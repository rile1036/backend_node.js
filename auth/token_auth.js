const authenticateUtils = require('./auth');

module.exports = function (req, res, next) {
    const accessToken = req.headers['x-access-token'];
    if (!accessToken) {
        return res
            .status(400)
            .json({
                data: {},
                message: 'Required access token.'
            });
    }
    return authenticateUtils.certifyAccessToken(accessToken)
        .then(result => {
            req.body.userID = result.userID;
            req.body.refreshtoken = result.refreshtoken;
            req.body.upk = result.upk;
            next();
        })
        .catch(err => {
            const status = 401;
            const message = err.message;
            return res
                .status(status)
                .send({ status, message });
        });
};
