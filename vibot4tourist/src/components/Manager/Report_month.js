import React, { useState, useEffect } from "react";

import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";

const Report_month = () => {
  const [dataChartMonthUser, setDataChartMonthUser] = useState([1, 1]);
  const [dataChartMonthTour, setDataChartMonthTour] = useState([]);
  const [dataChartThisWeekOrder, setDataChartThisWeekOrder] = useState([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ]);
  const [dataChartLastWeekOrder, setDataChartLastWeekOrder] = useState([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ]);
  const user = {
    labels: ["This month"],
    datasets: [
      {
        label: "News users",
        backgroundColor: "#F26083",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 1,
        data: [dataChartMonthUser[0], 0],
      },
      {
        label: "Royal users",
        backgroundColor: "#36A2EB",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 1,
        data: [dataChartMonthUser[1], 0],
      },
    ],
  };
  function getChartUser_month() {
    fetch(process.env.SERVER + "/getChartUser_month", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => {
        dataChartMonthUser[0] = result.newuser_thismonth;
        dataChartMonthUser[1] = result.userroyal_thismonth;
        console.log(dataChartMonthUser);
      })
      .catch((error) => console.log("error", error));
  }
  const order = {
    labels: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    datasets: [
      {
        label: "This week",
        fill: false,
        lineTension: 0,
        backgroundColor: "#ffeaa7",
        borderColor: "#fdcb6e",
        borderWidth: 3,
        data: dataChartThisWeekOrder,
      },
      {
        label: "Last week ",
        fill: false,
        lineTension: 0,
        backgroundColor: "#e056fd",
        borderColor: "#be2edd",
        borderWidth: 3,
        data: dataChartLastWeekOrder,
      },
    ],
  };
  function getChartBookedTour_Month() {
    fetch(process.env.SERVER + "/getChartBookedTour_week", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => {
        result.forEach((element) => {
          let day = new Date(element.date_trunc).getDay();
          dataChartThisWeekOrder[day] = element.sum;
          console.log(day, element.date_trunc);
        });
        console.log(dataChartThisWeekOrder);
      })
      .catch((error) => console.log("error", error));

    fetch(process.env.SERVER + "/getChartBookedTour_lastweek", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => {
        result.forEach((element) => {
          let day = new Date(element.date_trunc).getDay();
          dataChartLastWeekOrder[day] = element.sum;
          console.log(day, element.date_trunc);
        });
        console.log(dataChartThisWeekOrder);
      })
      .catch((error) => console.log("error", error));
  }
  const tour = {
    labels: ["This MONTH", "The rest in YEAR"],
    datasets: [
      {
        backgroundColor: ["#2FDE00", "#00A6B4"],
        hoverBackgroundColor: ["#175000", "#003350"],
        data: dataChartMonthTour,
      },
    ],
  };
  function getChartNewTour_month() {
    fetch(process.env.SERVER + "/getChartNewTour_month", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => {
        dataChartMonthTour[0] = result.newtour_thismonth;
        dataChartMonthTour[1] =
          result.newtour_thisyear - result.newtour_thismonth;
        console.log(dataChartWeek);
      })
      .catch((error) => console.log("error", error));
  }

  useEffect(() => {
    getChartUser_month();
    getChartBookedTour_Month();
    getChartNewTour_month();
  }, []);

  return (
    <div className="row d-flex justify-content-around">
      <div className="col-10 shadow p-3 mb-5 bg-white rounded text-center">
        <h1>Report Month</h1>
      </div>
      <div className="col-5 shadow p-3 mb-5 bg-white rounded">
        <Bar
          data={user}
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
      <div className="col-5 shadow p-3 mb-5 bg-white rounded">
        <Doughnut
          data={tour}
          options={{
            title: {
              display: true,
              position: "right",
              text: "New Tour",
              fontSize: 20,
            },
            legend: {
              display: true,
              position: "right",
            },
          }}
        />
      </div>
      <div className="col-10 shadow p-3 mb-5 bg-white rounded">
        <Line
          data={order}
          options={{
            title: {
              display: true,
              text: "Sale in Month",
              fontSize: 20,
            },
            legend: {
              display: true,
              position: "right",
            },
          }}
        />
      </div>
    </div>
  );
};
export default Report_month;
