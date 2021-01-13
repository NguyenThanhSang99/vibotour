import React, { useState, useEffect } from "react";

import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";

const Report_week = () => {
  const [dataChartWeekUser, setDataChartWeekUser] = useState([1, 1]);
  const [dataChartWeekTour, setDataChartWeekTour] = useState([]);
  const [dataChartWeekOrder, setDataChartWeekOrder] = useState([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  ]);
  const user = {
    labels: ["This week"],
    datasets: [
      {
        label: "News users",
        backgroundColor: "#F26083",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 1,
        data: [dataChartWeekUser[0], 0],
      },
      {
        label: "Royal users",
        backgroundColor: "#36A2EB",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 1,
        data: [dataChartWeekUser[1], 0],
      },
    ],
  };
  function getChartUser_week() {
    fetch(process.env.SERVER + "/getChartUser_week", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => {
        dataChartWeekUser[0] = result.newuser_thisweek;
        dataChartWeekUser[1] = result.userroyal_thisweek;
        console.log(dataChartWeekUser);
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
        label: "Tour Booked",
        fill: false,
        lineTension: 0,
        backgroundColor: "#ffeaa7",
        borderColor: "#fdcb6e",
        borderWidth: 3,
        data: dataChartWeekOrder,
      },
    ],
  };
  function getChartBookedTour_week() {
    fetch(process.env.SERVER + "/getChartBookedTour_week", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => {
        result.forEach((element) => {
          let day = new Date(element.date_trunc).getDay();
          dataChartWeekOrder[day] = element.sum;
          console.log(day, element.date_trunc);
        });
        console.log(dataChartWeekOrder);
      })
      .catch((error) => console.log("error", error));
  }
  const tour = {
    labels: ["This WEEK", "The rest in MONTH"],
    datasets: [
      {
        backgroundColor: ["#2FDE00", "#00A6B4"],
        hoverBackgroundColor: ["#175000", "#003350"],
        data: dataChartWeekTour,
      },
    ],
  };
  function getChartNewTour_week() {
    fetch(process.env.SERVER + "/getChartNewTour_week", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => {
        dataChartWeekTour[0] = result.newtour_thisweek;
        dataChartWeekTour[1] =
          result.newtour_thismonth - result.newtour_thisweek;
        console.log(dataChartWeek);
      })
      .catch((error) => console.log("error", error));
  }

  useEffect(() => {
    getChartUser_week();
    getChartBookedTour_week();
    getChartNewTour_week();
  }, []);

  return (
    <div className="row d-flex justify-content-around">
      <div className="col-10 shadow p-3 mb-5 bg-white rounded text-center">
        <h1>Report Week</h1>
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
              text: "Sale in week",
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
export default Report_week;
