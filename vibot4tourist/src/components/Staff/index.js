import React from "react";
import ReactDOM from "react-dom";

import Auth from "../authentication-components/Auth";

import Order from "./Order";
import Tour from "./Tour";
import Event from "./Event";

import "../../styles/Bootstrap.css";
import "../../styles/App.css";

function Staff(props) {
  function removeCookies() {
    var allCookies = document.cookie.split(";");
    for (var i = 0; i < allCookies.length; i++)
      document.cookie =
        allCookies[i] + "=;expires=" + new Date(0).toUTCString();
  }

  function loadO() {
    ReactDOM.render(<Order />, document.getElementById("load"));
  }
  function loadP() {
    ReactDOM.render(<Tour />, document.getElementById("load"));
  }
  function loadE() {
    ReactDOM.render(<Event />, document.getElementById("load"));
  }

  return (
    <div>
      <div className="container-fluid bg-info text-white">
        <div className="row navbar">
          <div className="col-2 d-flex align-items-center justify-content-center">
            <h5>Page Staff</h5>
          </div>
          <div className="col-8 d-flex align-items-center justify-content-center">
            <input
              className="form-control w-100"
              type="text"
              placeholder="Search"
              aria-label="Search"
            />
          </div>
          <div className="col-2 d-flex align-items-center justify-content-around">
            <button
              type="button"
              className="btn btn-light"
              onClick={() => {
                removeCookies();
                Auth.logout(() => {
                  props.history.push("/");
                });
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-2 d-flex flex-column">
            <ul className="list-unstyled list">
              <li onClick={() => loadO()}>
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                  className="bi bi-file-check text-primary"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 0h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H4z"
                  />
                  <path
                    fillRule="evenodd"
                    d="M10.854 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 8.793l2.646-2.647a.5.5 0 0 1 .708 0z"
                  />
                </svg>
                Orders
              </li>
              <li onClick={() => loadP()}>
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                  className="bi bi-cart3 text-warning"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
                  />
                </svg>
                Tours
              </li>
              <li onClick={() => loadE()}>
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                  className="bi bi-wallet2 text-success"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"
                  />
                </svg>
                Event
              </li>
            </ul>
          </div>
          <div className="col-10" id="load">
            <Order />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Staff;
