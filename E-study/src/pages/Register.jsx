import Register from "../components/Register"
import "../styles/register.css"

function RegisterPage(){

  return(
    <div className="register-container">

      <div className="register-box">

        <h1 className="register-title">Criar Conta</h1>

        <Register/>

      </div>

    </div>
  )

}

export default RegisterPage