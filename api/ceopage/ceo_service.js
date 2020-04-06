const database = require('./sql');
const authenticateUtils = require('../../auth/auth');
const pool = require("../../config/database");
var moment = require('moment');
var forEach = require('async-foreach').forEach;

exports.getuser = (token) => {
    return new Promise((resolve, reject) => {
        const sql = 'select s1.name, content_id, content.name as content from (select name, content_id from ceo left join ceo_content on ceo_content.ceo_id = ceo.id where ceo.id = ?) as s1 left join content on content.id = s1.content_id';
        authenticateUtils.certifyAccessToken(token)
        //authenticateUtils.decodedRefreshToken(token)
            .then(res => {
                pool.query(sql, [res.upk], (err, results, fields) => {
                    console.log(res.upk);
                    if (err) {
                        reject({
                            data: {},
                            message: 'Something wrong in server',
                            status: 501,
                        });
                    } else {
                        const accessToken = token;
                        var name = results[0].name;
                        var content_id = results[0].content_id;
                        var content = results[0].content;
                        resolve({
                              status: 200,
                              message: 'Success',
                              data: {
                                 name, content_id, content
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

exports.checkcontent = (information) => {
    const { name, phone, address, category } = information;
    return new Promise((resolve, reject) => {
        const sql = 'select * from content, content_info where content_info.content_id = content.id and category = ? and (name = ? or phone = ? or content_info.address = ?)';
        //authenticateUtils.decodedRefreshToken(token)
                pool.query(sql, [category, name, phone, address], (err, result, fields) => {
                  console.log(category);
                  if (err) { 
                    resolve({
                      data: {},
                      message: 'Something wrong in server',
                      status: 501,
                    });
                  }
                  console.log(result.length);
                  if (result.length > 0) {
                    reject({
                      status: 401,
                      data: {},
                      message: 'User id is already exist.'
                    });
                  } else {
                    resolve();
                  }
               });
    });
};

exports.content = (token, info) => {
    const { category, name, information, address, phone, day, s_time, e_time, latitude, longitude, comment, address_info } = info;
    const sql = 'INSERT INTO content (id, category, name, information, address, date) VALUES ((select ifnull(max(id) + 1, 1) from content as u), ?, ?, ?, ?, curdate())';
    const ins_sql = 'INSERT INTO content_info (id, phone, day, s_time, e_time, latitude, longitude, content_id, comment, address) VALUES ((select ifnull(max(id) + 1, 1) from content_info as u), ?, ?, ?, ?, ?, ?, (select max(id) from content as u), ?, ?)';
    const ceo_sql = 'INSERT INTO ceo_content (ceo_id, content_id) VALUES (?, (select max(id) from content as u))';

    return new Promise((resolve, reject) => {        
        authenticateUtils.certifyAccessToken(token)
        //authenticateUtils.decodedRefreshToken(token)
            .then(res => {
                pool.query(sql, [category, name, information, address], (err, results, fields) => {
                    if (err) {
                        reject({
                            data: {},
                            message: 'Something wrong in server',
                            status: 501,
                        });
                    } else {
                        resolve({
                              status: 200,
                              message: 'Success',
                              data: {
                              }
                        });
                    }
                });
            });
    }).then(() => {
        return new Promise((resolve, reject) => {
          authenticateUtils.certifyAccessToken(token)
           .then(res => {
      
              pool.query(ins_sql, [phone, day, s_time, e_time, latitude, longitude, comment, address_info], (err, result, fields) => {
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
           
         });
      })
    }).then(() => {
        return new Promise((resolve, reject) => {
          authenticateUtils.certifyAccessToken(token)
           .then(res => {
              pool.query(ceo_sql, [res.upk], (err, result, fields) => {
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
         });
      })
    });
};

exports.content_tag = (tag) => {
    const sql = 'INSERT INTO content_tag (id, tag, info_id) VALUES ((select ifnull(max(id) + 1, 1) from content_tag as u), ?, (select max(id) from content as u))';

    return new Promise((resolve, reject) => {
                pool.query(sql, [tag], (err, results, fields) => {
                    if (err) {
                        reject({
                            data: {},
                            message: 'Something wrong in server',
                            status: 501,
                        });
                    } else {
                        resolve({
                              status: 200,
                              message: 'Success',
                              data: {
                                  results
                              }
                        });
                    }
                });
    });
};

exports.content_image = (token) => {
    return new Promise((resolve, reject) => {
        const sql = 'select s1.content_id, image from (select name, content_id from ceo left join ceo_content on ceo_content.ceo_id = ceo.id where ceo.id = ?) as s1 left join content_image on content_image.content_id = s1.content_id)';
        authenticateUtils.certifyAccessToken(token)
        //authenticateUtils.decodedRefreshToken(token)
            .then(res => {
                pool.query(sql, [res.upk], (err, results, fields) => {
                    console.log(res.upk);
                    if (err) {
                        reject({
                            data: {},
                            message: 'Something wrong in server',
                            status: 501,
                        });
                    } else {
                        const accessToken = token;
                        console.log(results);
                        resolve({
                              status: 200,
                              message: 'Success',
                              
                              data: {
                                results
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

exports.content_list = (token) => {
    return new Promise((resolve, reject) => {
        const sql = 'select menu, name, value from ceo_content, content_list where ceo_id = ? and ceo_content.content_id = content_list.content_id';
        authenticateUtils.certifyAccessToken(token)
        //authenticateUtils.decodedRefreshToken(token)
            .then(res => {
                pool.query(sql, [res.upk], (err, results, fields) => {
                    console.log(res.upk);
                    if (err) {
                        reject({
                            data: {},
                            message: 'Something wrong in server',
                            status: 501,
                        });
                    } else {
                        const accessToken = token;
                        var arr = new Array();
                        var list = new Array();
                        forEach(results, function (item, index) {
                            if (index == results.length - 1) {
                                list.push({ "name": results[index].name, "value": results[index].value });
                                arr.push({ "menu": results[index].menu, "list": list });
                            }
                            else {
                                if (results[index].menu == results[index + 1].menu)
                                    list.push({ "name": results[index].name, "value": results[index].value });
                                else {
                                    list.push({ "name": results[index].name, "value": results[index].value });
                                    arr.push({ "menu": results[index].menu, "list": list });
                                    list = [];
                                }
                            }
                        });
                        console.log(results);
                        resolve({
                              status: 200,
                              message: 'Success',
                              
                              data: {
                                arr
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

exports.manager = ({ name, image, information, content_id, start_time, end_time, type, info }) => {
    const sql = 'INSERT INTO content_manager (id, name, image, information, content_id, start_time, end_time, type, info) VALUES ((select ifnull(max(id) + 1, 1) from content_manager as u), ?, ?, ?, ?, ?, ?, ?, ?)';

    return new Promise((resolve, reject) => {
                pool.query(sql, [name, image, information, content_id, start_time, end_time, type, info], (err, results, fields) => {
                    if (err) {
                        reject({
                            data: {},
                            message: 'Something wrong in server',
                            status: 501,
                        });
                    } else {
                        resolve({
                              status: 200,
                              message: 'Success',
                              data: {
                                  results
                              }
                        });
                    }
                });
    });
};

exports.manager_day = (day) => {
    const sql = 'INSERT INTO manager_rest (id, day, manager_id) VALUES ((select ifnull(max(id) + 1, 1) from manager_rest as u), ?, (select max(id) from content_manager as t))';

    return new Promise((resolve, reject) => {
                pool.query(sql, [day], (err, results, fields) => {
                    if (err) {
                        reject({
                            data: {},
                            message: 'Something wrong in server',
                            status: 501,
                        });
                    } else {
                        resolve({
                              status: 200,
                              message: 'Success',
                              data: {
                                  results
                              }
                        });
                    }
                });
    });
};