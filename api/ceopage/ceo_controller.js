const authModels = require('./ceo_service');
var moment = require('moment');

exports.getuser = (req, res, next) => {
    const token = req.headers['x-access-token'];
    authModels.getuser(token)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
};

exports.content_image = (req, res, next) => {
    const token = req.headers['x-access-token'];
    authModels.content_image(token)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
};

exports.checkcontent = (req, res, next) => {
    const { name, phone, address, category } = req.body;

    authModels.checkcontent({ name, phone, address, category })
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
};

exports.content = (req, res, next) => {
    const token = req.headers['x-access-token'];
    const { category, name, information, address, phone, day, s_time, e_time, latitude, longitude, comment, address_info } = req.body;

    authModels.content(token, { category, name, information, address, phone, day, s_time, e_time, latitude, longitude, comment, address_info })
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
};

exports.content_tag = (req, res, next) => {
    const { tag } = req.body;
    console.log(tag);
    authModels.content_tag(tag)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
};

exports.content_list = (req, res, next) => {
    const token = req.headers['x-access-token'];
    authModels.content_list(token)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
};

exports.manager = (req, res, next) => {
    const { name, image, information, content_id, start_time, end_time, type, info } = req.body;

    authModels.manager({ name, image, information, content_id, start_time, end_time, type, info })
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
};

exports.manager_day = (req, res, next) => {
    const { day } = req.body;
    console.log(req.body);
    authModels.manager_day(day)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
};