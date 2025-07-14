- ✨ Description
- 📦 Installation
- ⚙️ Usage with and without custom color/background
- 📋 API
- ✅ Examples
- 🏷️ Badges (optional)

---

### ✅ `README.md` for `req-res-message`

````md
# req-res-message

A lightweight, easy-to-use React toast message utility to display **success** and **error** messages. It supports default styling, and you can also provide **custom color** and **background color** for more control.

![npm](https://img.shields.io/npm/v/req-res-message)
![downloads](https://img.shields.io/npm/dw/req-res-message)
![license](https://img.shields.io/npm/l/req-res-message)

---

## 📦 Installation

```bash
npm install req-res-message
```
````

---

## ⚙️ Usage

### Step 1: Wrap your app in `<ToastProvider>`

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ToastProvider } from "req-res-message";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ToastProvider>
    <App />
  </ToastProvider>
);
```

---

### Step 2: Use `showSuccess` and `showError` in your components

```jsx
import React, { useContext } from "react";
import { ToastContext } from "req-res-message";

const App = () => {
  const { showSuccess, showError } = useContext(ToastContext);

  return (
    <>
      <button onClick={() => showSuccess("Success!")}>Show Success</button>

      <button onClick={() => showError("Something went wrong!")}>
        Show Error
      </button>
    </>
  );
};

export default App;
```

---

## 🎨 Custom Color and Background

You can optionally pass a second and third argument to `showSuccess` and `showError` to change text color and background color.

```jsx
showSuccess("Custom success", "white", "green");

showError("Custom error", "#fff", "#e63946");
```

---

## 🧠 API

| Function      | Description          | Arguments                                   |
| ------------- | -------------------- | ------------------------------------------- |
| `showSuccess` | Show a success toast | `message`, `textColor?`, `backgroundColor?` |
| `showError`   | Show an error toast  | `message`, `textColor?`, `backgroundColor?` |

> 📝 If color and background color are **not provided**, default styles are used.

---

## 🧪 Example

```jsx
<button onClick={() => showSuccess("Data saved!", "#000", "#90ee90")}>
  Custom Success
</button>

<button onClick={() => showError("Action failed!", "#fff", "#ff6347")}>
  Custom Error
</button>
```

---

## 🙌 Credits

Created by [Bibek Jana](https://github.com/bibekdotdev)
Inspired by simplicity and performance.

---

## 🏷️ Keywords

`react`, `toast`, `success`, `error`, `notification`, `message`, `toast-provider`

---

## 📃 License

This project is licensed under the MIT License.

```




```
