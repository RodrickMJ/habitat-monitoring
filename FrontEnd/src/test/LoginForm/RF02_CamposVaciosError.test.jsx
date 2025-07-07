import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginForm } from '../../src/Organismos/Loginform';

test('RF02 - Muestra error si hay campos vacíos', () => {
  render(<BrowserRouter><LoginForm /></BrowserRouter>);
  fireEvent.click(screen.getByText('Registrar'));
  expect(screen.getByText(/completa todos los campos/i)).toBeInTheDocument();
});
