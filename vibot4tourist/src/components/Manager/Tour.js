import React, { useState, useEffect } from "react";

import { Doughnut } from "react-chartjs-2";

const Tour = () => {
  const [dataTour, setDataTour] = useState([]);
  const [valuesNewTour, setValuesNewTour] = useState([]);
  const [dataChartWeek, setDataChartWeek] = useState([]);
  const state = {
    labels: ["This WEEK", "The rest in MONTH"],
    datasets: [
      {
        backgroundColor: ["#2FDE00", "#00A6B4"],
        hoverBackgroundColor: ["#175000", "#003350"],
        data: dataChartWeek,
      },
    ],
  };
  useEffect(() => {
    getAllTour();
    getValuesNewTour();
    getChartNewTour_week();
  }, []);

  function getAllTour() {
    fetch(process.env.SERVER + "/alltour", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => setDataTour(result))
      .catch((error) => console.log("error", error));
  }
  function getValuesNewTour() {
    fetch(process.env.SERVER + "/getValueNewTour", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => {
        setValuesNewTour(result);
      })
      .catch((error) => console.log("error", error));
  }
  function getChartNewTour_week() {
    fetch(process.env.SERVER + "/getChartNewTour_week", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => {
        dataChartWeek[0] = result.newtour_thisweek;
        dataChartWeek[1] = result.newtour_thismonth - result.newtour_thisweek;
        console.log(dataChartWeek);
      })
      .catch((error) => console.log("error", error));
  }

  return (
    <div className="row">
      <div className="col-6 shadow p-3 mb-5 bg-white rounded">
        <Doughnut
          data={state}
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
      <div className="col-6 d-flex flex-column">
        <div className="d-flex justify-content-around h-50 shadow p-3 mb-5 bg-white rounded">
          <h5>Annualy</h5>
          <div className="w-50 d-flex flex-column align-items-center">
            <div className="numberBig text-success">
              {valuesNewTour.newtour_year}
            </div>
            <div>NewTour</div>
          </div>
        </div>
        <div className="d-flex justify-content-around h-50 shadow p-3 mb-5 bg-white rounded">
          <h5>Monthly</h5>
          <div className="d-flex flex-column align-items-center">
            <div className="numberBig text-danger">
              {valuesNewTour.newtour_lastmonth}
            </div>
            <div>Last Month</div>
          </div>
          <div className="d-flex flex-column align-items-center">
            <div className="numberBig text-success">
              {valuesNewTour.newtour_thismonth}
            </div>
            <div>This Month</div>
          </div>
        </div>
      </div>
      <div className="col-12">
        <h3 className="title">List Tour</h3>
        <div className="table">
          <table className="table table-hover">
            <thead className="thead-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name Tour</th>
                <th scope="col">Description</th>
                <th scope="col">Prime</th>
                <th scope="col">Rate</th>
                <th scope="col">Start at</th>
              </tr>
            </thead>
            <tbody>
              {dataTour.map((tour, index) => (
                <tr key={index}>
                  <td scope="row">{tour.tour_id}</td>
                  <th>{tour.tour_name}</th>
                  <td>{tour.description}</td>
                  <td>{tour.tour_cost}</td>
                  <td>{(tour.total_vote / tour.number_vote).toFixed(1)}</td>
                  <td>{tour.time_start}</td>
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
export default Tour;
