const pool = require("../../config/database");

module.exports = {
  geteventLists: callBack => {
    pool.query(
      `select s1.id, s1.name, s1.information, s1.address, s1.category, s1.date, s1.Star_avg, s1.Star_num, (select count(list_id) from heart where heart.name = "매장" and heart.list_id = s1.id)as heart, image from (select content.id, content.name, content.date, content.information, content.address, category, ifnull(round(avg(star), 1),0) as Star_avg, count(star) as Star_num from content left join (select comment.reserve_id, reserve.id, star, reserve.content_id from comment, reserve where comment.reserve_id = reserve.id) as comment on comment.content_id = content.id group by content.id order by Star_num desc, Star_avg desc) as s1, content_image where s1.id = content_image.id group by category`,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
};
