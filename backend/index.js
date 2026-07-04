require('dotenv').config();
const express = require("express");

const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const cors = require("cors");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { UserModel } = require("./model/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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
app.post('/auth/signup', async (req, res) => {
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
        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        await seedUserData(newUser._id);

        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email, username: newUser.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            username: newUser.username,
            email: newUser.email
        });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).send("Error signing up user");
    }
});

// 2. Login Route
app.post('/auth/login', async (req, res) => {
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

        const token = jwt.sign(
            { userId: user._id, email: user.email, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
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
            // First time Google user - Register them!
            user = new UserModel({
                username: name || email.split('@')[0],
                email,
                googleId
            });
            await user.save();
            await seedUserData(user._id);
        } else if (!user.googleId) {
            // User existed but hadn't linked Google account - Link it!
            user.googleId = googleId;
            await user.save();
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
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

app.post('/newOrder', authenticateToken, async (req, res) => {
    try {
        const { name, qty, price, mode } = req.body;
        const qtyNum = Number(qty);
        const priceNum = Number(price);
        const userId = req.user.userId;

        let holding = await HoldingsModel.findOne({ name, user: userId });

        if (mode === "SELL") {
            if (!holding || holding.qty < qtyNum) {
                return res.status(400).send("Insufficient holdings to sell");
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