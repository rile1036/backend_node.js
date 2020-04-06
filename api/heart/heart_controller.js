const authModels = require('./heart_service');
var moment = require('moment');

exports.getcontent = (req, res, next) => {
    const token = req.headers['x-access-token'];
    authModels.getcontent(token)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
};

exports.getmenu = (req, res, next) => {
    const token = req.headers['x-access-token'];
    authModels.getmenu(token)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
};

exports.getmanager = (req, res, next) => {
    const token = req.headers['x-access-token'];
    authModels.getmanager(token)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
};

exports.getstyle = (req, res, next) => {
    const token = req.headers['x-access-token'];
    authModels.getstyle(token)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
};

exports.heart_delete = (req, res, next) => {
    const token = req.headers['x-access-token'];
    const { name, list_id } = req.body;
    authModels.heart_delete(token, {name, list_id})
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
};

exports.heart_insert = (req, res, next) => {
    const token = req.headers['x-access-token'];
    const { name, list_id } = req.body;
    console.log(req.body);
    authModels.heart_insert(token, {name, list_id})
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
};
