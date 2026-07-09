import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../landing_page/login/Login';

// Mock react-router-dom to bypass CRA 5 / React Router 7 resolution issues in Jest 27
jest.mock('react-router-dom', () => ({
  Link: ({ to, children }) => <a href={to}>{children}</a>
}));

// Mock Firebase Auth and Auth Provider
jest.mock('../firebase', () => ({
  auth: {},
  googleProvider: {}
}));

// Mock Firebase signInWithPopup
jest.mock('firebase/auth', () => ({
  signInWithPopup: jest.fn()
}));

describe('Login Component Unit Tests', () => {
  const originalLocation = window.location;

  beforeAll(() => {
    delete window.location;
    window.location = { href: '' };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  beforeEach(() => {
    window.location.href = '';
    global.fetch = jest.fn();
    localStorage.clear();
  });

  test('renders email and password inputs and buttons', () => {
    render(<Login />);

    expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue with Google' })).toBeInTheDocument();
  });

  test('displays validation error if fields are submitted empty', async () => {
    render(<Login />);

    const submitBtn = screen.getByRole('button', { name: 'Log In' });
    fireEvent.click(submitBtn);

    expect(screen.getByPlaceholderText('name@example.com')).toBeRequired();
    expect(screen.getByPlaceholderText('••••••••')).toBeRequired();
  });

  test('handles successful credentials login', async () => {
    const mockUserResponse = {
      token: 'fake-jwt-token-123',
      username: 'tester',
      email: 'test@example.com'
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserResponse
    });

    render(<Login />);

    const emailInput = screen.getByPlaceholderText('name@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitBtn = screen.getByRole('button', { name: 'Log In' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123!' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3002/auth/login', expect.any(Object));
      expect(window.location.href).toBe('http://localhost:3001/?token=fake-jwt-token-123');
    });
  });

  test('displays error alert on login failure', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      text: async () => 'Invalid email or password'
    });

    render(<Login />);

    const emailInput = screen.getByPlaceholderText('name@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitBtn = screen.getByRole('button', { name: 'Log In' });

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass!' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });
});
