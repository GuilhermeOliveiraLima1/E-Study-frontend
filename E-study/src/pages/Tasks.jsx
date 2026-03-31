import { useCallback, useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";
import TaskCreateCard from "../components/TaskCreateCard";
import TaskEditCard from "../components/TaskEditCard";
import TaskViewModal from "../components/TaskViewModal";
import "../styles/TaskPage.css";

export default function TasksPage() {
  const apiUrl = (import.meta.env.VITE_API_URL || "").trim();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingTask, setEditingTask] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
  const [viewTask, setViewTask] = useState(null);
  const [search, setSearch] = useState("");

  const fetchTasks = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token não encontrado. Faça login novamente.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(apiUrl + "/user-tasks", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Não foi possível carregar as tarefas.");
      }

      const data = await response.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (requestError) {
      console.error("Erro ao buscar tarefas:", requestError);
      setError("Erro ao carregar tarefas.");
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  function handleEdit(task) {
    setEditingTask(task);
  }

  async function handleSave(updatedTask) {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Token nao encontrado. Faca login novamente.");
      return;
    }

    try {
      const payload = {
        title: updatedTask.title?.trim() || "",
        description: updatedTask.description?.trim() || "",
        dueDate: updatedTask.dueDate
          ? new Date(`${updatedTask.dueDate}T00:00:00`).toISOString()
          : null,
        isCompleted: updatedTask.isCompleted === true,
      };

      const response = await fetch(`${apiUrl}/user-tasks/${updatedTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let data = null;

      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch {
        data = null;
      }

      if (!response.ok) {
        alert(data?.errors?.[0] || responseText || "Erro ao atualizar tarefa");
        return;
      }

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === updatedTask.id
            ? {
                ...task,
                ...payload,
              }
            : task
        )
      );
      setEditingTask(null);
    } catch (requestError) {
      console.error("Erro ao atualizar tarefa:", requestError);
      alert("Erro ao atualizar tarefa");
    }
  }

  function handleCancel() {
    setEditingTask(null);
  }

  async function handleView(task) {
    const token = localStorage.getItem("token");

    if (!token) {
      setViewTask(task);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/user-tasks/${task.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setViewTask(task);
        return;
      }

      const responseText = await response.text();
      const data = responseText ? JSON.parse(responseText) : null;
      setViewTask(data || task);
    } catch (requestError) {
      console.error("Erro ao carregar detalhes da tarefa:", requestError);
      setViewTask(task);
    }
  }

  function handleCloseView() {
    setViewTask(null);
  }

  async function handleDeleteTask(id) {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Token nao encontrado. Faca login novamente.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/user-tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const responseText = await response.text();
        const data = responseText ? JSON.parse(responseText) : null;
        alert(data?.errors?.[0] || "Erro ao excluir tarefa");
        return;
      }

      setTasks((previousTasks) => previousTasks.filter((task) => task.id !== id));
    } catch (requestError) {
      console.error("Erro ao excluir tarefa:", requestError);
      alert("Erro ao excluir tarefa");
    }
  }

  async function handleToggleComplete(task, checked) {
    await handleSave({
      ...task,
      isCompleted: checked,
    });
  }

  function handleOpenCreate() {
    setIsCreating(true);
  }

  function handleCloseCreate() {
    setIsCreating(false);
  }

  async function handleCreateTask(newTask) {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Token nao encontrado. Faca login novamente.");
      return;
    }

    try {
      setIsSubmittingCreate(true);

      const payload = {
        title: newTask.title,
        description: newTask.description || "",
        dueDate: newTask.dueDate
          ? new Date(`${newTask.dueDate}T00:00:00`).toISOString()
          : null,
      };

      const response = await fetch(apiUrl + "/user-tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      const data = responseText ? JSON.parse(responseText) : null;

      if (!response.ok) {
        alert(data?.errors?.[0] || responseText || "Erro ao criar tarefa");
        return;
      }

      setIsCreating(false);
      await fetchTasks();
    } catch (requestError) {
      console.error("Erro ao criar tarefa:", requestError);
      alert("Erro ao criar tarefa");
    } finally {
      setIsSubmittingCreate(false);
    }
  }

  const filteredTasks = tasks.filter((task) =>
    (task.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="tasks-page">
      {loading && <p style={{ textAlign: "center" }}>Carregando tarefas...</p>}
      {!loading && error && <p style={{ textAlign: "center", color: "#b00020" }}>{error}</p>}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar tarefas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="create-task-btn" onClick={handleOpenCreate}>
          Nova tarefa
        </button>
      </div>

      <div className="tasks-container">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleEdit}
            onDelete={handleDeleteTask}
            onView={handleView}
            onToggleComplete={handleToggleComplete}
          />
        ))}
      </div>

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

      {isCreating && (
        <TaskCreateCard
          onCreate={handleCreateTask}
          onCancel={handleCloseCreate}
          isSubmitting={isSubmittingCreate}
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