import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import ThemeContext from "./contexts/theme";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Loading from "./components/Loading";

const Popular = React.lazy(() => import("./components/Popular"));
const Battle = React.lazy(() => import("./components/Battle"));
const Results = React.lazy(() => import("./components/Results"));

export default function App() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () =>
    setTheme((curr) => (curr === "light" ? "dark" : "light"));

  return (
    <Router>
      <ThemeContext.Provider value={theme}>
        <div className={theme}>
          <div className="container">
            <NavBar toggleTheme={toggleTheme} />
            <React.Suspense fallback={<Loading />}>
              <Switch>
                <Route exact path="/" component={Popular} />
                <Route exact path="/battle" component={Battle} />
                <Route path="/battle/results" component={Results} />
                <Route render={() => <h1>404</h1>} />
              </Switch>
            </React.Suspense>
          </div>
        </div>
      </ThemeContext.Provider>
    </Router>
  );
}

ReactDOM.render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>
  document.getElementById("app")
);
