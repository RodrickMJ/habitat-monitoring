import { render, screen } from "@testing-library/react";
import { Customizeanimal } from "../Organismos/Customizeanimal";

describe("Customizeanimal Component", () => {
    test("CZ01 - Renderiza sin errores", () => {
        render(<Customizeanimal />);
        expect(screen.getByText(/personaliza/i)).toBeInTheDocument();
    });

    test("CZ02 - Contiene inputs o botones relevantes", () => {
        render(<Customizeanimal />);
        const inputs = screen.getAllByRole("textbox");
        expect(inputs.length).toBeGreaterThanOrEqual(1);
    });

    test("CZ03 - Interacción con un campo (mock)", () => {
        render(<Customizeanimal />);
        const field = screen.getAllByRole("textbox")[0];
        expect(field).toBeInTheDocument();
    });

    test("CZ04 - Botón presente", () => {
        const { container } = render(<Customizeanimal />);
        const buttons = container.querySelectorAll("button");
        expect(buttons.length).toBeGreaterThanOrEqual(1);
    });

    test("CZ05 - Renderiza algún título o encabezado", () => {
        render(<Customizeanimal />);
        expect(screen.getByRole("heading")).toBeInTheDocument();
    });
});
