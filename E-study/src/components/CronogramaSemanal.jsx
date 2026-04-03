import { useCallback, useEffect, useMemo, useState } from "react";
import "../styles/CronogramaSemanal.css";
import Swal from "sweetalert2";

const dayOrder = [
  { key: "segunda", label: "Segunda" },
  { key: "terca", label: "Terça" },
  { key: "quarta", label: "Quarta" },
  { key: "quinta", label: "Quinta" },
  { key: "sexta", label: "Sexta" },
  { key: "sabado", label: "Sábado" },
  { key: "domingo", label: "Domingo" },
];


function formatDateToInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCurrentWeekRange() {
  const today = new Date();
  const dayIndex = today.getDay();
  const mondayOffset = dayIndex === 0 ? -6 : 1 - dayIndex;

  const startDate = new Date(today);
  startDate.setDate(today.getDate() + mondayOffset);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
}

function getDateFromWeekday(dayKey) {
  const today = new Date();
  const dayIndex = today.getDay();
  const mondayOffset = dayIndex === 0 ? -6 : 1 - dayIndex;

  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  const dayOffsets = {
    segunda: 0,
    terca: 1,
    quarta: 2,
    quinta: 3,
    sexta: 4,
    sabado: 5,
    domingo: 6,
  };

  const date = new Date(monday);
  date.setDate(monday.getDate() + (dayOffsets[dayKey] ?? 0));

  return formatDateToInput(date);
}

function formatEventToCell(event) {
  const startDateTime = event?.startDateTime || event?.start_date || event?.start;

  if (!startDateTime) {
    return null;
  }

  const eventDate = new Date(startDateTime);

  if (Number.isNaN(eventDate.getTime())) {
    return null;
  }

  const weekdayMap = {
    1: "segunda",
    2: "terca",
    3: "quarta",
    4: "quinta",
    5: "sexta",
    6: "sabado",
    0: "domingo",
  };

  const dia = weekdayMap[eventDate.getDay()];

  if (!dia) {
    return null;
  }

  const horario = `${String(eventDate.getHours()).padStart(2, "0")}:${String(
    eventDate.getMinutes()
  ).padStart(2, "0")}`;

  return {
    id: event?.id ?? null,
    dia,
    horario,
    atividade: event?.title?.trim() || "Sem título",
  };
}

