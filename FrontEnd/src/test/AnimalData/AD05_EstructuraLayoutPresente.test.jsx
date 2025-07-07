import { render, screen } from '@testing-library/react';
import { AnimalData } from '../../src/Organismos/AnimalData';
import { BrowserRouter } from 'react-router-dom';

test('AD05 - Estructura de layout está presente', () => {
  render(<BrowserRouter><AnimalData /></BrowserRouter>);
  expect(screen.getByText('Datos Usuario')).toBeInTheDocument();
  expect(screen.getByText('Datos Animalito')).toBeInTheDocument();
});
