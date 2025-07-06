import ImgHomeI from "../assets/Img/ImgHome.jpeg"

export function ImgHome() {
  return (
    <div className="relative w-full sm:w-1/2 h-1/2 sm:h-full">
      <img className="w-full h-full object-cover" src={ImgHomeI} alt="ImgHome" />
      <div className="absolute inset-0 bg-black bg-opacity-35"></div>
    </div>
  );
}
