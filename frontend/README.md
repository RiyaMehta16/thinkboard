# NOTES FOR MERN

## FRONTEND

> 29 June 2025

### Creating React application using vite

- Run:

```
cd frontend
npm create vite@latest .
```

- You'll get:

```
 Need to install the following packages:
  create-vite@7.0.0
  Ok to proceed? (y) y

  > npx
  > create-vite .

│
◇  Select a framework:
│  React
│
◇  Select a variant:
│  JavaScript
│
◇  Scaffolding project in /Users/riyamehta/Desktop/thinkboard/frontend...
│
└  Done. Now run:

  npm install
  npm run dev
```

### Setting up Pages using "react-router"

```
npm i react-router
```

- Remove App.css, assets and other unnecessary data
- Wrap your <App/> in <BrowserRouter> in **main.jsx**:

```
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

```

- Now, Go to App.jsx and create your pages

  - Create src/pages folder
  - Create your different pages => HomePage.jsx, CreatePage.jsx, NoteDetailPage.jsx etc
  - App.jsx:

  ```
    import React from "react";
    import { Route, Routes } from "react-router";
    import HomePage from "./pages/HomePage";
    import CreatePage from "./pages/CreatePage";
    import NoteDetailPage from "./pages/NoteDetailPage";

    const App = () => {
    return (
        <div>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/note/:id" element={<NoteDetailPage />} />
        </Routes>
        </div>
    );
    };

    export default App;

  ```

### Setting up notifications using "react-hot-toast"

- Run

```
npm i react-hot-toast
```

- Set up Toast in **main.jsx**

```
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import App from "./App";
import { Toaster } from "react-hot-toast";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </StrictMode>
);
```

- Using react-hot-toast:
  ```
    import toast from "react-hot-toast";
    .
    .
    .
    <button onClick={()=>{toast.success("it's working!")}}>Click Me</button>
  ```

### Setting up Tailwind

- Run

```
npm install tailwindcss @tailwindcss/vite
```

- Add the @tailwindcss/vite plugin to your Vite configuration. (**vite.config.js**)

```
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

- Add an @import to your CSS file that imports Tailwind CSS.(**index.css**)

```
@import "tailwindcss";

```

### Setting up daisyUI

- Go to "https://daisyui.com/"
- Run:

```
npm i -D daisyui@latest
```

- In **index.css**, add @plugin "daisyui";

```
@import "tailwindcss";
@plugin "daisyui";
```

- To set-up theme in the app, in **index.css**:

```
@import "tailwindcss";
@plugin "daisyui" {
  themes: "valentine";
}
```

- In either <App > you can set parent <div data-theme="valentine">...rest of app</div> or set **index.html**:

```
@import "tailwindcss";
@plugin "daisyui" {
  themes: "valentine";
}
```

- Resources for theme and corresponding classes usage for components:
  - https://daisyui.com/docs/colors/
  - https://daisyui.com/docs/themes/

### Setting up lucide-react

For icons, we can use a package called **lucide-react** using:

```
npm i lucide-react
```

Usage:

```
import { Plus } from "lucide-react";
const component=()=>{
    return (
        <Plus className="size-5" />
    )
}

```

### Setting up axios

Run:

```
npm i axios
```

Using **fetch**, calling api:

```
 useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/notes");
        const data = await res.json();
        console.log(data);
      } catch (error) {
        console.log("Error fetching notes:", error);
      }
    };
    fetchNotes();
  });
```

But when we use, axios, we do not need to parse json as well, it directly returns parsed json data

```
useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/notes");
        console.log(res.data);
      } catch (error) {
        console.log("Error fetching notes:", error);
      }
    };
    fetchNotes();
  });

```

### Setting up CORS for API integration (go to thinkboard > readme.md)

- Cross-Origin Resource sharing
- a browser security rule
- When a website tries to get data from another website (like your frontend calling an API on different domain), the browser might block it for security reasons
- Example:
  - You've a frontend at :http://localhost:3000
  - And an API backend at: http://api.example.com
  - Your frontend makes a **fetch** request to get data from "http://api.example.com/users"
  - But the browser says: _You're coming from **localhost:3000** and you're trying to access **api.example.com**, which is a different origin. I need to make sure that the API allows this_

### Utility Functions

- For utility functions, create **src/lib**
- In lib, create **utils.js**
- Example function in utils.js to format dateString in mongodb's createdAt field:

```
export function formatDate(date) {
  date = new Date(date);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

```
