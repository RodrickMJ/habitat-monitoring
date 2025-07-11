import { render, screen } from "@testing-library/react";
import { InformationAnimal } from "../../Moleculas/InformationAnimal";

beforeEach(() => {
    localStorage.setItem("token", "123");
    localStorage.setItem("userId", "fake");
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
                name: "Juan",
                lastname: "Pérez",
                email: "juan@mail.com",
                animals: [{
                    name: "Firulais",
                    breed: "Labrador",
                    species: "Perro",
                    age: 5,
                    gender: "Macho",
                    color: "Negro",
                    size: "Grande",
                    notes: "Juguetón"
                }]
            }),
        })
    );
});

describe("InformationAnimal Component", () => {
    test("IA01 - Renderiza encabezado de usuario", async () => {
        render(<InformationAnimal />);
        expect(await screen.findByText("Datos Usuario")).toBeInTheDocument();
    });

    test("IA02 - Renderiza encabezado de animalito", async () => {
        render(<InformationAnimal />);
        expect(await screen.findByText("Datos Animalito")).toBeInTheDocument();
    });

    test("IA03 - Muestra datos de usuario", async () => {
        render(<InformationAnimal />);
        expect(await screen.findByText("Juan")).toBeInTheDocument();
    });

    test("IA04 - Muestra datos del animal", async () => {
        render(<InformationAnimal />);
        expect(await screen.findByText("Firulais")).toBeInTheDocument();
    });

    test("IA05 - Llamada con Authorization", async () => {
        render(<InformationAnimal />);
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining("fake"),
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: "Bearer 123"
                })
            })
        );
    });
});
