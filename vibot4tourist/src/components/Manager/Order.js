import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import { Line } from "react-chartjs-2";

const Order = () => {
  const [dataBookedTour, setDataBookedTour] = useState([]);
  const [valuesBookedTour, setValuesBookedTour] = useState([]);
  const [dataChartWeek, setDataChartWeek] = useState([0, 0, 0, 0, 0, 0, 0]);
  const state = {
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
        data: dataChartWeek,
      },
      // {
      //   label: "Tour Booked",
      //   fill: false,
      //   lineTension: 0,
      //   backgroundColor: "#fd79a8",
      //   borderColor: "#e84393",
      //   borderWidth: 3,
      //   data: [0, 2, 6, 6, 1, 8, 2],
      // },
    ],
  };

  useEffect(() => {
    getAllBookedTour();
    getValuesBookedTour();
    getChartBookedTour_week();
  }, []);

  function Value(number) {
    // Nine Zeroes for Billions
    return Math.abs(Number(number)) >= 1.0e9
      ? Math.abs(Number(number)) / 1.0e9 + " B"
      : // Six Zeroes for Millions
      Math.abs(Number(number)) >= 1.0e6
      ? Math.abs(Number(number)) / 1.0e6 + " M"
      : // Three Zeroes for Thousands
      Math.abs(Number(number)) >= 1.0e3
      ? Math.abs(Number(number)) / 1.0e3 + " K"
      : Math.abs(Number(number));
  }
  function getValuesBookedTour() {
    fetch(process.env.SERVER + "/getValueBookedTour", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => {
        setValuesBookedTour(result);
        console.log(result);
      })
      .catch((error) => console.log("error", error));
  }
  function getAllBookedTour() {
    fetch(process.env.SERVER + "/getAllBookedTour", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => setDataBookedTour(result))
      .catch((error) => console.log("error", error));
  }
  function getChartBookedTour_week() {
    fetch(process.env.SERVER + "/getChartBookedTour_week", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => {
        result.forEach((element) => {
          let day = new Date(element.date_trunc).getDay();
          dataChartWeek[day] = element.sum;
          console.log(day, element.date_trunc);
        });
        console.log(dataChartWeek);
      })
      .catch((error) => console.log("error", error));
  }
  return (
    <div className="row">
      <div className="col-6 shadow p-3 mb-5 bg-white rounded">
        <Line
          data={state}
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
      <div className="col-6 d-flex flex-column">
        <div className="d-flex justify-content-around h-50 shadow p-3 mb-5 bg-white rounded">
          <h5>Annualy</h5>
          <div className="d-flex flex-column align-items-center">
            <div className="numberBig text-danger">
              {valuesBookedTour.amount_year}
            </div>
            <div>Sales</div>
          </div>
          <div className="d-flex flex-column align-items-center">
            <div className="numberBig text-success">
              {Value(valuesBookedTour.profit_year)}
            </div>
            <div>Total income</div>
          </div>
        </div>
        <div className="d-flex justify-content-around h-50 shadow p-3 mb-5 bg-white rounded">
          <h5>Monthly</h5>
          <div className="d-flex flex-column align-items-center">
            <div className="numberBig text-danger">
              {
                (valuesBookedTour.amount_month = null
                  ? 0
                  : valuesBookedTour.amount_month)
              }
            </div>
            <div>Sales</div>
          </div>
          <div className="d-flex flex-column align-items-center">
            <div className="numberBig text-success">
              {Value(valuesBookedTour.profit_month)}
            </div>
            <div>Total income</div>
          </div>
        </div>
      </div>
      <div className="col-12">
        <h3 className="title">Detail order</h3>
        <div className="table">
          <table className="table table-hover">
            <thead className="thead-light">
              <tr>
                <th scope="col">Tour name</th>
                <th scope="col">Buyer</th>
                <th scope="col">Number ticket</th>
                <th scope="col">Unit price</th>
                <th scope="col">Time pay</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {dataBookedTour.map((tour, index) => (
                <tr key={index}>
                  <th scope="col">{tour.tour_name}</th>
                  <td scope="col">{tour.fullname}</td>
                  <td scope="col">{tour.amount}</td>
                  <td scope="col">{Value(tour.tour_cost)}</td>
                  <td scope="col">{tour.paid_time}</td>
                  <td scope="col">
                    {tour.status == "paid" ? (
                      <button
                        type="button"
                        className="btn btn-success"
                        disabled
                      >
                        Done
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        disabled
                      >
                        Booked
                      </button>
                    )}
                    {/* <button type="button" className="btn btn-success">Booked</button> */}
                  </td>
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
export default Order;
