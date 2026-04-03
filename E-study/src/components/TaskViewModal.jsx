import "../styles/TaskViewModal.css";

export default function TaskViewModal({ task, onClose }) {
  return (
    <div className="view-overlay">
      <div className="view-card">

        {/* HEADER */}
        <div className="view-header">
          <h2>{task.title}</h2>
        </div>

        {/* DESCRIÇÃO */}
        <p className="view-description">
          {task.description || "Sem descrição"}
        </p>

        {/* FOOTER */}
        <div className="view-footer">
          <span className="view-deadline">
            {task.dueDate?.slice(0, 10) || task.deadline || "Sem prazo"}
          </span>

          <button className="primary-btn" onClick={onClose}>
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
}