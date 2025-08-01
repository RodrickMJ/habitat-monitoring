import { MainBackground } from "../Moleculas/MainBackground"
import { AuthContainer } from "../Moleculas/AuthContainer"
import { Navigation } from "../Moleculas/Navigation"
import WebcamControl from "../Moleculas/WebCam"



export function Camera (){
    return(<>
       <MainBackground>
        <AuthContainer className="bg-black animate-fade-up">
           <Navigation/>
           <div className="w-4/5 mt-10">
           <WebcamControl/>
           </div>
        </AuthContainer>
    </MainBackground>
    </>)
}   