const authModels = require('./reserve_service');
var moment = require('moment');

exports.getreserve = (req, res, next) => {
    const token = req.headers['x-access-token'];
    authModels.getreserve(token)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
};

exports.getreserve_coupon = (req, res, next) => {
    const content_id = req.params.content_id;
    const token = req.headers['x-access-token'];
    authModels.getreserve_coupon(content_id,token)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
};

exports.reserve = (req, res, next) => {
    const token = req.headers['x-access-token'];
    const { content_id, list_id, manager_id, payment, point, value, coupon_id, coupon_type, reserve_date } = req.body;
    authModels.reserve(token, { content_id, list_id, manager_id, payment, point, value, coupon_id, coupon_type, reserve_date } )
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
};


exports.review = (req, res, next) => {
    const token = req.headers['x-access-token'];
    const { star, text, reserve_id, image } = req.body;

    authModels.review(token, { star, text, reserve_id, image } )
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
};