import express from "express";

import {
  loginGoogle,
  sendCode,
  inviteRole,
  changRole,
  getUserByEmail,
  getUserById,
  getUserByEmailAndPassword,
  registerAccount,
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
} from "../controllers/authenticationController.js";

const router = express.Router();

router.post("/sendCode", sendCode);
router.post("/inviteRole", inviteRole);
router.post("/changRole", changRole);
router.post("/changePass", changePass);
router.post("/register", registerAccount);
router.post("/user", getUserByEmail);
router.post("/getUserById", getUserById);
router.post("/checkLogin", getUserByEmailAndPassword);
router.post("/loginGoogle", loginGoogle);
router.post("/updateUser", updateUser);
router.post("/updateUserByAdmin", updateUserByAdmin);
router.post("/createUserByAdmin", createUserByAdmin);
router.post("/deleteUserByAdmin", deleteUserByAdmin);
router.get("/getAllUsers", getAllUsers);
router.get("/getAllMember", getAllMember);
router.get("/getValueUser", getValueUser);
router.get("/getChartUser_week", getChartUser_week);
router.get("/getChartUser_month", getChartUser_month);

export default router;
