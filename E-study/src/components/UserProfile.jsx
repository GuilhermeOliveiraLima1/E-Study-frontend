import { useEffect, useState } from "react"
import "../styles/UserProfile.css"

function UserProfile({ fechar }) {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarUsuario()
  }, [])

  async function carregarUsuario() {
    try {
      const response = await fetch("http://localhost:5000/user", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data)
      } else {
        alert("Erro ao carregar dados")
      }

    } catch (error) {
      console.error(error)
      alert("Erro na conexão")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">

      <div className="modal-box">

        <h2>Dados Pessoais</h2>

        {loading ? (
          <p>Carregando...</p>
        ) : user ? (
          <>
            <p><strong>Nome:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </>
        ) : (
          <p>Erro ao carregar dados</p>
        )}

        <div className="modal-actions">
          <button onClick={fechar}>Fechar</button>
        </div>

      </div>

    </div>
  )
}

export default UserProfile