import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ListItems from "./components/ListItems/";
import Navbar from "./components/Navbar";
import ScrollUpButton from "react-scroll-up-button";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Router>
        <Switch>
          <Route path="/" exact component={ListItems} />
        </Switch>
      </Router>
      <ScrollUpButton />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
