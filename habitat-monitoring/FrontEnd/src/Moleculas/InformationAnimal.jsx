import { useState, useEffect } from "react";
import { DoubleContainer } from "./DoubleContainer";
import { Titles } from "../Atomos/Texts";

export function InformationAnimal() {
  const [datosAnimal, setDatosAnimal] = useState([]);
  const [datosPerfil, setDatosPerfil] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      try {
        const response = await fetch(`http://34.236.185.151/api/v1/auth/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          setDatosPerfil([
            { datos: "Nombre", informacion: data.name },
            { datos: "Apellido", informacion: data.lastname },
            { datos: "Email", informacion: data.email }
          ]);
          
          if (data.animals && data.animals.length > 0) {
            const animal = data.animals[0];
            setDatosAnimal([
              { datos: "Nombre", informacion: animal.name },
              { datos: "Raza", informacion: animal.breed },
              { datos: "Especie", informacion: animal.species },
              { datos: "Edad", informacion: animal.age },
              { datos: "Género", informacion: animal.gender },
              { datos: "Color", informacion: animal.color },
              { datos: "Tamaño", informacion: animal.size },
              { datos: "Notas", informacion: animal.notes }
            ]);
          }
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        console.error("Error in fetch:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <DoubleContainer className="gap-20">
      <article className="w-1/2 h-full p-3">
        <header className="mt-10">
          <Titles text="Datos Usuario" />
        </header>
        <section className="text-center p-4 mt-5">
          <table className="w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Datos</th>
                <th className="border border-gray-300 px-4 py-2">Información</th>
              </tr>
            </thead>
            <tbody className="bg-blue-100">
              {datosPerfil.map((item, index) => (
                <tr key={index} className="hover:bg-blue-200">
                  <td className="border border-gray-300 px-4 py-2">{item.datos}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.informacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </article>

      <article className="w-1/2 h-full p-3">
        <header className="mt-10">
          <Titles text="Datos Animalito" />
        </header>
        <section className="text-center p-4 mt-5">
          <table className="w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
            <thead className="bg-green-500 text-white">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Datos</th>
                <th className="border border-gray-300 px-4 py-2">Información</th>
              </tr>
            </thead>
            <tbody className="bg-green-100">
              {datosAnimal.map((item, index) => (
                <tr key={index} className="hover:bg-green-200">
                  <td className="border border-gray-300 px-4 py-2">{item.datos}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.informacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </article>
    </DoubleContainer>
  );
}
