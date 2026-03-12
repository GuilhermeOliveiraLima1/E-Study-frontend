import { Link } from "react-router-dom"

function Sidebar(){

  return(

    <aside className="sidebar">

      <h2 className="logo">E-Study</h2>

      <nav>


        <Link to="/home">Tarefas</Link>

        <Link to="/schedule">Cronograma</Link>

        <Link to="/pomodoro">Pomodoro</Link>

      </nav>

    </aside>

  )

}

export default Sidebar