import { render, screen } from '@testing-library/react';
import { Navigation } from '../../src/Moleculas/Navigation';

test('NV04 - Link a Personaliza presente', () => {
  render(<Navigation />);
  const link = screen.getByText('Personaliza');
  expect(link).toBeInTheDocument();
  expect(link).toHaveAttribute('href', '/Personaliza');
});
