const authModels = require('./auth_admin');

exports.signin = (req, res, next) => {
    const { adminID, adminPW } = req.body;
    const isInvalidRequest = !adminID || !adminPW;

    if (isInvalidRequest) {
        res.status(401)
            .json({ message: 'This is not a valid request.' });
    }

    authModels.signin({ adminID, adminPW })
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
    const { id, adminID, adminPW } = req.body;
    const isInvalidRequest = !id || !adminID || !adminPW;
    if (isInvalidRequest) {
        res.status(401)
            .json({
                data: {},
                message: 'This is not a valid request.'
            });
    }

    authModels.signup({ id, adminID, adminPW })
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
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
