import { useNavigate } from "react-router-dom"
import '../styles/SettingsMenu.css'

function Menu(){

  const navigate = useNavigate()

  return(

    <div className="settings-container">

      <button className="settings-button">
        Conta
      </button>

      <button className="settings-button">
        Histórico de Tarefas Concluídas
      </button>

      <button className="settings-button">
        Notificações
      </button>

      <button
        className="settings-button"
        onClick={() => navigate("/about")}
      >
        Sobre o Site
      </button>

    </div>

  )

}

export default Menu