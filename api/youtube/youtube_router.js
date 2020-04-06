const { getYoutube_category, getYoutube_id, getYoutube, getstory, getpick } = require("./youtube_controller");
const router = require("express").Router();

router.get("/mimotv/info/:id", getYoutube_id);
router.get("/mimotv/:category", getYoutube_category);
router.get("/mimotv", getYoutube);
router.get("/mimostory/:category", getstory);
router.post("/pick", getpick);
 
module.exports = router;
