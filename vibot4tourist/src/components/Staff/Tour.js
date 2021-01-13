import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import DetailTour from "./DetailTour";

const Tour = () => {
  const [dataTour, setDataTour] = useState([]);

  useEffect(() => {
    getAllTour();
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
  function loadDT(tourId) {
    ReactDOM.render(
      <DetailTour tourId={tourId} />,
      document.getElementById("load")
    );
  }

  return (
    <div className="row">
      <div className="col-12">
        <div className="d-flex justify-content-between align-items-center pr-4">
          <h3 className="title mb-4">List Tour</h3>
          <button type="button" className="btn btn-success ">
            <svg
              width="20px"
              height="20px"
              viewBox="0 0 16 16"
              className="bi bi-cart-plus text-white"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
              />
              <path
                fillRule="evenodd"
                d="M8.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 .5-.5z"
              />
            </svg>
          </button>
        </div>
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
                <th scope="col">Actions</th>
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
                  <th className="d-flex justify-content-around ">
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={() => loadDT(tour.tour_id)}
                    >
                      Edit
                    </button>
                    <button type="button" className="btn btn-danger">
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
export default Tour;
