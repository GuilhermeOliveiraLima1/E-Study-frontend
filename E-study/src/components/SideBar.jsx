import { Link } from "react-router-dom"

function Sidebar(){

  return(

    <aside className="sidebar">

      <h2 className="logo">E-Study</h2>
      <p>Bem-vindo, {localStorage.getItem("userName")}</p>
      <nav>


        <Link to="/home">Inicio</Link>

        <Link to="/tasks">Tarefas</Link>

        <Link to="/schedule">Cronograma</Link>

        <Link to="/pomodoro">Pomodoro</Link>

        <Link to="/settings">Configurações</Link>
      </nav>

    </aside>

  )

}

export default Sidebar