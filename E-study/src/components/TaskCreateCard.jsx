import { useState } from "react";
import "../styles/TaskCreateCard.css";

const MAX_CHARS = 200;

export default function TaskCreateCard({ onCreate, onCancel, isSubmitting }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    onCreate({
      title: title.trim(),
      description: description.trim(),
      dueDate,
    });
  }

  return (
    <div className="create-overlay">
      <div className="create-card">
        <h2>Criar tarefa</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Titulo</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Descricao</label>
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

          <div className="form-group">
            <label>Data limite</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="create-actions">
            <button type="button" className="cancel" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </button>

            <button type="submit" className="save" disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
