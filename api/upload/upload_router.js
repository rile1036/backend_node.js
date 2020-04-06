const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const pool = require("../../config/database");
//const { create } = require("./upload_service");
const { getid, getimage,create } = require("./upload_controller");
//const { create } = require("./upload_service");
var uuid = require('uuid/v4');

var router = require('express').Router();
var keyword;

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region:'ap-northeast-2',
});


const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'mimo-s3/content_name',
   
    key: function (req, file, cb) {
        let extension = path.extname(file.originalname);
        //console.log(file.originalname);
        this.keyword = file.originalname;//uuid() + Date.now().toString() + extension;
        //this.keyword = extension;
        //console.log(this.keyword);
        cb(null, this.keyword);
    },
    acl: 'public-read-write'
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const upload_manager = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'mimo-s3/content_manager',
   
    key: function (req, file, cb) {
        let extension = path.extname(file.originalname);
        this.keyword = file.originalname;
        cb(null, this.keyword);
    },
    acl: 'public-read-write'
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const upload_comment = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'mimo-s3/comment',
   
    key: function (req, file, cb) {
        let extension = path.extname(file.originalname);
        this.keyword = file.originalname;
        cb(null, this.keyword);
    },
    acl: 'public-read-write'
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/', upload.array('file', 5), (req, res) => {
  let imgFile = req.files;
  res.json(imgFile);
});

router.post('/manager', upload_manager.array('file', 5), (req, res) => {
  let imgFile = req.files;
  res.json(imgFile);
});

router.post('/comment', upload_comment.array('file', 1), (req, res) => {
  let imgFile = req.files;
  res.json(imgFile);
});

router.get('/', getimage);
router.get('/id', getid);
router.post('/image',  create);

module.exports = router;