import React, { useState, useEffect, useCallback } from "react";
import "../styles/Pomodoro.css";

// ---------- LocalStorage ----------
const initializeState = () => {
  const saved = localStorage.getItem("pomodoroState");
  if (saved) return JSON.parse(saved);

  return {
    minutes: 25,
    seconds: 0,
    isActive: false,
    isBreak: false,
    studyTimeMin: 25,
    studyTimeSec: 0,
    breakTimeMin: 5,
    breakTimeSec: 0,
    cycles: 4,
    currentCycle: 1,
  };
};

function TimerInput({ minutes, seconds, onCommit, disabled }) {
  const [rawDigits, setRawDigits] = useState(
    `${String(minutes).padStart(2, "0")}${String(seconds).padStart(2, "0")}`,
  );

  const format = (digits) => {
    const normalized = digits.replace(/\D/g, "").slice(-4).padStart(4, "0");
    return `${normalized.slice(0, 2)}:${normalized.slice(2, 4)}`;
  };

  const handleChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(-4);
    setRawDigits(digits);
  };

  const handleBlur = () => {
    const padded = rawDigits.padStart(4, "0");
    const mm = Number(padded.slice(0, 2));
    const ss = Math.min(59, Number(padded.slice(2, 4)));

    onCommit(mm, ss);

    setRawDigits(
      `${String(mm).padStart(2, "0")}${String(ss).padStart(2, "0")}`,
    );
  };

  return (
    <input
      type="text"
      value={format(rawDigits)}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={disabled}
      className="timer-input"
    />
  );
}

// ---------- Componente principal ----------
export default function Pomodoro() {
  const initialState = initializeState();

  const [minutes, setMinutes] = useState(initialState.minutes);
  const [seconds, setSeconds] = useState(initialState.seconds);
  const [isActive, setIsActive] = useState(initialState.isActive);
  const [isBreak, setIsBreak] = useState(initialState.isBreak);
  const [studyTimeMin, setStudyTimeMin] = useState(initialState.studyTimeMin);
  const [studyTimeSec, setStudyTimeSec] = useState(initialState.studyTimeSec);
  const [breakTimeMin, setBreakTimeMin] = useState(initialState.breakTimeMin);
  const [breakTimeSec, setBreakTimeSec] = useState(initialState.breakTimeSec);
  const [cycles, setCycles] = useState(initialState.cycles);
  const [currentCycle, setCurrentCycle] = useState(initialState.currentCycle);

  // ---------- Salvar no localStorage ----------
  useEffect(() => {
    localStorage.setItem(
      "pomodoroState",
      JSON.stringify({
        minutes,
        seconds,
        isActive,
        isBreak,
        studyTimeMin,
        studyTimeSec,
        breakTimeMin,
        breakTimeSec,
        cycles,
        currentCycle,
      }),
    );
  }, [
    minutes,
    seconds,
    isActive,
    isBreak,
    studyTimeMin,
    studyTimeSec,
    breakTimeMin,
    breakTimeSec,
    cycles,
    currentCycle,
  ]);

  // ---------- Som ----------
  const playNotificationSound = useCallback(() => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      const audio = new AudioContextClass();
      const now = audio.currentTime;

      const playTone = (frequency, startOffset, duration, volume) => {
        const osc = audio.createOscillator();
        const gain = audio.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(frequency, now + startOffset);

        // Quick attack + smooth release to avoid clicks.
        gain.gain.setValueAtTime(0.0001, now + startOffset);
        gain.gain.exponentialRampToValueAtTime(
          volume,
          now + startOffset + 0.03,
        );
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          now + startOffset + duration,
        );

        osc.connect(gain);
        gain.connect(audio.destination);

        osc.start(now + startOffset);
        osc.stop(now + startOffset + duration);
      };

      // Two-note chime (A5 -> E6).
      playTone(880, 0, 0.22, 0.18);
      playTone(1318.5, 0.2, 0.28, 0.14);

      setTimeout(() => {
        audio.close().catch(() => {});
      }, 800);
    } catch {
      // Fails silently if browser blocks or has no audio support.
    }
  }, []);

  // ---------- Timer ----------
  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            playNotificationSound();

            // Focus ended: increment cycle and stop if that was the last one.
            if (!isBreak) {
              if (currentCycle >= cycles) {
                setIsActive(false);
                setIsBreak(false);
                setMinutes(studyTimeMin);
                setSeconds(studyTimeSec);
                setCurrentCycle(1);
                return;
              }

              setCurrentCycle((c) => Math.min(c + 1, cycles));

              setIsBreak(true);
              setMinutes(breakTimeMin);
              setSeconds(breakTimeSec);
              return;
            }

            // Break ended: go back to focus without incrementing cycles.
            setIsBreak(false);
            setMinutes(studyTimeMin);
            setSeconds(studyTimeSec);
            return;
          }

          setMinutes((m) => m - 1);
          setSeconds(59);
          return;
        }

        setSeconds((s) => s - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [
    isActive,
    minutes,
    seconds,
    isBreak,
    studyTimeMin,
    studyTimeSec,
    breakTimeMin,
    breakTimeSec,
    cycles,
    playNotificationSound,
    currentCycle,
  ]);

  const toggleTimer = () => {
    // Converter tudo para segundos
    const studyTotal = studyTimeMin * 60 + studyTimeSec;
    const breakTotal = breakTimeMin * 60 + breakTimeSec;

    // Validação
    if (studyTotal === 0 || breakTotal === 0) {
      alert("O tempo de foco e pausa não podem ser 00:00.");
      return;
    }

    // Se for iniciar, define o tempo correto
    if (!isActive) {
      setMinutes(isBreak ? breakTimeMin : studyTimeMin);
      setSeconds(isBreak ? breakTimeSec : studyTimeSec);
    }

    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setMinutes(studyTimeMin);
    setSeconds(studyTimeSec);
    setCurrentCycle(1);
  };

  return (
    <div className="pomodoro-container">
      <h2>
        {isBreak ? "Pausa" : "Foco"} - Ciclo {currentCycle}/{cycles}
      </h2>

      <div className="timer-display">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>

      <div className="settings-panel">
        <div className="settings-group">
          <label>Estudo:</label>
          <TimerInput
            minutes={studyTimeMin}
            seconds={studyTimeSec}
            onCommit={(min, sec) => {
              setStudyTimeMin(min);
              setStudyTimeSec(sec);
            }}
            disabled={isActive}
          />
        </div>

        <div className="settings-group">
          <label>Pausa:</label>
          <TimerInput
            minutes={breakTimeMin}
            seconds={breakTimeSec}
            onCommit={(min, sec) => {
              setBreakTimeMin(min);
              setBreakTimeSec(sec);
            }}
            disabled={isActive}
          />
        </div>

        <label>
          Ciclos:
          <input
            type="number"
            value={cycles}
            onChange={(e) => setCycles(Math.max(1, Number(e.target.value)))}
            disabled={isActive}
          />
        </label>
      </div>

      <div className="button-group">
        <button onClick={toggleTimer} className="btn btn-primary">
          {isActive ? "Pausar" : "Iniciar"}
        </button>

        <button onClick={resetTimer} className="btn btn-secondary">
          Resetar
        </button>
      </div>
    </div>
  );
}
