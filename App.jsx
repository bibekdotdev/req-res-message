import React from "react";
import { useToast } from "./src";

import React, { createContext } from "react";
const App = () => {
  const { showSuccess, showError } = useToast();

  return (
    <div style={{ padding: "2rem" }}>
      <h2>React Toast Example</h2>
      <button onClick={() => showSuccess("Success toast!")}>
        Show Success
      </button>
      <button
        onClick={() => showError("Error toast!")}
        style={{ marginLeft: "1rem" }}
      >
        Show Error
      </button>
    </div>
  );
};

export default App;
