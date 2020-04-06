const { create, create_list, getreserve, getreview, getgrade, getdiscount, getrecommend, getheart } = require("./content_service");
var forEach = require('async-foreach').forEach;

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
  create_list: (req, res) => {
    const body = req.body;
    create_list(body, (err, results) => {
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
  getheart: (req, res) => {
    const token = req.headers['x-access-token'];
    getheart(token, (err, results) => {
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
  /*getgrade: (req, res) => {
    const category = req.params.category;
    getgrade(category, (err, results) => {
      return res.json ({
        sucess: 1,
        data: results
      });
    });
  },
  getreview: (req, res) => {
    const category = req.params.category;
    getreview(category, (err, results) => {
      return res.json ({
        sucess: 1,
        data: results
      });
    });
  },
  getdiscount: (req, res) => {
    const category = req.params.category;
    getdiscount(category, (err, results) => {
      return res.json ({
        sucess: 1,
        data: results
      });
    });
  },
  getrecommend: (req, res) => {
    const category = req.params.category;
    getrecommend(category, (err, results) => {
      return res.json ({
        sucess: 1,
        data: results
      });
    });
  },
  getreserve: (req, res) => {
    const category = req.params.category;
    getreserve(category, (err, results) => {
      return res.json ({
        sucess: 1,
        data: results
      });
    });
  },*/
  getcheck: (req, res) => {
    const test = req.params.check_order;
    const category = req.params.category;
    console.log(test);
    if (test == "reserve") {
      getreserve(category, (err, results) => {
        return res.json ({
          sucess: 1,
          data: results
        });
      });
    }
    else if (test == "recommend") {
      getrecommend(category, (err, results) => {
        return res.json ({
          sucess: 1,
          data: results
        });
      });
    }
    else if (test == "grade") {
      getgrade(category, (err, results) => {
        return res.json ({
          sucess: 1,
          data: results
        });
      });
    }
    else if (test == "review") {
      getreview(category, (err, results) => {
        return res.json ({
          sucess: 1,
          data: results
        });
      });
    }
    else if (test == "discount") {
      getdiscount(category, (err, results) => {
        return res.json ({
          sucess: 1,
          data: results
        });
      });
    }
  },
  getcheck_mobile: (req, res) => {
    const test = req.body.check_order;
    const category = req.body.category;
    var test_size = req.body.category.length;
    var arr = new Array();
    //setTimeout(function() {
    if (test == "reserve") {
     forEach(category, function (item, i) {
      setTimeout(function() {
      getreserve(req.body.category[i], (err, results) => {
        forEach(results, function (item, index) {
          arr.push(results[index]);
        });
        if (i == test_size - 1) {
        if (test_size != 1) {
          arr.sort(function(a, b) {
            return b["reserve_num"] - a["reserve_num"];
          });
        }
        return res.json ({
          sucess: 1,
          data: arr
        });
        }
      });
      }, 200);
     });
    }

    else if (test == "recommend") {
     forEach(category, function (item, i) {
      setTimeout(function() {
      getrecommend(req.body.category[i], (err, results) => {
        forEach(results, function (item, index) {
          arr.push(results[index]);
        });
        if (i == test_size - 1) {
        if (test_size != 1) {
          arr.sort(function(a, b) {
            return b["heart"] - a["heart"];
          });
        }
        return res.json ({
          sucess: 1,
          data: arr  
        });
        }
      });
      }, 200);
     });
    }

    else if (test == "grade") {
     forEach(category, function (item, i) {
      setTimeout(function() {
      getgrade(req.body.category[i], (err, results) => {
        forEach(results, function (item, index) {
          arr.push(results[index]);
        });
        if (i == test_size - 1) {
        if (test_size != 1) {
          arr.sort(function(a, b) {
            return b["Star_avg"] - a["Star_avg"];
          });
        }
        return res.json ({
          sucess: 1,
          data: arr
        });
        }
      });
      }, 200);
     });
    }

    else if (test == "review") {
     forEach(category, function (item, i) {
      setTimeout(function() {
      getreview(req.body.category[i], (err, results) => {
        forEach(results, function (item, index) {
          arr.push(results[index]);
        });
        if (i == test_size - 1) {
        if (test_size != 1) {
          arr.sort(function(a, b) {
            return b["Star_num"] - a["Star_num"];
          });
        }
        return res.json ({
          sucess: 1,
          data: arr
        });
        }
      });
      }, 200);
     });
    }

    else if (test == "discount") {
     forEach(category, function (item, i) {
      setTimeout(function() {
      getdiscount(req.body.category[i], (err, results) => {
        forEach(results, function (item, index) {
          arr.push(results[index]);
        });
        if (i == test_size - 1) {
        if (test_size != 1) {
          arr.sort(function(a, b) {
            return b["discount_value"] - a["discount_value"];
          });
        }
        return res.json ({
          sucess: 1,
          data: arr
        });
        }
      });
      }, 200);
     });
    }
  }
}
