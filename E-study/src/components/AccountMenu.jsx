import '../styles/SettingsMenu.css'
import { useNavigate } from "react-router-dom"

function Menu(){

  const navigate = useNavigate()

  function logout(){
    localStorage.removeItem("token")
    navigate("/")
  }

  return(  

    <div className="settings-container">

      <button className="settings-button">
        Redefinir Senha
      </button>

      <button className="settings-button">
        Desativar Conta
      </button>

      <button className="settings-button">
        Dados Pessoais
      </button>

      <button className="settings-button" onClick={logout}>
          Sair
      </button>

    </div>

  )

}

export default Menu