import InterfaceDataResponse from "../interface/IDataResponse";
const emitSocket = (data: any) =>  {
  
const send: Array<InterfaceDataResponse> = [
    {datos: 'Temperatura', informacion: data.temperature},
    {datos: 'Humedad', informacion: data.humidity}
]
   
    return send
}
export default emitSocket;
