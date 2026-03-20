import '../styles/SettingsMenu.css'
import { useState } from "react"
import ResetPassword from "./ResetPassword"
import { useNavigate } from "react-router-dom"
import DeleteAccount from "./DeleteAccount"

function Menu(){

  const navigate = useNavigate()
  const [mostrarModal, setMostrarModal] = useState(false)
  const [mostrarDelete, setMostrarDelete] = useState(false)

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

      <button 
        className="settings-button"
        onClick={() => setMostrarDelete(true)}
      >
        Desativar Conta
      </button>
      {mostrarDelete && (
        <DeleteAccount fechar={() => setMostrarDelete(false)} />
      )}

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