import { useCallback, useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";
import TaskCreateCard from "../components/TaskCreateCard";
import TaskEditCard from "../components/TaskEditCard";
import TaskViewModal from "../components/TaskViewModal";
import "../styles/TaskPage.css";

export default function TasksPage() {
  const apiUrl = (import.meta.env.VITE_API_URL || "").trim();
  const [tasks, setTasks] = useState([]);
  const [defaultCategories, setDefaultCategories] = useState([]);
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

  const fetchCategories = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      const defaultResponse = await fetch(`${apiUrl}/user-custom-categories/default-categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (defaultResponse.ok) {
        const responseText = await defaultResponse.text();
        const data = responseText ? JSON.parse(responseText) : [];
        setDefaultCategories(Array.isArray(data) ? data : []);
      } else {
        setDefaultCategories([]);
      }
    } catch (requestError) {
      console.error("Erro ao buscar categorias:", requestError);
      setDefaultCategories([]);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, [fetchTasks, fetchCategories]);

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
      let dueDate = null;
      if (updatedTask.dueDate) {
        const dueDateStr = updatedTask.dueDate.includes("T") 
          ? updatedTask.dueDate 
          : `${updatedTask.dueDate}T00:00:00`;
        dueDate = new Date(dueDateStr).toISOString();
      }

      const payload = {
        title: updatedTask.title?.trim() || "",
        description: updatedTask.description?.trim() || "",
        dueDate: dueDate,
        isCompleted: updatedTask.isCompleted === true,
        category: Number.isInteger(updatedTask.category) ? updatedTask.category : undefined,
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
        category: Number.isInteger(newTask.category) ? newTask.category : undefined,
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

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = (task.title || "").toLowerCase().includes(search.toLowerCase());
    return matchesSearch && task.isCompleted !== true;
  });

  const getTaskCategoryLabel = (task) => {
    if (task?.categoryName) {
      return task.categoryName;
    }

    if (Number.isInteger(task?.category)) {
      const matchedCategory = defaultCategories.find((category) => category?.value === task.category);
      if (matchedCategory?.name) {
        return matchedCategory.name;
      }
    }

    return "Sem categoria";
  };

  const groupedTasksEntries = Object.entries(
    filteredTasks.reduce((groups, task) => {
      const categoryLabel = getTaskCategoryLabel(task);

      if (!groups[categoryLabel]) {
        groups[categoryLabel] = [];
      }

      groups[categoryLabel].push(task);
      return groups;
    }, {})
  ).sort(([categoryA], [categoryB]) => categoryA.localeCompare(categoryB, "pt-BR", { sensitivity: "base" }));

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

      <div className="task-groups">
        {groupedTasksEntries.map(([categoryLabel, categoryTasks]) => (
          <section key={categoryLabel} className="tasks-category-section">
            <h3 className="tasks-category-title">{categoryLabel}</h3>

            <div className="tasks-grid">
              {categoryTasks.map((task) => (
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
          </section>
        ))}
      </div>

      {filteredTasks.length === 0 && !loading && (
        <p style={{ textAlign: "center" }}>
          Nenhuma tarefa pendente encontrada
        </p>
      )}

      {editingTask && (
        <TaskEditCard
          task={editingTask}
          onSave={handleSave}
          onCancel={handleCancel}
          defaultCategories={defaultCategories}
        />
      )}

      {isCreating && (
        <TaskCreateCard
          onCreate={handleCreateTask}
          onCancel={handleCloseCreate}
          isSubmitting={isSubmittingCreate}
          defaultCategories={defaultCategories}
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