import React from "react";
import ReactDOM from "react-dom";

import Auth from "../authentication-components/Auth";

import User from "./User";
import Invite from "./Invite";

import "../../styles/Bootstrap.css";
import "../../styles/App.css";

function Admin(props) {
  function removeCookies() {
    var allCookies = document.cookie.split(";");
    for (var i = 0; i < allCookies.length; i++)
      document.cookie =
        allCookies[i] + "=;expires=" + new Date(0).toUTCString();
  }
  function loadU() {
    ReactDOM.render(<User />, document.getElementById("load"));
  }
  function loadI() {
    ReactDOM.render(<Invite />, document.getElementById("load"));
  }

  return (
    <div>
      <div className="container-fluid bg-info text-white">
        <div className="row navbar">
          <div className="col-2 d-flex align-items-center justify-content-center">
            <h5>Page Admin</h5>
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
              <li onClick={() => loadI()}>
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                  className="bi bi-mailbox"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a3 3 0 0 0-3 3v6h6V7a3 3 0 0 0-3-3zm0-1h8a4 4 0 0 1 4 4v6a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V7a4 4 0 0 1 4-4zm2.646 1A3.99 3.99 0 0 1 8 7v6h7V7a3 3 0 0 0-3-3H6.646z"
                  />
                  <path
                    fillRule="evenodd"
                    d="M11.793 8.5H9v-1h5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.354-.146l-.853-.854z"
                  />
                  <path d="M5 7c0 .552-.448 0-1 0s-1 .552-1 0a1 1 0 0 1 2 0z" />
                </svg>
                Invite
              </li>
            </ul>
          </div>
          <div className="col-10" id="load">
            <User />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
