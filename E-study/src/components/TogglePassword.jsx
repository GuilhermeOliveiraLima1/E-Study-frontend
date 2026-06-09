import React from "react";

function TogglePassword({ show, onToggle, disabled = false, title, ariaLabel, className }) {
  const cls = className || "toggle-password";

  return (
    <button
      type="button"
      className={cls}
      onClick={(event) => {
        if (!disabled && typeof onToggle === "function") {
          onToggle(event);
        }
      }}
      title={title}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      <span className="toggle-password-icon" aria-hidden="true">
        {show ? (
          <svg viewBox="0 0 24 24">
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 4l16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24">
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        )}
      </span>
    </button>
  );
}

export default TogglePassword;
