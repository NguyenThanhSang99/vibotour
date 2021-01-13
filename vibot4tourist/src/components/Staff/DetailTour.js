import React, { useState, useEffect } from "react";
import Schedule from "../detail-components/Schedule";

function DetailTour(props) {
  const [tourId, setTourId] = useState(props.tourId);
  const [tourName, setTourName] = useState("");
  const [description, setDescription] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [departureLocation, setDepartureLocation] = useState("");
  const [tourCost, setTourCost] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [startDay, setStartDay] = useState("");
  const [endDay, setEndDay] = useState("");
  const [note, setNote] = useState("");
  const [tourSchedule, setTourSchedule] = useState([]);

  console.log(props.tourId);
  // FORMAT DATE
  const getDate = (date) => {
    date = new Date(date);
    var year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate();
    day <= 9 ? (day = "0" + day) : (day = day);
    return year + "-" + month + "-" + day;
  };

  // FORMAT TIME
  const getTime = (time) => {
    time = new Date(time);
    var hour = time.getHours(),
      minute = time.getMinutes();
    hour <= 9 ? (hour = "0" + hour) : (hour = hour);
    minute <= 9 ? (minute = "0" + minute) : (minute = minute);

    return hour + ":" + minute;
  };

  // FORMAT DATE
  const addDays = (date, days) => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  // GET DATA TOUR
  function getData(tour_id) {
    fetch(process.env.SERVER + "/tour", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({ tour_id }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          const date = getDate(result[0].time_start);
          setTourName(result[0].tour_name);
          setTourCost(result[0].tour_cost);
          setDescription(result[0].description);
          setVehicle(result[0].vehicle);
          setDepartureLocation(result[0].departure_location);
          setStartDay(date);
          setDepartureTime(getTime(result[0].time_start));
          parseInt(result[0].number_day) > parseInt(result[0].number_night)
            ? setEndDay(getDate(addDays(date, parseInt(result[0].number_day))))
            : setEndDay(
                getDate(addDays(date, parseInt(result[0].number_night)))
              );
          setNote(result[0].note);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  useEffect(() => {
    getData(tourId);
  }, []);

  return (
    <div className="container-contact100">
      <div className="wrap-contact100">
        <form className="contact100-form validate-form">
          <span className="contact100-form-title">Tour Detail</span>
          <div className="wrap-input100 validate-input bg1">
            <span className="label-input100">Tour Name *</span>
            <input
              className="input100"
              type="text"
              id="tour-name"
              value={tourName}
              onChange={(e) => setTourName(e.target.value)}
            />
          </div>

          <div className="wrap-input100 validate-input bg1">
            <span className="label-input100">Description</span>
            <textarea
              className="input100"
              type="text"
              id="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="wrap-input100 bg1 rs1-wrap-input100">
            <span className="label-input100">Start Day</span>
            <input
              className="input100"
              type="date"
              id="start-date"
              value={startDay}
              onChange={(e) => setStartDay(e.target.value)}
            />
          </div>
          <div className="wrap-input100 bg1 rs1-wrap-input100">
            <span className="label-input100">End Day</span>
            <input
              className="input100"
              type="date"
              id="start-date"
              value={endDay}
              onChange={(e) => setEndDay(e.target.value)}
            />
          </div>
          <div className="wrap-input100 validate-input bg1 rs1-wrap-input100">
            <span className="label-input100">Price </span>
            <input
              className="input100"
              type="text"
              id="price"
              value={tourCost}
              onChange={(e) => setTourCost(e.target.value)}
            />
          </div>
          <div className="wrap-input100 bg1 rs1-wrap-input100">
            <span className="label-input100">departure time</span>
            <input
              className="input100"
              type="time"
              id="departure-time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
            />
          </div>
          <div className="wrap-input100 bg1 rs1-wrap-input100">
            <span className="label-input100">starting place</span>
            <input
              className="input100"
              type="text"
              id="starting-place"
              value={departureLocation}
              onChange={(e) => setDepartureLocation(e.target.value)}
            />
          </div>
          <div className="wrap-input100 bg1 rs1-wrap-input100">
            <span className="label-input100">vehicle</span>
            <input
              className="input100"
              type="text"
              id="vehicle"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
            />
          </div>

          <Schedule tourId={tourId} />

          <div className="wrap-input100 bg1 rs1-wrap-input100 note">
            <span className="label-input100">Note</span>
            <textarea
              className="input100"
              type="text"
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="container-contact100-form-btn">
            <button className="contact100-form-btn">
              <span>
                Submit
                <i
                  className="fa fa-long-arrow-right m-l-7"
                  aria-hidden="true"
                />
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DetailTour;
