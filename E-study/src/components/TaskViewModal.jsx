import "../styles/TaskViewModal.css";

export default function TaskViewModal({ task, onClose }) {
  const categoryLabels = {
    0: "Sem categoria",
    1: "Trabalho",
    2: "Estudo",
    3: "Saúde",
    4: "Exercício",
    5: "Shopping",
    6: "Pessoal",
    7: "Família",
    8: "Finanças",
    9: "Entretenimento",
    10: "Viagem",
  };

  const formatDate = (value) => {
    if (!value) return "Sem prazo";

    const dateValue = value.includes("T") ? value : `${value}T00:00:00`;
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "Sem prazo";

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getCategoryLabel = () => {
    if (task?.categoryName) return task.categoryName;
    if (Number.isInteger(task?.category)) return categoryLabels[task.category] || `Categoria ${task.category}`;
    return "Sem categoria";
  };

  return (
    <div className="view-overlay">
      <div className="view-card">

        {/* HEADER */}
        <div className="view-header">
          <h2>{task.title}</h2>
          <span className={task.isCompleted === true ? "view-status completed" : "view-status pending"}>
            {task.isCompleted === true ? "Concluída" : "Pendente"}
          </span>
        </div>

        <div className="view-info-grid">
          <div className="view-info-item">
            <span className="view-info-label">Categoria</span>
            <span className="view-info-value">{getCategoryLabel()}</span>
          </div>

          <div className="view-info-item">
            <span className="view-info-label">Prazo</span>
            <span className="view-info-value">{formatDate(task.dueDate || task.deadline)}</span>
          </div>
        </div>

        <div className="view-description-box">
          <span className="view-info-label">Descrição</span>
          <p className="view-description">
            {task.description || "Sem descrição"}
          </p>
        </div>

        {/* FOOTER */}
        <div className="view-footer">
          <button className="primary-btn" onClick={onClose}>
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
}