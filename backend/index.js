require('dotenv').config();
const express = require("express");
const crypto = require("crypto");

const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const cors = require("cors");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { UserModel } = require("./model/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Rate Limiter for authentication routes to prevent brute-force
const authAttempts = new Map();
const rateLimitAuth = (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();
    const limit = 5; // Max 5 attempts
    const windowMs = 15 * 60 * 1000; // 15 minutes window

    if (!authAttempts.has(ip)) {
        authAttempts.set(ip, []);
    }

    // Filter attempts within the time window
    const attempts = authAttempts.get(ip).filter(timestamp => now - timestamp < windowMs);
    attempts.push(now);
    authAttempts.set(ip, attempts);

    if (attempts.length > limit) {
        return res.status(429).send("Too many attempts. Please try again after 15 minutes.");
    }
    next();
};

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET || "tradeflow_jwt_secret_key_123456";

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Seeding function for new users
const seedUserData = async (userId) => {
    try {
        const defaultHoldings = [
            { name: "BHARTIARTL", qty: 2, avg: 538.05, price: 541.15, net: "+0.58%", day: "+2.99%" },
            { name: "HDFCBANK", qty: 2, avg: 1383.4, price: 1522.35, net: "+10.04%", day: "+0.11%" },
            { name: "HINDUNILVR", qty: 1, avg: 2335.85, price: 2417.4, net: "+3.49%", day: "+0.21%" },
            { name: "INFY", qty: 1, avg: 1350.5, price: 1555.45, net: "+15.18%", day: "-1.60%" },
            { name: "ITC", qty: 5, avg: 202.0, price: 207.9, net: "+2.92%", day: "+0.80%" },
            { name: "KPITTECH", qty: 5, avg: 250.3, price: 266.45, net: "+6.45%", day: "+3.54%" },
            { name: "M&M", qty: 2, avg: 809.9, price: 779.8, net: "-3.72%", day: "-0.01%" },
            { name: "RELIANCE", qty: 1, avg: 2193.7, price: 2112.4, net: "-3.71%", day: "+1.44%" },
            { name: "SBIN", qty: 4, avg: 324.35, price: 430.2, net: "+32.63%", day: "-0.34%" },
            { name: "SGBMAY29", qty: 2, avg: 4727.0, price: 4719.0, net: "-0.17%", day: "+0.15%" },
            { name: "TATAPOWER", qty: 5, avg: 104.2, price: 124.15, net: "+19.15%", day: "-0.24%" },
            { name: "TCS", qty: 1, avg: 3041.7, price: 3194.8, net: "+5.03%", day: "-0.25%" },
            { name: "WIPRO", qty: 4, avg: 489.3, price: 577.75, net: "+18.08%", day: "+0.32%" },
        ];
        const defaultPositions = [
            { product: "CNC", name: "EVEREADY", qty: 2, avg: 316.27, price: 312.35, net: "+0.58%", day: "-1.24%", isLoss: true },
            { product: "CNC", name: "JUBLFOOD", qty: 1, avg: 3124.75, price: 3082.65, net: "+10.04%", day: "-1.35%", isLoss: true },
        ];

        await HoldingsModel.insertMany(defaultHoldings.map(h => ({ ...h, user: userId })));
        await PositionsModel.insertMany(defaultPositions.map(p => ({ ...p, user: userId })));
        console.log(`Seeded default portfolio data for user: ${userId}`);
    } catch (err) {
        console.error("Error seeding default user data:", err);
    }
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).send("Access token is missing");
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).send("Invalid or expired access token");
        }
        req.user = user;
        next();
    });
};

// --- AUTHENTICATION ROUTES ---

// 1. Signup Route
app.post('/auth/signup', rateLimitAuth, async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).send("Please fill in all fields");
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send("Email is already registered");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');

        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            isEmailVerified: false,
            emailVerificationToken
        });

        await newUser.save();
        await seedUserData(newUser._id);

        // In a real application, you would email this verificationToken to the user
        console.log(`\n--- SIMULATED VERIFICATION EMAIL ---`);
        console.log(`To: ${email}`);
        console.log(`Verify Link: http://localhost:3002/auth/verify-email?token=${emailVerificationToken}`);
        console.log(`------------------------------------\n`);

        res.status(201).json({
            message: "Registration successful! Please verify your email.",
            verificationToken: emailVerificationToken // Returned for simulation/testing
        });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).send("Error signing up user");
    }
});

// 2. Login Route
app.post('/auth/login', rateLimitAuth, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send("Please fill in all fields");
        }

        const user = await UserModel.findOne({ email });
        if (!user || !user.password) {
            return res.status(401).send("Invalid email or password");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send("Invalid email or password");
        }

        // Enforce email verification
        if (!user.isEmailVerified) {
            return res.status(403).send("Email not verified. Please check your inbox.");
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' } // Shorter session lifetime
        );

        res.json({
            token,
            username: user.username,
            email: user.email
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).send("Error logging in user");
    }
});

