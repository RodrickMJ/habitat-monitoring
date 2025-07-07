import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginForm } from '../../src/Organismos/Loginform';

test('RF01 - Renderiza los campos del formulario', () => {
    render(<BrowserRouter><LoginForm /></BrowserRouter>);
    expect(screen.getByPlaceholderText('Nombre')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Apellido')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Correo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
});
