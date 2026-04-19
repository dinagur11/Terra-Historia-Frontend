import "./LoginPage.css"
import LoginCard from "../Components/LoginCard";
import StarBackground from "../Components/StarsBackground"

function LogInPage(){
    return (
    <><StarBackground />
    <div className="login-page">
        <LoginCard />
    </div></>);
}

export default LogInPage