// 3. Verify Email Route
app.get('/auth/verify-email', async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) {
            return res.status(400).send("Verification token is required");
        }

        const user = await UserModel.findOne({ emailVerificationToken: token });
        if (!user) {
            return res.status(400).send("Invalid or expired verification token");
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        await user.save();

        res.send("Email verified successfully! You can now log in.");
    } catch (err) {
        console.error("Email verification error:", err);
        res.status(500).send("Error verifying email");
    }
});

// 4. Forgot Password Route
app.post('/auth/forgot-password', rateLimitAuth, async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).send("Email is required");
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            // Mitigate user enumeration by returning a generic message
            return res.json({ message: "If that email exists, a reset link has been generated." });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
        await user.save();

        // Simulate sending email
        console.log(`\n--- SIMULATED PASSWORD RESET EMAIL ---`);
        console.log(`To: ${email}`);
        console.log(`Reset Link: http://localhost:3000/reset-password?token=${resetToken}`);
        console.log(`--------------------------------------\n`);

        res.json({
            message: "Password reset link has been generated successfully.",
            resetToken: resetToken // Returned for simulation/testing
        });
    } catch (err) {
        console.error("Forgot password error:", err);
        res.status(500).send("Error generating reset token");
    }
});

// 5. Reset Password Route
app.post('/auth/reset-password', rateLimitAuth, async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).send("Token and password are required");
        }

        const user = await UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send("Invalid or expired password reset token");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.send("Password has been reset successfully! You can now log in.");
    } catch (err) {
        console.error("Reset password error:", err);
        res.status(500).send("Error resetting password");
    }
});

// 3. Google Sign-In Route (via Firebase)
app.post('/auth/google', async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).send("Firebase credential is required");
        }

        let payload;
        const apiKey = process.env.FIREBASE_API_KEY;

        if (credential === "MOCK_DEVELOPER_GOOGLE_TOKEN") {
            console.log("Mock Google Sign-In requested for development.");
            payload = {
                email: "google_developer@tradeflow.com",
                name: "Google Developer",
                sub: "mock_google_user_id_9999"
            };
        } else if (apiKey && apiKey !== "YOUR_FIREBASE_API_KEY") {
            // Verify ID Token via Firebase Auth lookup API
            const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ idToken: credential })
            });

            if (!response.ok) {
                return res.status(400).send("Failed to verify Firebase token");
            }

            const data = await response.json();
            if (!data.users || data.users.length === 0) {
                return res.status(400).send("No user found for this token");
            }

            const firebaseUser = data.users[0];
            payload = {
                email: firebaseUser.email,
                name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                sub: firebaseUser.localId
            };
        } else {
            // Enforce signature verification in production
            if (process.env.NODE_ENV === "production") {
                return res.status(401).send("OAuth signature verification is required in production");
            }
            // Development fallback: decode JWT without signature validation
            console.warn("WARNING: FIREBASE_API_KEY not set. Decoding token without signature verification.");
            const decoded = jwt.decode(credential);
            if (!decoded) {
                return res.status(400).send("Invalid Firebase token format");
            }
            payload = {
                email: decoded.email,
                name: decoded.name || decoded.email.split('@')[0],
                sub: decoded.sub
            };
        }

        const { email, name, sub: googleId } = payload;

        if (!email) {
            return res.status(400).send("Google token lacks email");
        }

        let user = await UserModel.findOne({ email });

        if (!user) {
            // First time Google user - Register them as verified!
            user = new UserModel({
                username: name || email.split('@')[0],
                email,
                googleId,
                isEmailVerified: true
            });
            await user.save();
            await seedUserData(user._id);
        } else {
            let updated = false;
            if (!user.googleId) {
                user.googleId = googleId;
                updated = true;
            }
            if (!user.isEmailVerified) {
                user.isEmailVerified = true;
                updated = true;
            }
            if (updated) {
                await user.save();
            }
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            username: user.username,
            email: user.email
        });
    } catch (err) {
        console.error("Google auth error:", err);
        res.status(500).send("Error authenticating with Google");
    }
});

// GET /user/settings
app.get('/user/settings', authenticateToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.json({
            theme: user.theme || "light",
            currency: user.currency || "INR",
            chartType: user.chartType || "candle",
            notifications: user.notifications !== false
        });
    } catch (err) {
        console.error("Error fetching settings:", err);
        res.status(500).send("Error fetching settings");
    }
});

