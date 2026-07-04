import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Signup from '../landing_page/signup/Signup';

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

describe('Signup Component Unit Tests', () => {
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

  test('renders registration inputs and buttons', () => {
    render(<Signup />);

    expect(screen.getByPlaceholderText('john_doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue with Google' })).toBeInTheDocument();
  });

  test('handles successful registration and redirect', async () => {
    const mockSignupResponse = {
      token: 'fake-signup-token-456',
      username: 'newuser',
      email: 'new@example.com'
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSignupResponse
    });

    render(<Signup />);

    const userInput = screen.getByPlaceholderText('john_doe');
    const emailInput = screen.getByPlaceholderText('name@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitBtn = screen.getByRole('button', { name: 'Sign Up' });

    fireEvent.change(userInput, { target: { value: 'newuser' } });
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'pass12345' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3002/auth/signup', expect.any(Object));
      expect(window.location.href).toBe('http://localhost:3001/?token=fake-signup-token-456');
    });
  });

  test('displays error alert on signup failure', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      text: async () => 'Email is already registered'
    });

    render(<Signup />);

    const userInput = screen.getByPlaceholderText('john_doe');
    const emailInput = screen.getByPlaceholderText('name@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitBtn = screen.getByRole('button', { name: 'Sign Up' });

    fireEvent.change(userInput, { target: { value: 'existinguser' } });
    fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'pass12345' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Email is already registered')).toBeInTheDocument();
    });
  });
});