export default function CronogramaSemanal() {
  const apiUrl = (import.meta.env.VITE_API_URL || "").trim();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [eventActionId, setEventActionId] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [form, setForm] = useState({
    dia: "segunda",
    horario: "08:00",
    title: "",
  });

  const loadEvents = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token não encontrado. Faça login novamente.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { startDate, endDate } = getCurrentWeekRange();
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

      const mappedEvents = rawEvents
        .map(formatEventToCell)
        .filter(Boolean)
        .filter((event) => dayOrder.some((day) => day.key === event.dia));

      setEvents(mappedEvents);
    } catch (requestError) {
      console.error("Erro ao buscar eventos:", requestError);
      setError("Erro ao carregar o cronograma semanal.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const timeSlots = useMemo(() => {
    const slots = events.map((event) => event.horario);

    return [...new Set(slots)].sort((left, right) =>
      left.localeCompare(right, "pt-BR", { numeric: true })
    );
  }, [events]);

  const activityMap = useMemo(() => {
    return events.reduce((map, event) => {
      const key = `${event.dia}-${event.horario}`;
      const currentValue = map[key] || [];
      map[key] = [...currentValue, event];
      return map;
    }, {});
  }, [events]);

  const hasScheduleConflict = useMemo(() => {
    return events.some(
      (event) => event.dia === form.dia && event.horario === form.horario
    );
  }, [events, form.dia, form.horario]);

  async function handleSubmit(event) {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token não encontrado. Faça login novamente.");
      return;
    }

    if (hasScheduleConflict) {
      setError("Já existe uma tarefa nesse dia e horário.");
      setSuccessMessage("");
      return;
    }

    const [hours, minutes] = form.horario.split(":").map(Number);
    const selectedDate = getDateFromWeekday(form.dia);
    const startDateTime = new Date(`${selectedDate}T00:00:00`);
    startDateTime.setHours(hours, minutes, 0, 0);

    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + 60);

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const response = await fetch(`${apiUrl}/event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title.trim() || null,
          startDateTime: startDateTime.toISOString(),
          endDateTime: endDateTime.toISOString(),
          isAllDay: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Não foi possível salvar o evento.");
      }

      setForm({
        dia: "segunda",
        horario: "08:00",
        title: "",
      });
      setSuccessMessage("Evento adicionado com sucesso.");
      await loadEvents();
    } catch (submitError) {
      console.error("Erro ao salvar evento:", submitError);
      setError("Erro ao salvar o evento.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteEvent(eventId) {
    const result = await Swal.fire({
      title: 'Deletar evento?',
      text: "Você deseja deletar esse evento?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#4facfe',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Manter evento'
    });

    if (!result.isConfirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token não encontrado. Faça login novamente.");
      return;
    }

    if (!eventId) {
      setError("Não foi possível identificar o evento para excluir.");
      return;
    }

    try {
      setEventActionId(eventId);
      setError("");
      setSuccessMessage("");

      const response = await fetch(`${apiUrl}/event/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Não foi possível excluir o evento.");
      }

      setSuccessMessage("Evento removido com sucesso.");
      await loadEvents();
    } catch (deleteError) {
      console.error("Erro ao excluir evento:", deleteError);
      setError("Erro ao excluir o evento.");
    } finally {
      setEventActionId(null);
    }
  }

  async function handlePatchEventTitle(eventItem) {
    setEditingEventId(eventItem.id);
    setEditingTitle(eventItem.atividade);
  }

  function handleCancelEdit() {
    setEditingEventId(null);
    setEditingTitle("");
  }

  async function handleSaveEditTitle(eventId) {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token não encontrado. Faça login novamente.");
      return;
    }

    if (!eventId) {
      setError("Não foi possível identificar o evento para editar.");
      return;
    }

    const newTitle = editingTitle.trim();

    if (!newTitle) {
      setError("Informe um título válido.");
      return;
    }

    try {
      setEventActionId(eventId);
      setError("");
      setSuccessMessage("");

      const response = await fetch(`${apiUrl}/event/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTitle,
        }),
      });

      if (!response.ok) {
        throw new Error("Não foi possível atualizar o título.");
      }

      setSuccessMessage("Título atualizado com sucesso.");
      setEditingEventId(null);
      setEditingTitle("");
      await loadEvents();
    } catch (patchError) {
      console.error("Erro ao atualizar título:", patchError);
      setError("Erro ao atualizar o título do evento.");
    } finally {
      setEventActionId(null);
    }
  }

  return (
    <section className="schedule-page">
      <header className="schedule-header">
        <h1 className="schedule-title">Cronograma semanal</h1>
        <p className="schedule-subtitle">
          Visualização dos eventos da semana atual em formato de tabela.
        </p>
      </header>

      <div className="schedule-card">
        <form className="schedule-form" onSubmit={handleSubmit}>
          <div className="schedule-form-grid">
            <label className="schedule-field">
              <span>Dia</span>
              <select
                value={form.dia}
                onChange={(event) => setForm((current) => ({ ...current, dia: event.target.value }))}
              >
                {dayOrder.map((day) => (
                  <option key={day.key} value={day.key}>
                    {day.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="schedule-field">
              <span>Horário</span>
              <input
                type="time"
                value={form.horario}
                onChange={(event) =>
                  setForm((current) => ({ ...current, horario: event.target.value }))
                }
              />
            </label>

            <label className="schedule-field schedule-field-wide">
              <span>Título</span>
              <input
                type="text"
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
                placeholder="Ex: Estudo"
              />
            </label>
          </div>

          <div className="schedule-form-actions">
            <button
              type="submit"
              className="schedule-button"
              disabled={saving || hasScheduleConflict}
              title={hasScheduleConflict ? "Já existe tarefa nesse horário." : undefined}
            >
              {saving ? "Salvando..." : "Adicionar evento"}
            </button>
            {successMessage && <p className="schedule-status schedule-status-success">{successMessage}</p>}
            {hasScheduleConflict && (
              <p className="schedule-status schedule-status-error">
                Já existe uma tarefa nesse dia e horário.
              </p>
            )}
          </div>
        </form>

        {loading && <p className="schedule-status">Carregando cronograma...</p>}
        {!loading && error && <p className="schedule-status schedule-status-error">{error}</p>}

        <div className="schedule-table-wrapper">
          {timeSlots.length > 0 ? (
            <table className="schedule-table">
              <thead>
                <tr>
                  <th scope="col">Horário</th>
                  {dayOrder.map((day) => (
                    <th key={day.key} scope="col">
                      {day.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((horario) => (
                  <tr key={horario}>
                    <th scope="row">{horario}</th>
                    {dayOrder.map((day) => {
                      const dayEvents = activityMap[`${day.key}-${horario}`] || [];

                      return (
                        <td key={`${day.key}-${horario}`}>
                          {dayEvents.length > 0 ? (
                            <div className="schedule-event-list">
                              {dayEvents.map((eventItem) => (
                                <div key={eventItem.id || `${eventItem.dia}-${eventItem.horario}-${eventItem.atividade}`} className="schedule-event-item">
                                  {editingEventId === eventItem.id ? (
                                    <div className="schedule-edit-form">
                                      <input
                                        type="text"
                                        className="schedule-edit-input"
                                        value={editingTitle}
                                        onChange={(e) => setEditingTitle(e.target.value)}
                                        placeholder="Título do evento"
                                        autoFocus
                                      />
                                      <div className="schedule-edit-actions">
                                        <button
                                          type="button"
                                          className="schedule-edit-button schedule-edit-button-confirm"
                                          onClick={() => handleSaveEditTitle(eventItem.id)}
                                          disabled={eventActionId === eventItem.id || !editingTitle.trim()}
                                        >
                                          Confirmar
                                        </button>
                                        <button
                                          type="button"
                                          className="schedule-edit-button schedule-edit-button-cancel"
                                          onClick={handleCancelEdit}
                                          disabled={eventActionId === eventItem.id}
                                        >
                                          Cancelar
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <span className="schedule-activity">{eventItem.atividade}</span>
                                      <div className="schedule-event-actions">
                                        <button
                                          type="button"
                                          className="schedule-mini-button"
                                          onClick={() => handlePatchEventTitle(eventItem)}
                                          disabled={eventActionId === eventItem.id}
                                        >
                                          Editar
                                        </button>
                                        <button
                                          type="button"
                                          className="schedule-mini-button schedule-mini-button-danger"
                                          onClick={() => handleDeleteEvent(eventItem.id)}
                                          disabled={eventActionId === eventItem.id}
                                        >
                                          Excluir
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="schedule-empty">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="schedule-status">Nenhum horário com atividade nesta semana.</p>
          )}
        </div>
      </div>
    </section>
  );
}
