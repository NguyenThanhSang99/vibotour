import React, { useState, useEffect } from "react";

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

  return (
    <div className="row">
      <div className="col-12">
        <h3 className="title mb-4">List Promotion</h3>
        <div className="table">
          <table className="table table-hover">
            <thead className="thead-light">
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Percent</th>
                <th scope="col">Content</th>
                <th scope="col">Start</th>
                <th scope="col">End</th>
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
        <h3 className="title mb-4">List Voucher</h3>
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
