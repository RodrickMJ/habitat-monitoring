import { render, screen } from '@testing-library/react';
import { AnimalData } from '../../src/Organismos/AnimalData';
import { BrowserRouter } from 'react-router-dom';

test('AD04 - Contenedor tiene clase bg-black y animación', () => {
  render(<BrowserRouter><AnimalData /></BrowserRouter>);
  const container = screen.getByRole('main');
  expect(container.className).toMatch(/bg-black/);
});
