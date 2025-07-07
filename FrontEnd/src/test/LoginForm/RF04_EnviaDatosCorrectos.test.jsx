import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginForm } from '../../src/Organismos/Loginform';

test('RF04 - Enviar con datos válidos no muestra error', () => {
  render(<BrowserRouter><LoginForm /></BrowserRouter>);

  fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: 'Ana' } });
  fireEvent.change(screen.getByPlaceholderText('Apellido'), { target: { value: 'López' } });
  fireEvent.change(screen.getByPlaceholderText('Correo'), { target: { value: 'ana@test.com' } });
  fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: '123456' } });

  fireEvent.click(screen.getByText('Registrar'));

  expect(screen.queryByText(/completa todos los campos/i)).not.toBeInTheDocument();
});
