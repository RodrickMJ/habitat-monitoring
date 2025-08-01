import React, { useState } from 'react';
import { DoubleContainer } from './DoubleContainer';

export default function WebcamControl() {
  const [webcamStream, setWebcamStream] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const startCamera = async () => {
    try {
      const response = await fetch('http://34.236.185.151/api/v1/camera/on', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      console.log(data);

      if (data.status === "Camera is on") {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoElement = document.getElementById('webcam');
        videoElement.srcObject = stream;
        setWebcamStream(stream);
        setIsCameraOn(true);
      } else {
        console.error("Error encendiendo la cámara: Respuesta inesperada", data);
      }
    } catch (err) {
      console.error('Error encendiendo la cámara:', err);
    }
  };

  const stopCamera = async () => {
    try {
      const response = await fetch('http://34.236.185.151/api/v1/camera/off', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      console.log(data);

      if (data.status === "Camera is off") {
        const videoElement = document.getElementById('webcam');
        setIsCameraOn(false);
        if (webcamStream) {
          webcamStream.getTracks().forEach(track => track.stop());
          setWebcamStream(null);
        }
      } else {
        console.error("Error apagando la cámara: Respuesta inesperada", data);
      }
    } catch (err) {
      console.error('Error apagando la cámara:', err);
    }
  };

  return (
    
    <div className="flex flex-col items-center justify-center ">
      <h1 className="text-2xl font-bold text-gray-800">Webcam Control</h1>
      <div className="my-5">
        <button
          id="start"
          onClick={startCamera}
          className="px-4 py-2 mx-2 text-white bg-green-500  rounded-md"
        >
          Encender Cámara
        </button>
        <button
          id="stop"
          onClick={stopCamera}
          className="px-4 py-2 mx-2 text-white bg-red-500 rounded-md"
        >
          Apagar Cámara
        </button>
      </div>
      <video
        id="webcam"
        width="500"
        height=""
        autoPlay
        className={`mt-5 border-2 border-gray-800 rounded-lg ${isCameraOn ? 'block' : 'hidden'}`}
      ></video>
    </div>
  );
}
