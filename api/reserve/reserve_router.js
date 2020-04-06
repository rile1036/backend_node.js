const router = require("express").Router();
const { getreserve, getreserve_coupon, reserve,review } = require("./reserve_controller");

router.get("/", getreserve);
router.get("/:content_id", getreserve_coupon);
router.post("/insert", reserve);
router.post("/review", review);

module.exports = router;