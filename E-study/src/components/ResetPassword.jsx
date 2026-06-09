import { useState } from "react"
import "../styles/ResetPassword.css"
import TogglePassword from "./TogglePassword"

function ResetPassword({ fechar }) {

  const [senhaAtual, setSenhaAtual] = useState("")
  const [novaSenha, setNovaSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  })

  async function handleResetSenha(e) {
    e.preventDefault()
    setError("")

    if (!senhaAtual.trim()) {
      setError("Informe a senha atual")
      return
    }

    if (novaSenha.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres")
      return
    }

    if (novaSenha !== confirmarSenha) {
      setError("As senhas não coincidem")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + "/user/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          password: senhaAtual,
          newPassword: novaSenha
        })
      })

      if (response.status === 204) {
        alert("Senha redefinida com sucesso!")
        fechar()
      } else {
        const erro = await response.json()
        console.log(erro)
        setError(erro.message || "Erro ao alterar senha")
      }
    } catch (error) {
      console.error(error)
      setError("Erro na conexão com o servidor")
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Redefinir Senha</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleResetSenha}>
          <div className="form-group">
            <label htmlFor="senha-atual">Senha Atual</label>
            <div className="password-input-wrapper">
              <input
                id="senha-atual"
                type={showPassword.current ? "text" : "password"}
                placeholder="Digite sua senha atual"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                disabled={isSubmitting}
              />
              <TogglePassword
                show={showPassword.current}
                onToggle={() => togglePasswordVisibility('current')}
                disabled={isSubmitting}
                title={showPassword.current ? "Ocultar senha" : "Mostrar senha"}
                ariaLabel={showPassword.current ? "Ocultar senha" : "Mostrar senha"}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="nova-senha">Nova Senha</label>
            <div className="password-input-wrapper">
              <input
                id="nova-senha"
                type={showPassword.new ? "text" : "password"}
                placeholder="Digite a nova senha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                disabled={isSubmitting}
              />
              <TogglePassword
                show={showPassword.new}
                onToggle={() => togglePasswordVisibility('new')}
                disabled={isSubmitting}
                title={showPassword.new ? "Ocultar senha" : "Mostrar senha"}
                ariaLabel={showPassword.new ? "Ocultar senha" : "Mostrar senha"}
              />
            </div>
            <small className="password-hint">Mínimo 6 caracteres</small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmar-senha">Confirmar Senha</label>
            <div className="password-input-wrapper">
              <input
                id="confirmar-senha"
                type={showPassword.confirm ? "text" : "password"}
                placeholder="Confirme a nova senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                disabled={isSubmitting}
              />
              <TogglePassword
                show={showPassword.confirm}
                onToggle={() => togglePasswordVisibility('confirm')}
                disabled={isSubmitting}
                title={showPassword.confirm ? "Ocultar senha" : "Mostrar senha"}
                ariaLabel={showPassword.confirm ? "Ocultar senha" : "Mostrar senha"}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button 
              type="button"
              className="cancel"
              onClick={fechar}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="confirm"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Confirmar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword