import express from "express";

import {
  payTour, 
  saveTicket, 
  cancelTicket, 
  touristInfo, 
  getStripePage, 
  paySuccess, 
  payCancel,
  checkout,
  sendTicket
} from "../controllers/paymentController.js";

const router = express.Router();


router.post("/checkout", checkout);
router.post("/saveTicket", saveTicket);
router.post("/cancelTicket", cancelTicket);
router.post("/touristInfo", touristInfo);
router.post("/sendTicket", sendTicket);
router.get("/web/checkout/redirect", getStripePage);
router.get("/payment/success", paySuccess);
router.get("/payment/cancel", payCancel);

export default router;
