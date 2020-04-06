//const { createAdmin, getAdminID, getAdmin, login } = require("./admin_controller");
const router = require("express").Router();
//const { checkToken } = require("../../auth/token_validation");
const { certifyUser, reissuanceAccessToken, signin, signup, signout } = require("./auth_admin_controller");

router.post("/signup", signup);
router.post("/login", signin);
router.get("/me", certifyUser);
router.get("/signout", signout);
router.get("/reissue", reissuanceAccessToken);
/*router.post("/", createAdmin);
router.get("/", checkToken, getAdmin);
router.get("/:id", checkToken, getAdminID);
router.post("/login", login);
*/

module.exports = router;
