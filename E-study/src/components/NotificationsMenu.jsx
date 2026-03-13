import { useState } from "react"
import '../styles/SettingsMenu.css'

function Menu(){

  const [emailNotif, setEmailNotif] = useState(false)
  const [taskNotif, setTaskNotif] = useState(false)
  const [weekNotif, setWeekNotif] = useState(false)

  return(  

    <div className="settings-container">

      <h1>Notificações</h1>

      <div className="setting-item">
        <span>Notificar no E-mail</span>

        <label className="switch">
          <input 
            type="checkbox"
            checked={emailNotif}
            onChange={() => setEmailNotif(!emailNotif)}
          />
          <span className="slider"></span>
        </label>
      </div>

      <div className="setting-item">
        <span>Notificar tarefas próximas do prazo</span>

        <label className="switch">
          <input 
            type="checkbox"
            checked={taskNotif}
            onChange={() => setTaskNotif(!taskNotif)}
          />
          <span className="slider"></span>
        </label>
      </div>

      <div className="setting-item">
        <span>Receber resumo semanal de tarefas</span>

        <label className="switch">
          <input 
            type="checkbox"
            checked={weekNotif}
            onChange={() => setWeekNotif(!weekNotif)}
          />
          <span className="slider"></span>
        </label>
      </div>

    </div>
  )
}

export default Menu