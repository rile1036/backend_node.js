const { getcheck, create, create_list, getheart, getcheck_mobile, getrecommend } = require("./content_controller");
const router = require("express").Router();

router.post("/", create);
router.post("/list", create_list);
//router.get("/grade/:category", getgrade);
//router.get("/review/:category", getreview);
//router.get("/discount/:category", getdiscount);
//router.get("/recommend/:category", getrecommend);
//router.get("/reserve/:category", getreserve);
router.get("/heart", getheart);
router.get("/:check_order/:category", getcheck);
router.post("/sort", getcheck_mobile);

module.exports = router;
