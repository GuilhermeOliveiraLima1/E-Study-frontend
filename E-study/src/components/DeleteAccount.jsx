import "../styles/DeleteAccount.css"
import { useNavigate } from "react-router-dom"

function DeleteAccount({ fechar }) {

  const navigate = useNavigate() // ✅ CORRETO

  async function handleDelete() {

    try {

      const response = await fetch("http://localhost:5000/user", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })

      if (response.status === 204) {
        alert("Conta excluída com sucesso!")

        localStorage.removeItem("token")

        navigate("/") 
      } else {
        alert("Erro ao excluir conta")
      }

    } catch (error) {
      console.error(error)
      alert("Erro na conexão com o servidor")
    }
  }

  return (
    <div className="modal-overlay">

      <div className="modal-box1">

        <h2>Excluir Conta</h2>

        <p className="warning">
          ⚠️ Essa ação é permanente e não pode ser desfeita.
        </p>

        <div className="modal-actions">

          <button onClick={fechar}>
            Cancelar
          </button>

          <button className="btn-danger" onClick={handleDelete}>
            Excluir Conta
          </button>

        </div>

      </div>

    </div>
  )
}

export default DeleteAccount