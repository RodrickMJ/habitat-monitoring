import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginForm } from '../../src/Organismos/Loginform';

test('RF03 - Actualiza datos del input', () => {
  render(<BrowserRouter><LoginForm /></BrowserRouter>);
  const nameInput = screen.getByPlaceholderText('Nombre');
  fireEvent.change(nameInput, { target: { value: 'Ana' } });
  expect(nameInput.value).toBe('Ana');
});
