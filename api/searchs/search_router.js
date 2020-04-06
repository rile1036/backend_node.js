const { getRecent_insert, getSearch, getRecent, getRecent_delete, getPopular } = require("./search_controller");
const router = require("express").Router();
//const { getPopular, getRecent } = require("./search_controller");

router.post("/", getSearch);
router.get("/popular", getPopular);
router.get("/recent", getRecent);
router.post("/recent/delete", getRecent_delete);
router.post("/recent/insert", getRecent_insert);

module.exports = router;
