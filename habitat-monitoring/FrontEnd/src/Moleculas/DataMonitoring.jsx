import React, { useEffect, useState } from 'react';
import { Titles } from "../Atomos/Texts";
import { DoubleContainer } from './DoubleContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThermometerHalf, faTint } from '@fortawesome/free-solid-svg-icons';
import { useSocket } from '../Context/soquet';

export function DataMonitoring() {
  const { sensorData } = useSocket();
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    if (sensorData && Array.isArray(sensorData)) {
      const updatedDatos = sensorData.map((item) => {
        let icono, color;

        switch (item.datos) {
          case "Temperatura":
            icono = faThermometerHalf;
            color = "bg-red-200";
            break;
          case "Humedad":
            icono = faTint;
            color = "bg-blue-200";
            break;
          default:
            icono = faThermometerHalf; 
            color = "bg-gray-200"; 
        }

        return {
          datos: item.datos,
          informacion: `${item.informacion}${item.datos === "Temperatura" ? '°C' : '%'}`,
          icono,
          color,
        };
      });

      setDatos(updatedDatos);
    }
  }, [sensorData]);

  return (
    <DoubleContainer className='flex justify-center'>
      <article className="w-full md:w-1/2 h-full p-3">
        <header className="mt-5">
          <Titles text="Datos de Monitoreo" />
        </header>
        <section className="text-center p-4 mt-6 md:mt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {datos.map((item, index) => (
              <div key={index} className={`p-4 rounded-lg shadow-md border border-gray-200 ${item.color}`}>
                <FontAwesomeIcon icon={item.icono} className="text-4xl mb-4" />
                <h3 className="text-xl font-semibold mb-2">{item.datos}</h3>
                <p className="text-2xl font-bold">{item.informacion}</p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </DoubleContainer>
  );
}
