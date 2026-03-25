import "../styles/TaskViewModal.css";

export default function TaskViewModal({ task, onClose }) {

  return (
    <div className="view-overlay">

      <div className="view-card">

        <h2>{task.title}</h2>

        <p className="view-description">
          {task.description}
        </p>

        <span className="view-deadline">
          Prazo: {task.deadline}
        </span>

        <button onClick={onClose}>
          Fechar
        </button>

      </div>

    </div>
  );
}