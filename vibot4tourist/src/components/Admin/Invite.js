import React, { useState, useEffect } from "react";

const Invite = () => {
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [roleUser, setRoleUser] = useState(0);
  const [listRoles] = useState([
    { label: "Admin", value: 1 },
    { label: "Manager", value: 3 },
    { label: "Staff", value: 4 },
  ]);
  function validateEmail(email) {
    const regEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regEmail.test(email);
  }

  function check() {
    if (validateEmail(email) == false) {
      alert("Can't send Email Invite \nPlease check your Email!");
      return false;
    } else if (roleUser == 0) {
      alert("Can't send Email Invite \nPlease check your Role!");
      return false;
    } else if (content == "") {
      alert("Can't send Email Invite \nPlease check your Content!");
      return false;
    }
    return true;
  }
  function sendEmail() {
    if (check()) {
      fetch(process.env.SERVER + "/inviteRole", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          role: roleUser,
          content: content,
        }),
      })
        .then((res) => res.json())
        .then((result) => {})
        .catch((error) => console.log(error));

      fetch(process.env.SERVER + "/changRole", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          role: roleUser,
        }),
      })
        .then((res) => res.json())
        .then((result) => {})
        .catch((error) => console.log(error));
    }
  }
  return (
    <div>
      <div className="row">
        <div className="col-5 bg-warning rounded-left p-4">
          <div className="contact-info">
            <svg
              width="75px"
              height="75px"
              viewBox="0 0 16 16"
              className="bi bi-envelope text-white"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383l-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z"
              />
            </svg>
            <h2>Email Invite</h2>
            <h6>You can decentralization for users !</h6>
          </div>
        </div>
        <div className="col-7 p-4">
          <div className="contact-form">
            <div className="form-group">
              <label className="control-label" for="email">
                Email:
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter email"
                name="email"
                onChange={(event) => setEmail(event.target.value)}
              ></input>
            </div>
            <div className="form-group">
              <label className="control-label" for="email">
                Select Role
              </label>

              <select
                className="browser-default custom-select"
                onChange={(e) => setRoleUser(e.currentTarget.value)}
              >
                <option selected hidden>
                  Please choose the role
                </option>
                {listRoles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="control-label " for="comment">
                Content:
              </label>
              <textarea
                className="form-control"
                rows="5"
                id="comment"
                onChange={(event) => setContent(event.target.value)}
              ></textarea>
            </div>
            <div className="form-group">
              <button
                type="submit"
                onClick={() => sendEmail()}
                className="btn btn-default"
              >
                Send email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invite;
