const database = require('./sql');
//const connection = database.connection();
const authenticateUtils = require('../../auth/auth');
const pool = require("../../config/database");
var moment = require('moment');

exports.signin = (information) => {
    const { ceoID, ceoPW } = information;
    const sql = `SELECT * FROM ceo WHERE ceoID = ?`;
    return new Promise((resolve, reject) => {
        pool.query(sql, [ceoID], (err, result, fields) => {
            if (err) {
                reject({
                    data: {},
                    message: 'Wrong server',
                    status: 501,
                });
            }
            if (result === undefined) {
                reject({
                    status: 401,
                    data: {},
                    message: 'user information not exist.'
                });
            } else {
                //console.log(result[0]);
                const isMatchPassword = authenticateUtils.certifyPassword(ceoPW, result[0].ceoPW);

                if (isMatchPassword) {
                    const upk = result[0].id;
                    const { ceoPW, refreshtoken } = result[0];
                    const accessToken = authenticateUtils.generateAccessToken({ ceoID, upk });
                    const refreshToken = authenticateUtils.generateRefreshToken({ ceoID, ceoPW });
                    const sql2 = `update ceo set refreshtoken = ?, refreshdate = ? where id = ?`;
                    var cur_time = moment().add(40, 's').format('YYYY-MM-DD HH:mm:ss');
                    //var limit_time = cur_time.add(40,'s');
                    pool.query(sql2, [refreshToken, cur_time, upk],function (err, results, fields) {
                        if (err) throw err;
                        console.log(results);
                    });
                    resolve({
                        status: 200,
                        data: {
                            accessToken,
                            refreshToken,
                            cur_time
                        },
                        message: 'User information matched.'
                    });
                } else {
                    var Fail = "Fail Login";
                    resolve({
                        status: 401,
                        data: {Fail},
                        message: 'User information isn`t matched.'
                    });
                   
                }
            }
        })
    });
};

exports.signup = (information) => {
    const { id, ceoID, ceoPW, name } = information;
    const selectSql = `SELECT * FROM ceo WHERE ceoID = ?`;
    const insertSql = `INSERT INTO ceo (id, ceoID, ceoPW, name) VALUES ((select ifnull(max(id) + 1, 1) from ceo as u), ?, ?, ?)`;

    return new Promise((resolve, reject) => {
        pool.query(selectSql, [ceoID], (err, result, fields) => {
            if (err) {
                resolve({
                    data: {},
                    message: 'Something wrong in server',
                    status: 501,
                });
            }
            console.log(ceoID);
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
    }).then(() => {
        const encryptedPassword = authenticateUtils.encryptPassword(ceoPW);
        console.log(encryptedPassword);
        return new Promise((resolve, reject) => {
            pool.query(insertSql, [ceoID, encryptedPassword, name], (err, result, fields) => {
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
};

exports.certifyUser = (token) => {
    return authenticateUtils.certifyAccessToken(token)
        .then(res => {
            return Promise.resolve({
                status: 200,
                data: res,
                message: 'Success',
            });
        })
        .catch(err => {
            return Promise.reject({
                data: {},
                message: 'This token is invalid.',
                status: 401,
            });
        });
};

exports.reissuanceAccessToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM ceo WHERE refreshtoken = ?';
        authenticateUtils.decodedRefreshToken(refreshToken)
            .then(res => {
                pool.query(sql, [refreshToken], (err, result, fields) => {
                    if (err) {
                        reject({
                            data: {},
                            message: 'Something wrong in server',
                            status: 501,
                        });
                    } else {
                        const { userID, id: upk, ceoPW, name, refreshtoken, refreshdate } = result[0];
                        authenticateUtils.certifyRefreshToken(refreshToken, ceoPW)
                            .then(res => {
                                const accessToken = authenticateUtils.generateAccessToken({ ceoID, upk, name });
                                const refreshToken = result[0].refreshtoken;
                                //const sql2 = `update user set refreshtoken = ?, refreshdate = ? where refreshtoken = ?`;
                                var cur_time = moment().add(40, 's').format('YYYY-MM-DD HH:mm:ss');
                                var checktime = moment(moment(result[0].refreshdate,"YYYY-MM-DDTHH:mm:ssZ").diff(moment(),"YYYY-MM-DDTHH:mm:ssZ"));
                               /* if (checktime / 1000 > 0) {
                                    pool.query(sql2, [refreshToken, cur_time, result[0].refreshtoken],function (err, results, fields) {
                                        if (err) throw err;
                                        console.log(results);
                                    });*/
                                    resolve({
                                        status: 200,
                                        message: 'Success',
                                        data: {
                                            accessToken,
                                       //    refreshToken,
                                            cur_time
                                        }
                                    });
                                /*}
                                else {
                                    resolve({
                                        status: 400,
                                        message: 'It`s invalid token.'
                                    });
                                }*/
                            })
                            .catch(err => {
                                resolve({
                                    status: 400,
                                    message: 'It`s invalid token.'
                                });
                            });
                    }
                });
            });
    });
};
