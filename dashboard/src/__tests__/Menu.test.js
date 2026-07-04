import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Menu from '../components/Menu';

// Mock react-router-dom to bypass CRA 5 / React Router 7 resolution issues in Jest 27
jest.mock('react-router-dom', () => ({
  Link: ({ to, children }) => <a href={to}>{children}</a>
}));

describe('Menu Component Unit Tests', () => {
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
    localStorage.clear();
  });

  test('renders user initials, username and links correctly', () => {
    localStorage.setItem('username', 'tester');
    localStorage.setItem('email', 'tester@example.com');

    render(<Menu />);

    expect(screen.getByText('TE')).toBeInTheDocument(); // Initials for 'tester'
    expect(screen.getByText('tester')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Holdings')).toBeInTheDocument();
    expect(screen.getByText('Positions')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  test('toggles dropdown and logs out cleanly on click', () => {
    localStorage.setItem('username', 'alex');
    localStorage.setItem('email', 'alex@example.com');

    render(<Menu />);

    // Dropdown is not visible initially
    expect(screen.queryByText('Log Out')).not.toBeInTheDocument();

    // Click profile section to open dropdown
    const profileBtn = screen.getByText('alex');
    fireEvent.click(profileBtn);

    // Verify user details and Log Out button are now visible
    expect(screen.getByText('alex@example.com')).toBeInTheDocument();
    const logoutBtn = screen.getByRole('button', { name: 'Log Out' });
    expect(logoutBtn).toBeInTheDocument();

    // Click Log Out
    fireEvent.click(logoutBtn);

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('username')).toBeNull();
    expect(localStorage.getItem('email')).toBeNull();
    expect(window.location.href).toBe('http://localhost:3000');
  });
});
