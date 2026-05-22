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
            <label htmlFor="create-title">Título</label>
            <input
              id="create-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da tarefa"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="create-description">Descrição</label>
            <textarea
              id="create-description"
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
            <label htmlFor="create-dueDate">Data limite</label>
            <input
              id="create-dueDate"
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
