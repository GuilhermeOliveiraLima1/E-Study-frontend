import React, { useState } from "react";
import "../styles/TaskEditCard.css";

const MAX_CHARS = 200;

export default function TaskEditCard({ task, onSave, onCancel }) {

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [dueDate, setDueDate] = useState(task.dueDate ? String(task.dueDate).slice(0, 10) : "");
  const [isCompleted, setIsCompleted] = useState(task.isCompleted === true);

  function handleSubmit(e) {
    e.preventDefault();

    onSave({
      ...task,
      title,
      description,
      dueDate: dueDate || null,
      isCompleted,
    });
  }

  return (
    <div className="edit-overlay">
      <div className="edit-card">

        <h2>Editar tarefa</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="title">Título</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da tarefa"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrição</label>

            <textarea
              id="description"
              rows="4"
              value={description}
              maxLength={MAX_CHARS}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite uma descrição (opcional)"
            />

            <span className="char-counter">
              {description.length}/{MAX_CHARS}
            </span>

          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Data limite</label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="form-group form-group-checkbox">
            <label htmlFor="isCompleted" className="checkbox-label">
              <input
                id="isCompleted"
                type="checkbox"
                checked={isCompleted}
                onChange={(e) => setIsCompleted(e.target.checked)}
              />
              <span>Marcar como concluída</span>
            </label>
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