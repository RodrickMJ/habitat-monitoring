import { useState } from "react";
import { MainBackground } from "../Moleculas/MainBackground";
import { CardData } from "../Moleculas/CardDate";
import { AuthContainer } from "../Moleculas/AuthContainer";
import { ImgHome } from "../Moleculas/ImgHome";
import { Paragraphs } from "../Atomos/Texts";
import { InputT } from "../Atomos/Input";
import { ButtonI } from "../Atomos/Button";
import { useNavigate } from "react-router-dom";

export function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleForm = async (e) => {
    e.preventDefault();

    // Verificar que todos los campos estén llenados
    if (!formData.name || !formData.lastname || !formData.email || !formData.password) {
      setFormError("Por favor, completa todos los campos.");
      return;
    } else {
      setFormError(null);
    }

    try {
      const response = await fetch("http://34.236.185.151/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Registro exitoso:", data);
        alert("Registro exitoso :) DE CLIK PARA AVANZAR");
        navigate("/");
      } else {
        const errorData = await response.json();
        console.error("Error en el registro:", errorData);
        setFormError("Error en el registro. Por favor, intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setFormError("Error en la solicitud. Por favor, intenta de nuevo.");
    }
  };

  return (
    <MainBackground>
      <AuthContainer className="bg-pink-300 animate-fade-left animate-duration-[2000ms]">
        <CardData>
          <form className="flex flex-col w-full sm:w-4/5 mt-7" onSubmit={handleForm}>
            <label>
              <Paragraphs text="Nombre:" />
              <InputT type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} />
            </label>

            <label className="mt-4">
              <Paragraphs text="Apellido:" />
              <InputT type="text" name="lastname" placeholder="Apellido" value={formData.lastname} onChange={handleChange} />
            </label>

            <label className="mt-4">
              <Paragraphs text="Correo:" />
              <InputT type="email" name="email" placeholder="Correo" value={formData.email} onChange={handleChange} />
            </label>

            <label className="mt-4">
              <Paragraphs text="Contraseña:" />
              <InputT type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} />
            </label>

            {formError && <p className="text-red-500 mt-2">{formError}</p>}

            <div className="flex justify-center mt-4">
              <ButtonI type="submit" text="Registrar" />
            </div>
          </form>
        </CardData>
        <ImgHome />
      </AuthContainer>
    </MainBackground>
  );
}
