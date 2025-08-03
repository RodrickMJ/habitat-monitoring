import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./Organismos/Login";
import { LoginForm } from "./Organismos/Loginform";
import { Camera } from "./Organismos/Camera";
import { Monitoring } from "./Organismos/Monitoring";
import { AnimalData } from "./Organismos/AnimalData";
import { Customizeanimal } from "./Organismos/Customizeanimal";
import { SocketProvider } from "./Context/soquet";

function App() {
  return (

    <Router>
      <SocketProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Formulario" element={<LoginForm />} />
          <Route path="/Camara" element={<Camera />} />
          <Route path="/Monitoreo" element={<Monitoring />} />
          <Route path="/DatosAnimalito" element={<AnimalData />} />
          <Route path="/Personaliza" element={<Customizeanimal />} />
        </Routes>
      </SocketProvider>

    </Router>

  );
}

export default App;

