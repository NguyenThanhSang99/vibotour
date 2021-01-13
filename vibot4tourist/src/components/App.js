import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Login from "./Login";
import Admin from "./Admin/index";
import Manager from "./Manager/index";
import Staff from "./Staff/index";

// import OrderM from "./Manager/Order";
// import ProductM from "./Manager/Product";
// import UserM from "./Manager/User";

import { ProtectedRoute } from "./authentication-components/protected.route";
import "../styles/App.css";

class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Login} />

          <ProtectedRoute exact path="/manager" component={Manager} />
          {/* <Route path="/manager/orders" component={OrderM}/>
          <Route path="/manager/products" component={ProductM}/>
          <Route path="/manager/users" component={UserM} /> */}

          <ProtectedRoute exact path="/admin" component={Admin} />
          <ProtectedRoute exact path="/staff" component={Staff} />
          <Route exact path="*" component={() => "404 NOT FOUND"} />
        </Switch>
      </div>
    );
  }
}

export default App;
