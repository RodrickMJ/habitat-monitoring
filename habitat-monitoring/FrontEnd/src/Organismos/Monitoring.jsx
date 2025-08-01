import { MainBackground } from "../Moleculas/MainBackground";
import { AuthContainer } from "../Moleculas/AuthContainer";
import { Navigation } from "../Moleculas/Navigation";
import { DataMonitoring } from "../Moleculas/DataMonitoring";


export function Monitoring() {
  return (
    <>
      <MainBackground>
        <AuthContainer className="bg-black animate-fade-up">
            <Navigation/>
           <DataMonitoring/>
        </AuthContainer>
      </MainBackground>
    </>
  );
}
