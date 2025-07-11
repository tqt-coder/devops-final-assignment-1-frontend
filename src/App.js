import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Switch } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AddStudent from "./components/AddStudent";
import Students from "./components/Students";
import StudentList from "./components/StudentList";

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <a href="/students" className="navbar-brand">
            Student Management APP V2 Date 2025-07-05
          </a>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/students"} className="nav-link">
                Students
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/add"} className="nav-link">
                Add
              </Link>
            </li>
          </div>
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/students"]} component={StudentList} />
            <Route exact path="/add" component={AddStudent} />
            <Route path="/students/:id" component={Students} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
