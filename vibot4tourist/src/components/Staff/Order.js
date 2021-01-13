import React, { useState, useEffect } from "react";

const Order = () => {
  const [dataBookedTour, setDataBookedTour] = useState([]);

  useEffect(() => {
    getAllBookedTour();
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
  function getAllBookedTour() {
    fetch(process.env.SERVER + "/getAllBookedTour", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => setDataBookedTour(result))
      .catch((error) => console.log("error", error));
  }

  return (
    <div className="row">
      <div className="col-12">
        <h3 className="title mb-4">Detail order</h3>
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
