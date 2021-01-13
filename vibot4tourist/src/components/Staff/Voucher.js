import React, { useState, useEffect } from "react";
import CKEditor from "ckeditor4-react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";

const Voucher = (props) => {
  const [id, setId] = useState(props.voucher_id);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState(-1);
  const [amount, setAmount] = useState(-1);
  const [content, setContent] = useState("Input your content");
  const [rangePick, setRangePick] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  useEffect(() => {
    getVoucherById(id);
    console.log(props.voucher_id);
  });

  function getVoucherById(voucher_id) {
    fetch(process.env.SERVER + "/getVoucherById", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({ voucher_id }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          setTitle = result[0].voucher_title;
          setValue = result[0].voucher_value;
          setAmount = result[0].voucher_amount;
          setContent = result[0].voucher_content;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  const createPromotion = () => {
    if (title == "") {
      alert("Can not create promotion \nPlease check your Title!");
    } else if (value < 0) {
      alert("Can not create promotion \nPlease check your Value!");
    } else if (amount < 0) {
      alert("Can not create promotion \nPlease check your Amount of Voucher!");
    } else if (content == "") {
      alert("Can not create promotion \nPlease check your Content!");
    } else {
      fetchToDatabase();
    }
  };

  function fetchToDatabase() {
    fetch(process.env.SERVER + "/saveVocher", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        voucher_title: title,
        voucher_value: value,
        voucher_amount: amount,
        voucher_content: content,
        voucher_start: rangePick[0].startDate,
        voucher_end: rangePick[0].endDate,
      }),
    }).catch((error) => {
      console.log("error", error);
    });
  }
  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-center">
        <h2 className="m-4">Create Voucher</h2>
      </div>
      <div
        className="row d-flex justify-content-around"
        encType="multipart/form-data"
      >
        <div className="shadow pt-3 px-4 bg-white rounded col-5">
          <label>Title</label>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Input</span>
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
        <div className="shadow pt-3 px-4 bg-white rounded col-3">
          <label>Value</label>
          <div className="input-group mb-3">
            <input
              type="number"
              className="form-control"
              value={value}
              placeholder="Input"
              onChange={(event) => setValue(event.target.value)}
              step="1000"
            />
            <div className="input-group-append">
              <span className="input-group-text"> VND </span>
            </div>
          </div>
        </div>
        <div className="shadow pt-3 px-4 bg-white rounded col-3">
          <label>Amount</label>
          <div className="input-group mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Input"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              step="1"
            />
            <div className="input-group-append">
              <span className="input-group-text"> Voucher </span>
            </div>
          </div>
        </div>
        <div className="col-5 mt-5">
          <label>Contents</label>
          <CKEditor
            data={content}
            onChangeText={(content) => setContent(content)}
          />
        </div>
        <div className="col-6 mt-5 ">
          <label>Select time&nbsp;&nbsp;&nbsp;&nbsp;</label>
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setRangePick([item.selection])}
            ranges={rangePick}
            className="m-3 "
          />
        </div>
        <div className="d-flex justify-content-center col-12 mt-3">
          <button onClick={createPromotion} className="btn btn-primary">
            Create
          </button>
        </div>
      </div>
    </div>
  );
};
export default Voucher;
