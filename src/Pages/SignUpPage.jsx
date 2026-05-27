import "./LoginPage.css"
import StarBackground from "../Components/StarsBackground"
import SignUpCard from "../Components/Authentication/SignUpCard";

function LogInPage(){
    return (
    <><StarBackground />
    <div className="login-page">
        <SignUpCard />
    </div></>);
}

export default LogInPage