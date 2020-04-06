const database = require('./sql');
//const connection = database.connection();
const authenticateUtils = require('../../auth/auth');
const pool = require("../../config/database");

exports.signin = (information) => {
    const { adminID, adminPW } = information;
    const sql = `SELECT * FROM administrator WHERE adminID = ?`;

    return new Promise((resolve, reject) => {
        pool.query(sql, [adminID], (err, result, fields) => {
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
                const isMatchPassword = authenticateUtils.certifyPassword(adminPW, result[0].adminPW);

                if (isMatchPassword) {
                    const upk = result[0].id;
                    const { adminPW } = result[0];
                    const accessToken = authenticateUtils.generateAccessToken({ adminID, upk });
                    const refreshToken = authenticateUtils.generateRefreshToken({ adminID, adminPW });
                    resolve({
                        status: 200,
                        data: {
                            adminID,
                            accessToken,
                            refreshToken
                        },
                        message: 'User information matched.'
                    });
                } else {
                    reject({
                        status: 401,
                        data: {},
                        message: 'User information isn`t matched.'
                    });
                }
            }
        })
    });
};

exports.signup = (information) => {
    const { id, adminID, adminPW } = information;
    const selectSql = `SELECT * FROM administrator WHERE adminID = ?`;
    const insertSql = `INSERT INTO administrator (id, adminID, adminPW) VALUES (?, ?, ?)`;

    return new Promise((resolve, reject) => {
        pool.query(selectSql, [adminID], (err, result, fields) => {
            if (err) {
                reject({
                    data: {},
                    message: 'Something wrong in server',
                    status: 501,
                });
            }

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
        const encryptedPassword = authenticateUtils.encryptPassword(adminPW);
        console.log(encryptedPassword);
        return new Promise((resolve, reject) => {
            pool.query(insertSql, [id, adminID, encryptedPassword], (err, result, fields) => {
                if (err) {
                    reject({
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

exports.signout = (id) => {
    const sql = `DELETE FROM administrator WHERE id = ? `;
    return new Promise((resolve, reject) => {
        pool.query(sql, id, (err, result, fields) => {
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
                    data: {}
                });
            }
        })
    });
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
        const sql = `SELECT * FROM administrator WHERE adminID = ?`;
        authenticateUtils.decodedRefreshToken(refreshToken)
            .then(res => {
                connection.query(sql, [res.adminID], (err, result, fields) => {
                    if (err) {
                        reject({
                            data: {},
                            message: 'Something wrong in server',
                            status: 501,
                        });
                    } else {
                        const { adminID: adminID, id: upk, adminPW } = result[0];
                        authenticateUtils.certifyRefreshToken(refreshToken, userPW)
                            .then(res => {
                                const accessToken = authenticateUtils.generateAccessToken({ adminID, upk });
                                resolve({
                                    status: 200,
                                    message: 'Success',
                                    data: {
                                        accessToken
                                    }
                                });
                            })
                            .catch(err => {
                                reject({
                                    status: 400,
                                    message: 'It`s invalid token.'
                                });
                            });
                    }
                });
            });
    });
};
