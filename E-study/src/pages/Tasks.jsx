import { useState } from "react";
import TaskCard from "../components/TaskCard";
import TaskEditCard from "../components/TaskEditCard";
import TaskViewModal from "../components/TaskViewModal";
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
      description: "Adicionar gráficos de desempenho fdhdfsguidfshuhndfusvbjusnsihufdhuhnvnsnvvjdsnfighfdfshbuisbybuydefrygbeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeerereeeeeeeeeeeeeeeeeeeeeeeeeeeeerrrrrrrrrrrrrrrrrrgxy",
      deadline: "25/03"
    }
  ];

  const [editingTask, setEditingTask] = useState(null);
  const [viewTask, setViewTask] = useState(null);
  const [search, setSearch] = useState(""); // 🔥 novo estado

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

  function handleView(task) {
    setViewTask(task);
  }

  function handleCloseView() {
    setViewTask(null);
  }

  // 🔥 filtro de busca
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="tasks-page">

      {/* 🔍 barra de busca */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar tarefas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="tasks-container">
        {filteredTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleEdit}
            onDelete={(id) => console.log("delete", id)}
            onView={handleView}
          />
        ))}
      </div>

      {/* 🔥 mensagem quando não encontrar */}
      {filteredTasks.length === 0 && (
        <p style={{ textAlign: "center" }}>
          Nenhuma tarefa encontrada
        </p>
      )}

      {editingTask && (
        <TaskEditCard
          task={editingTask}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {viewTask && (
        <TaskViewModal
          task={viewTask}
          onClose={handleCloseView}
        />
      )}

    </div>
  );
}