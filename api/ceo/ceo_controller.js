const authModels = require('./ceo_service');
var moment = require('moment');

exports.signin = (req, res, next) => {
    const { ceoID, ceoPW } = req.body;
    const isInvalidRequest = !ceoID || !ceoPW;
    if (isInvalidRequest) {
        res.status(401)
            .json({ message: 'This is not a valid request.' });
    }
    authModels.signin({ ceoID, ceoPW })
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
    const { ceoID, ceoPW, name } = req.body;
    const isInvalidRequest = !ceoID || !ceoPW || !name;
    if (isInvalidRequest) {
        res.status(401)
            .json({
                data: {},
                message: 'This is not a valid request.'
            });
    }

    authModels.signup({ ceoID, ceoPW, name })
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
