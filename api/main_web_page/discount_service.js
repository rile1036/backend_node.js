const pool = require("../../config/database");

module.exports = {
  create: (data, callBack) => {
    pool.query(
      `insert into discount(id, value, currentDate, discountDate, content_id, list_id) values(?,?,NOW(),?,?,?)`,
      [
        data.id,
        data.value,
        data.discountDate,
        data.content_id,
        data.list_id
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getLists: callBack => {
    pool.query(
      `select s2.id, s2.name, s2.information, s2.address, s2.date, s2.value, s2.image, ifnull(round(avg(star), 1), 0) as Star_avg, count(star) as Star_num, (select count(list_id) from heart where heart.name = "매장" and heart.list_id = s2.id) as heart from (select s1.id, s1.name, s1.date, s1.information, s1.address, max(s1.value) as value, image from (select content.id, content.date, content.name, content.information, content.address, category, discount.value from discount, content where content.id = discount.content_id group by name order by value desc) as s1, content_image where s1.id = content_image.content_id group by category) as s2 left join (select comment.reserve_id, reserve.id, star, reserve.content_id from comment, reserve where comment.reserve_id = reserve.id) as comment on comment.content_id = s2.id group by s2.id`,
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
