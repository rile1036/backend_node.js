const router = require("express").Router();
const { heart_insert, heart_delete, getstyle, getcontent, getmenu, getmanager } = require("./heart_controller");

router.get("/content", getcontent);
router.get("/menu", getmenu);
router.get("/manager", getmanager);
router.get("/style", getstyle);
router.post("/delete", heart_delete);
router.post("/insert", heart_insert);

module.exports = router;
