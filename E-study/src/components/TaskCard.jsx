import React from "react";
import Swal from "sweetalert2";
import "../styles/TaskCard.css";

export default function TaskCard({ task, onDelete, onEdit, onView }) {

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
    });

    if (result.isConfirmed) {
      onDelete(task.id);
    }
  }

  return (
    <div className="task-card" onClick={() => onView(task)}>

      <div className="task-header">
    <input
      type="checkbox"
      onClick={(e) => e.stopPropagation()}
    />     
   <h3>{task.title}</h3>
      </div>

      <div className="task-footer">

        <span>{task.deadline}</span>

        <div className="task-actions">

          <button
            className="edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
          >
            Editar
          </button>

          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              deleteTask();
            }}
          >
            Excluir
          </button>

        </div>

      </div>
    </div>
  );
}