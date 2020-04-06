const pool = require("../../config/database");

module.exports = {
  getheader: ([list_id, id], callBack) => {
    pool.query(
      `select content.id, content.name, (select count(heart.id) from heart, content where heart.list_id = content.id and heart.name = "매장" and heart.list_id = ?) as heart, content_image.image from content, content_image where content.id = content_image.content_id and content.id = ?`,
      //`select content.id, content.name, content.heart, content_image.image from content, content_image where content.id = content_image.content_id and content.id = ?`,
      [list_id, id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getstyle: (id, callBack) => {
    pool.query(
      `select content_list.id as style_id, image from content_list_image, content_list where content_list_image.list_id = content_list.id and content_list.content_id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getmenu: (content_id, callBack) => {
    pool.query(
      `select content_list.id, content_list.menu, content_list.name as cont_name, content_list.value as cont_value, content_list.time, discount.value, content_list_image.image from content_list left join discount on content_list.id = discount.list_id left join content_list_image on content_list.id = content_list_image.list_id where content_list.content_id = ? order by content_list.id`,
      [content_id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getmanager: (id, callBack) => {
    pool.query(
      `select s1.id, name, image, information, Star_avg, Star_num, (select count(list_id) from heart where heart.name = "디자이너" and heart.list_id = s1.id) as heart from (select content_manager.id, content_manager.name, content_manager.image, content_manager.information, ifnull(round(avg(comment.star),1),0) as Star_avg, count(comment.star) as Star_num from content_manager left join (select star, list_id, manager_id from comment, reserve where comment.reserve_id = reserve.id) as comment on comment.manager_id = content_manager.id where content_manager.content_id = 1 group by name) as s1`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getmap: (id, callBack) => {
    pool.query(
      `select content_info.phone, content_info.day, content_info.s_time, content_info.e_time, content_info.address, content_info.latitude, content_info.longitude, content_info.comment, content_tag.tag from content_info, content_tag where content_tag.info_id = content_info.id and content_id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getallcomment: (id, callBack) => {
    pool.query(
      `select id, menu, ifnull(round(avg(star),1), 0) as Star_avg,count(star) as Star_num from (select id, menu from content_list where content_id = ?) as s1 left join (select list_id, star from comment, reserve where comment.reserve_id = reserve.id) as reserve on reserve.list_id = s1.id group by menu`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getphotocomment: (id, callBack) => {
    pool.query(
      `select comment.id, image from comment, comment_image,reserve where comment.id = comment_image.comment_id and comment.reserve_id = reserve.id and reserve.content_id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getcomment: (id, callBack) => {
    pool.query(
      `select s1.id, s1.username, s1.menu, s1.name, s1.managername, s1.comment_date, s1.star, s1.text, image from (select comment.id, user.username, content_list.menu, content_list.name, content_manager.name as managername, comment.comment_date, star, text from comment, reserve, user, content_manager, content_list where comment.reserve_id = reserve.id and reserve.user_id = user.id and reserve.manager_id = content_manager.id and reserve.list_id = content_list.id and reserve.content_id = ?) as s1 left join comment_image on s1.id = comment_image.comment_id order by comment_date desc`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getdetail_list: ([content_id, id], callBack) => {
    pool.query(
      `select content_list.id, content_list.menu, content_list.name as cont_name, content_list.value as cont_value, content_list.time, discount.value, content_list_image.image from content_list left join discount on content_list.id = discount.list_id left join content_list_image on content_list.id = content_list_image.list_id where content_list.content_id = ? and content_list.id = ?`,
      [content_id, id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getdetail_info: ([content_id, id], callBack) => {
    pool.query(
      `select s5.id, s5.list_id, s5.detail_id, s5.info_id, s5.image, s5.name, s5.menu, s5.value, s5.discount, s5.time, s5.information, s5.title, s5.type, (select count(list_id) from heart where heart.name = "메뉴" and heart.list_id = s5.id) as heart, s5.info, list_detail_info_value.value as info_value from (select s4.id, s4.list_id, s4.detail_id, list_detail_info.id as info_id, s4.image, s4.name, s4.menu, s4.value, s4.discount, s4.time, s4.information, s4.title, s4.type, list_detail_info.info from (select s2.id, s2.list_id, list_detail.id as detail_id, s2.image, s2.name, s2.menu, s2.value, s2.discount, s2.time, s2.information,list_detail.title, list_detail.type from (select s3.id, s3.list_id, s3.name, s3.menu, s3.value, s3.discount, s3.time, s3.information, content_list_image.image from (select s1.id, s1.list_id, s1.name, s1.menu, s1.value, discount.value as discount, s1.time, s1.information from (select content.id, content_list.id as list_id, content.name, content_list.name as menu, value, time, content_list.information from content, content_list where content.id = content_list.content_id and content.id = ? and content_list.id = ?) as s1 left join discount on discount.content_id = s1.id and discount.list_id = s1.list_id) as s3 left join content_list_image on content_list_image.list_id = s3.list_id) as s2 left join list_detail on s2.list_id = list_detail.list_id) as s4 left join list_detail_info on s4.detail_id = list_detail_info.detail_id) as s5 left join list_detail_info_value on list_detail_info_value.info_id = s5.info_id and s5.type = true order by s5.detail_id`,
      [content_id, id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getdetail_comment: ([content_id, id], callBack) => {
    pool.query(
      `select s1.id, s1.username, s1.menu, s1.name, s1.managername, s1.comment_date, s1.star, s1.text, image from (select comment.id, user.username, content_list.menu, content_list.name, content_manager.name as managername, comment.comment_date, star, text from comment, reserve, user, content_manager, content_list where comment.reserve_id = reserve.id and reserve.user_id = user.id and reserve.manager_id = content_manager.id and reserve.list_id = content_list.id and reserve.content_id = ? and content_list.id = ?) as s1 left join comment_image on s1.id = comment_image.comment_id order by comment_date desc`,
      [content_id, id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getreserve_date: ([content_id, reserve_date], callBack) => {
    pool.query(
      `select s2.id, s2.image, s2.name, s2.information, s2.start_time, s2.end_time, s2.type, s2.reserve_date, s2.time, day from (select s1.id, s1.image, s1.name, s1.information, s1.start_time, s1.end_time, s1.type, reserve_date, time from (select content_manager.id, content_manager.image, content_manager.name, content_manager.information, content_manager.start_time, content_manager.end_time, content_manager.type from content_manager where content_id = ?) as s1 left join (select reserve.manager_id, reserve_date, time from reserve, content_list where content_list.id = reserve.list_id and date_format(reserve_date, '%y-%m-%d') = date_format(?, '%y-%m-%d')) as reserve on reserve.manager_id = s1.id) as s2 left join manager_rest on s2.id = manager_rest.manager_id`,
      [content_id, reserve_date],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getmanager_detail: (id, callBack) => {
    pool.query(
      `select s1.id, s1.manager_id, s1.image, s1.name, s1.manager_name, ifnull(round(avg(star), 1), 0) as Star_avg, count(star) as Star_num, ifnull((select count(list_id) from heart where heart.name = "디자이너" and heart.list_id = s1.manager_id), 0) as heart, s1.info from (select content_manager.content_id as id, content_manager.id as manager_id, content_manager.image, content.name, content_manager.name as manager_name,content_manager.info from content, content_manager where content_manager.content_id = content.id and content_manager.id = ?) as s1 left join (select manager_id, star from reserve, comment where comment.reserve_id = reserve.id) as reserve on reserve.manager_id = s1.manager_id`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getmanager_style_detail: (id, callBack) => {
    pool.query(
      `select content_list_image.image from content_list_image, content_list, content_manager, content where content_list.id = content_list_image.list_id and content_list.content_id = content.id and content.id = content_manager.content_id and content_manager.id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getmanager_comment_detail: (id, callBack) => {
    pool.query(
      `select s1.id, s1.username, s1.menu, s1.name, s1.managername, s1.comment_date, s1.star, s1.text, image from (select comment.id, user.username, content_list.menu, content_list.name, content_manager.name as managername, comment.comment_date, star, text from comment, reserve, user, content_manager, content_list where comment.reserve_id = reserve.id and reserve.user_id = user.id and reserve.manager_id = content_manager.id and reserve.list_id = content_list.id and reserve.manager_id = ?) as s1 left join comment_image on s1.id = comment_image.comment_id order by comment_date desc`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  } 
};