import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Home from '../components/Home';

// Mock axios
jest.mock('axios');

// Mock TopBar and Dashboard components
jest.mock('../components/TopBar', () => () => <div data-testid="topbar">TopBar</div>);
jest.mock('../components/Dashboard', () => () => <div data-testid="dashboard">Dashboard</div>);

describe('Home Component Authentication Tests', () => {
  const originalLocation = window.location;

  beforeAll(() => {
    delete window.location;
    window.location = { href: '', search: '' };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  beforeEach(() => {
    window.location.href = '';
    window.location.search = '';
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('shows Authenticating and redirects to login if no token is found', () => {
    render(<Home />);

    expect(screen.getByText('Authenticating...')).toBeInTheDocument();
    expect(window.location.href).toBe('http://localhost:3000/login');
  });

  test('parses token from URL, saves to localStorage, and renders TopBar and Dashboard', async () => {
    // Mock URL with query parameter ?token=fake-token
    window.location.search = '?token=fake-jwt-token-789';

    // Mock history.replaceState
    window.history.replaceState = jest.fn();

    // Mock axios.get response
    axios.get.mockResolvedValueOnce({ data: { theme: 'light' } });

    render(<Home />);

    expect(localStorage.getItem('token')).toBe('fake-jwt-token-789');
    
    // Wait for the async state updates to finish and TopBar to mount
    expect(await screen.findByTestId('topbar')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
  });

  test('renders immediately if token is already in localStorage', async () => {
    localStorage.setItem('token', 'active-local-token');

    // Mock axios.get response
    axios.get.mockResolvedValueOnce({ data: { theme: 'light' } });

    render(<Home />);

    // Wait for the async state updates to finish and TopBar to mount
    expect(await screen.findByTestId('topbar')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
  });
});
