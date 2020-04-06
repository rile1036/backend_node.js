const database = require('./sql');
const authenticateUtils = require('../../auth/auth');
const pool = require("../../config/database");
var moment = require('moment');
var forEach = require('async-foreach').forEach;

exports.getreserve = (token) => {
    return new Promise((resolve, reject) => {
        var reserve_arr = new Array();
       // const sql = 'Select s1.id, content.name, content_list.name as menu, content_manager.name as manager, s1.reserve_date, s1.content_id, s1.list_id, s1.manager_id, user.username, user.phone, content_image.image, s1.value, s1.complete from (select reserve.id, reserve.value, reserve.reserve_date, reserve.content_id, reserve.list_id, reserve.manager_id, reserve.user_id, comment.id as complete from reserve left join comment on comment.reserve_id = reserve.id where user_id = ?) as s1, content, content_list, content_manager, content_image, user where content.id = s1.content_id and content_list.id = s1.list_id and content_manager.id = s1.manager_id and user.id = s1.user_id and content_image.content_id = s1.content_id group by s1.id';
        const sql = 'Select s1.id, content.name, content.category, content_list.name as menu, content_manager.name as manager, s1.reserve_date, s1.content_id, s1.list_id, s1.manager_id, user.username, user.phone, s1.value, content_list_image.image, s1.complete from content, content_list, content_manager, user, (select reserve.id, reserve.value, reserve.reserve_date, reserve.content_id, reserve.list_id, reserve.manager_id, reserve.user_id, comment.id as complete from reserve left join comment on comment.reserve_id = reserve.id where user_id = ?) as s1 left join content_list_image on content_list_image.list_id = s1.list_id where content.id = s1.content_id and content_list.id = s1.list_id and content_manager.id = s1.manager_id and user.id = s1.user_id group by s1.id order by reserve_date desc';
        authenticateUtils.certifyAccessToken(token)
        //authenticateUtils.decodedRefreshToken(token)
            .then(res => {
                pool.query(sql, [res.upk], (err, results, fields) => {
                    if (err) {
                        resolve({
                            data: {},
                            message: 'Something wrong in server',
                            status: 501,
                        });
                    } else {
                        console.log(res.upk);
                        forEach(results, function (item, index) {
                        if (results[index].complete == null)
                            reserve_arr.push({ "id": results[index].id, "image": results[index].image, "name": results[index].name, "category": results[index].category, "menu": results[index].menu, "manager": results[index].manager, "date" : results[index].reserve_date, "content_id": results[index].content_id, "menu_id": results[index].list_id, "manager_id": results[index].manager_id, "user": results[index].username, "phone": results[index].phone, "value": results[index].value, "complete": false });
                        else
                            reserve_arr.push({ "id": results[index].id, "image": results[index].image, "name": results[index].name, "category": results[index].category, "menu": results[index].menu, "manager": results[index].manager, "date" : results[index].reserve_date, "content_id": results[index].content_id, "menu_id": results[index].list_id, "manager_id": results[index].manager_id, "user": results[index].username, "phone": results[index].phone, "value": results[index].value, "complete": true });
                        });
                        const accessToken = token;
                        resolve({
                              status: 200,
                              message: 'Success',
                              data: reserve_arr
                        });
                    }
                });
            })
            .catch(err => {
                resolve({
                    status: 400,
                        message: 'It`s invalid token.'
                    });
            });
    });
};

