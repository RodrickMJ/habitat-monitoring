import { render, screen } from '@testing-library/react';
import { Navigation } from '../../src/Moleculas/Navigation';

test('NV01 - Link a Datos General presente', () => {
  render(<Navigation />);
  const link = screen.getByText('Datos General');
  expect(link).toBeInTheDocument();
  expect(link).toHaveAttribute('href', '/DatosAnimalito');
});
