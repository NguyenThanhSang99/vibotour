import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import Promotion from "./Promotion";
import Voucher from "./Voucher";

const Event = () => {
  const [dataPro, setDataPro] = useState([]);
  const [dataVou, setDataVou] = useState([]);

  useEffect(() => {
    getAllPromotion();
    getAllVoucher();
  }, []);

  function getAllPromotion() {
    fetch(process.env.SERVER + "/getAllPromotion", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => setDataPro(result))
      .catch((error) => console.log("error", error));
  }
  function getAllVoucher() {
    fetch(process.env.SERVER + "/getAllVoucher", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => setDataVou(result))
      .catch((error) => console.log("error", error));
  }
  function loadPr(promotion_id) {
    ReactDOM.render(
      <Promotion promotion_id={promotion_id} />,
      document.getElementById("load")
    );
  }
  function loadV(voucher_id) {
    ReactDOM.render(
      <Voucher voucher_id={voucher_id} />,
      document.getElementById("load")
    );
  }
  function deleteP(promotion_id) {
    fetch(process.env.SERVER + "/deletePro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        promotion_id: promotion_id,
      }),
    })
      .then((response) => {
        if (response.status == 200) {
          alert("Success! Please refresh page");
        } else {
          alert("Failure! Please try again");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }
  function deleteV(voucher_id) {
    fetch(process.env.SERVER + "/deleteVou", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        voucher_id: voucher_id,
      }),
    })
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          alert("Success! Please refresh page");
        } else {
          alert("Failure! Please try again");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  return (
    <div className="row">
      <div className="col-12">
        <div className="d-flex justify-content-between align-items-center pr-4">
          <h3 className="title mb-4">List Promotion</h3>
          <button
            type="button"
            onClick={() => loadPr()}
            className="btn btn-outline-success"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20px"
              height="20px"
              fill="currentColor"
              className="bi bi-flower1"
              viewBox="0 0 16 16"
            >
              <path d="M6.174 1.184a2 2 0 0 1 3.652 0A2 2 0 0 1 12.99 3.01a2 2 0 0 1 1.826 3.164 2 2 0 0 1 0 3.652 2 2 0 0 1-1.826 3.164 2 2 0 0 1-3.164 1.826 2 2 0 0 1-3.652 0A2 2 0 0 1 3.01 12.99a2 2 0 0 1-1.826-3.164 2 2 0 0 1 0-3.652A2 2 0 0 1 3.01 3.01a2 2 0 0 1 3.164-1.826zM8 1a1 1 0 0 0-.998 1.03l.01.091c.012.077.029.176.054.296.049.241.122.542.213.887.182.688.428 1.513.676 2.314L8 5.762l.045-.144c.248-.8.494-1.626.676-2.314.091-.345.164-.646.213-.887a4.997 4.997 0 0 0 .064-.386L9 2a1 1 0 0 0-1-1zM2 9l.03-.002.091-.01a4.99 4.99 0 0 0 .296-.054c.241-.049.542-.122.887-.213a60.59 60.59 0 0 0 2.314-.676L5.762 8l-.144-.045a60.59 60.59 0 0 0-2.314-.676 16.705 16.705 0 0 0-.887-.213 4.99 4.99 0 0 0-.386-.064L2 7a1 1 0 1 0 0 2zm7 5l-.002-.03a5.005 5.005 0 0 0-.064-.386 16.398 16.398 0 0 0-.213-.888 60.582 60.582 0 0 0-.676-2.314L8 10.238l-.045.144c-.248.8-.494 1.626-.676 2.314-.091.345-.164.646-.213.887a4.996 4.996 0 0 0-.064.386L7 14a1 1 0 1 0 2 0zm-5.696-2.134l.025-.017a5.001 5.001 0 0 0 .303-.248c.184-.164.408-.377.661-.629A60.614 60.614 0 0 0 5.96 9.23l.103-.111-.147.033a60.88 60.88 0 0 0-2.343.572c-.344.093-.64.18-.874.258a5.063 5.063 0 0 0-.367.138l-.027.014a1 1 0 1 0 1 1.732zM4.5 14.062a1 1 0 0 0 1.366-.366l.014-.027c.01-.02.021-.048.036-.084a5.09 5.09 0 0 0 .102-.283c.078-.233.165-.53.258-.874a60.6 60.6 0 0 0 .572-2.343l.033-.147-.11.102a60.848 60.848 0 0 0-1.743 1.667 17.07 17.07 0 0 0-.629.66 5.06 5.06 0 0 0-.248.304l-.017.025a1 1 0 0 0 .366 1.366zm9.196-8.196a1 1 0 0 0-1-1.732l-.025.017a4.951 4.951 0 0 0-.303.248 16.69 16.69 0 0 0-.661.629A60.72 60.72 0 0 0 10.04 6.77l-.102.111.147-.033a60.6 60.6 0 0 0 2.342-.572c.345-.093.642-.18.875-.258a4.993 4.993 0 0 0 .367-.138.53.53 0 0 0 .027-.014zM11.5 1.938a1 1 0 0 0-1.366.366l-.014.027c-.01.02-.021.048-.036.084a5.09 5.09 0 0 0-.102.283c-.078.233-.165.53-.258.875a60.62 60.62 0 0 0-.572 2.342l-.033.147.11-.102a60.848 60.848 0 0 0 1.743-1.667c.252-.253.465-.477.629-.66a5.001 5.001 0 0 0 .248-.304l.017-.025a1 1 0 0 0-.366-1.366zM14 9a1 1 0 0 0 0-2l-.03.002a4.996 4.996 0 0 0-.386.064c-.242.049-.543.122-.888.213-.688.182-1.513.428-2.314.676L10.238 8l.144.045c.8.248 1.626.494 2.314.676.345.091.646.164.887.213a4.996 4.996 0 0 0 .386.064L14 9zM1.938 4.5a1 1 0 0 0 .393 1.38l.084.035c.072.03.166.064.283.103.233.078.53.165.874.258a60.88 60.88 0 0 0 2.343.572l.147.033-.103-.111a60.584 60.584 0 0 0-1.666-1.742 16.705 16.705 0 0 0-.66-.629 4.996 4.996 0 0 0-.304-.248l-.025-.017a1 1 0 0 0-1.366.366zm2.196-1.196l.017.025a4.996 4.996 0 0 0 .248.303c.164.184.377.408.629.661A60.597 60.597 0 0 0 6.77 5.96l.111.102-.033-.147a60.602 60.602 0 0 0-.572-2.342c-.093-.345-.18-.642-.258-.875a5.006 5.006 0 0 0-.138-.367l-.014-.027a1 1 0 1 0-1.732 1zm9.928 8.196a1 1 0 0 0-.366-1.366l-.027-.014a5 5 0 0 0-.367-.138c-.233-.078-.53-.165-.875-.258a60.619 60.619 0 0 0-2.342-.572l-.147-.033.102.111a60.73 60.73 0 0 0 1.667 1.742c.253.252.477.465.66.629a4.946 4.946 0 0 0 .304.248l.025.017a1 1 0 0 0 1.366-.366zm-3.928 2.196a1 1 0 0 0 1.732-1l-.017-.025a5.065 5.065 0 0 0-.248-.303 16.705 16.705 0 0 0-.629-.661A60.462 60.462 0 0 0 9.23 10.04l-.111-.102.033.147a60.6 60.6 0 0 0 .572 2.342c.093.345.18.642.258.875a4.985 4.985 0 0 0 .138.367.575.575 0 0 0 .014.027zM8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
            </svg>{" "}
            Add
          </button>
        </div>
        <div className="table">
          <table className="table table-hover">
            <thead className="thead-light">
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Percent</th>
                <th scope="col">Content</th>
                <th scope="col">Start</th>
                <th scope="col">End</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {dataPro.map((pro, index) => (
                <tr key={index}>
                  <th scope="row">{pro.promotion_title}</th>
                  <td scope="row">{pro.promotion_percent}</td>
                  <td scope="row">{pro.promotion_content}</td>
                  <td scope="row">{pro.promotion_start}</td>
                  <td scope="row">{pro.promotion_end}</td>
                  <th className="d-flex justify-content-around ">
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={() => loadPr(pro.promotion_id)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteP(pro.promotion_id)}
                      className="btn btn-danger"
                    >
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
      <div className="col-12">
        <div className="d-flex justify-content-between align-items-center pr-4">
          <h3 className="title mb-4">List Voucher</h3>
          <button
            type="button"
            onClick={() => loadV()}
            className="btn btn-outline-success"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20px"
              height="20px"
              fill="currentColor"
              className="bi bi-flower2"
              viewBox="0 0 16 16"
            >
              <path d="M8 16a4 4 0 0 0 4-4 4 4 0 0 0 0-8 4 4 0 0 0-8 0 4 4 0 1 0 0 8 4 4 0 0 0 4 4zm3-12c0 .073-.01.155-.03.247-.544.241-1.091.638-1.598 1.084A2.987 2.987 0 0 0 8 5c-.494 0-.96.12-1.372.331-.507-.446-1.054-.843-1.597-1.084A1.117 1.117 0 0 1 5 4a3 3 0 0 1 6 0zm-.812 6.052A2.99 2.99 0 0 0 11 8a2.99 2.99 0 0 0-.812-2.052c.215-.18.432-.346.647-.487C11.34 5.131 11.732 5 12 5a3 3 0 1 1 0 6c-.268 0-.66-.13-1.165-.461a6.833 6.833 0 0 1-.647-.487zm-3.56.617a3.001 3.001 0 0 0 2.744 0c.507.446 1.054.842 1.598 1.084.02.091.03.174.03.247a3 3 0 1 1-6 0c0-.073.01-.155.03-.247.544-.242 1.091-.638 1.598-1.084zm-.816-4.721A2.99 2.99 0 0 0 5 8c0 .794.308 1.516.812 2.052a6.83 6.83 0 0 1-.647.487C4.66 10.869 4.268 11 4 11a3 3 0 0 1 0-6c.268 0 .66.13 1.165.461.215.141.432.306.647.487zM8 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
            </svg>{" "}
            Add
          </button>
        </div>
        <div className="table">
          <table className="table table-hover">
            <thead className="thead-light">
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Value</th>
                <th scope="col">Content</th>
                <th scope="col">Number Release</th>
                <th scope="col">Number Remain</th>
                <th scope="col">Start</th>
                <th scope="col">End</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {dataVou.map((vou, index) => (
                <tr key={index}>
                  <th scope="row">{vou.voucher_title}</th>
                  <td scope="row">{vou.voucher_value}</td>
                  <td scope="row">{vou.voucher_content}</td>
                  <td scope="row">{vou.voucher_amount}</td>
                  <td scope="row">{vou.voucher_amount_rest}</td>
                  <td scope="row">{vou.voucher_start}</td>
                  <td scope="row">{vou.voucher_end}</td>
                  <th className="d-flex justify-content-around ">
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={() => loadV(vou.voucher_id)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteV(vou.voucher_id)}
                      className="btn btn-danger"
                    >
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
export default Event;