exports.getreserve_coupon = (content_id, token) => {
    const sql = 'select test as coupon_id, coupon_id as id, id as user_id, name, value, type, start_date, end_date from (select mycoupon.id as test, mycoupon.coupon_id, user.id, name, value, type, start_date, end_date from event, mycoupon, user where user.id = mycoupon.user_id and coupon_type = false and event.id = mycoupon.coupon_id and now() <= end_date and kind = false union select mycoupon.id, mycoupon.coupon_id, user.id, name, value, type, start_date, end_date from coupon, mycoupon, user where user.id = mycoupon.user_id and coupon_type = true and coupon.id = mycoupon.coupon_id and now() <= end_date and content_id = ?) as s1 where id = ? order by start_date';

    return new Promise((resolve, reject) => {
        authenticateUtils.certifyAccessToken(token)
        //authenticateUtils.decodedRefreshToken(token)
            .then(res => {
                pool.query(sql, [content_id, res.upk], (err, results, fields) => {
                    if (err) {
                        resolve({
                            data: {},
                            message: 'Something wrong in server',
                            status: 501,
                        });
                    } else {
                        const accessToken = token;
                        resolve({
                              status: 200,
                              message: 'Success',
                              data: results
                        });
                    }
                });
            })
            .catch(err => {
                resolve({
                    status: 400,
                        message: 'It`s invalid token.'
                    });
            });
    });
};

exports.reserve = (token, information) => {
    const { content_id, list_id, manager_id, payment, point, value, coupon_id, coupon_type, reserve_date } = information;
    const deleteSql = `DELETE FROM mycoupon WHERE user_id=? and id =    ?`;
    const insertSql = `INSERT INTO reserve (id, value, reserve_date, content_id, list_id, manager_id, user_id, payment) VALUES ((select ifnull(max(id) + 1, 1) from reserve as u), ?, ?, ?, ?, ?, ?, ?)`;
    const savingSql = `INSERT INTO my_saving (id, user_id, name, start_date, end_date, value, type) VALUES ((select ifnull(max(id) + 1, 1) from my_saving as u), ?, "사용", "", "", ?, "-")`;

    return new Promise((resolve, reject) => {
        authenticateUtils.certifyAccessToken(token)
          .then(res => {
          pool.query(insertSql, [value, reserve_date, content_id, list_id, manager_id, res.upk, payment], (err, result, fields) => {
            if (err) {
                resolve({
                    data: {},
                    message: 'Something wrong in server',
                    status: 501,
                });
            }

            else {
                resolve({
                    status: 200,
                    data: {},
                });
            }
          });
        });
    }).then(() => {
        return new Promise((resolve, reject) => {
          authenticateUtils.certifyAccessToken(token)
           .then(res => {
            if (coupon_id != null){
              pool.query(deleteSql, [res.upk, coupon_id], (err, result, fields) => {
                if (err) {
                    resolve({
                        data: {},
                        message: 'Something wrong',
                        status: 501,
                    });
                } else {
                    resolve({
                        status: 200,
                        message: 'Success',
                        data: {}
                    });
                }
             });
           }
         });
      }).then(() => {
        return new Promise((resolve, reject) => {
          authenticateUtils.certifyAccessToken(token)
           .then(res => {
            if (point != 0){
              pool.query(savingSql, [res.upk, point], (err, result, fields) => {
                if (err) {
                    resolve({
                        data: {},
                        message: 'Something wrong',
                        status: 501,
                    });
                } else {
                    resolve({
                        status: 200,
                        message: 'Success',
                        data: {}
                    });
                }
             });
           }
         });
       });
    });
  });
};

