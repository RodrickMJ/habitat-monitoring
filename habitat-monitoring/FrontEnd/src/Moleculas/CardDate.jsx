
import { Titles } from '../Atomos/Texts'; 
export function CardData({ children, text }) {
  return (
    <section className="bg-blue-400 bg-opacity-25 w-full h-full flex items-center justify-center p-4 sm:w-1/2 sm:p-0">
      <div className="bg-black bg-opacity-10 rounded-3xl w-full sm:w-3/4 h-auto p-8 sm:h-5/6">
        <Titles text={text} /> {}
        <section className="w-full flex justify-center">
          {children}
        </section>
      </div>
    </section>
  );
}
