const { getmanager_detail_tag, getheader, getstyle, getcomment, getcommentlist, getmanager, getmanager_detail, getreserve_date, getmenu, getdetail_comment, getdetail_list, getdetail_info, getmap } = require("./content_controller");
const router = require("express").Router();

router.get("/:id", getheader);
router.get("/style/:id", getstyle);
router.get("/manager/:id", getmanager);
router.get("/comment/info/:id", getcomment);
router.get("/menu/:content_id", getmenu);
router.get("/map/:id", getmap);
router.get("/comment/list/:id", getcommentlist);
router.get("/:content_id/menu/:id", getdetail_list);
router.get("/:content_id/menu/:id/info", getdetail_info);
router.get("/:content_id/comment/:id", getdetail_comment);
router.post("/reserve", getreserve_date);
router.get("/manager/:id/info", getmanager_detail);
router.get("/manager/:id/:tag", getmanager_detail_tag);

module.exports = router;
