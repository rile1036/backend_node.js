const { getid, getimage, create } = require("./upload_service");

module.exports = {
    getid: (req, res) => {
        getid((err, results) => {
          if (err) {
            return res.status(500).json({
              sucess: 0,
              message: "Database connect error"
            });
          }
          return res.status(200).json ({
            sucess: 1,
            data: results[0]
          });
        });
    },
  
  getimage: (req, res) => {
    const body = req.body;
    getimage(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          sucess: 0,
          message: "Database connect error"
        });
      }
      return res.status(200).json ({
        sucess: 1,
        data: results
      });
    });
  },
  create: (req, res) => {
    const {image, content_id} = req.body;
    console.log(req.body);
    create({image, content_id}, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          sucess: 0,
          message: "Database connect error"
        });
      }
      return res.status(200).json ({
        sucess: 1,
        data: results
      });
    });
    },
}