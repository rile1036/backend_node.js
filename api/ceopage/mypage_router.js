const router = require("express").Router();
const { getuser, manager, checkcontent, content, content_tag, content_image, content_list, manager_day } = require("./ceo_controller");

router.get("/", getuser);
router.get("/list", content_list);
//router.get("/image", content_image);
router.post("/content", checkcontent);
router.post("/insert", content);
router.post("/tag/insert", content_tag);
router.post("/manager", manager);
router.post("/manager/rest", manager_day);

module.exports = router;
