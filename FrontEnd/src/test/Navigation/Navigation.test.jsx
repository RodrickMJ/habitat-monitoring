import { render, screen } from "@testing-library/react";
import { Navigation } from "../Moleculas/Navigation";
import { MemoryRouter } from "react-router-dom";

describe("Navigation Component", () => {
    test("NV01 - Enlace a Datos General", () => {
        render(<Navigation />, { wrapper: MemoryRouter });
        expect(screen.getByText("Datos General")).toBeInTheDocument();
    });

    test("NV02 - Enlace a Cámara", () => {
        render(<Navigation />, { wrapper: MemoryRouter });
        expect(screen.getByText("Cámara")).toBeInTheDocument();
    });

    test("NV03 - Enlace a Monitoreo", () => {
        render(<Navigation />, { wrapper: MemoryRouter });
        expect(screen.getByText("Monitoreo")).toBeInTheDocument();
    });

    test("NV04 - Enlace a Personaliza", () => {
        render(<Navigation />, { wrapper: MemoryRouter });
        expect(screen.getByText("Personaliza")).toBeInTheDocument();
    });

    test("NV05 - Enlace para cerrar sesión", () => {
        render(<Navigation />, { wrapper: MemoryRouter });
        expect(screen.getByText("Cerrar Sesión")).toBeInTheDocument();
    });
});
