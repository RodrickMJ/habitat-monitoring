import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AnimalData } from '../../src/Organismos/AnimalData';

test('AD01 - Renderiza AnimalData sin errores', () => {
  render(<BrowserRouter><AnimalData /></BrowserRouter>);
});
