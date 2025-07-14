import React, { createContext, useState, useEffect } from "react";
import {
  Box,
  useMediaQuery,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ToastContext = createContext();
const TOAST_DURATION = 3000;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

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

  const showSuccess = (msg, bg = null, text = null) =>
    showToast(msg, "success", bg, text);
  const showError = (msg, bg = null, text = null) =>
    showToast(msg, "error", bg, text);

  useEffect(() => {
    if (toasts.length === 0) return;

    const interval = setInterval(() => {
      setToasts((prev) =>
        prev.map((toast) => {
          if (!toast.visible || toast.paused) return toast;

          const elapsed = Date.now() - toast.startTime;
          const remaining = TOAST_DURATION - elapsed;

          if (remaining <= 0) return { ...toast, visible: false };
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
          ? {
              ...toast,
              paused: false,
              startTime: Date.now() - toast.remaining,
            }
          : toast
      )
    );
  };

  const defaultBackground = {
    success: "linear-gradient(135deg, #4caf50, #2e7d32)",
    error: "linear-gradient(135deg, #f44336, #c62828)",
  };

  const defaultBoxShadow = {
    success: "0 4px 12px rgba(76, 175, 80, 0.4)",
    error: "0 4px 12px rgba(244, 67, 54, 0.4)",
  };

  return (
    <ToastContext.Provider value={{ showSuccess, showError }}>
      {children}

      {/* Toast Container */}
      <Box
        aria-live="assertive"
        sx={{
          position: "fixed",
          top: 20,
          left: 20,
          right: 20,
          zIndex: 1400,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pointerEvents: "none",
          alignItems: isSmallScreen ? "center" : "flex-end",
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
            <Box
              key={id}
              role="alert"
              onMouseEnter={() => pauseToast(id)}
              onMouseLeave={() => resumeToast(id)}
              sx={{
                pointerEvents: "auto",
                px: 3,
                py: 2.5,
                borderRadius: 2,
                background: backgroundColor || defaultBackground[type],
                color: textColor || "#fff",
                boxShadow: backgroundColor
                  ? "0 4px 12px rgba(0,0,0,0.2)"
                  : defaultBoxShadow[type],
                fontWeight: 500,
                fontSize: 14,
                userSelect: "none",
                cursor: "default",
                opacity: visible ? 1 : 0,
                transform: visible
                  ? "translateX(0)"
                  : "translateX(120%) scale(0.95)",
                transition: "opacity 0.3s, transform 0.3s",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                maxWidth: 320,
                boxSizing: "border-box",
              }}
            >
              {/* Header with message and close icon */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  width: "100%",
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    flex: 1,
                    lineHeight: 1.5,
                    wordBreak: "break-word",
                  }}
                >
                  {message}
                </Typography>

                <IconButton
                  size="small"
                  onClick={() => removeToast(id)}
                  sx={{
                    color: "rgba(255,255,255,0.85)",
                    "&:hover": { color: "#fff" },
                    mt: "-4px",
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Progress Bar */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  height: 4,
                  backgroundColor: "rgba(255,255,255,0.7)",
                  width: `${(remaining / TOAST_DURATION) * 100}%`,
                  transition: paused ? "none" : "width 50ms linear",
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.4)",
                }}
              />
            </Box>
          )
        )}
      </Box>
    </ToastContext.Provider>
  );
};

export { ToastContext };
