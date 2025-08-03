export function Navigation() {
    return (
      <>
        <nav className="bg-black bg-opacity-10 p-3 md:p-10">
          <ul className="text-white  md:mt-10">
          <li className="md:mt-6">
              <a
                href="/DatosAnimalito"
                className="block text-center p-2 hover:bg-white hover:text-black transition-colors duration-200"
              >
                Datos General
              </a>
            </li>
            <li className="md:mt-6">
              <a
                href="/Camara"
                className="block text-center p-2 hover:bg-white hover:text-black transition-colors duration-200"
              >
                Cámara
              </a>
            </li>
            <li className="md:mt-6">
              <a
                href="/Monitoreo"
                className="block text-center p-2 hover:bg-white hover:text-black transition-colors duration-200"
              >
                Monitoreo
              </a>
            </li>
            <li className="md:mt-6">
              <a
                href="/Personaliza"
                className="block text-center p-2 hover:bg-white hover:text-black transition-colors duration-200"
              >
                Personaliza
              </a>
            </li>
            <li className="mt-6 md:mt-28">
              <a
                href="/"
                className="block text-center p-2 hover:bg-white hover:text-black transition-colors duration-200"
              >
                Cerrar Sesión
              </a>
            </li>
          </ul>
        </nav>
      </>
    );
  }
  