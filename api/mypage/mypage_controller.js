const authModels = require('./mypage_service');
var moment = require('moment');

exports.getevent = (req, res, next) => {
    const token = req.headers['x-access-token'];
    authModels.getevent(token)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
};
 
exports.getcoupon = (req, res, next) => {
    const token = req.headers['x-access-token'];
    authModels.getcoupon(token)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
};

exports.getsaving = (req, res, next) => {
    const token = req.headers['x-access-token'];
    authModels.getsaving(token)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
};

exports.getreview = (req, res, next) => {
    const token = req.headers['x-access-token'];
    authModels.getreview(token)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
};

exports.getreview_complete = (req, res, next) => {
    const token = req.headers['x-access-token'];
    authModels.getreview_complete(token)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
};

exports.getnotice = (req, res, next) => {
    const token = req.headers['x-access-token'];
    authModels.getnotice(token)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
};

exports.getquestion = (req, res, next) => {
    const token = req.headers['x-access-token'];
    authModels.getquestion(token)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            const { status } = err;
            res.status(status)
                .json(err);
        });
};

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
