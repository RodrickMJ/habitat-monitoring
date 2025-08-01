import FondoPrincipal from "../assets/Img/FondoPrincipal.jpg"

export function MainBackground ({children}){
    return(<>
    <main className="relative w-full h-screen">
      <img className="absolute w-full h-full object-cover" src={FondoPrincipal} alt="Fondo Principal"/>
      <div className="absolute inset-0 bg-gray-600 bg-opacity-45"></div>
      <section className="relative flex items-center justify-center h-full">
        {children}
      </section>
    </main>
    </>)
}