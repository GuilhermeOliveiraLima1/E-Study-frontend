import React, { useState } from "react";
import "../styles/TaskEditCard.css";

const MAX_CHARS = 200;

export default function TaskEditCard({ task, onSave, onCancel }) {

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  function handleSubmit(e) {
    e.preventDefault();

    onSave({
      ...task,
      title,
      description
    });
  }

  return (
    <div className="edit-overlay">
      <div className="edit-card">

        <h2>Editar tarefa</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Descrição</label>

            <textarea
              rows="4"
              value={description}
              maxLength={MAX_CHARS}
              onChange={(e) => setDescription(e.target.value)}
            />

            <span className="char-counter">
              {description.length}/{MAX_CHARS}
            </span>

          </div>

          <div className="edit-actions">
            <button type="button" className="cancel" onClick={onCancel}>
              Cancelar
            </button>

            <button type="submit" className="save">
              Salvar
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}