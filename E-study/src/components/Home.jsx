import { useNavigate } from "react-router-dom"

function Home(){

  const navigate = useNavigate()

  function logout(){
    localStorage.removeItem("token")
    navigate("/")
  }

  return(

    <div className="home-box">

      <h1 className="home-title">E-Study</h1>

      <p className="home-subtitle">
        Organize seus estudos de forma inteligente.
      </p>

      <button className="home-button" onClick={logout}>
        Logout
      </button>

    </div>

  )

}

export default Home