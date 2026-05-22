import { useCallback, useEffect, useState } from "react"
import "../styles/UserProfile.css"

function UserProfile({ fechar }) {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  function extractUserPayload(data) {
    if (!data || typeof data !== "object") {
      return {}
    }

    if (data.user && typeof data.user === "object") {
      return data.user
    }

    if (data.data && typeof data.data === "object") {
      return data.data
    }

    return data
  }

  const carregarUsuario = useCallback(async () => {
    const token = localStorage.getItem("token")
    const apiBaseUrl = (import.meta.env.VITE_API_URL || "").trim()

    if (!token) {
      setLoading(false)
      setUser(null)
      return
    }

    try {
      const response = await fetch(`${apiBaseUrl}/user/user-profile`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error("Erro ao carregar dados")
      }

      const data = await response.json()
      const payload = extractUserPayload(data)
      const cachedName = localStorage.getItem("userName") || ""
      const cachedEmail = localStorage.getItem("userEmail") || ""
      const loadedUser = {
        name:
          payload?.name ||
          payload?.userName ||
          payload?.username ||
          cachedName ||
          "",
        email:
          payload?.email ||
          payload?.emailAddress ||
          payload?.userEmail ||
          payload?.mail ||
          cachedEmail ||
          ""
      }

      if (!loadedUser.name && !loadedUser.email) {
        throw new Error("Perfil não encontrado")
      }

      setUser(loadedUser)

    } catch (error) {
      console.error(error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregarUsuario()
  }, [carregarUsuario])

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Dados Pessoais</h2>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Carregando dados...</p>
          </div>
        ) : user ? (
          <div className="user-info">
            <div className="info-card">
              <label>Nome</label>
              <p className="info-value">{user.name}</p>
            </div>

            <div className="info-card">
              <label>Email</label>
              <p className="info-value">{user.email}</p>
            </div>
          </div>
        ) : (
          <div className="error-state">
            <p>⚠️ Erro ao carregar dados pessoais</p>
          </div>
        )}

        <div className="modal-actions">
          <button className="close-btn" onClick={fechar}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserProfile