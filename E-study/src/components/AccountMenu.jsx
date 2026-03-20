import '../styles/SettingsMenu.css'
import { useState } from "react"
import ResetPassword from "./ResetPassword"
import { useNavigate } from "react-router-dom"

function Menu(){

  const navigate = useNavigate()
  const [mostrarModal, setMostrarModal] = useState(false)

  function logout(){
    localStorage.removeItem("token")
    navigate("/")
  }

  return(  

    <div className="settings-container">

      <button
        className="settings-button"
        onClick={() => setMostrarModal(true)}
      >
        Redefinir Senha
      </button>

      {mostrarModal && (
        <ResetPassword fechar={() => setMostrarModal(false)} />
      )}

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