const { getQueen } = require("./comment_service");

module.exports = {
  getQueen: (req, res) => {
    getQueen((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        sucess: 1,
        data: results
      });
    });
  }
}
