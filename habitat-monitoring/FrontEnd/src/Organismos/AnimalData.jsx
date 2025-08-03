import { MainBackground } from "../Moleculas/MainBackground"
import { AuthContainer } from "../Moleculas/AuthContainer"
import { Navigation } from "../Moleculas/Navigation"
import { InformationAnimal } from "../Moleculas/InformationAnimal"

export function AnimalData (){

    

    return(<>
     <MainBackground>
        <AuthContainer className="bg-black animate-fade-up">
           <Navigation/>
          <InformationAnimal/>
        </AuthContainer>
    </MainBackground>
    </>)
}