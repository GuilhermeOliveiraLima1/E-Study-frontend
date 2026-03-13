import { useState } from "react";
import TaskCard from "../components/TaskCard";
import TaskEditCard from "../components/TaskEditCard";
import "../styles/TaskPage.css";

export default function TasksPage() {

  const tasks = [
    {
      id: 1,
      title: "Criar tela login",
      description: "Desenvolver tela de login com autenticação",
      deadline: "20/03"
    },
    {
      id: 2,
      title: "Criar dashboard",
      description: "Adicionar gráficos de desempenho",
      deadline: "25/03"
    }
  ];
  const [editingTask, setEditingTask] = useState(null);

  function handleEdit(task) {
    setEditingTask(task);
  }

  function handleSave(updatedTask) {
    console.log("salvar", updatedTask);
    setEditingTask(null);
  }

  function handleCancel() {
    setEditingTask(null);
  }

  return (
    <div className="tasks-page">

      <div className="tasks-container">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleEdit}
            onDelete={(id) => console.log("delete", id)}
          />
        ))}
      </div>

      {editingTask && (
        <TaskEditCard
          task={editingTask}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

    </div>
  );
}