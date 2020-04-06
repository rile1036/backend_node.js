const { create, getLists } = require("./discount_service");
const { geteventLists } = require("./today_service");

module.exports = {
  create: (req, res) => {
    const body = req.body;
    create(body, (err, results) => {
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
  getLists: (req, res) => {
    getLists((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        sucess: 1,
        data: results
      });
    });
  },
  geteventLists: (req, res) => {
    geteventLists((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        sucess: 1,
        data: results
      });
    });
  },
}
