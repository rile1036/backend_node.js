const { getQueen } = require("./comment_controller");
const router = require("express").Router();

router.get("/queen", getQueen);

module.exports = router;
