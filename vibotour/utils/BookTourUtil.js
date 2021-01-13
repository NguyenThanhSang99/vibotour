const bookTour = async (user_id, tour_id) => {
  return new Promise(function (resolve) {
    fetch(process.env.SERVER_IP + "/api/v1/bookTour", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({ user_id, tour_id }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          resolve(result);
        },
        (error) => {
          console.log(error);
          resolve(error);
        }
      );
  });
};

const cancelTicket = (items, userId) => {
  return new Promise(function (resolve) {
    fetch(process.env.SERVER_IP + "/api/v1/cancelTicket", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({ items, userId }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          resolve(result);
        },
        (error) => {
          console.log(error);
          resolve(error);
        }
      );
  });
};

const sendEmailTicket = (items, firstName, lastName, email) => {
  return new Promise(function (resolve) {
    fetch(process.env.SERVER_IP + "/api/v1/sendTicket", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({ items, firstName, lastName, email }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          resolve(result);
        },
        (error) => {
          console.log(error);
          resolve(error);
        }
      );
  });
};

export { bookTour, cancelTicket, sendEmailTicket };
