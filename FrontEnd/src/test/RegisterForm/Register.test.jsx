import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { LoginForm } from "../Organismos/Loginform";

describe("LoginForm Component", () => {
    test("RF01 - Renderiza todos los campos", () => {
        render(<BrowserRouter><LoginForm /></BrowserRouter>);
        expect(screen.getByPlaceholderText("Nombre")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Apellido")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Correo")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Contraseña")).toBeInTheDocument();
    });

    test("RF02 - Muestra error si hay campos vacíos", () => {
        render(<BrowserRouter><LoginForm /></BrowserRouter>);
        fireEvent.click(screen.getByText("Registrar"));
        expect(screen.getByText("Por favor, completa todos los campos.")).toBeInTheDocument();
    });

    test("RF03 - Actualiza campos correctamente", () => {
        render(<BrowserRouter><LoginForm /></BrowserRouter>);
        fireEvent.change(screen.getByPlaceholderText("Nombre"), { target: { value: "Ana" } });
        fireEvent.change(screen.getByPlaceholderText("Apellido"), { target: { value: "López" } });
        fireEvent.change(screen.getByPlaceholderText("Correo"), { target: { value: "ana@mail.com" } });
        expect(screen.getByPlaceholderText("Nombre").value).toBe("Ana");
    });

    test("RF04 - Botón registrar visible", () => {
        render(<BrowserRouter><LoginForm /></BrowserRouter>);
        expect(screen.getByText("Registrar")).toBeInTheDocument();
    });

    test("RF05 - No muestra error si todos los campos se llenan (mock)", () => {
        render(<BrowserRouter><LoginForm /></BrowserRouter>);
        fireEvent.change(screen.getByPlaceholderText("Nombre"), { target: { value: "Juan" } });
        fireEvent.change(screen.getByPlaceholderText("Apellido"), { target: { value: "Pérez" } });
        fireEvent.change(screen.getByPlaceholderText("Correo"), { target: { value: "juan@mail.com" } });
        fireEvent.change(screen.getByPlaceholderText("Contraseña"), { target: { value: "123456" } });
        fireEvent.click(screen.getByText("Registrar"));
        expect(screen.queryByText("Por favor, completa todos los campos.")).not.toBeInTheDocument();
    });
});