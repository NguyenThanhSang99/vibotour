import pool from "../db/pool.js";
import { sendEmail, parse } from "../utils/emailUtil.js";
import dotenv from "dotenv";
import encryptPassword from "../utils/encryptPassword.js";

dotenv.config();
const loginGoogle = (req, res) => {
  const { firstName, lastName, email, photoURL } = req.body;
  pool.query(
    "SELECT f_login_google($1, $2, $3, $4) AS result",
    [email, firstName, lastName, photoURL],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send("error");
      } else {
        if (results.rowCount === 0) {
          res.status(200).json("failed");
        } else {
          res.status(200).json(results.rows[0].result);
        }
      }
    }
  );
};
const sendCode = (request, response) => {
  const { codeSend, email, firstName, lastName } = request.body;
  const fullName =
    (firstName ? firstName + " " : "Sir/Madam") + (lastName ? lastName : "");
  const content = parse(
    process.env.SEND_CODE_REGISTER_CONTENT,
    fullName,
    codeSend,
    process.env.EMAIL
  );
  response.status(200).json(sendEmail("Confirm viBOTour", content, email));
};
const inviteRole = (request, response) => {
  const { email, role, content } = request.body;
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  const date = month + "/" + day + "/" + year;
  console.log(role);
  const contentsend = parse(
    process.env.SEND_EMAIL_INVITE,
    email,
    email,
    role == 3 ? "Manager" : role == 1 ? "Admin" : "Staff",
    date,
    content,
    process.env.EMAIL
  );
  response
    .status(200)
    .json(sendEmail("Update your account - viBOTour", contentsend, email));
};

const changePass = (req, res) => {
  const { pass, email } = req.body;
  pool.query(
    "UPDATE users SET password = $1 WHERE email = $2;",
    [encryptPassword(pass), email],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send("error");
      } else {
        res.status(200).json("success");
      }
    }
  );
};

const registerAccount = (request, response) => {
  const { email, password, firstName, lastName } = request.body;

  const newPassword = encryptPassword(password);
  pool.query(
    "INSERT INTO users(first_name, last_name, email, password, role_id, create_at) SELECT $1, $2, $3, $4, 2, NOW() WHERE NOT EXISTS (SELECT 1 FROM users WHERE email='$3') RETURNING user_id",
    [firstName, lastName, email, newPassword],
    (error, results) => {
      if (error) {
        console.log(error);
        response.status(500).send("error");
      } else {
        if (results.rowCount === 0) {
          response.status(200).json("failed");
        } else {
          response.status(200).json(results.rows[0].user_id);
        }
      }
    }
  );
};

const getUserByEmail = (request, response) => {
  const { email } = request.body;
  pool.query(
    "SELECT user_id, email, first_name, last_name FROM users WHERE email = $1;",
    [email],
    (error, results) => {
      if (error) {
        response.status(500).send("failed");
      }
      response.status(200).json(results.rows);
    }
  );
};

const getUserById = (request, response) => {
  const { userId } = request.body;
  console.log(userId);
  pool.query(
    "SELECT user_id, email, first_name, last_name, address, phone, gender, image FROM users WHERE user_id = $1;",
    [userId],
    (error, results) => {
      if (error) {
        response.status(500).send("failed");
      }
      response.status(200).json(results.rows);
    }
  );
};

const getUserByEmailAndPassword = (request, response) => {
  const { email, password } = request.body;
  pool.query(
    "SELECT user_id, email, first_name, last_name, role_id FROM users WHERE email = $1 and password = $2;",
    [email, encryptPassword(password)],
    (error, results) => {
      if (error) {
        response.status(500).send("failed");
      }
      response.status(200).json(results.rows);
    }
  );
};

