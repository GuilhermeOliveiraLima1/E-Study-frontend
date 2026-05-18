import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"

function Sidebar(){
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  return(

    <>
      <button
        type="button"
        className="sidebar-toggle"
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        ☰
      </button>

      <div
        className={`sidebar-backdrop ${isOpen ? "sidebar-backdrop-open" : ""}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
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
    </>

  )

}

export default Sidebar