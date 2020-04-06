//const { createUser, getUserByUserID, getUsers, updateUser, login } = require("./user_controller");
const router = require("express").Router();
//const { checkToken } = require("../../auth/token_validation");
const { certifyUser, reissuanceAccessToken, signin, signup } = require("./ceo_controller");

router.post("/signup", signup);
//router.get("/", checkToken, getUsers);
//router.get("/:id", checkToken, getUserByUserID);
//router.patch("/", checkToken, updateUser);
router.get('/reissue', reissuanceAccessToken);
router.get('/me', certifyUser);
router.post("/login", signin);
//router.get("/signout", signout);

module.exports = router;