const updateUser = (request, response) => {
  const { user } = request.body;
  pool.query(
    "SELECT f_update_user($1, $2, $3, $4, $5, $6, $7) AS result;",
    [
      user.userId,
      user.firstName,
      user.lastName,
      user.address,
      user.gender,
      user.phone,
      user.image,
    ],
    (error, results) => {
      if (error) {
        response.status(500).send("Có lỗi xảy ra, vui lòng thử lại sau!!!");
        return;
      }
      switch (results.rows[0].result) {
        case -1:
          response.status(500).send("Tài khoản không tồn tại!!!");
          break;
        case 0:
          response.status(500).send("Có lỗi xảy ra, vui lòng thử lại sau!!!");
          break;
        default:
          response
            .status(200)
            .send("Cập nhật thông tin tài khoản thành công!!!");
      }
    }
  );
};
const getAllUsers = (request, response) => {
  pool.query("SELECT * FROM users WHERE role_id = '2'", (error, results) => {
    if (error) {
      response.status(500).send("failed");
    }
    response.status(200).json(results.rows);
  });
};
const getAllMember = (request, response) => {
  pool.query(
    "SELECT u.*, role_name FROM users u, roles r WHERE r.role_id <> '2' AND u.role_id = r.role_id ORDER BY role_id ASC ",
    (error, results) => {
      if (error) {
        response.status(500).send("failed");
      }
      response.status(200).json(results.rows);
    }
  );
};
const getValueUser = async (request, response) => {
  await pool.query("SELECT * FROM f_dataUser_Report();", (error, results) => {
    if (error) {
      response.status(500).send("failed");
    } else {
      response.status(200).json(results.rows[0]);
    }
  });
};
const getChartUser_week = async (request, response) => {
  await pool.query(
    "SELECT * FROM f_dataUser_Chart_week();",
    (error, results) => {
      if (error) {
        response.status(500).send("failed");
      } else {
        response.status(200).json(results.rows[0]);
      }
    }
  );
};
const getChartUser_month = async (request, response) => {
  await pool.query(
    "SELECT * FROM f_dataUser_Chart_month();",
    (error, results) => {
      if (error) {
        response.status(500).send("failed");
      } else {
        response.status(200).json(results.rows[0]);
      }
    }
  );
};
const updateUserByAdmin = (request, response) => {
  const { first_name, last_name, email, phone, address, userId } = request.body;
  console.log(first_name, last_name, email, phone, address, userId);
  pool.query(
    "UPDATE users SET first_name = $1, last_name = $2, email = $3, phone = $4, address = $5 WHERE user_id = $6;",
    [first_name, last_name, email, phone, address, userId],
    (error, results) => {
      if (error) {
        response.status(500).send("failed");
      }
      response.status(200).send("Cập nhật thông tin tài khoản thành công!!!");
    }
  );
};
const createUserByAdmin = (request, response) => {
  const { first_name, last_name, email, phone, address } = request.body;
  pool.query(
    "INSERT INTO users(first_name, last_name, email, phone, address, role_id, create_at) VALUES($1, $2, $3, $4, $5 ,2, NOW())",
    [first_name, last_name, email, phone, address],
    (error, results) => {
      if (error) {
        response.status(500).send("failed");
      }
      response.status(200).send("thành công!!!");
    }
  );
};
const deleteUserByAdmin = (request, response) => {
  const { user_id } = request.body;
  pool.query(
    "DELETE FROM users WHERE user_id = $1;",
    [user_id],
    (error, results) => {
      if (error) {
        response.status(500).send("failed");
      }
      response.status(200).send("thành công!!!");
    }
  );
};
const changRole = (request, response) => {
  const { email, role } = request.body;
  pool.query(
    "UPDATE users SET role_id = $1 WHERE email = $2;",
    [role, email],
    (error, results) => {
      if (error) {
        response.status(500).send("failed");
      }
      response.status(200).send("thành công!!!");
    }
  );
};

export {
  getUserByEmail,
  getUserById,
  getUserByEmailAndPassword,
  registerAccount,
  loginGoogle,
  sendCode,
  inviteRole,
  changRole,
  changePass,
  updateUser,
  updateUserByAdmin,
  createUserByAdmin,
  deleteUserByAdmin,
  getAllUsers,
  getAllMember,
  getValueUser,
  getChartUser_week,
  getChartUser_month,
};
