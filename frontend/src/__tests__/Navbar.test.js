import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from '../landing_page/Navbar';

// Mock react-router-dom to bypass CRA 5 / React Router 7 resolution issues in Jest 27
jest.mock('react-router-dom', () => ({
  Link: ({ to, children }) => <a href={to}>{children}</a>
}));

describe('Navbar Component Unit Tests', () => {
  test('renders all static navigation links', () => {
    render(<Navbar />);

    // Verify logo brand link
    expect(screen.getByAltText('Logo')).toBeInTheDocument();

    // Verify static menu navigation links
    expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'SignUp' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Product' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Pricing' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Support' })).toBeInTheDocument();
  });
});
