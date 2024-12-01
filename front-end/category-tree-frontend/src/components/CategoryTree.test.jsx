import React from 'react';
import { render, screen } from '@testing-library/react';
import CategoryTree from '../components/CategoryTree';

const mockCategories = [
  {
    _id: '1',
    name: 'Women',
    children: [
      { _id: '2', name: 'Clothing', children: [] },
      { _id: '3', name: 'T-Shirts', children: [] },
    ],
  },
];

test('renders category tree', () => {
  render(<CategoryTree categories={mockCategories} />);

  expect(screen.getByText('Women')).toBeInTheDocument();
  expect(screen.getByText('Clothing')).toBeInTheDocument();
  expect(screen.getByText('T-Shirts')).toBeInTheDocument();
});
