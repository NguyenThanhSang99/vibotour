import React from "react";
import ReactDOM from "react-dom";

import Auth from "../authentication-components/Auth";

import Dashboard from "./Dashboard";
import User from "./User";
import Order from "./Order";
import Tour from "./Tour";
import Event from "./Event";
import Report_week from "./Report_week";
import Report_month from "./Report_month";

import "../../styles/Bootstrap.css";
import "../../styles/App.css";

function Manager(props) {
  function removeCookies() {
    var allCookies = document.cookie.split(";");
    for (var i = 0; i < allCookies.length; i++)
      document.cookie =
        allCookies[i] + "=;expires=" + new Date(0).toUTCString();
  }

  function loadD() {
    ReactDOM.render(<Dashboard />, document.getElementById("load"));
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
  function loadU() {
    ReactDOM.render(<User />, document.getElementById("load"));
  }
  function loadRW() {
    ReactDOM.render(<Report_week />, document.getElementById("load"));
  }
  function loadRM() {
    ReactDOM.render(<Report_month />, document.getElementById("load"));
  }

  return (
    <div>
      <div className="container-fluid bg-info text-white">
        <div className="row navbar">
          <div className="col-2 d-flex align-items-center justify-content-center">
            <h5>Page Manage</h5>
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
              <li onClick={() => loadD()}>
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                  className="bi bi-house text-success"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 13.5V7h1v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7h1v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5zm11-11V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"
                  />
                  <path
                    fillRule="evenodd"
                    d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"
                  />
                </svg>
                Dashboard
              </li>
              <li onClick={() => loadU()}>
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                  className="bi bi-people text-danger"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1h7.956a.274.274 0 0 0 .014-.002l.008-.002c-.002-.264-.167-1.03-.76-1.72C13.688 10.629 12.718 10 11 10c-1.717 0-2.687.63-3.24 1.276-.593.69-.759 1.457-.76 1.72a1.05 1.05 0 0 0 .022.004zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10c-1.668.02-2.615.64-3.16 1.276C1.163 11.97 1 12.739 1 13h3c0-1.045.323-2.086.92-3zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"
                  />
                </svg>
                User
              </li>
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
              <h6 className="my-4 mx-2 text-dark">SAVED REPORTS</h6>
              <li onClick={() => loadRW()}>
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                  className="bi bi-file-earmark-spreadsheet"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 10H3V9h10v1h-3v2h3v1h-3v2H9v-2H6v2H5v-2H3v-1h2v-2zm1 0v2h3v-2H6z"
                  />
                  <path d="M4 0h5.5v1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h1V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z" />
                  <path d="M9.5 3V0L14 4.5h-3A1.5 1.5 0 0 1 9.5 3z" />
                </svg>
                Report week
              </li>
              <li onClick={() => loadRM()}>
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                  className="bi bi-file-earmark-spreadsheet"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 10H3V9h10v1h-3v2h3v1h-3v2H9v-2H6v2H5v-2H3v-1h2v-2zm1 0v2h3v-2H6z"
                  />
                  <path d="M4 0h5.5v1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h1V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z" />
                  <path d="M9.5 3V0L14 4.5h-3A1.5 1.5 0 0 1 9.5 3z" />
                </svg>
                Report month
              </li>
            </ul>
          </div>
          <div className="col-10" id="load">
            <Dashboard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Manager;
