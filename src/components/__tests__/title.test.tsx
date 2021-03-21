import React from 'react';
import { render, screen } from '@testing-library/react';
import Title from '../title';

test('includes text in title', () => {
  render(<Title header="test header" body="test body" />);

  const headerElement = screen.getByText("test header");
  const bodyElement = screen.getByText("test body");

  expect(headerElement).toBeInTheDocument();
  expect(bodyElement).toBeInTheDocument();
});