const authModels = require('./auth_user');
var moment = require('moment');

exports.signin = (req, res, next) => {
    const { userID, userPW } = req.body;
    const isInvalidRequest = !userID || !userPW;
    if (isInvalidRequest) {
        res.status(401)
            .json({ message: 'This is not a valid request.' });
    }
    authModels.signin({ userID, userPW })
        .then(result => {
            const { status } = result;
            res.status(status)
                .json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
};
exports.signup = (req, res, next) => {
    const { id, userID, userPW, username, phone } = req.body;
    const isInvalidRequest = !id || !userID || !userPW || !username || !phone;
    if (isInvalidRequest) {
        res.status(401)
            .json({
                data: {},
                message: 'This is not a valid request.'
            });
    }
    else {
    authModels.signup({ userID, userPW, username, phone })
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
    }
};

exports.signout = (req, res, next) => {
    const { id } = req.body;

    authModels.signout(id)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
};

exports.certifyUser = (req, res, next) => {
    const token = req.headers['x-access-token'];
    authModels.certifyUser(token)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
};

exports.reissuanceAccessToken = (req, res, next) => {
    const refreshToken = req.headers['x-refresh-token'];
    authModels.reissuanceAccessToken(refreshToken)
        .then(result => {
            console.log(result);
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
};
