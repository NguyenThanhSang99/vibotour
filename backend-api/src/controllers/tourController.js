import pool from "../db/pool.js";

// Function query list of current tour and response result
const getListToursAfterNow = (request, response) => {
  pool.query(
    "SELECT t.tour_id, tour_name, image, SUM(number_day) as number_day, SUM(number_night) as number_night, tour_cost, case when round(total_vote*1.0/number_vote, 1)  is null then 4.0 else round(total_vote*1.0/number_vote, 1) end as rate FROM tour t, tour_detail td, (SELECT t.tour_id, image FROM tourist_attractions ta, tour t, tour_detail td WHERE t.tour_id = td.tour_id and td.tourist_attraction_id = ta.tourist_attraction_id and place_order = 1) a WHERE t.tour_id = td.tour_id and a.tour_id = t.tour_id and time_start > NOW() and number_ticket > number_paid_ticket GROUP BY t.tour_id, image ORDER BY rate DESC LIMIT 10;",
    [],
    (error, results) => {
      if (error) {
        console.log(error);
        response.status(500).send("error");
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

// Function query tour by ID and response result
const getTourByID = (request, response) => {
  const { tour_id } = request.body;
  pool.query(
    "SELECT t.tour_id, tour_name, description, time_start, SUM(number_day) AS number_day, SUM(number_night) AS number_night, departure_location, vehicle, tour_cost, number_vote, total_vote, note FROM tour t, tour_detail td WHERE t.tour_id = td.tour_id and t.tour_id = $1 GROUP BY t.tour_id;",
    [tour_id],
    (error, results) => {
      if (error) {
        console.log(error);
        response.status(500).send("error");
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

// Function response tour detail information and response result
const getTourDetail = (req, res) => {
  const { tour_id } = req.body;

  pool.query(
    "SELECT ta.tourist_attraction_id, ta.tourist_attraction_name, ta.description, ta.address, number_day, number_night, schedule_detail, image FROM tourist_attractions ta, tour t, tour_detail td WHERE t.tour_id = td.tour_id and td.tourist_attraction_id = ta.tourist_attraction_id and t.tour_id=$1 ORDER BY(td.place_order) ASC",
    [tour_id],
    (error, results) => {
      if (error) {
        console.log("error : ", error);
        res.status(500).send(`Error : ${error}`);
      } else if (results === null) {
        console.log("null");
      } else {
        res.status(200).json(results.rows);
      }
    }
  );
};

const bookTour = (req, res) => {
  const { user_id, tour_id } = req.body;
  pool.query(
    "INSERT INTO booked_tour(user_id, tour_id, amount, status) SELECT $1, $2, 1, 'booked' WHERE NOT EXISTS (SELECT 1 FROM booked_tour WHERE user_id = $1 and tour_id = $2 and status='booked')",
    [user_id, tour_id],
    (error, results) => {
      if (error) {
        console.log("error : ", error);
        res.status(500).send(`Lỗi xảy ra, vui lòng thử lại sau!!!`);
      } else {
        if (results.rowCount === 0) {
          res
            .status(200)
            .json(
              "Bạn đã đặt tour này rồi. \nKiểm tra shopping cart để xem!!!"
            );
        } else {
          res.status(200).json("Đặt tour thành công!");
        }
      }
    }
  );
};

const getBookedTour = (request, response) => {
  const { user_id } = request.body;
  pool.query(
    "SELECT booked_tour_id, t.tour_id, tour_name, t.time_start, t.departure_location, i.image, tour_cost, number_ticket - number_paid_ticket AS number_ticket_remaining, bt.user_id FROM booked_tour bt, tour t, (SELECT t.tour_id, image FROM tourist_attractions ta, tour t, tour_detail td WHERE t.tour_id = td.tour_id and td.tourist_attraction_id = ta.tourist_attraction_id and td.place_order = 1) i WHERE bt.tour_id = t.tour_id  and t.tour_id = i.tour_id and bt.user_id = $1 AND bt.status like '%booked%' GROUP BY t.tour_id, i.image, number_ticket_remaining, booked_tour_id, bt.user_id;",
    [user_id],
    (error, results) => {
      if (error) {
        console.log(error);
        response.status(500).send("error");
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const deleteBookedTour = (req, res) => {
  const { booked_tour_id } = req.body;
  console.log(booked_tour_id);
  pool.query(
    "DELETE FROM booked_tour WHERE booked_tour_id = $1;",
    [booked_tour_id],
    (error, results) => {
      if (error) {
        console.log("error : ", error);
        res.status(500).send(`Error`);
      } else {
        console.log(results);
        res.status(200).json(results.rows);
      }
    }
  );
};

const getPaidTour = (request, response) => {
  const { user_id } = request.body;
  pool.query(
    "SELECT booked_tour_id, t.tour_id, tour_name, i.image, tour_cost, bt.user_id, paid_time, amount, f_checkreview(booked_tour_id) AS can_review FROM booked_tour bt, tour t, (SELECT t.tour_id, image FROM tourist_attractions ta, tour t, tour_detail td WHERE t.tour_id = td.tour_id and td.tourist_attraction_id = ta.tourist_attraction_id and td.place_order = 1) i WHERE bt.tour_id = t.tour_id  and t.tour_id = i.tour_id and bt.user_id = $1 AND bt.status like '%paid%' GROUP BY t.tour_id, i.image, booked_tour_id, bt.user_id ORDER BY paid_time DESC;",
    [user_id],
    (error, results) => {
      if (error) {
        console.log(error);
        response.status(500).send("error");
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

// Function query list of current tour and response result
const getAllListToursAfterNow = (request, response) => {
  pool.query(
    "SELECT t.tour_id, tour_name, image, SUM(number_day) as number_day, SUM(number_night) as number_night, tour_cost, case when round(total_vote*1.0/number_vote, 1)  is null then 4.0 else round(total_vote*1.0/number_vote, 1) end as rate FROM tour t, tour_detail td, (SELECT t.tour_id, image FROM tourist_attractions ta, tour t, tour_detail td WHERE t.tour_id = td.tour_id and td.tourist_attraction_id = ta.tourist_attraction_id and place_order = 1) a WHERE t.tour_id = td.tour_id and a.tour_id = t.tour_id and time_start > NOW() and number_ticket > number_paid_ticket GROUP BY t.tour_id, image ORDER BY rate DESC",
    [],
    (error, results) => {
      if (error) {
        console.log(error);
        response.status(500).send("error");
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const getTourTrending = (req, res) => {
  const days = req.query.days;
  pool.query(
    "SELECT * FROM f_gettourtrendingbydays($1);",
    [days],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).json("error");
      } else {
        res.status(200).json(results.rows);
      }
    }
  );
};

const reviewTour = (req, res) => {
  const { userId, bookedTourId, rate, reviewContent } = req.body;
  pool.query(
    "CaLL p_reviewtour($1, $2, $3, $4) ",
    [userId, bookedTourId, rate, reviewContent],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).json(error.message);
      } else {
        res.status(200).json("success");
      }
    }
  );
};

const getReviewsTour = (req, res) => {
  const tourId = req.query.tourId;
  pool.query(
    "SELECT * FROM f_Get_Review_Of_Tour($1);",
    [tourId],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).json(error.message);
      } else {
        res.status(200).json(results.rows);
      }
    }
  );
};

const searchTour = (req, res) => {
  const search = "%" + req.query.searchString + "%";
  pool.query("SELECT * FROM f_searchTour($1);", [search], (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send("error");
    } else {
      res.status(200).json(results.rows);
    }
  });
};

// Function getAllTour and response result
const getAllTour = (request, response) => {
  pool.query("SELECT * FROM tour", (error, results) => {
    if (error) {
      response.status(500).send("failed");
    }
    response.status(200).json(results.rows);
  });
};
//Funtion getValueNewTour
const getValueNewTour = async (request, response) => {
  await pool.query("SELECT * FROM f_dataTour_Report();", (error, results) => {
    if (error) {
      response.status(500).send("failed");
    } else {
      response.status(200).json(results.rows[0]);
    }
  });
};
//Funtion getValueNewTour
const getChartNewTour_week = async (request, response) => {
  await pool.query(
    "SELECT * FROM f_dataTour_Chart_week();",
    (error, results) => {
      if (error) {
        response.status(500).send("failed");
      } else {
        response.status(200).json(results.rows[0]);
      }
    }
  );
};
//Funtion getChartNewTour_month
const getChartNewTour_month = async (request, response) => {
  await pool.query(
    "SELECT * FROM f_dataTour_Chart_month();",
    (error, results) => {
      if (error) {
        response.status(500).send("failed");
      } else {
        response.status(200).json(results.rows[0]);
      }
    }
  );
};

// Function savePromotion
const savePromotion = (request, response) => {
  const {
    promotion_title,
    promotion_percent,
    promotion_content,
    promotion_image,
    promotion_start,
    promotion_end,
    tourChoose,
  } = request.body;
  pool.query(
    "INSERT INTO promotion (promotion_title, promotion_percent, promotion_content, promotion_image, promotion_start, promotion_end) VALUES($1, $2, $3, $4, $5, $6) RETURNING promotion_id;",
    [
      promotion_title,
      promotion_percent,
      promotion_content,
      promotion_image,
      promotion_start,
      promotion_end,
    ],
    (error, results) => {
      if (error) {
        response.status(500).send(`Error : ${error}`);
      } else {
        tourChoose.forEach((tour_id) => {
          addTour_Promotiontable(tour_id, results.rows[0].promotion_id);
        });
        response.status(200).send("oke");
      }
    }
  );
};
// Function editPromotion
const editPromotion = (request, response) => {
  const {
    promotion_id,
    promotion_title,
    promotion_percent,
    promotion_content,
    promotion_image,
    promotion_start,
    promotion_end,
  } = request.body;
  console.log(
    promotion_id,
    promotion_title,
    promotion_percent,
    promotion_content,
    promotion_image,
    promotion_start,
    promotion_end
  );
  pool.query(
    "update promotion set promotion_title = $1,promotion_percent = $2,promotion_content = $3,promotion_image = $4,promotion_start = $5,promotion_end = $6 where	promotion_id = $7",
    [
      promotion_title,
      promotion_percent,
      promotion_content,
      promotion_image,
      promotion_start,
      promotion_end,
      promotion_id,
    ],
    (error, results) => {
      if (error) {
        response.status(500).send(`Error : ${error}`);
      } else {
        response.status(200).send("oke");
      }
    }
  );
};

//Function add data into table tour_promotion
function addTour_Promotiontable(tour_id, promotion_id) {
  pool.query(
    "INSERT INTO tour_promotion (tour_id, promotion_id) VALUES($1,$2);",
    [tour_id, promotion_id],
    (error, results) => {
      if (error) {
        console.log(`Error : ${error}`);
      }
    }
  );
}

// Function savePromotion
const saveVocher = (request, response) => {
  const {
    voucher_title,
    voucher_value,
    voucher_amount,
    voucher_content,
    voucher_start,
    voucher_end,
  } = request.body;
  pool.query(
    "INSERT INTO voucher ( voucher_title, voucher_value, voucher_content, voucher_start, voucher_end, voucher_amount, voucher_amount_rest) VALUES ($1, $2, $3, $4, $5, $6, $6);",
    [
      voucher_title,
      voucher_value,
      voucher_content,
      voucher_start,
      voucher_end,
      voucher_amount,
    ],
    (error, results) => {
      if (error) {
        response.status(500).send(`Error : ${error}`);
      } else {
        console.log(voucher_amount);
        response.status(200).send("oke");
      }
    }
  );
};

//Funtion getAllBookedTour
const getAllBookedTour = (request, response) => {
  pool.query(
    "SELECT tour_name, last_name  || ' ' || first_name as fullname, amount, tour_cost, paid_time, status FROM booked_tour b, tour t, users u WHERE b.tour_id = t.tour_id AND b.user_id = u.user_id",
    (error, results) => {
      if (error) {
        response.status(500).send("failed");
      }
      response.status(200).json(results.rows);
    }
  );
};

//Funtion getValueBookedTour
const getValueBookedTour = async (request, response) => {
  await pool.query("SELECT * FROM f_dataOrder_Report();", (error, results) => {
    if (error) {
      response.status(500).send("failed");
    } else {
      response.status(200).json(results.rows[0]);
    }
  });
};
//Fun getChartBookedTour_week
const getChartBookedTour_week = (request, response) => {
  pool.query(
    "SELECT SUM(amount),date_trunc( 'day', paid_time ) FROM booked_tour WHERE status = 'paid' 	AND EXTRACT(month FROM paid_time ) - EXTRACT(month FROM now()) = 0 	AND EXTRACT(week FROM paid_time ) - EXTRACT(week FROM now()) = 0 GROUP BY date_trunc( 'day', paid_time );",
    (error, results) => {
      if (error) {
        response.status(500).send("failed");
      }
      response.status(200).json(results.rows);
    }
  );
};
const getChartBookedTour_lastweek = (request, response) => {
  pool.query(
    "SELECT SUM(amount),date_trunc( 'day', paid_time ) FROM booked_tour WHERE status = 'paid' 	AND EXTRACT(month FROM paid_time ) - EXTRACT(month FROM now()) = 0 	AND EXTRACT(week FROM paid_time ) - EXTRACT(week FROM now()) = -1 GROUP BY date_trunc( 'day', paid_time );",
    (error, results) => {
      if (error) {
        response.status(500).send("failed");
      }
      response.status(200).json(results.rows);
    }
  );
};
//Funtion getAllPromotion
const getAllPromotion = async (request, response) => {
  await pool.query(
    "SELECT * FROM promotion order by promotion_id desc limit 5;",
    (error, results) => {
      if (error) {
        response.status(500).send("failed");
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};
//Funtion getPromotionByID
const getPromotionByID = async (request, response) => {
  const { promotion_id } = request.body;
  console.log(promotion_id);
  await pool.query(
    "select * from promotion where promotion_id = $1",
    [promotion_id],
    (error, results) => {
      if (error) {
        response.status(500).send("failed");
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

//Funtion getAllVoucher
const getAllVoucher = async (request, response) => {
  await pool.query(
    "SELECT * FROM voucher order by voucher_start desc limit 5;",
    (error, results) => {
      if (error) {
        response.status(500).send("failed");
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

//Funtion getVoucherById
const getVoucherById = async (request, response) => {
  const { voucher_id } = request.body;
  console.log(voucher_id);
  await pool.query(
    "select * from voucher where voucher_id = $1",
    [voucher_id],
    (error, results) => {
      if (error) {
        response.status(500).send("failed");
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};

const getReviews = async (request, response) => {
  await pool.query(
    "select first_name, last_name, email, phone, review_content from review r , booked_tour b, users u where r.booked_tour_id = b.booked_tour_id and b.user_id = u.user_id limit 4",
    (error, results) => {
      if (error) {
        response.status(500).send("failed");
      } else {
        response.status(200).json(results.rows);
      }
    }
  );
};
const deleteTour = (request, response) => {
  const { tour_id } = request.body;
  pool.query(
    "DELETE FROM tour WHERE tour_id = $1;",
    [tour_id],
    (error, results) => {
      if (error) {
        response.status(500).send("failed");
      }
      response.status(200).send("thành công!!!");
    }
  );
};
const deletePro = (request, response) => {
  const { promotion_id } = request.body;
  pool.query(
    "DELETE FROM promotion WHERE promotion_id = $1;",
    [promotion_id],
    (error, results) => {
      if (error) {
        response.status(500).send("failed");
      }
      response.status(200).send("thành công!!!");
    }
  );
};
const deleteVou = (request, response) => {
  const { voucher_id } = request.body;
  console.log(voucher_id);
  // pool.query(
  //   "DELETE FROM voucher WHERE voucher_id = $1;",
  //   [voucher_id],
  //   (error, results) => {
  //     if (error) {
  //       response.status(500).send("failed");
  //     }
  //     response.status(200).send("thành công!!!");
  //   }
  // );
};
export {
  getTourByID,
  getTourDetail,
  getListToursAfterNow,
  bookTour,
  getBookedTour,
  deleteBookedTour,
  getPaidTour,
  getAllListToursAfterNow,
  getTourTrending,
  reviewTour,
  getReviewsTour,
  searchTour,
  getAllTour,
  getValueNewTour,
  getChartNewTour_week,
  getChartNewTour_month,
  savePromotion,
  editPromotion,
  saveVocher,
  getAllBookedTour,
  getValueBookedTour,
  getChartBookedTour_week,
  getChartBookedTour_lastweek,
  getAllPromotion,
  getPromotionByID,
  getAllVoucher,
  getVoucherById,
  getReviews,
  deleteTour,
  deletePro,
  deleteVou,
};
