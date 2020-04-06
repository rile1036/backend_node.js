const { create, getLists, geteventLists } = require("./main_web_page_controller");
const router = require("express").Router();

router.post("/discount", create);
router.get("/event", getLists);
router.get("/today", geteventLists);

module.exports = router;
