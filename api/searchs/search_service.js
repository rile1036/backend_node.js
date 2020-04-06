const pool = require("../../config/database");
const authenticateUtils = require('../../auth/auth');

module.exports = {
  getSearch: ([name, category], callBack) => {
    pool.query(
      `select content_id, s2.category, image, s2.name, information, address, Star_avg, Star_num, (select ifnull(count(heart.id),0) from heart where heart.name = "매장") as heart from (select s1.content_id, s1.category, image, name, information, address, ifnull(round(Avg(star), 1),0) as Star_avg, count(star) as Star_num from (select content_id, category, image, name, information, address, date from content,content_image where content.id = content_image.content_id and name like "%"?"%" group by name) as s1 left join (select content_id as set_id, star from reserve, comment where reserve.id = comment.reserve_id) as reserve on reserve.set_id = content_id group by content_id) as s2 where s2.category = ? group by content_id order by name desc`,
      [name, category],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        
        return callBack(null, results);
      }
    );
  },
  getPopular: callBack => {
    pool.query(
     `select word from search_word group by word order by count(word) desc limit 10`,//like '%${data.name}%'",//like '%?%'`,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getRecent: (token, callBack) => {
    if (token != null) {
      authenticateUtils.certifyAccessToken(token)
            .then(res => {
               pool.query(
                 `select id, word from search_word where user_id = ? order by Date desc limit 10`, [res.upk], (error, results, fields) => {
                   if (error) {
                     callBack(error);
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
  },
  getRecent_delete: (id, callBack) => {
     pool.query(`delete from search_word where id = ?`, [id], (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
    });
  },
  getRecent_insert: ([word, token], callBack) => {
    authenticateUtils.certifyAccessToken(token)
            .then(res => {
               pool.query(
                 `INSERT INTO search_word (id, word, user_id, Date) VALUES ((select ifnull(max(id) + 1, 1) from search_word as u), ?, ?, now())`, [word, res.upk], (error, results, fields) => {
                   if (error) {
                     callBack(error);
                   }
                   console.log(res.upk);
                   console.log(word);
                   return callBack(null, results);
                });
            });
  },
};