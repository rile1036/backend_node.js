const router = require("express").Router();
const { getquestion, getuser, getnotice, getevent, getcoupon, getsaving, getreview, getreview_complete } = require("./mypage_controller");

router.get("/", getuser);
router.get("/notice", getnotice);
router.get("/event", getevent);
router.get("/coupon", getcoupon);
router.get("/saving", getsaving);
router.get("/review", getreview);
router.get("/question", getquestion);
router.get("/review/complete", getreview_complete);

module.exports = router;
