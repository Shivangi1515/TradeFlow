import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Apps from '../components/Apps';

describe('Apps Component Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders all application cards by default', () => {
    render(<Apps />);

    expect(screen.getByText('Smallcase')).toBeInTheDocument();
    expect(screen.getByText('Sensibull')).toBeInTheDocument();
    expect(screen.getByText('Streak')).toBeInTheDocument();
    expect(screen.getByText('GoldenPi')).toBeInTheDocument();
    expect(screen.getByText('Tijori Finance')).toBeInTheDocument();
  });

  test('filters applications by category clicks', () => {
    render(<Apps />);

    // Click "Derivatives" tab
    const derivativesTab = screen.getByRole('button', { name: /Derivatives/ });
    fireEvent.click(derivativesTab);

    // Sensibull should be shown, Smallcase should not be shown
    expect(screen.getByText('Sensibull')).toBeInTheDocument();
    expect(screen.queryByText('Smallcase')).not.toBeInTheDocument();
  });

  test('opens simulated SSO modal on clicking Connect App', () => {
    render(<Apps />);

    const connectBtn = screen.getAllByRole('button', { name: 'Connect App' })[0]; // First app card button (Smallcase)
    fireEvent.click(connectBtn);

    // Verify modal elements are visible
    expect(screen.getByText('Link Smallcase to TradeFlow')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Authorize Access' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  test('simulates authorization flow and marks app as Connected', () => {
    render(<Apps />);

    // Connect first app (Smallcase)
    const connectBtn = screen.getAllByRole('button', { name: 'Connect App' })[0];
    fireEvent.click(connectBtn);

    // Authorize
    const authBtn = screen.getByRole('button', { name: 'Authorize Access' });
    fireEvent.click(authBtn);

    // Fast-forward first timer (1500ms for connection loader)
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    // Fast-forward second timer (1000ms for success popup auto-close)
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/Connected \(Disconnect\)/)).toBeInTheDocument();
  });
});
