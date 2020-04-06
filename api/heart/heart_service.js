const database = require('./sql');
const authenticateUtils = require('../../auth/auth');
const pool = require("../../config/database");
var moment = require('moment');
var forEach = require('async-foreach').forEach;

exports.getcontent = (token) => {
    return new Promise((resolve, reject) => {
        const sql = 'select s1.heart_id, s1.id, s1.category, s1.name, s1.information, s1.address, s1.date, (select count(heart.id) from heart where heart.name = "매장" and heart.list_id = s1.id) as heart, ifnull(round(avg(star),1),0) as Star_avg, count(star) as Star_num, s1.image from (select heart.id as heart_id, content.id, content.category, content.name, content.information, content.address, content.date, content_image.image from content, content_image, heart where content.id = content_image.content_id and heart.list_id = content.id and heart.name = "매장" and user_id = ? order by heart.id desc) as s1 left join (select content_id, star from reserve, comment where comment.reserve_id = reserve.id) as reserve on reserve.content_id = s1.id group by id';
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
                        const accessToken = token;
                        resolve({
                              status: 200,
                              message: 'Success',
                              data: {
                                   results,
                              }
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

exports.getmenu = (token) => {
    return new Promise((resolve, reject) => {
        const sql = 'select s2.heart_id, s2.id, s2.menu_id, s2.category, s2.content_id,image, s2.name, s2.menu, s2.value, s2.time, s2.discount from (select s1.heart_id, s1.id, discount.content_id, s1.menu_id, s1.category, s1.name, s1.menu, s1.value, s1.time, discount.value as discount from (select heart.id as heart_id, content.id, content_list.id as menu_id, content.category, content.name, content_list.name as menu, content_list.value, content_list.time from content_list, content, heart where content_list.content_id = content.id and heart.list_id = content_list.id and heart.name = "메뉴" and heart.user_id = ? order by heart.id desc) as s1 left join discount on discount.content_id = s1.id and discount.list_id = s1.menu_id) as s2 left join content_list_image on s2.menu_id = content_list_image.list_id';
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
                        var heartmenu = new Array();
                        forEach(results, function (item, index) {
                           if (results[index].image == null) {
                              if (results[index].discount == null)
                                 heartmenu.push({ "id": results[index].id, "menu_id": results[index].menu_id, "category": results[index].category, "name": results[index].name, "menu": results[index].menu, "value": results[index].value, "time": results[index].time });
                              else
                                 heartmenu.push({ "id": results[index].id, "menu_id": results[index].menu_id, "category": results[index].category,"name": results[index].name, "menu": results[index].menu, "value": results[index].value, "time": results[index].time, "discount": results[index].discount, "discount_value": results[index].value / 100 * ( 100 - results[index].discount) });
                           }
                           else {
                              if (results[index].discount == null)
                                 heartmenu.push({ "id": results[index].id, "menu_id": results[index].menu_id, "category": results[index].category,"name": results[index].name, "menu": results[index].menu, "value": results[index].value, "time": results[index].time, "image": results[index].image });
                              else
                                 heartmenu.push({ "id": results[index].id, "menu_id": results[index].menu_id, "category": results[index].category,"name": results[index].name, "menu": results[index].menu, "value": results[index].value, "time": results[index].time, "discount": results[index].discount, "discount_value": results[index].value / 100 * ( 100 - results[index].discount), "image": results[index].image });
                           }
                        });
                        const accessToken = token;
                        resolve({
                              status: 200,
                              message: 'Success',
                              data: {
                                   heartmenu,
                              }
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

exports.getmanager = (token) => {
    return new Promise((resolve, reject) => {
        const sql = 'select s2.heart_id, s2.id, s2.manager_id, content.category, s2.name, s2.image, s2.information, s2.Star_avg, s2.Star_num, (select count(list_id) from heart where heart.list_id = s2.manager_id and name = "디자이너") as heart from (select s1.heart_id, s1.id, s1.manager_id, s1.name, s1.image, s1.information, ifnull(round(avg(star), 1),0) as Star_avg, count(star) as Star_num from (select heart.id as heart_id, content_manager.content_id as id, content_manager.id as manager_id, content_manager.name, content_manager.image, content_manager.information from heart, content_manager where heart.name = "디자이너" and content_manager.id = heart.list_id order by heart.id desc) as s1 left join (select star, manager_id from reserve, comment where reserve.id = comment.reserve_id) as reserve on reserve.manager_id = s1.manager_id group by s1.heart_id) as s2, content where content.id = s2.id';
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
                        const accessToken = token;
                        resolve({
                              status: 200,
                              message: 'Success',
                              data: {
                                   results,
                              }
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

exports.getstyle = (token) => {
    return new Promise((resolve, reject) => {
        const sql = 'select heart.id as heart_id, content.id, content_list.id as style_id, content.category, content_list_image.list_id, content_list_image.image from heart, content_list_image, content_list, content where heart.name = "스타일" and content_list.id = content_list_image.list_id and content_list.content_id = content.id and content_list_image.id = heart.list_id and user_id = ? order by heart.id desc';
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
                        const accessToken = token;
                        resolve({
                              status: 200,
                              message: 'Success',
                              data: {
                                   results,
                              }
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

exports.heart_delete = (token, information) => {
    const { name, list_id } = information;
    return new Promise((resolve, reject) => {
        const sql = 'delete from heart where user_id = ? and name = ? and list_id = ?';
        authenticateUtils.certifyAccessToken(token)
            .then(res => {
                 pool.query(sql, [res.upk, name, list_id], (err, results, fields) => {
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
                              data: {
                                   results,
                              }
                        });
                    }
                });
            })
    });
};

exports.heart_insert = (token, information) => {
    const { name, list_id } = information;
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO heart (id, user_id, name, list_id) VALUES ((select ifnull(max(id) + 1, 1) from heart as u), ?, ?, ?)`;
        authenticateUtils.certifyAccessToken(token)
        //authenticateUtils.decodedRefreshToken(token)
            .then(res => {
                pool.query(sql, [res.upk, name, list_id], (err, results, fields) => {
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
                              data: {
                                   results,
                              }
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