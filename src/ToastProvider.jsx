import React, { createContext, useState, useEffect } from "react";

const ToastContext = createContext();

const TOAST_DURATION = 3000; // Toast display time in ms

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (
    message,
    type,
    backgroundColor = null,
    textColor = null
  ) => {
    const id = Date.now();
    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        type,
        backgroundColor,
        textColor,
        visible: false,
        startTime: null,
        remaining: TOAST_DURATION,
        paused: false,
      },
    ]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((toast) =>
          toast.id === id
            ? { ...toast, visible: true, startTime: Date.now() }
            : toast
        )
      );
    }, 10);
  };

  const removeToast = (id) => {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id ? { ...toast, visible: false } : toast
      )
    );

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 300);
  };

  const showSuccess = (message, backgroundColor = null, textColor = null) =>
    showToast(message, "success", backgroundColor, textColor);
  const showError = (message, backgroundColor = null, textColor = null) =>
    showToast(message, "error", backgroundColor, textColor);

  useEffect(() => {
    if (toasts.length === 0) return;

    const interval = setInterval(() => {
      setToasts((prev) =>
        prev.map((toast) => {
          if (toast.paused || !toast.visible) return toast;

          const elapsed = Date.now() - toast.startTime;
          const remaining = TOAST_DURATION - elapsed;

          if (remaining <= 0) {
            return { ...toast, visible: false };
          }

          return { ...toast, remaining };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [toasts]);

  useEffect(() => {
    toasts.forEach((toast) => {
      if (!toast.visible && toast.remaining !== TOAST_DURATION) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toast.id));
        }, 300);
      }
    });
  }, [toasts]);

  const pauseToast = (id) => {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id
          ? {
              ...toast,
              paused: true,
              remaining: toast.remaining - (Date.now() - toast.startTime),
            }
          : toast
      )
    );
  };

  const resumeToast = (id) => {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id
          ? { ...toast, paused: false, startTime: Date.now() - toast.remaining }
          : toast
      )
    );
  };

  const defaultBackground = {
    success: "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)",
    error: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
  };

  const defaultBoxShadow = {
    success: "0 0 12px 2px rgba(76,175,80,0.6), 0 6px 14px rgba(0, 0, 0, 0.14)",
    error: "0 6px 14px rgba(0, 0, 0, 0.14), 0 1px 6px rgba(0, 0, 0, 0.12)",
  };

  return (
    <ToastContext.Provider value={{ showSuccess, showError }}>
      {children}

      <div
        aria-live="assertive"
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          left: 20,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          pointerEvents: "none",
        }}
      >
        {toasts.map(
          ({
            id,
            message,
            type,
            backgroundColor,
            textColor,
            visible,
            remaining,
            paused,
          }) => (
            <div
              key={id}
              role="alert"
              onMouseEnter={() => pauseToast(id)}
              onMouseLeave={() => resumeToast(id)}
              style={{
                pointerEvents: "auto",
                padding: "16px 20px",
                borderRadius: 10,
                background:
                  backgroundColor || defaultBackground[type] || "#333",
                color: textColor || "#fff",
                boxShadow: backgroundColor
                  ? "0 6px 14px rgba(0, 0, 0, 0.14), 0 1px 6px rgba(0, 0, 0, 0.12)"
                  : defaultBoxShadow[type] || "0 6px 14px rgba(0,0,0,0.2)",
                fontWeight: 600,
                fontSize: 14,
                userSelect: "none",
                cursor: "default",

                opacity: visible ? 1 : 0,
                transform: visible
                  ? "translateX(0) scale(1)"
                  : "translateX(100%) scale(0.95)",
                transition:
                  "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden",

                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,

                textShadow: "0 0 3px rgba(0,0,0,0.4)",
                willChange: "transform",

                width: "100%",
                maxWidth: 280,
                boxSizing: "border-box",
              }}
            >
              <span style={{ flex: 1, marginRight: 8 }}>{message}</span>

              <button
                onClick={() => removeToast(id)}
                aria-label="Close notification"
                style={{
                  border: "none",
                  background: "transparent",
                  color: "rgba(255,255,255,0.85)",
                  fontSize: 18,
                  cursor: "pointer",
                  fontWeight: "bold",
                  lineHeight: 1,
                  padding: 0,
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.85)")
                }
              >
                ×
              </button>

              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  height: 5,
                  backgroundColor: "rgba(255,255,255,0.8)",
                  width: `${(remaining / TOAST_DURATION) * 100}%`,
                  transition: paused ? "none" : "width 50ms linear",
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  boxShadow: "inset 0 1px 3px rgba(255,255,255,0.6)",
                }}
              />
            </div>
          )
        )}
      </div>
    </ToastContext.Provider>
  );
};

export { ToastContext };
