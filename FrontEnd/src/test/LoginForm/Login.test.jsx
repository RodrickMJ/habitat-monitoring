import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Login } from "../Organismos/Login";

describe("Login Component", () => {
    test("LG01 - Renderiza campos de correo y contraseña", () => {
        render(<BrowserRouter><Login /></BrowserRouter>);
        expect(screen.getByPlaceholderText("Correo Electrónico")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Contraseña")).toBeInTheDocument();
    });

    test("LG02 - Muestra error con campos vacíos", async () => {
        render(<BrowserRouter><Login /></BrowserRouter>);
        fireEvent.click(screen.getByText("Iniciar Sesión"));
        expect(await screen.findByText(/Error en el inicio/i)).toBeInTheDocument();
    });

    test("LG03 - Actualiza campos del formulario", () => {
        render(<BrowserRouter><Login /></BrowserRouter>);
        const emailInput = screen.getByPlaceholderText("Correo Electrónico");
        const passInput = screen.getByPlaceholderText("Contraseña");
        fireEvent.change(emailInput, { target: { value: "test@mail.com" } });
        fireEvent.change(passInput, { target: { value: "123456" } });
        expect(emailInput.value).toBe("test@mail.com");
        expect(passInput.value).toBe("123456");
    });

    test("LG04 - Renderiza enlaces secundarios", () => {
        render(<BrowserRouter><Login /></BrowserRouter>);
        expect(screen.getByText("Regístrate")).toBeInTheDocument();
        expect(screen.getByText("Personaliza")).toBeInTheDocument();
    });

    test("LG05 - Muestra botón de envío", () => {
        render(<BrowserRouter><Login /></BrowserRouter>);
        expect(screen.getByText("Iniciar Sesión")).toBeInTheDocument();
    });
});
