import React, { useState, useEffect } from "react";

const DetailUser = (props) => {
  const [user_id, setUser_id] = useState(props.userId);
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  function validateEmail(email) {
    const regEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regEmail.test(email);
  }
  function getData(userId) {
    fetch(process.env.SERVER + "/getUserById", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({ userId }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setFirstName(result[0].first_name);
          setLastName(result[0].last_name);
          setEmail(result[0].email);
          setPhone(result[0].phone);
          setAddress(result[0].address);
          console.log(result);
        },
        (error) => {
          console.log(error);
        }
      );
  }
  function update() {
    fetch(process.env.SERVER + "/updateUserByAdmin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: first_name,
        last_name: last_name,
        phone: phone,
        address: address,
        userId: user_id,
        email: email,
      }),
    }).catch((error) => {
      console.log("error", error);
    });
  }
  function create() {
    fetch(process.env.SERVER + "/createUserByAdmin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone: phone,
        address: address,
      }),
    }).catch((error) => {
      console.log("error", error);
    });
  }
  useEffect(() => {
    if (user_id != "") {
      getData(user_id);
    }
  }, []);

  return (
    <form>
      <h3 className="title mb-4 ">
        Detail User: &emsp;
        <span className="w-100 text-success">#{user_id}</span>
      </h3>
      <div className="form-row">
        <div className="form-group col-md-6">
          <label>First Name</label>
          <input
            type="text"
            className="form-control "
            placeholder="First name"
            value={first_name}
            onChange={(event) => setFirstName(event.target.value)}
            required
          />
        </div>
        <div className="form-group col-md-6">
          <label>Last name</label>
          <input
            type="text"
            className="form-control "
            placeholder="Last name"
            value={last_name}
            onChange={(event) => setLastName(event.target.value)}
            required
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group col-md-6">
          <label>Email</label>
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">@</span>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group col-md-6">
          <label>Number Phone</label>
          <input
            type="text"
            className="form-control"
            placeholder="0905xxxxxx"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group col-md-12">
          <label htmlFor="inputAddress">Address</label>
          <input
            type="text"
            className="form-control"
            placeholder="1234 Main St"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            required
          />
        </div>
      </div>
      <button
        type="submit"
        onClick={() => {
          user_id == null ? create() : update();
        }}
        className="btn btn-primary"
      >
        {user_id == null ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default DetailUser;
