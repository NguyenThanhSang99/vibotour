import React, { useState, useEffect } from "react";

import { Bar } from "react-chartjs-2";

const User = () => {
  const [dataUsers, setDataUsers] = useState([]);
  const [valuesUser, setValuesUser] = useState([]);
  const [dataChartWeek, setDataChartWeek] = useState([1, 1]);
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
        <h3 className="title">List User</h3>
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
