import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CategoryTree from './CategoryTree';

describe('CategoryTree Component', () => {
  test('renders CategoryTree component', () => {
    render(<CategoryTree />);
    expect(screen.getByText('Category Tree')).toBeInTheDocument();
  });

  test('fetches and displays categories', async () => {
    const mockCategories = [
      { _id: '1', name: 'Electronics', children: [] },
      { _id: '2', name: 'Books', children: [] },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockCategories),
      }),
    );

    render(<CategoryTree />);

    expect(await screen.findByText('Electronics')).toBeInTheDocument();
    expect(await screen.findByText('Books')).toBeInTheDocument();
  });

  test('displays error message on fetch failure', async () => {
    global.fetch = jest.fn(() => Promise.reject('API is down'));

    render(<CategoryTree />);

    expect(await screen.findByText('Error fetching categories:')).toBeInTheDocument();
  });
});
