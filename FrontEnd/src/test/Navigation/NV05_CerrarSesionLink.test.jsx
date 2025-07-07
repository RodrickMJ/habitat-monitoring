import { render, screen } from '@testing-library/react';
import { Navigation } from '../../src/Moleculas/Navigation';

test('NV05 - Link para cerrar sesión presente', () => {
  render(<Navigation />);
  const link = screen.getByText('Cerrar Sesión');
  expect(link).toBeInTheDocument();
  expect(link).toHaveAttribute('href', '/');
});
