import React, { useState, useEffect } from "react";
import CKEditor from "ckeditor4-react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import firebase from "firebase/app";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBe30Ki4f6xGgfx-dPzqHNlnYI1iydw11g",
  authDomain: "vibotour-e118a.firebaseapp.com",
  projectId: "vibotour-e118a",
  storageBucket: "vibotour-e118a.appspot.com",
  messagingSenderId: "602368019319",
  appId: "1:602368019319:web:09c2ffc269d617f80aaf72",
  measurementId: "G-KX5E7DNR4Z",
};
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

const Promition = (props) => {
  const [dataTour, setDataTour] = useState([]);
  const [id, setId] = useState(props.promotion_id);
  const [title, setTitle] = useState("");
  const [percent, setPercent] = useState(-1);
  const [image, setImage] = useState(null);
  const [urlImage, setUrlImage] = useState(null);
  const [content, setContent] = useState("Input your content");
  const [rangePick, setRangePick] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [tourChoose, setTourChoose] = useState([]);

  useEffect(() => {
    getAllTour();
    if (id != "") {
      getPromotionByID(id);
    }
    console.log(id);
  }, []);

  function getPromotionByID(promotion_id) {
    fetch(process.env.SERVER + "/getPromotionByID", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({ promotion_id }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setTitle(result[0].promotion_title);
          setPercent(result[0].promotion_percent);
          setContent(result[0].promotion_content);
          setUrlImage(result[0].promotion_image);
          // rangePick[0].startDate = result[0].promotion_start;
          // rangePick[0].endDate = result[0].promotion_end;
          setTitle(result[0].promotion_title);
          console.log(result);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  const selectFile = (event) => {
    if (event.target.files[0]) setImage(event.target.files[0]);
    setUrlImage(URL.createObjectURL(event.target.files[0]));
  };

  const fetchToDatabase = () => {
    if (title == "") {
      alert("Can not create promotion \nPlease check your Title!");
    } else if (percent < 0 || percent > 100) {
      alert("Can not create promotion \nPlease check your Percent!");
    } else if (content == "") {
      alert("Can not create promotion \nPlease check your Content!");
    } else if (image == null) {
      alert("Can not create promotion \nPlease check your Image!");
    } else if (tourChoose.length == 0) {
      alert("Can not create promotion \nPlease check your Tour!");
    } else {
      const time = Date.now();
      const uploadTask = storage.ref(`images/${time + image.name}`).put(image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("images")
            .child(time + image.name)
            .getDownloadURL()
            .then((url) => {
              if (id == null) createPromotion(url);
              else editPromotion(url);
            });
        }
      );
    }
  };

  function createPromotion(url) {
    fetch(process.env.SERVER + "/savePromotion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        promotion_title: title,
        promotion_percent: percent,
        promotion_content: content,
        promotion_image: url,
        promotion_start: rangePick[0].startDate,
        promotion_end: rangePick[0].endDate,
        tourChoose: tourChoose,
      }),
    }).catch((error) => {
      console.log("error", error);
    });
  }
  function editPromotion(url) {
    fetch(process.env.SERVER + "/editPromotion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        promotion_id: id,
        promotion_title: title,
        promotion_percent: percent,
        promotion_content: content,
        promotion_image: url,
        promotion_start: rangePick[0].startDate,
        promotion_end: rangePick[0].endDate,
      }),
    }).catch((error) => {
      console.log("error", error);
    });
  }

  function getAllTour() {
    fetch(process.env.SERVER + "/alltour", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => setDataTour(result))
      .catch((error) => console.log("error", error));
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-center">
        <h2 className="m-4">Create Promition</h2>
      </div>
      <div
        className="row d-flex justify-content-around"
        encType="multipart/form-data"
      >
        <div className="shadow pt-3 px-4 bg-white rounded col-6">
          <label>Title</label>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Input Title</span>
            </div>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              autoFocus
            />
          </div>
        </div>
        <div className="shadow pt-3 px-4 bg-white rounded col-5 ">
          <label>Percent</label>
          <div className="input-group mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Input Percent"
              value={percent}
              onChange={(event) => setPercent(event.target.value)}
            />
            <div className="input-group-append">
              <span className="input-group-text"> % </span>
            </div>
          </div>
        </div>
        <div className="col-12 mt-5">
          <label>Contents</label>
          <CKEditor
            data={content}
            onChangeText={(content) => setContent(content)}
          />
        </div>
        <div className="shadow pt-3 px-4 bg-white rounded col-6 my-5">
          <label>Choose your image</label>
          <input
            type="file"
            className="form-control-file"
            accept="image/*"
            onChange={selectFile}
          />
          <div className="mt-4">
            <img src={urlImage} className="h-100 w-100" />
          </div>
        </div>
        <div className="shadow  bg-white rounded col-5 my-5 ">
          <label>Select time&nbsp;&nbsp;&nbsp;&nbsp;</label>
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setRangePick([item.selection])}
            ranges={rangePick}
            className="m-3 "
          />
        </div>
        <div className="col-12 mt-3">
          <table className="table table-hover">
            <thead className="thead-light">
              <tr>
                <th scope="col"></th>
                <th scope="col">ID Tour</th>
                <th scope="col">Tour Name</th>
                <th scope="col">Description</th>
                <th scope="col">Departure Location</th>
                <th scope="col">Start</th>
                <th scope="col">Number Ticket</th>
              </tr>
            </thead>
            <tbody>
              {dataTour.map((tour, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      onChange={(event) => {
                        let checked = event.target.checked;
                        if (checked) tourChoose.push(tour.tour_id);
                        else {
                          var index = tourChoose.indexOf(tour.tour_id);
                          if (index !== -1) {
                            tourChoose.splice(index, 1);
                          }
                        }
                      }}
                    />
                  </td>
                  <td scope="row">{tour.tour_id}</td>
                  <th>{tour.tour_name}</th>
                  <td>{tour.description}</td>
                  <td>{tour.departure_location}</td>
                  <td>{tour.time_start}</td>
                  <td>{tour.number_ticket}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-center col-12 mt-3">
          <button onClick={() => fetchToDatabase()} className="btn btn-primary">
            {id == null ? "Create" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Promition;
