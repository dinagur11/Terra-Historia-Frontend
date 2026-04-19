import "./LoginPage.css"
import ForgotPassCard from "../Components/ForgotPasswordCard";
import StarBackground from "../Components/StarsBackground"

function LogInPage(){
    return (
    <><StarBackground />
    <div className="login-page">
        <ForgotPassCard />
    </div></>);
}

export default LogInPage