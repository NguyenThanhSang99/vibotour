import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [dataReview, setDataReView] = useState([]);

  useEffect(() => {
    getReviews();
  }, []);
  function getReviews() {
    fetch(process.env.SERVER + "/getReviews", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => setDataReView(result))
      .catch((error) => console.log("error", error));
  }
  return (
    <div>
      <div className="d-flex justify-content-between">
        <h3>Dashboard</h3>
        {/* <div className="btn-group btn-group-toggle" data-toggle="buttons">
            <label className="btn btn-outline-secondary">Share </label>
            <label className="btn btn-outline-secondary">Export </label>
            <label className="btn btn-outline-secondary mx-2">
              This weekend
            </label>
          </div> */}
      </div>
      <div className="d-flex justify-content-around">
        <div className="card border-0">
          <div className="face face1">
            <div className="content">
              <div className="icon">
                <svg
                  width="50px"
                  height="50px"
                  viewBox="0 0 16 16"
                  className="bi bi-people"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1h7.956a.274.274 0 0 0 .014-.002l.008-.002c-.002-.264-.167-1.03-.76-1.72C13.688 10.629 12.718 10 11 10c-1.717 0-2.687.63-3.24 1.276-.593.69-.759 1.457-.76 1.72a1.05 1.05 0 0 0 .022.004zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10c-1.668.02-2.615.64-3.16 1.276C1.163 11.97 1 12.739 1 13h3c0-1.045.323-2.086.92-3zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="face face2">
            <div className="content">
              <h3>News users</h3>
              <p>Some word</p>
            </div>
          </div>
        </div>
        <div className="card border-0">
          <div className="face face1">
            <div className="content">
              <div className="icon">
                <svg
                  width="50px"
                  height="50px"
                  viewBox="0 0 16 16"
                  className="bi bi-file-check"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 0h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H4z"
                  />
                  <path
                    fillRule="evenodd"
                    d="M10.854 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 8.793l2.646-2.647a.5.5 0 0 1 .708 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="face face2">
            <div className="content">
              <h3>Product sold</h3>
              <p>Some word</p>
            </div>
          </div>
        </div>
        <div className="card border-0">
          <div className="face face1">
            <div className="content">
              <div className="icon">
                <svg
                  width="50px"
                  height="50px"
                  viewBox="0 0 16 16"
                  className="bi bi-pen"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M13.498.795l.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="face face2">
            <div className="content">
              <h3>Customer's feedback</h3>
              <p>Some word</p>
            </div>
          </div>
        </div>
      </div>

      <h3 className="title mb-4">Feedback from customer</h3>
      <div className="row justify-content-around">
        {dataReview.map((re, index) => (
          <div className="col-5 d-flex feedback p-0 rounded-lg p-2 m-2">
            <div className="feedback-preview p-3">
              <h6>{re.first_name + " " + re.last_name}</h6>
              <div>{re.email}</div>
              <div>{re.phone}</div>
            </div>
            <div className="p-3">
              <h6>Feedback</h6>
              <p>{re.review_content}</p>
            </div>
          </div>
        ))}
      </div>
      <br />
      <a className="ViewMore" href="123">
        View More &raquo;
      </a>
    </div>
  );
};

export default Dashboard;
