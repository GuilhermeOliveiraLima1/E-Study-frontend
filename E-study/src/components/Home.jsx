import { useNavigate } from "react-router-dom"
import '../styles/Home.css'

function Home(){

  const navigate = useNavigate()

  function logout(){
    localStorage.removeItem("token")
    navigate("/")
  }

  return(
      
        <div>
        <button className="home-button" onClick={logout}>
          Logout
        </button>
          <div className="title-container">
            <h1 className="home-title">E-Study</h1>
          </div>
        <p className="home-subtitle">
          Organize seus estudos de forma inteligente.
        </p>

      </div>
  )

}

export default Home