import { render, screen } from '@testing-library/react';
import { AnimalData } from '../../src/Organismos/AnimalData';
import { BrowserRouter } from 'react-router-dom';

test('AD03 - Renderiza InformationAnimal dentro de AnimalData', () => {
  render(<BrowserRouter><AnimalData /></BrowserRouter>);
  expect(screen.getByText('Datos Usuario')).toBeInTheDocument();
});
