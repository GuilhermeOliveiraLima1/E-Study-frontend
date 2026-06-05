import Login from "../components/Login"
import "../styles/Login.css"

function LoginPage(){

  return (
    <div className="login-container">

      <div className="login-box">
        <h1 className="login-title">E-Study</h1>

        <Login />
      </div>

    </div>
  )

}

export default LoginPage