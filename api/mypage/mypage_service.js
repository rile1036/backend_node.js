const database = require('./sql');
const authenticateUtils = require('../../auth/auth');
const pool = require("../../config/database");
var moment = require('moment');
var forEach = require('async-foreach').forEach;

exports.getevent = (token) => {
    return new Promise((resolve, reject) => {
        var event_arr = new Array();
        const sql = 'select event.id, event.type, event.value, event.name, event.start, event.end, event.title, event.sub_name, event.information, event.type, event.kind, mycoupon.user_id as receive from event left join (select * from mycoupon where user_id = ? and mycoupon.coupon_type = true) as mycoupon on mycoupon.coupon_id = event.id where type = false union select event.id, event.type, event.value, event.name, event.start, event.end, event.title, event.sub_name, event.information, event.type, event.kind, mysaving.user_id as receive from event left join (select * from mysaving where user_id = ?) as mysaving on mysaving.saving_id = event.id where type = true';
        authenticateUtils.certifyAccessToken(token)
        //authenticateUtils.decodedRefreshToken(token)
            .then(res => {
                pool.query(sql, [res.upk, res.upk], (err, results, fields) => {
                    if (err) {
                        resolve({
                            data: {},
                            message: 'Something wrong in server',
                            status: 501,
                        });
                    } else {
                        forEach(results, function (item, index) {
                        if (results[index].type == 0) {
                          if (results[index].receive == null) {
                            if (results[index].kind == false) 
                              event_arr.push({ "id": results[index].id, "type": "%", "kind": "쿠폰", "value": results[index].value, "name": results[index].name, "start": results[index].start, "end": results[index].end, "title": results[index].title, "sub_name": results[index].sub_name, "information": results[index].information, "receive": false });
                            else
                              event_arr.push({ "id": results[index].id, "type": "%", "kind": "적립금", "value": results[index].value, "name": results[index].name, "start": results[index].start, "end": results[index].end, "title": results[index].title, "sub_name": results[index].sub_name, "information": results[index].information, "receive": false });
                          }
                          else {
                            if (results[index].kind == false) 
                              event_arr.push({ "id": results[index].id, "type": "%", "kind": "쿠폰" , "value": results[index].value, "name": results[index].name, "start": results[index].start, "end": results[index].end, "title": results[index].title, "sub_name": results[index].sub_name, "information": results[index].information, "receive": true });
                            else  
                              event_arr.push({ "id": results[index].id, "type": "%", "kind": "적립금", "value": results[index].value, "name": results[index].name, "start": results[index].start, "end": results[index].end, "title": results[index].title, "sub_name": results[index].sub_name, "information": results[index].information, "receive": true });
                          }
                        }
                        if (results[index].type == 1) {
                          if (results[index].receive == null) {
                            if (results[index].kind == false) 
                              event_arr.push({ "id": results[index].id, "type": "원", "kind": "쿠폰", "value": results[index].value, "name": results[index].name, "start": results[index].start, "end": results[index].end, "title": results[index].title, "sub_name": results[index].sub_name, "information": results[index].information, "receive": false });
                            else
                              event_arr.push({ "id": results[index].id, "type": "원", "kind": "적립금", "value": results[index].value, "name": results[index].name, "start": results[index].start, "end": results[index].end, "title": results[index].title, "sub_name": results[index].sub_name, "information": results[index].information, "receive": false });
                          }
                          else {
                            if (results[index].kind == false) 
                              event_arr.push({ "id": results[index].id, "type": "원", "kind": "쿠폰" , "value": results[index].value, "name": results[index].name, "start": results[index].start, "end": results[index].end, "title": results[index].title, "sub_name": results[index].sub_name, "information": results[index].information, "receive": true });
                            else
                              event_arr.push({ "id": results[index].id, "type": "원", "kind": "적립금", "value": results[index].value, "name": results[index].name, "start": results[index].start, "end": results[index].end, "title": results[index].title, "sub_name": results[index].sub_name, "information": results[index].information, "receive": true });
                          }
                        }
                        });
                        event_arr.sort(function(a, b) {
                          return a["id"] - b["id"];
                        });                       
                        const accessToken = token;
                        resolve({
                              status: 200,
                              message: 'Success',
                              data: {
                                   event_arr,
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


exports.getuser = (token) => {
    return new Promise((resolve, reject) => {
        const sql = 'select * from (select user.id, username, image from user left join user_image on user_image.user_id = user.id) as s1 where s1.id = ?';
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
                        var username = results[0].username;
                        var image = results[0].image;
                        resolve({
                              status: 200,
                              message: 'Success',
                              data: {
                                 username, image
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

exports.getcoupon = (token) => {
    return new Promise((resolve, reject) => {
        var coupon = new Array();
	var coupon_arr = new Array();
        const sql = 'select * from (select user.id, name, value, type, start_date, end_date from event, mycoupon, user where user.id = mycoupon.user_id and coupon_type = false and event.id = mycoupon.coupon_id and now() <= end_date and kind = false union select user.id, name, value, type, start_date, end_date from coupon, mycoupon, user where user.id = mycoupon.user_id and coupon_type = true and coupon.id = mycoupon.coupon_id and now() <= end_date) as s1 where id = ? order by start_date';
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
                        forEach(results, function (item, index) {
                        if (results[index].type == 0)
                            coupon_arr.push({ "id": index, "name": results[index].name, "value": results[index].value + "%", "start_date": results[index].start_date, "end_date": results[index].end_date });
                        else if (results[index].type == 1)
                            coupon_arr.push({ "id": index, "name": results[index].name, "value": results[index].value + "원", "start_date": results[index].start_date, "end_date": results[index].end_date });
                        });                        
                        const accessToken = token;
                        var coupon_num = results.length;
                        resolve({
                              status: 200,
                              message: 'Success',
                              data: {
                                 coupon_num,
                                 coupon_arr
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

exports.getsaving = (token) => {
    return new Promise((resolve, reject) => {
        const sql = 'select * from my_saving where user_id = ? order by id desc';
        //const sql = 'select * from (select user.id, name, start_date, end_date, value from user, mysaving, event where user.id = mysaving.user_id and event.type = 1 and mysaving.saving_id = event.id union select user_id, "후기", comment_date, end_date, ifnull(image, 100) from (select s1.id, user_id, comment_date, date_add(comment_date, interval 1 month) as end_date, image from (select comment.id, user_id, comment_date from comment, reserve where comment.reserve_id = reserve.id) as s1 left join comment_image on comment_image.comment_id = s1.id) as s2) as s3 where id = ? order by start_date';   
        authenticateUtils.certifyAccessToken(token)
        //authenticateUtils.decodedRefreshToken(token)
            .then(res => {
                pool.query(sql, [res.upk], (err, results, fields) => {
                    if (token == '') {
                        resolve({
                            data: {},
                            message: 'Something wrong in server',
                            status: 501,
                        });
                    } else {
                        var all_saving = 0;
                        var min_saving = 0;
                        var saving = new Array();
                        forEach(results, function (item, index) {
                            console.log(results[index].type);
                            if (results[index].type == "-") {
                              min_saving += results[index].value;
                              saving.push({ "id": index, "name": results[index].name + " 적립금", "type": results[index].type, "value": results[index].value, "start_date": results[index].start_date, "end_date": results[index].end_date });
                            }
                            else {
                              all_saving += results[index].value;
                              saving.push({ "id": index, "name": results[index].name + " 적립금", "type": results[index].type, "value": results[index].value, "start_date": results[index].start_date, "end_date": results[index].end_date });
                            }
                        });
                        all_saving -= min_saving;
                        const accessToken = token;
                        resolve({
                              status: 200,
                              message: 'Success',
                              data: {
                                   all_saving,
                                   saving
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

/*
exports.getsaving = (token) => {
    return new Promise((resolve, reject) => {
        const sql = 'select * from (select user.id, name, start_date, end_date, value from user, mysaving, event where user.id = mysaving.user_id and event.type = 1 and mysaving.saving_id = event.id union select user_id, "후기", comment_date, end_date, ifnull(image, 100) from (select s1.id, user_id, comment_date, date_add(comment_date, interval 1 month) as end_date, image from (select comment.id, user_id, comment_date from comment, reserve where comment.reserve_id = reserve.id) as s1 left join comment_image on comment_image.comment_id = s1.id) as s2) as s3 where id = ? order by start_date';   
        authenticateUtils.certifyAccessToken(token)
        //authenticateUtils.decodedRefreshToken(token)
            .then(res => {
                pool.query(sql, [res.upk], (err, results, fields) => {
                    if (err) {
                        reject({
                            data: {},
                            message: 'Something wrong in server',
                            status: 501,
                        });
                    } else {
                        var all_saving = 0;
                        var saving = new Array();
                        forEach(results, function (item, index) {
                            if (isNaN(results[index].value) == true)
                                 results[index].value = "500";
                            all_saving += parseInt(results[index].value);
                            saving.push({ "id": index, "name": results[index].name + " 적립금", "value": results[index].value, "start_date": results[index].start_date, "end_date": results[index].end_date });
                        });
                     
                        const accessToken = token;
                        resolve({
                              status: 200,
                              message: 'Success',
                              data: {
       				   all_saving,
                                   saving
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
*/
exports.getreview = (token) => {
    return new Promise((resolve, reject) => {
        const sql = 'select s2.id, s2.content_name, s2.list_name, s2.image, comment.id as review from (select s1.id, s1.content_name, s1.list_name, s1.reserve_date, content_list_image.image from (select reserve.reserve_date, reserve.id, content.name as content_name, content_list.id as list_id, content_list.name as list_name from reserve, content, content_list where content.id = reserve.content_id and content_list.id = reserve.list_id and user_id = ?) as s1 left join content_list_image on s1.list_id  = content_list_image.list_id) as s2 left join comment on s2.id = comment.reserve_id order by reserve_date desc, review'
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
                        var review = new Array();
                        forEach(results, function (item, index) {
                            if (results[index].review == null) {
                                if (results[index].image == null)
                                     review.push({ "id": results[index].id, "content": results[index].content_name, "list_name": results[index].list_name, "review": false});
                                else
                                     review.push({ "id": results[index].id, "content": results[index].content_name, "list_name": results[index].list_name, "image": results[index].image, "review": false });
                            }
                            else {
                                if (results[index].image == null)
                                    review.push({ "id": results[index].id, "content": results[index].content_name, "list_name": results[index].list_name, "review": true });
                                else
                                    review.push({ "id": results[index].id, "content": results[index].content_name, "list_name": results[index].list_name, "image": results[index].image, "review": true });
                            }
                        });
                        const accessToken = token;
                        resolve({
                              status: 200,
                              message: 'Success',
                              data:  review
                              
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

exports.getreview_complete = (token) => {
    return new Promise((resolve, reject) => {
        const sql = 'select s1.id, s1.name, s1.manager_name, s1.star, s1.username, s1.comment_date, s1.text, image from (select comment.id, content_list.name, content_manager.name as manager_name, star, user.username, comment_date, text from comment, reserve, content_list, content_manager, user where comment.reserve_id = reserve.id and reserve.list_id = content_list.id and reserve.manager_id = content_manager.id and reserve.user_id = user.id and user_id = ?) as s1 left join comment_image on comment_image.comment_id = s1.id';
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
			var reviewed = new Array();
      			forEach(results, function (item, index) {
         		    if (results[index].image == null)
          			reviewed.push({ "id": results[index].id, "name": results[index].name, "manager": results[index].manager_name, "star": results[index].star, "username": results[index].username, "date": results[index].comment_date, "text": results[index].text });
        		    else
          			reviewed.push({ "id": results[index].id, "name": results[index].name, "manager": results[index].manager_name, "star": results[index].star, "username": results[index].username, "date": results[index].comment_date, "text": results[index].text, "image": results[index].image });
      			});
                        const accessToken = token;
                        /* return res.json({
                          sucess: 1,
                          data: reviewed
                        });*/
                        resolve({
                              status: 200,
                              message: 'Success',
                              data: reviewed,
                             
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

exports.getnotice = (token) => {
    return new Promise((resolve, reject) => {
        const sql = 'select * from notice';
        authenticateUtils.certifyAccessToken(token)
        //authenticateUtils.decodedRefreshToken(token)
            .then(res => {
                pool.query(sql, [], (err, results, fields) => {
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

exports.getquestion = (token) => {
    return new Promise((resolve, reject) => {
        const sql = 'select question.id, question.item, question.title, question.info, question.date, question.complete, image from question left join question_image on question_image.q_id = question.id where user_id = ?';
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
                        var question = new Array();
                        var image = new Array();
                        forEach(results, function (item, index) {
                            if (results[index].image == null)
                                question.push({ "id": results[index].id, "item": results[index].item, "title": results[index].title, "info": results[index].info, "date": results[index].date, "complete": results[index].complete, "comment": results[index].test });
                            else
                                if (index != results.length - 1) {
                                    if (results[index].id == results[index + 1].id)
                                         image.push(results[index].image);
                                    else {
                                         image.push(results[index].image);
                                         question.push({ "id": results[index].id, "item": results[index].item, "title": results[index].title, "info": results[index].info, "date": results[index].date, "complete": results[index].complete, "comment": results[index].test, "image": image });
                                         image = [];
                                    }
                                }
                                else {
                                    image.push(results[index].image);
                                    question.push({ "id": results[index].id, "item": results[index].item, "title": results[index].title, "info": results[index].info, "date": results[index].date, "complete": results[index].complete, "comment": results[index].test, "image": image });
                                }
                        });
                        const accessToken = token;
                        resolve({
                              status: 200,
                              message: 'Success',
                              data: {
                                   question,
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
