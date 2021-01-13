import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import DetailUser from "./DetailUser";

import { Bar } from "react-chartjs-2";

const User = () => {
  const [dataUsers, setDataUsers] = useState([]);
  const [dataMems, setDataMems] = useState([]);
  const [valuesUser, setValuesUser] = useState([]);
  const [dataChartWeek, setDataChartWeek] = useState([3, 1]);
  const state = {
    labels: ["This week"],
    datasets: [
      {
        label: "News users",
        backgroundColor: "#F26083",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 1,
        data: [dataChartWeek[0], 0],
      },
      {
        label: "Royal users",
        backgroundColor: "#36A2EB",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 1,
        data: [dataChartWeek[1], 0],
      },
    ],
  };

  useEffect(() => {
    getAllUsers();
    getAllMems();
    getValueUser();
    getChartUser_week();
  }, []);

  function getValueUser() {
    fetch(process.env.SERVER + "/getValueUser", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => {
        setValuesUser(result);
      })
      .catch((error) => console.log("error", error));
  }
  function getAllUsers() {
    fetch(process.env.SERVER + "/getAllUsers", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => setDataUsers(result))
      .catch((error) => console.log("error", error));
  }
  function getAllMems() {
    fetch(process.env.SERVER + "/getAllMember", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => setDataMems(result))
      .catch((error) => console.log("error", error));
  }
  function loadDU(userId) {
    ReactDOM.render(
      <DetailUser userId={userId} />,
      document.getElementById("load")
    );
  }
  function getChartUser_week() {
    fetch(process.env.SERVER + "/getChartUser_week", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => {
        dataChartWeek[0] = result.newuser_thisweek;
        dataChartWeek[1] = result.userroyal_thisweek;
        console.log(dataChartWeek);
      })
      .catch((error) => console.log("error", error));
  }
  function deleteU(userId) {
    fetch(process.env.SERVER + "/deleteUserByAdmin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
      }),
    })
      .then((response) => {
        if (response.status == 200) {
          alert("Success! Please refresh page");
        } else {
          alert("Failure! Please refresh page");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  return (
    <div className="row">
      <div className="col-6 shadow p-3 mb-5 bg-white rounded">
        <Bar
          data={state}
          options={{
            title: {
              display: true,
              text: "Distribution of customers",
              fontSize: 20,
            },
            legend: {
              display: true,
              position: "right",
            },
          }}
        />
      </div>
      <div className="col-6 d-flex flex-column">
        <div className="d-flex justify-content-around h-50 shadow p-3 mb-5 bg-white rounded">
          <h5>Annualy</h5>
          <div className="d-flex flex-column align-items-center">
            <div className="numberBig text-danger">
              {valuesUser.newuser_thisyear}
            </div>
            <div>News user</div>
          </div>
          <div className="d-flex flex-column align-items-center">
            <div className="numberBig text-success">
              {valuesUser.userroyal_thisyear}
            </div>
            <div>Loyal User</div>
          </div>
        </div>
        <div className="d-flex justify-content-around h-50 shadow p-3 mb-5 bg-white rounded">
          <h5>Monthly</h5>
          <div className="d-flex flex-column align-items-center">
            <div className="numberBig text-danger">
              {valuesUser.newuser_thismonth}
            </div>
            <div>News user</div>
          </div>
          <div className="d-flex flex-column align-items-center">
            <div className="numberBig text-success">
              {valuesUser.userroyal_thismonth}
            </div>
            <div>Loyal User</div>
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="d-flex justify-content-between align-items-center pr-4">
          <h3 className="title">List User</h3>
          <button
            type="button"
            onClick={() => loadDU()}
            className="btn btn-success h-25"
          >
            <svg
              width="30px"
              height="30px"
              viewBox="0 0 16 16"
              className="bi bi-person-plus text-white"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm6 5c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10zM13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"
              />
            </svg>
          </button>
        </div>
        <div className="table">
          <table className="table table-hover">
            <thead className="thead-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Email</th>
                <th scope="col">Number phone</th>
                <th scope="col">Address</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dataUsers.map((users, index) => (
                <tr key={index}>
                  <td>{users.user_id}</td>
                  <th>{users.first_name}</th>
                  <th>{users.last_name}</th>
                  <td>{users.email}</td>
                  <td>{users.phone}</td>
                  <td>{users.address}</td>
                  <th className="d-flex justify-content-between">
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={() => loadDU(users.user_id)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => deleteU(users.user_id)}
                    >
                      Delete
                    </button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
          <a className="aViewMore" href="123">
            View More &raquo;
          </a>
        </div>
      </div>
      <div className="col-12">
        <h3 className="title">List Member</h3>
        <div className="table">
          <table className="table table-hover">
            <thead className="thead-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Role</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Number phone</th>
                <th scope="col">Address</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dataMems.map((mems, index) => (
                <tr key={index}>
                  <td>{mems.user_id}</td>
                  <td>{mems.role_name}</td>
                  <th>{mems.first_name + " " + mems.last_name}</th>
                  <td>{mems.email}</td>
                  <td>{mems.phone}</td>
                  <td>{mems.address}</td>
                  <th className="d-flex justify-content-between">
                    <button
                      type="button"
                      onClick={() => loadDU(mems.user_id)}
                      className="btn btn-warning"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteU(mems.user_id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
          <a className="aViewMore" href="123">
            View More &raquo;
          </a>
        </div>
      </div>
    </div>
  );
};
export default User;
