import express from "express";

import {
  getTourByID,
  getTourDetail,
  getListToursAfterNow,
  bookTour,
  getBookedTour,
  deleteBookedTour,
  getAllListToursAfterNow,
  getTourTrending,
  getPaidTour,
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
} from "../controllers/tourController.js";

const router = express.Router();

router.post("/tour", getTourByID);
router.post("/tourDetail", getTourDetail);
router.get("/getCurrentTours", getListToursAfterNow);
router.post("/bookTour", bookTour);
router.post("/getBookedTour", getBookedTour);
router.post("/getPaidTour", getPaidTour);
// DELETE booked tour
router.post("/deleteBookedTour", deleteBookedTour);
// SEARCH tour on app
router.get("/searchTour", searchTour);
router.get("/getAllCurrentTours", getAllListToursAfterNow);
router.get("/getTourTrending", getTourTrending);
router.post("/reviewTour", reviewTour);
router.get("/getReviewsTour", getReviewsTour);

//GET all tour
router.get("/alltour", getAllTour);
//GET ValueNewTour
router.get("/getValueNewTour", getValueNewTour);
//GET getChartNewTour_week
router.get("/getChartNewTour_week", getChartNewTour_week);
router.get("/getChartNewTour_month", getChartNewTour_month);

//GET AllBookedTour
router.get("/getAllBookedTour", getAllBookedTour);
//GET ValueBookerTour
router.get("/getValueBookedTour", getValueBookedTour);
//GET getChartBookedTour_week
router.get("/getChartBookedTour_week", getChartBookedTour_week);
router.get("/getChartBookedTour_lastweek", getChartBookedTour_lastweek);

//GET getAllPromotion
router.get("/getAllPromotion", getAllPromotion);
router.post("/getPromotionByID", getPromotionByID);
//POST to save Promotion Information
router.post("/savePromotion", savePromotion);
router.post("/editPromotion", editPromotion);
//GET ValueNewTour
router.get("/getAllVoucher", getAllVoucher);
router.post("/getVoucherById", getVoucherById);
//POST to save Vocher Information
router.post("/saveVocher", saveVocher);
router.get("/getReviews", getReviews);

router.post("deleteTour", deleteTour);
router.post("deletePro", deletePro);
router.post("deleteVou", deleteVou);

export default router;
