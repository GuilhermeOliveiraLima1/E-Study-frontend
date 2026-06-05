import { useCallback, useEffect, useState } from "react";
import "../styles/Home.css";

function Home() {
  const apiUrl = (import.meta.env.VITE_API_URL || "").trim();
  const [todayEvents, setTodayEvents] = useState([]);
  const [urgentTasks, setUrgentTasks] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [errorEvents, setErrorEvents] = useState("");
  const [errorTasks, setErrorTasks] = useState("");

  const getDayNameInPortuguese = (date) => {
    const days = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
    return days[date.getDay()];
  };

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

  const getCategoryLabel = (task) => {
    if (task?.categoryName) return task.categoryName;
    if (Number.isInteger(task?.category)) return categoryLabels[task.category] || `Categoria ${task.category}`;
    return "Sem categoria";
  };

  const loadTodayEvents = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setErrorEvents("Token não encontrado.");
      setLoadingEvents(false);
      return;
    }

    try {
      setLoadingEvents(true);
      setErrorEvents("");

      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const todayEnd = new Date(todayStart);
      todayEnd.setDate(todayEnd.getDate() + 1);

      const startDate = todayStart.toISOString();
      const endDate = todayEnd.toISOString();

      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
      });

      const response = await fetch(`${apiUrl}/event?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Não foi possível carregar os eventos.");
      }

      const responseText = await response.text();
      let data = null;

      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch {
        data = null;
      }

      const rawEvents = Array.isArray(data)
        ? data
        : Array.isArray(data?.events)
        ? data.events
        : Array.isArray(data?.data)
        ? data.data
        : [];

      const mappedEvents = rawEvents.map((event) => ({
        id: event.id,
        title: event.title || "Sem título",
        startDateTime: event.startDateTime,
        endDateTime: event.endDateTime,
      }));

      setTodayEvents(mappedEvents);
    } catch (requestError) {
      console.error("Erro ao buscar eventos:", requestError);
      setErrorEvents("Erro ao carregar eventos do dia.");
      setTodayEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  }, [apiUrl]);

  const loadUrgentTasks = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setErrorTasks("Token não encontrado.");
      setLoadingTasks(false);
      return;
    }

    try {
      setLoadingTasks(true);
      setErrorTasks("");

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
      const tasks = Array.isArray(data) ? data : [];

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const filtered = tasks.filter((task) => {
        if (!task.dueDate || task.isCompleted) return false;

        const dueDateStr = task.dueDate.includes("T")
          ? task.dueDate
          : `${task.dueDate}T00:00:00`;
        const dueDate = new Date(dueDateStr);
        dueDate.setHours(0, 0, 0, 0);

        const timeDiff = dueDate.getTime() - today.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);

        return daysDiff >= 0 && daysDiff <= 3;
      });

      setUrgentTasks(filtered);
    } catch (requestError) {
      console.error("Erro ao buscar tarefas:", requestError);
      setErrorTasks("Erro ao carregar tarefas.");
      setUrgentTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    loadTodayEvents();
    loadUrgentTasks();
  }, [loadTodayEvents, loadUrgentTasks]);

  const today = new Date();
  const todayDayName = getDayNameInPortuguese(today);

  return (
    <div>
      <div className="title-container">
        <h1 className="home-title">E-Study</h1>
        <h2 className="home-subtitle">
          Organize seus estudos de forma inteligente.
        </h2>
      </div>

      <div className="home-content">
        <div className="home-section">
          <h3 className="section-title">
            Eventos de Hoje ({todayDayName.charAt(0).toUpperCase() + todayDayName.slice(1)})
          </h3>
          {loadingEvents ? (
            <p className="loading-text">Carregando eventos...</p>
          ) : errorEvents ? (
            <p className="error-text">{errorEvents}</p>
          ) : todayEvents.length === 0 ? (
            <p className="empty-text">Nenhum evento para hoje.</p>
          ) : (
            <ul className="events-list">
              {todayEvents.map((event) => (
                <li key={event.id} className="event-item">
                  <span className="event-title">{event.title}</span>
                  {event.startDateTime && (
                    <span className="event-time">
                      {new Date(event.startDateTime).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="home-section">
          <h3 className="section-title">Tarefas Próximo Vencimento (até 3 dias)</h3>
          {loadingTasks ? (
            <p className="loading-text">Carregando tarefas...</p>
          ) : errorTasks ? (
            <p className="error-text">{errorTasks}</p>
          ) : urgentTasks.length === 0 ? (
            <p className="empty-text">Nenhuma tarefa com prazo próximo.</p>
          ) : (
            <ul className="tasks-list">
              {urgentTasks.map((task) => (
                <li key={task.id} className="task-item">
                  <div className="task-summary">
                    <span className="task-title">{task.title}</span>
                    <span className="task-category">{getCategoryLabel(task)}</span>
                  </div>
                  <div className="task-deadline-block">
                    <span className="task-duedate">Prazo: {formatDate(task.dueDate)}</span>
                    <span className="task-duedate task-duedate-highlight">
                      Vence em {(() => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const dueDateStr = task.dueDate.includes("T")
                          ? task.dueDate
                          : `${task.dueDate}T00:00:00`;
                        const dueDate = new Date(dueDateStr);
                        dueDate.setHours(0, 0, 0, 0);
                        const daysDiff = Math.ceil(
                          (dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
                        );
                        return daysDiff === 0
                          ? "Hoje"
                          : daysDiff === 1
                          ? "Amanhã"
                          : `${daysDiff} dias`;
                      })()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
