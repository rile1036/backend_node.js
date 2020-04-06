const pool = require("../../config/database");

module.exports = {
  getYoutube: callBack => {
    pool.query(
      `select id, name, address, category, current, view from youtube order by current desc limit 6`,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getYoutube_category: (category, callBack) => {
    pool.query(
      `select id, name, address, category, current, view from youtube where category = ? order by current desc limit 6`,
      [category],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getYoutube_id: (id, callBack) => {
    pool.query(
      `select id, name, address, category, current, view from youtube where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getstory: (category, callBack) => {
    pool.query(
      `select name, address, current, view from youtube where category = ? order by current desc limit 4`,
      [category],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getpick: (category, callBack) => {
    pool.query(
      `select s4.id, s4.category, s4.name, s4.date, (select count(list_id) from heart where heart.name = "매장" and heart.list_id = s4.id) as heart, s4.Star_avg, s4.Star_num, s4.information, s4.address, s4.discount, s4.value as coupon, type, image from (select s3.id, s3.category, s3.date, s3.name, s3.Star_avg, s3.Star_num, s3.information, s3.address, discount, value, type from (select s2.id, s2.category, s2.name, s2.date, s2.Star_avg, s2.Star_num, s2.information, s2.address, value as discount from (select s1.id, s1.date, s1.category, s1.name, s1.information, s1.address , ifnull(round(avg(star),1),0) as Star_avg, count(star) as Star_num from (select content.id, content.date, category, name, information, address from pick, content where pick.content_id = content.id) as s1 left join (select content_id, star from reserve, comment where reserve.id = comment.reserve_id) as comment on comment.content_id = s1.id group by id) as s2 left join discount on discount.content_id = s2.id order by discount desc) as s3 left join coupon on s3.id = coupon.content_id group by id) as s4 left join content_image on content_image.content_id = s4.id where category = ?`,
      //`select s2.id, s2.name, s2.category, s2.information, s2.Star_avg, s2.Star_num, s2.heart, s2.address, image from (select s1.id, s1.name, s1.information, if(s1.category = 2, 1, 1) as category, ifnull(round(avg(star), 1), 0) as Star_avg, count(star) as Star_num, s1.heart, s1.address from (select content.id, content.name, content.category, content.information, content.heart, content.address from pick, content where content.id = pick.content_id) as s1 left join (select star, content_id from reserve, comment where comment.reserve_id = reserve.id) as comment on comment.content_id = s1.id group by s1.id) as s2 left join content_image on s2.id = content_image.content_id where category = ?`,
      [category],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getstorydis: callBack => {
    pool.query(
      `select content.id, discount.value from content, discount, pick where discount.content_id = content.id and pick.content_id = content.id`,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, result);
      }
    );
  },
}
