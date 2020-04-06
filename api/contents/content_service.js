const pool = require("../../config/database");
const authenticateUtils = require('../../auth/auth');

module.exports = {
  create: (data, callBack) => {
    pool.query(
      `insert into content(id, category, name, information) values(?,?,?,?)`,
      [
        data.id,
        data.category,
        data.name,
        data.information
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  create_list: (data, callBack) => {
    pool.query(
      `insert into content_list(id, cont_name, cont_value, content_id) values(?,?,?,?)`,
      [
        data.id,
        data.cont_name,
        data.cont_value,
        data.content_id
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getgrade: (category, callBack) => {
    pool.query(
      `select s2.id, s2.name, s2.information, s2.address, ifnull(round(avg(comment.star),1),0) as Star_avg, count(comment.star) as Star_num, (select count(list_id) from content, heart where heart.name = "매장" and heart.list_id = content.id and content.id = s2.id) as heart, s2.image, s2.date, s2.value as discount_value, coupon.value as coupon_value, coupon.type as coupon_type from (select s1.id, s1.name, s1.information, s1.address, s1.value, image, s1.date from (select content.id, content.name, content.information, content.address, discount.value, content.date from content left join discount on content.id = discount.content_id where content.category = ?) as s1, content_image where content_image.content_id = s1.id group by s1.id) as s2 left join (select content_id, star from comment, reserve where comment.reserve_id = reserve.id) as comment on comment.content_id = s2.id left join coupon on coupon.content_id = s2.id group by s2.id order by star_num desc, star_avg desc`,
      [category],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getreview: (category, callBack) => {
    pool.query(
      `select s2.id, s2.name, s2.information, s2.address, ifnull(round(avg(comment.star),1),0) as Star_avg, count(comment.star) as Star_num, s2.date, (select count(list_id) from content, heart where heart.name = "매장" and heart.list_id = content.id and content.id = s2.id) as heart, s2.image, s2.value as discount_value, coupon.value as coupon_value, coupon.type as coupon_type from (select s1.id, s1.name, s1.information, s1.address, s1.date, s1.value, image from (select content.id, content.name, content.information, content.address, content.date, discount.value  from content left join discount on content.id = discount.content_id where content.category = ?) as s1, content_image where content_image.content_id = s1.id group by s1.id) as s2 left join (select content_id, star from comment, reserve where comment.reserve_id = reserve.id) as comment on comment.content_id = s2.id left join coupon on coupon.content_id = s2.id group by s2.id order by star_num desc`,
      [category],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getdiscount: (category, callBack) => {
    pool.query(
      `select s2.id, s2.name, s2.information, s2.address, s2.date, ifnull(round(avg(comment.star),1),0) as Star_avg, count(comment.star) as Star_num, (select count(list_id) from content, heart where heart.name = "매장" and heart.list_id = content.id and content.id = s2.id) as heart, s2.image, s2.value as discount_value, coupon.value as coupon_value, coupon.type as coupon_type from (select s1.id, s1.name, s1.information, s1.address, s1.date, s1.value, image from (select content.id, content.name, content.information, content.address, content.date, discount.value  from content left join discount on content.id = discount.content_id where content.category = ? order by discount.value desc) as s1, content_image where content_image.content_id = s1.id group by s1.id) as s2 left join (select content_id, star from comment, reserve where comment.reserve_id = reserve.id) as comment on comment.content_id = s2.id left join coupon on coupon.content_id = s2.id group by s2.id order by discount_value desc`,
      [category],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getrecommend: (category, callBack) => {
    pool.query(
      `select s2.id, s2.name, s2.information, s2.address, s2.date, ifnull(round(avg(comment.star),1),0) as Star_avg, count(comment.star) as Star_num, (select count(list_id) from content, heart where heart.name = "매장" and heart.list_id = content.id and content.id = s2.id) as heart, s2.image, s2.value as discount_value, coupon.value as coupon_value, coupon.type as coupon_type from (select s1.id, s1.name, s1.information, s1.address, s1.date, s1.value, image from (select content.id, content.name, content.information, content.address, content.date, discount.value  from content left join discount on content.id = discount.content_id where content.category = ?) as s1, content_image where content_image.content_id = s1.id group by s1.id) as s2 left join (select content_id, star from comment, reserve where comment.reserve_id = reserve.id) as comment on comment.content_id = s2.id left join coupon on coupon.content_id = s2.id group by s2.id order by heart desc`,
      [category],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getreserve: (category, callBack) => {
    pool.query(
      `select s3.id, s3.name, s3.information, s3.address, s3.date, s3.Star_avg, s3.Star_num, (select count(list_id) from content, heart where heart.name = "매장" and heart.list_id = content.id and content.id = s3.id) as heart, s3.image, s3.discount_value, s3.coupon_value, s3.coupon_type, count(reserve.id) as reserve_num from (select s2.id, s2.name, s2.information, s2.address, ifnull(round(avg(comment.star),1),0) as Star_avg, count(comment.star) as Star_num, s2.image, s2.date, s2.value as discount_value, coupon.value as coupon_value, coupon.type as coupon_type  from (select s1.id, s1.name, s1.information, s1.date, s1.address, s1.value, image from (select content.id, content.date, content.name, content.information,  content.address, discount.value  from content left join discount on content.id = discount.content_id where content.category = ?) as s1, content_image where content_image.content_id = s1.id group by s1.id) as s2 left join (select content_id, star from comment, reserve where comment.reserve_id = reserve.id) as comment on comment.content_id = s2.id left join coupon on coupon.content_id = s2.id group by s2.id) as s3 left join reserve on s3.id = reserve.content_id group by s3.id order by reserve_num desc`,
      [category],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getheart: (token, callBack) => {
     const sql = 'select name, list_id from heart where user_id = ?';
     if (token != null) {
       authenticateUtils.certifyAccessToken(token)
            .then(res => {
                pool.query(sql, [res.upk], (err, results, fields) => {
                    if (err) {
                      return callBack(error);
                    }
                    return callBack(null, results);
                });
            });
      }
    else {
      var results = new Array();
      results = [];
      return callBack(null, results);
    }
  }
}
