import { MainBackground } from "../Moleculas/MainBackground"
import { AuthContainer } from "../Moleculas/AuthContainer"
import { Navigation } from "../Moleculas/Navigation"
import { FormAnimal } from "../Moleculas/FormAnimal"

export function Customizeanimal(){
    return(<>
      <MainBackground>
        <AuthContainer className="bg-black animate-fade-up">
           <Navigation/>
           <div className="flex justify-center w-5/6 p-10 ">
           <FormAnimal/>
           </div>
        </AuthContainer>
    </MainBackground>
    </>)
}