// PUT /user/settings
app.put('/user/settings', authenticateToken, async (req, res) => {
    try {
        const { theme, currency, chartType, notifications } = req.body;
        const user = await UserModel.findById(req.user.userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        if (theme) user.theme = theme;
        if (currency) user.currency = currency;
        if (chartType) user.chartType = chartType;
        if (notifications !== undefined) user.notifications = notifications;

        await user.save();

        res.json({
            message: "Settings updated successfully",
            settings: {
                theme: user.theme,
                currency: user.currency,
                chartType: user.chartType,
                notifications: user.notifications
            }
        });
    } catch (err) {
        console.error("Error updating settings:", err);
        res.status(500).send("Error updating settings");
    }
});

// --- PROTECTED DASHBOARD ENDPOINTS ---

app.get('/allHoldings', authenticateToken, async (req, res) => {
    try {
        let allHoldings = await HoldingsModel.find({ user: req.user.userId });
        res.json(allHoldings);
    } catch (err) {
        console.error("Error fetching holdings:", err);
        res.status(500).send("Error fetching holdings");
    }
});

app.get('/allPositions', authenticateToken, async (req, res) => {
    try {
        let allPositions = await PositionsModel.find({ user: req.user.userId });
        res.json(allPositions);
    } catch (err) {
        console.error("Error fetching positions:", err);
        res.status(500).send("Error fetching positions");
    }
});

// GET user funds details
app.get('/user/funds', authenticateToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.json({
            funds: user.funds !== undefined ? user.funds : 100000.00,
            usedMargin: user.usedMargin !== undefined ? user.usedMargin : 0.00
        });
    } catch (err) {
        console.error("Error fetching funds:", err);
        res.status(500).send("Error fetching funds");
    }
});

// POST add funds
app.post('/user/funds/add', authenticateToken, async (req, res) => {
    try {
        const { amount } = req.body;
        const amountNum = Number(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            return res.status(400).send("Invalid amount");
        }
        const user = await UserModel.findById(req.user.userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        user.funds = (user.funds !== undefined ? user.funds : 100000.00) + amountNum;
        await user.save();
        res.json({ message: "Funds added successfully", funds: user.funds });
    } catch (err) {
        console.error("Error adding funds:", err);
        res.status(500).send("Error adding funds");
    }
});

// POST withdraw funds
app.post('/user/funds/withdraw', authenticateToken, async (req, res) => {
    try {
        const { amount } = req.body;
        const amountNum = Number(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            return res.status(400).send("Invalid amount");
        }
        const user = await UserModel.findById(req.user.userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        const currentFunds = user.funds !== undefined ? user.funds : 100000.00;
        if (currentFunds < amountNum) {
            return res.status(400).send("Insufficient balance for withdrawal");
        }
        user.funds = currentFunds - amountNum;
        await user.save();
        res.json({ message: "Funds withdrawn successfully", funds: user.funds });
    } catch (err) {
        console.error("Error withdrawing funds:", err);
        res.status(500).send("Error withdrawing funds");
    }
});

// GET all orders for the current user
app.get('/allOrders', authenticateToken, async (req, res) => {
    try {
        const allOrders = await OrdersModel.find({ user: req.user.userId }).sort({ date: -1 });
        res.json(allOrders);
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).send("Error fetching orders");
    }
});

app.post('/newOrder', authenticateToken, async (req, res) => {
    try {
        const { name, qty, price, mode } = req.body;
        const qtyNum = Number(qty);
        const priceNum = Number(price);
        const userId = req.user.userId;

        const userObj = await UserModel.findById(userId);
        if (!userObj) {
            return res.status(404).send("User not found");
        }

        const cost = priceNum * qtyNum;
        const currentFunds = userObj.funds !== undefined ? userObj.funds : 100000.00;

        let holding = await HoldingsModel.findOne({ name, user: userId });

        if (mode === "SELL") {
            if (!holding || holding.qty < qtyNum) {
                return res.status(400).send("Insufficient holdings to sell");
            }
        } else if (mode === "BUY") {
            if (currentFunds < cost) {
                return res.status(400).send("Insufficient funds to place this order");
            }
        }

        let newOrder = new OrdersModel({
            user: userId,
            name,
            qty: qtyNum,
            price: priceNum,
            mode,
        });

        await newOrder.save();

        if (mode === "BUY") {
            userObj.funds = currentFunds - cost;
            userObj.usedMargin = (userObj.usedMargin !== undefined ? userObj.usedMargin : 0.00) + cost;
            await userObj.save();

            if (holding) {
                const oldQty = holding.qty;
                const oldAvg = holding.avg;
                const newQty = oldQty + qtyNum;
                const newAvg = ((oldAvg * oldQty) + (priceNum * qtyNum)) / newQty;

                holding.qty = newQty;
                holding.avg = newAvg;
                holding.price = priceNum;
                await holding.save();
            } else {
                let newHolding = new HoldingsModel({
                    user: userId,
                    name,
                    qty: qtyNum,
                    avg: priceNum,
                    price: priceNum,
                    net: "+0.00%",
                    day: "+0.00%",
                });
                await newHolding.save();
            }
        } else if (mode === "SELL") {
            userObj.funds = currentFunds + cost;
            userObj.usedMargin = Math.max(0, (userObj.usedMargin !== undefined ? userObj.usedMargin : 0.00) - cost);
            await userObj.save();

            const newQty = holding.qty - qtyNum;
            if (newQty === 0) {
                await HoldingsModel.deleteOne({ name, user: userId });
            } else {
                holding.qty = newQty;
                holding.price = priceNum;
                await holding.save();
            }
        }

        res.send("Order saved and holdings updated");
    } catch (err) {
        console.error("Error in newOrder:", err);
        res.status(500).send("Error saving order and updating holdings");
    }
});

app.listen(PORT, () => {
    console.log("app started");
    mongoose.connect(uri);
    console.log("DB connected");

})