exports.review = (token, information) => {
    const { star, text, reserve_id, image, point } = information;
    const insertSql = `INSERT INTO comment (id, comment_date, star, text, reserve_id) VALUES ((select ifnull(max(id) + 1, 1) from comment as u), curdate(), ?, ?, ? )`;
    const imageSql = `INSERT INTO comment_image (id, image, comment_id) VALUES ((select ifnull(max(id) + 1, 1) from comment_image as u), ?, (select max(id) from comment as u))`;
    const savingSql = `INSERT INTO my_saving (id, user_id, name, start_date, end_date, value, type) VALUES ((select ifnull(max(id) + 1, 1) from my_saving as u), ?, "후기", curdate(), DATE_ADD(curdate(), INTERVAL 1 MONTH), ?, "+")`;

    return new Promise((resolve, reject) => {
        pool.query(insertSql, [star, text, reserve_id], (err, result, fields) => {
            if (err) {
                resolve({
                    data: {result},
                    message: 'Something wrong in server',
                    status: 501,
                });
            }

            else {
                resolve({
                    status: 200,
                    data: {},
                });
            }
          });
    }).then(() => {
        if (image != null){
        return new Promise((resolve, reject) => {
              pool.query(imageSql, [image], (err, result, fields) => {
                if (err) {
                    resolve({
                        data: {result},
                        message: 'Something wrong',
                        status: 501,
                    });
                } else {
                    resolve({
                        status: 200,
                        message: 'Success',
                        data: {}
                    });
                }
             });
         });
        }
    }).then(() => {
        console.log(image);
        if (image == null) {
        return new Promise((resolve, reject) => {
            authenticateUtils.certifyAccessToken(token)
            .then(res => {
              pool.query(savingSql, [res.upk, 100], (err, result, fields) => {
                if (err) {
                    resolve({
                        data: {result},
                        message: 'Something wrong',
                        status: 501,
                    });
                } else {
                    resolve({
                        status: 200,
                        message: 'Success',
                        data: {}
                    });
                }
             });
            });
         });
        }
        else {
            return new Promise((resolve, reject) => {
                authenticateUtils.certifyAccessToken(token)
                .then(res => {
                  pool.query(savingSql, [res.upk, 500], (err, result, fields) => {
                    if (err) {
                        resolve({
                            data: {result},
                            message: 'Something wrong',
                            status: 501,
                        });
                    } else {
                        resolve({
                            status: 200,
                            message: 'Success',
                            data: {}
                        });
                    }
                 });
                });
             });
        }
    });
};

/*
exports.getreserve_detail = (token, id) => {
    return new Promise((resolve, reject) => {
        var reserve_arr = new Array();
        const sql = 'Select s1.id, content.name, content_list.name as menu, content_manager.name as manager, s1.reserve_date, s1.content_id, s1.list_id, s1.manager_id, user.username, user.phone, s1.value, s1.complete from (select reserve.id, reserve.value, reserve.reserve_date, reserve.content_id, reserve.list_id, reserve.manager_id, reserve.user_id, comment.id as complete from reserve left join comment on comment.reserve_id = reserve.id where user_id = ?) as s1, content, content_list, content_manager, user where content.id = s1.content_id and content_list.id = s1.list_id and content_manager.id = s1.manager_id and user.id = s1.user_id and s1.id = 1';
        authenticateUtils.certifyAccessToken(token)
        //authenticateUtils.decodedRefreshToken(token)
            .then(res => {
                pool.query(sql, [res.upk, id], (err, results, fields) => {
                    if (err) {
                        reject({
                            data: {},
                            message: 'Something wrong in server',
                            status: 501,
                        });
                    } else {
                        console.log(id);
                        console.log(res.upk);
                        forEach(results, function (item, index) {
                        if (results[index].complete == null)
                            reserve_arr.push({ "id": results[index].id, "name": results[index].name, "menu": results[index].menu, "manager": results[index].manager, "date" : results[index].reserve_date, "content_id": results[index].content_id, "menu_id": results[index].list_id, "manager_id": results[index].manager_id, "user": results[index].username, "phone": results[index].phone, "value": results[index].value, "complete": false });
                        else
                            reserve_arr.push({ "id": results[index].id, "name": results[index].name, "menu": results[index].menu, "manager": results[index].manager, "date" : results[index].reserve_date, "content_id": results[index].content_id, "menu_id": results[index].list_id, "manager_id": results[index].manager_id, "user": results[index].username, "phone": results[index].phone, "value": results[index].value, "complete": true });
                        });
                        const accessToken = token;
                        resolve({
                              status: 200,
                              message: 'Success',
                              data: reserve_arr[0]
                        });
                    }
                });
            })
            .catch(err => {
                resolve({
                    status: 400,
                        message: 'It`s invalid token.'
                    });
            });
    });
};*/
