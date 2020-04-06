const { getYoutube_id, getYoutube_category, getYoutube, getstory, getpick } = require("./youtube_service");

var forEach = require('async-foreach').forEach;
var fetchVideoInfo = require('youtube-info');

module.exports = {
  getYoutube: (req, res) => {
    getYoutube ((err, results) => {
      var mimoTV = new Array();
      var num = 0;

      //console.log(results.length);
      //for (var index = 0; index < results.length; index++) {
      forEach(results, function (item, index) {
        var key = results[index].address;
        var view = results[index].view;
        var name = results[index].name;
        var curr = results[index].current;
        //var date = results[index].date;
       // fetchVideoInfo(key).then(function (videoInfo) {
          mimoTV.push({ "id": results[index].id, "category": results[index].category, "address": "https://www.youtube.com/watch?v=" + key, "view": view,  "image": "https://i.ytimg.com/vi/" + key + "/maxresdefault.jpg", "date": curr, "name": name});//"name": name, "curr": curr});
          num++;
       //   console.log(num);
          if (num == results.length) {
            return res.json({
              sucess: 1,
              data: mimoTV//, videoInfo.thumbnailUrl, videoInfo.views, videoInfo.datePublished]
            });
          }
       // });
      });
   // }   console.log(mimoTV);
      //console.log(mimoTV);
      //console.log(mimoTV);
      //return res.json({
      //  sucess: 1,
      //  data: results//, videoInfo.thumbnailUrl, videoInfo.views, videoInfo.datePublished]
      //}); 
      
    });
  },
  getYoutube_category: (req, res) => {
    const category = req.params.category;
    getYoutube_category (category, (err, results) => {
      var mimoTV = new Array();
      var num = 0;

      //console.log(results.length);
      //for (var index = 0; index < results.length; index++) {
      forEach(results, function (item, index) {
        var key = results[index].address;
        var view = results[index].view;
        var name = results[index].name;
        var curr = results[index].current;
        //var date = results[index].date;
       // fetchVideoInfo(key).then(function (videoInfo) {
          mimoTV.push({ "id": results[index].id, "category": results[index].category, "address": "https://www.youtube.com/watch?v=" + key, "view": view,  "image": "https://i.ytimg.com/vi/" + key + "/maxresdefault.jpg", "date": curr, "name": name});//"name": name, "curr": curr});
          num++;
       //   console.log(num);
          if (num == results.length) {
            return res.json({
              sucess: 1,
              data: mimoTV//, videoInfo.thumbnailUrl, videoInfo.views, videoInfo.datePublished]
            });
          }
       // });
      });
    });
  },
  getstory: (req, res) => {
    const category = req.params.category;
    getstory (category, (err, results) => {
      var mimoStory = new Array();
      var num = 0;

      forEach(results, function (item, index) {
        var key = results[index].address;
        var view = results[index].view;
        var name = results[index].name;
        var curr = results[index].current;
          mimoStory.push({"address": "https://www.youtube.com/watch?v=" + key, "view": view,  "image": "https://i.ytimg.com/vi/" + key + "/maxresdefault.jpg", "date": curr, "name": name});
          num++;
          if (num == results.length) {
            return res.json({
              sucess: 1,
              data: mimoStory
            });
          }
      });
    });
  },
  getYoutube_id: (req, res) => {
    const id = req.params.id;
    getYoutube_id (id, (err, results) => {
      var mimoStory = new Array();
      var num = 0;

      forEach(results, function (item, index) {
        var key = results[index].address;
        var view = results[index].view;
        var name = results[index].name;
        var curr = results[index].current;
          mimoStory.push({"address": "https://www.youtube.com/watch?v=" + key, "view": view,  "image": "https://i.ytimg.com/vi/" + key + "/maxresdefault.jpg", "date": curr, "name": name});
          num++;
          if (num == results.length) {
            return res.json({
              sucess: 1,
              data: mimoStory[0]
            });
          }
      });
    });
  },
  getpick: (req, res) => {
    var image = new Array();
    var mimopick = new Array();
    var category_size = req.body.category.length;
    setTimeout(function() {
    forEach(req.body.category, function (item, i) {
       var category = req.body.category[i];
       getpick (category, (err, results) => {
         var check = 0;
         forEach(results, function (item, index) {
          if (index == results.length - 1) {
            image.push(results[index].image);
            if (results[check].discount == null) {
               if (results[check].coupon == null)
                 mimopick.push({ "id": results[check].id, "name": results[check].name, "date": results[check].date, "Star_avg": results[check].Star_avg, "Star_num": results[check].Star_num, "heart": results[check].heart, "information": results[check].information, "address": results[check].address, "image": image })
               else 
                 mimopick.push({ "id": results[check].id, "name": results[check].name, "date": results[check].date, "Star_avg": results[check].Star_avg, "Star_num": results[check].Star_num, "heart": results[check].heart, "information": results[check].information, "address": results[check].address, "coupon": results[check].coupon, "type": results[check].type, "image": image })
             }
             else {
               if (results[check].coupon == null)
                 mimopick.push({ "id": results[check].id, "name": results[check].name, "date": results[check].date, "Star_avg": results[check].Star_avg, "Star_num": results[check].Star_num, "heart": results[check].heart,  "information": results[check].information, "address": results[check].address, "discount": results[check].discount, "image": image })
               else
                 mimopick.push({ "id": results[check].id, "name": results[check].name, "date": results[check].date, "Star_avg": results[check].Star_avg, "Star_num": results[check].Star_num, "heart": results[check].heart, "information": results[check].information, "address": results[check].address, "discount": results[check].discount, "coupon": results[check].coupon, "type": results[check].type, "image": image })
             }
             image = [];
          }
          else {
           if (results[check].id == results[index].id)
             image.push(results[index].image);
           else {
             if (results[check].discount == null) {
               if (results[check].coupon == null)
                 mimopick.push({ "id": results[check].id, "name": results[check].name, "date": results[check].date, "Star_avg": results[check].Star_avg, "Star_num": results[check].Star_num, "heart": results[check].heart, "information": results[check].information, "address": results[check].address, "image": image })
               else 
                 mimopick.push({ "id": results[check].id, "name": results[check].name, "date": results[check].date, "Star_avg": results[check].Star_avg, "Star_num": results[check].Star_num, "heart": results[check].heart, "information": results[check].information, "address": results[check].address, "coupon": results[check].coupon, "type": results[check].type, "image": image })
             }
             else {
               if (results[check].coupon == null)
                 mimopick.push({ "id": results[check].id, "name": results[check].name, "date": results[check].date, "Star_avg": results[check].Star_avg, "Star_num": results[check].Star_num, "heart": results[check].heart, "information": results[check].information, "address": results[check].address, "discount": results[check].discount, "image": image })
               else 
                 mimopick.push({ "id": results[check].id, "name": results[check].name, "date": results[check].date, "Star_avg": results[check].Star_avg, "Star_num": results[check].Star_num, "heart": results[check].heart, "information": results[check].information, "address": results[check].address, "discount": results[check].discount, "coupon": results[check].coupon, "type": results[check].type, "image": image })
             }
             check = index;
             image = [];
             image.push(results[index].image);
           }
          }
         });
         if (i == category_size - 1) {
           return res.json({
            sucess: 1,
            data: mimopick
          });
         }
       });
    });
    }, 100);
  }
  /*getpick: (req, res) => {
    var mimopick = new Array;
    var category_size = req.body.category.length;
    for (var i = 0; i < category_size; i++) {
    const category = req.body.category[i];
    getpick (category, (err, results) => {
      mimopick.push(results);
      var id = results[0].id;
      var img_arr = new Array;
      var discount_value = 0;
      var check_image = 0;
      forEach(results, function (item, index) {
        var check_id = results[index].id;
        if (id == check_id) {
          if ( results[index].value != null ) {
            if (discount_value == 0) {
              img_arr.push(results[index].image);
              discount_value = results[index].value;
              check_image = index;
            }
            else if (discount_value < results[index].value)
              discount_value = results[index].value;
            else if (discount_value == results[index].value && results[check_image].image != results[index].image) {
              img_arr.push(results[index].image);
              check_image = index;
            }
          }
          else
            img_arr.push(results[index].image);
        }
        else if (id != check_id) {
          if (results[index - 1].value != null) {
            if (results[index - 1].coupon != null)
              mimopick.push({ "id": id, "name": results[index - 1].name, "image": img_arr, "name": results[index - 1].name, "Star_avg": results[index - 1].Star_avg, "Star_num": results[index - 1].Star_num, "heart": results[index - 1].heart, "information": results[index - 1].information, "address": results[index - 1].address, "value": discount_value, "coupon": results[index - 1].coupon });
            else
              mimopick.push({ "id": id, "name": results[index - 1].name, "image": img_arr, "name": results[index - 1].name, "Star_avg": results[index - 1].Star_avg, "Star_num": results[index - 1].Star_num, "heart": results[index - 1].heart, "information": results[index - 1].information, "address": results[index - 1].address, "value": discount_value });
          }
          else {
            if (results[index - 1].coupon != null)
              mimopick.push({ "id": id, "name": results[index - 1].name, "image": img_arr, "name": results[index - 1].name, "Star_avg": results[index - 1].Star_avg, "Star_num": results[index - 1].Star_num, "heart": results[index - 1].heart, "information": results[index - 1].information, "address": results[index - 1].address, "coupon": results[index - 1].coupon });
            else
              mimopick.push({ "id": id, "name": results[index - 1].name, "image": img_arr, "name": results[index - 1].name, "Star_avg": results[index - 1].Star_avg, "Star_num": results[index - 1].Star_num, "heart": results[index - 1].heart, "information": results[index - 1].information, "address": results[index - 1].address});
          }
          id = check_id;
          img_arr = [];
          img_arr.push(results[index].image);
          discount_value = 0;
        }

        if (index == results.length - 1) {
          if (results[index - 1].value != null) {
            if (results[index - 1].coupon != null)
              mimopick.push({ "id": id, "name": results[index - 1].name, "image": img_arr, "name": results[index - 1].name, "Star_avg": results[index - 1].Star_avg, "Star_num": results[index - 1].Star_num, "heart": results[index - 1].heart, "information": results[index - 1].information, "address": results[index - 1].address, "value": discount_value, "coupon": results[index - 1].coupon });
            else
              mimopick.push({ "id": id, "name": results[index - 1].name, "image": img_arr, "name": results[index - 1].name, "Star_avg": results[index - 1].Star_avg, "Star_num": results[index - 1].Star_num, "heart": results[index - 1].heart, "information": results[index - 1].information, "address": results[index - 1].address, "value": discount_value });
          }
          else {
            if (results[index - 1].coupon != null)
              mimopick.push({ "id": id, "name": results[index - 1].name, "image": img_arr, "name": results[index - 1].name, "Star_avg": results[index - 1].Star_avg, "Star_num": results[index - 1].Star_num, "heart": results[index - 1].heart, "information": results[index - 1].information, "address": results[index - 1].address, "coupon": results[index - 1].coupon });
            else
              mimopick.push({ "id": id, "name": results[index - 1].name, "image": img_arr, "name": results[index - 1].name, "Star_avg": results[index - 1].Star_avg, "Star_num": results[index - 1].Star_num, "heart": results[index - 1].heart, "information": results[index - 1].information, "address": results[index - 1].address});
          id = check_id;
          }
          img_arr = [];
          discount_value = 0;
        }
      });
    });
  }
  return res.json({
        sucess: 1,
        data: mimopick
  });
  }*/
}
