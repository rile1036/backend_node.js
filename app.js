const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const cors = require('cors');
require("dotenv").config();
const userRouter = require("./api/users/user_router");
const searchRouter = require("./api/searchs/search_router");
const adminRouter = require("./api/admin/admin_router");
const uploadRouter = require("./api/upload/upload_router");
const mainwebRouter = require("./api/main_web_page/main_web_page_router");
const contentRouter = require("./api/contents/content_router");
const commentRouter = require("./api/comment/comment_router");
const youtubeRouter = require("./api/youtube/youtube_router");
const detailRouter = require("./api/content_detail/content_router");
const mypageRouter = require("./api/mypage/mypage_router");
const heartRouter = require("./api/heart/heart_router");
const reserveRouter = require("./api/reserve/reserve_router");
const ceoRouter = require("./api/ceo/ceo_router");
const ceopageRouter = require("./api/ceopage/mypage_router");

app.use(express.json());
app.use(cors());
//app.use(cors(corsOption));

app.use("/api/users", userRouter);
app.use("/api/search", searchRouter);
app.use("/api/admin", adminRouter);
app.use("/api/upload", uploadRouter);
app.use("/api", mainwebRouter);
app.use("/api/content", contentRouter);
app.use("/api/comment", commentRouter);
app.use("/api", youtubeRouter);
app.use("/api/detail", detailRouter);
app.use("/api/mypage", mypageRouter);
app.use("/api/heart", heartRouter);
app.use("/api/reserve", reserveRouter);
app.use("/api/ceo", ceoRouter);
app.use("/api/ceopage", ceopageRouter);

app.listen(process.env.APP_PORT, () => {
  console.log('PORT Check')
});
