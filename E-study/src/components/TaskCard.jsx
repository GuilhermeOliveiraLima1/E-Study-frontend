import React from "react";
import Swal from "sweetalert2";
import "../styles/TaskCard.css";

export default function TaskCard({ task, onDelete, onEdit, onView, onToggleComplete }) {
  const MAX_DESCRIPTION_LENGTH = 60;

  const descriptionText = task?.description ?? "";
  const descriptionPreview =
    descriptionText.length > MAX_DESCRIPTION_LENGTH
      ? `${descriptionText.slice(0, MAX_DESCRIPTION_LENGTH).trimEnd()}...`
      : descriptionText;

  async function deleteTask() {
    const result = await Swal.fire({
      title: 'Deletar evento inscrição?',
      text: "Você deseja deletar esse evento?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#4facfe',
      confirmButtonText: 'Sim excluir!',
      cancelButtonText: 'Manter evento'
    });

    if (result.isConfirmed) {
      onDelete(task.id);
    }
  }

  async function handleToggleCompletion(checked) {
    const markingAsCompleted = checked === true;

    const result = await Swal.fire({
      title: markingAsCompleted ? "Concluir tarefa?" : "Marcar como pendente?",
      text: markingAsCompleted
        ? "Deseja marcar esta tarefa como concluída?"
        : "Deseja marcar esta tarefa como pendente novamente?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4facfe",
      cancelButtonColor: "#d33",
      confirmButtonText: markingAsCompleted ? "Sim, concluir" : "Sim, marcar como pendente",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      await onToggleComplete(task, checked);
    }
  }

  return (
    <div className="task-card" onClick={() => onView(task)}>

      <div className="task-header">
        <input
          type="checkbox"
          checked={task.isCompleted === true}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => handleToggleCompletion(e.target.checked)}
        />
        <h3>{task.title}</h3>
      </div>

      <div className="task-description">
        <p>{descriptionPreview}</p>
      </div>

      <div className="task-footer">
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