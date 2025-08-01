import { AuthContainer } from "../Moleculas/AuthContainer";
import { ImgHome } from "../Moleculas/ImgHome";
import { CardData } from "../Moleculas/CardDate";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { InputT } from "../Atomos/Input";
import { Paragraphs } from "../Atomos/Texts";
import { ButtonI } from "../Atomos/Button";
import { MainBackground } from "../Moleculas/MainBackground";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    const credentials = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch("http://34.236.185.151/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error en el inicio de sesión");
      }

      const data = await response.json();
      const token = data.token; // Suponiendo que el token se devuelve como 'token' en la respuesta
      const userId = data.id; // Suponiendo que el ID del usuario se devuelve como 'id' en la respuesta

      // Guardar el token y el ID del usuario en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      console.log("Token:", token);
      console.log("User ID:", userId);

      // Redirigir al usuario a la página de inicio (ejemplo: "/Home")
      navigate("/DatosAnimalito");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <MainBackground>
        <AuthContainer className=" bg-black animate-fade-right animate-duration-[2000ms]">
          <ImgHome />
          <CardData text="Login">
            <form className="flex flex-col w-full sm:w-4/5 mt-10" onSubmit={handleLogin}>
              <label className="flex flex-col mt-4">
                <Paragraphs text="Correo Electrónico:" />
                <InputT
                  type="email"
                  placeholder="Correo Electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label className="flex flex-col mt-4">
                <Paragraphs text="Contraseña:" />
                <InputT
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>

              {error && <p className="text-red-500 mt-2">{error}</p>}

              <nav className="mt-7 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                <a className="text-gray-300 no-underline hover:text-gray-400" href="Formulario">Regístrate</a>
                <a className="text-gray-300 no-underline hover:text-gray-400" href="">Personaliza</a>
              </nav>

              <div className="flex justify-center mt-4">
                <ButtonI type="submit" text="Iniciar Sesión" />
              </div>
            </form>
          </CardData>
          
        </AuthContainer>
      </MainBackground>
    </>
  );
}
