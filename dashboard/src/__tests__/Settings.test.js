import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Settings from '../components/Settings';

// Mock axios
jest.mock('axios');

describe('Settings Component Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('username', 'tester');
    localStorage.setItem('email', 'tester@example.com');
    jest.clearAllMocks();
  });

  test('displays loading screen initially', () => {
    axios.get.mockReturnValueOnce(new Promise(() => {})); // Never resolves to keep it loading
    render(<Settings />);
    expect(screen.getByText('Loading settings...')).toBeInTheDocument();
  });

  test('loads settings from backend and renders form options', async () => {
    const mockSettings = {
      theme: 'light',
      currency: 'INR',
      chartType: 'candle',
      notifications: true
    };

    axios.get.mockResolvedValueOnce({ data: mockSettings });

    render(<Settings />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:3002/user/settings');
      expect(screen.getByText('Hi, tester! / Settings')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Light Mode/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Dark Mode/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /INR/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /USD/ })).toBeInTheDocument();
    });
  });

  test('handles saving settings successfully', async () => {
    const mockSettings = {
      theme: 'light',
      currency: 'INR',
      chartType: 'candle',
      notifications: true
    };

    axios.get.mockResolvedValueOnce({ data: mockSettings });
    axios.put.mockResolvedValueOnce({
      data: { message: 'Settings updated successfully' }
    });

    render(<Settings />);

    // Wait for load
    await screen.findByText('Hi, tester! / Settings');

    // Click Dark Mode
    const darkBtn = screen.getByRole('button', { name: /Dark Mode/ });
    fireEvent.click(darkBtn);

    // Save preferences
    const saveBtn = screen.getByRole('button', { name: /Save Preferences/ });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith('http://localhost:3002/user/settings', {
        theme: 'dark',
        currency: 'INR',
        chartType: 'candle',
        notifications: true
      });
      expect(screen.getByText('Settings saved successfully!')).toBeInTheDocument();
    });
  });
});
