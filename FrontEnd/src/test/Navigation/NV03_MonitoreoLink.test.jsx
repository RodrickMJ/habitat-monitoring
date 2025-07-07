import { render, screen } from '@testing-library/react';
import { Navigation } from '../../src/Moleculas/Navigation';

test('NV03 - Link a Monitoreo presente', () => {
  render(<Navigation />);
  const link = screen.getByText('Monitoreo');
  expect(link).toBeInTheDocument();
  expect(link).toHaveAttribute('href', '/Monitoreo');
});
