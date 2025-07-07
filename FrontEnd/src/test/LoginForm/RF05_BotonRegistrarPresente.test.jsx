import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginForm } from '../../src/Organismos/Loginform';

test('RF05 - Botón Registrar está presente', () => {
  render(<BrowserRouter><LoginForm /></BrowserRouter>);
  expect(screen.getByText('Registrar')).toBeInTheDocument();
});
