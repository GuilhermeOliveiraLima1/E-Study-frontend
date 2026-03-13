import React, { useState } from "react"
import Swal from "sweetalert2"
import "../styles/TaskCard.css"

export default function TaskCard({ task, onDelete, onEdit }) {

  const [expandido, setExpandido] = useState(false)

  async function deleteTask() {

    const result = await Swal.fire({
      title: 'Deletar evento inscrição?',
      text: "Você deseja deletar esse evento?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim excluir!',
      cancelButtonText: 'Manter evento'
    })

    if (result.isConfirmed) {
      onDelete(task.id)
    }
  }

  return (
    <div className="task-card">

      <div className="task-header">
        <input type="checkbox"/>
        <h3>{task.title}</h3>
      </div>

      <p className={`task-desc ${expandido ? "expandido" : ""}`}>
        {task.description}
      </p>

      <span
        className="read-more"
        onClick={() => setExpandido(!expandido)}
      >
        {expandido ? "Mostrar menos" : "Ler mais..."}
      </span>

      <div className="task-footer">

        <span>{task.deadline}</span>

        <div className="task-actions">

          <button
            className="edit-btn"
            onClick={() => onEdit(task)}
          >
            Editar
          </button>

          <button
            className="delete-btn"
            onClick={deleteTask}
          >
            Excluir
          </button>

        </div>

      </div>
    </div>
  )
}