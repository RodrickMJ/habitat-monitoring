import { render, screen } from '@testing-library/react';
import { Navigation } from '../../src/Moleculas/Navigation';

test('NV02 - Link a Cámara presente', () => {
  render(<Navigation />);
  const link = screen.getByText('Cámara');
  expect(link).toBeInTheDocument();
  expect(link).toHaveAttribute('href', '/Camara');
});
