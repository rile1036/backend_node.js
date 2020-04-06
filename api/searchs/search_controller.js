const { getRecent_delete, getRecent_insert, getSearch, getPopular, getRecent } = require("./search_service");
var forEach = require('async-foreach').forEach;

module.exports = {
  getSearch: (req, res) => {
    var arr = new Array();
    const name = req.body.name;
    const category = req.body.category;
    var test_size = category.length;
    forEach(category, function (item, i) {
      setTimeout(function() {
      getSearch([name, req.body.category[i]], (err, results) => {
        forEach(results, function (item, index) {
          console.log(results[index]);
          arr.push(results[index]);
        });
        ///console.log(req.body.category[i]);
        ///console.log(arr);
        if (i == test_size - 1) {
            return res.json ({
            sucess: 1,
            data: arr
        });
        }
      });
      }, 600);
     });
    /*
    getSearch ([name, category], (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(category);
      //forEach(results, function (item, index) {
      //});
      return res.json({
        sucess: 1,
        data: results// search
      });
    });
   ==      const body = req.body;
    getSearch(body.name, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      var search = new Array();
      if (body.name == "")
        search = [];
      else
        forEach(results, function (item, index) {
	  search.push(results[index].name);
        });
      console.log(search);
      return res.json({
        sucess: 1,
        data: search
      });
    });*/
  },
  getPopular: (req, res) => {
    getPopular((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      var arr = new Array();
      forEach(results, function (item, i) {
        arr.push(results[i].word);
      });
      var result = new Array();
      result.push(arr);
      return res.json({
        sucess: 1,
        data: result[0]
      });
    });
  },
  getRecent: (req, res) => {
    const token = req.headers['x-access-token'];
    getRecent(token, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      var arr = new Array();
      /*forEach(results, function (item, i) {
        arr.push(results[i].word);
      });*/
      //var result = new Array();
      //result.push(arr);
      return res.json({
        sucess: 1,
        data: results
      });
    });
  },
  getRecent_delete: (req, res) => {
    const id = req.body.id;
    getRecent_delete(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(id);
      return res.json({
        sucess: 1,
        data: results
      });
    });
  },
  getRecent_insert: (req, res) => {
   // const token = req.headers['x-access-token'];
    const token = req.headers['x-access-token'];
    const word = req.body.word;
      getRecent_insert([word, token], (err, results) => {
        if (err) { return; }
        return res.json ({
          sucess: 1,
          data: results
        });
      });
  },
}
