import { render, screen } from "@testing-library/react";
import { AnimalData } from "../Organismos/AnimalData";
import { MemoryRouter } from "react-router-dom";

jest.mock("../Moleculas/Navigation", () => ({
    Navigation: () => <div>Mock Navigation</div>,
}));

jest.mock("../Moleculas/InformationAnimal", () => ({
    InformationAnimal: () => <div>Mock InformationAnimal</div>,
}));

describe("AnimalData Component", () => {
    test("AD01 - Renderizado del componente sin errores", () => {
        render(<AnimalData />, { wrapper: MemoryRouter });
        expect(screen.getByText("Mock Navigation")).toBeInTheDocument();
        expect(screen.getByText("Mock InformationAnimal")).toBeInTheDocument();
    });

    test("AD02 - Presencia del componente Navigation", () => {
        render(<AnimalData />, { wrapper: MemoryRouter });
        expect(screen.getByText("Mock Navigation")).toBeInTheDocument();
    });

    test("AD03 - Presencia del componente InformationAnimal", () => {
        render(<AnimalData />, { wrapper: MemoryRouter });
        expect(screen.getByText("Mock InformationAnimal")).toBeInTheDocument();
    });

    test("AD04 - Contenedor con fondo negro y animación", () => {
        const { container } = render(<AnimalData />, { wrapper: MemoryRouter });
        expect(container.querySelector(".bg-black")).toBeInTheDocument();
        expect(container.querySelector(".animate-fade-up")).toBeInTheDocument();
    });

    test("AD05 - Estructura general renderizada correctamente", () => {
        const { container } = render(<AnimalData />, { wrapper: MemoryRouter });
        expect(container).toBeInTheDocument();
    });
});
