import { useState } from "react";
import "../styles/TaskCreateCard.css";

const MAX_CHARS = 200;

function TaskCreateCard({
  onCreate,
  onCancel,
  isSubmitting,
  defaultCategories = [],
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [categoryValue, setCategoryValue] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    onCreate({
      title: title.trim(),
      description: description.trim(),
      dueDate,
      category: categoryValue ? Number(categoryValue) : undefined,
    });
  }

  const visibleDefaultCategories = defaultCategories.filter((category) => category?.value !== 0);
  const controlsDisabled = isSubmitting;

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

          <div className="form-group">
            <label htmlFor="create-category">Categoria (opcional)</label>
            <select
              className="category-select-mobile"
              id="create-category"
              value={categoryValue}
              onChange={(e) => setCategoryValue(e.target.value)}
              disabled={controlsDisabled}
            >
              <option value="">Selecione uma categoria</option>
              {visibleDefaultCategories.map((category) => (
                <option key={`default-${category.value}`} value={category.value}>
                  {category.name}
                </option>
              ))}
            </select>
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

export default TaskCreateCard;
