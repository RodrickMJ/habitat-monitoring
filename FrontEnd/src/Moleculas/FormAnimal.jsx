import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import ImgFormAnimal from "../assets/Img/ImgFormAnimal.jpeg";
import { Paragraphs } from "../Atomos/Texts";
import { InputT } from "../Atomos/Input";
import { ButtonI } from "../Atomos/Button";

export function FormAnimal() {
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    species: "",
    age: "",
    gender: "",
    color: "",
    size: "",
    notes: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://34.236.185.151/api/v1/animal/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrar el animal");
      }

  
      alert("¡Registro exitoso! Cuidaremos de Tu Animalito :)");
      navigate("/DatosAnimalito"); 
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Error en el registro: " + error.message);
    }
  };

  return (
    <>
      <article className="w-full h-full relative">
        <img
          className="absolute w-full h-full object-cover"
          src={ImgFormAnimal}
          alt="ImgFormAnimal"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <section className="relative flex items-center justify-center h-full">
          <form className="bg-blue-50 bg-opacity-15 w-11/12 h-5/6" onSubmit={handleSubmit}>
            <div className="w-full h-1/4 mt-6 flex justify-center items-center gap-28">
              <label className="">
                <Paragraphs text="Nombre:" />
                <InputT 
                  type="text" 
                  placeholder="Nombre" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </label>
              <label className="">
                <Paragraphs text="Raza:" />
                <InputT 
                  type="text" 
                  placeholder="Raza" 
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                />
              </label>
              <label className="">
                <Paragraphs text="Especie:" />
                <InputT 
                  type="text" 
                  placeholder="Especie" 
                  name="species"
                  value={formData.species}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="w-full h-1/4 mt-6 flex justify-center items-center gap-28">
              <label className="">
                <Paragraphs text="Edad:" />
                <InputT 
                  type="number" 
                  placeholder="Edad" 
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                />
              </label>
              <label className="">
                <Paragraphs text="Género:" />
                <InputT 
                  type="text" 
                  placeholder="Género" 
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                />
              </label>
              <label className="">
                <Paragraphs text="Color:" />
                <InputT 
                  type="text" 
                  placeholder="Color" 
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="w-full h-1/4 mt-6 flex justify-center items-center gap-28">
              <label className="">
                <Paragraphs text="Tamaño:" />
                <InputT 
                  type="text" 
                  placeholder="Tamaño" 
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                />
              </label>
              <label className="">
                <Paragraphs text="Notas:" />
                <InputT 
                  type="text" 
                  placeholder="Notas" 
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </label>

              <div className="">
                <ButtonI className="bg-blue-500 opacity-50" type="submit" text="Personaliza" />
              </div>
            </div>
          </form>
        </section>
      </article>
    </>
  );
}
