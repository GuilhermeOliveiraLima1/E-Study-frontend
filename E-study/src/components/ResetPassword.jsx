import { useState } from "react"
import "../styles/ResetPassword.css"

function ResetPassword({ fechar }) {

  const [senhaAtual, setSenhaAtual] = useState("")
  const [novaSenha, setNovaSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")

  async function handleResetSenha() {

    if (!senhaAtual) {
      alert("Informe a senha atual")
      return
    }

    if (novaSenha !== confirmarSenha) {
      alert("As senhas não coincidem")
      return
    }

    if (novaSenha.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres")
      return
    }

    try {

      const response = await fetch("http://localhost:5000/user/change-password", {
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
        alert(erro.message || "Erro ao alterar senha")
      }

    } catch (error) {
      console.error(error)
      alert("Erro na conexão com o servidor")
    }
  }

  return (

    <div className="modal-overlay">

      <div className="modal-box">

        <h2>Redefinir Senha</h2>

        <input
          type="password"
          placeholder="Senha atual"
          value={senhaAtual}
          onChange={(e) => setSenhaAtual(e.target.value)}
        />

        <input
          type="password"
          placeholder="Nova senha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirmar senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
        />

        <div className="modal-actions">

          <button onClick={fechar}>
            Cancelar
          </button>

          <button onClick={handleResetSenha}>
            Confirmar
          </button>

        </div>

      </div>

    </div>

  )
}

export default ResetPassword