const { getmanager_style_detail,getmanager_comment_detail, getheader, getmap, getmanager_detail, getstyle, getcomment, getallcomment, getphotocomment, getmenu, getmanager, getsetmenu, getdetail_list, getdetail_info, getdetail_comment, getreserve_date } = require("./content_service");
var forEach = require('async-foreach').forEach;
var moment = require('moment');

module.exports = {
  getheader: (req, res) => {
    const id = req.params.id;
    const list_id = req.params.id;
    getheader([list_id, id], (err, results) => {
      var header = new Array();
      var image = new Array();
      forEach(results, function (item, index) {
        image.push( results[index].image );
        if (index == results.length - 1) {
          header.push({ "id": results[index].id, "name": results[index].name, "image": image, "heart": results[index].heart }); 
          return res.json({
            sucess: 1,
            data: header[0]
          });
        }
      });
    });
  },
  getstyle: (req, res) => {
    const id = req.params.id;
    getstyle(id, (err, results) => {
      return res.json({
        sucess: 1,
        data: results
      });
    });
  },
  getmap: (req, res) => {
    const id = req.params.id;
    getmap(id, (err, results) => {
      var map_arr = new Array();
      var tag = new Array();
      forEach(results, function (item, index) {
        tag.push( results[index].tag );
        if (index == results.length - 1) {
          map_arr.push({ "phone": results[index].phone, "day": results[index].day, "address": results[index].address, "s_time": results[index].s_time,  "e_time": results[index].e_time, "latitude": results[index].latitude, "longitude": results[index].longitude, "comment":  results[index].comment, "tag": tag });
          return res.json({
            sucess: 1,
            data: map_arr[0]
          });
        }
      });
    });
  },
  getmanager: (req, res) => {
    const id = req.params.id;
    getmanager(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          sucess: 0,
          message: "Record not Found"
        });
      }
      return res.json({
        sucess: 1,
        data: results
      });
    });
  },
  getmenu: (req, res) => {
    const content_id = req.params.content_id;
    getmenu (content_id, (err, results) => {
      var menu = new Array();
      var menu_list = new Array();
      var id = 1; var menu_id = 0;
      var name = results[0].menu;

      forEach(results, function (item, index) {
        var check_menu = results[index].menu;
        if (name == check_menu) {
          if (name == "세트 메뉴") {
            if (results[index].value != null)
              menu_list.push({"id": results[index].id, "image": results[index].image, "name": results[index].cont_name, "value": results[index].cont_value, "time": results[index].time, "discount": results[index].value, "discount_value": results[index].cont_value * (100 - results[index].value) / 100});
            else
              menu_list.push({"id": results[index].id, "image": results[index].image, "name": results[index].cont_name, "value": results[index].cont_value, "time": results[index].time });
            menu_id++;          
          }
          else {
            if (results[index].value != null)
            menu_list.push({"id": results[index].id, "name": results[index].cont_name, "value": results[index].cont_value, "time": results[index].time, "discount": results[index].value, "discount_value": results[index].cont_value * (100 - results[index].value) / 100});
            else
            menu_list.push({"id": results[index].id, "name": results[index].cont_name, "value": results[index].cont_value, "time": results[index].time });
          menu_id++;
          }
        }
        else {
          if (name == "세트 메뉴") {
            menu.unshift({ "id": 0, "menu": name, "list": menu_list });
            name = check_menu;
            menu_list = [];
            menu_id = 0;
          }
          else {
            menu.push({ "id": id, "menu": name, "list": menu_list });
            name = check_menu;
            menu_list = [];
            id++; menu_id = 0;
          }
          if (name == "세트 메뉴") {
            if (results[index].value != null)
              menu_list.push({"id": results[index].id, "image": results[index].image, "name": results[index].cont_name, "value": results[index].cont_value, "time": results[index].time, "discount": results[index].value, "discount_value": results[index].cont_value * (100 - results[index].value) / 100});
            else
              menu_list.push({"id": results[index].id, "image": results[index].image, "name": results[index].cont_name, "value": results[index].cont_value, "time": results[index].time });
            menu_id++;
          }
          else {
            if (results[index].value != null)
              menu_list.push({"id": results[index].id, "name": results[index].cont_name, "value": results[index].cont_value, "time": results[index].time, "discount": results[index].value, "discount_value": results[index].cont_value * (100 - results[index].value) / 100});
            else
              menu_list.push({"id": results[index].id, "name": results[index].cont_name, "value": results[index].cont_value, "time": results[index].time });
            menu_id++;
          }
        }
        if (index == results.length - 1) {
          if (name == "세트 메뉴") {
            menu.unshift({ "id": 0, "menu": name, "list": menu_list });
            name = check_menu;
            menu_list = [];
            id = 0; menu_id = 0;
          }
          else {
            menu.push({ "id": id, "menu": name, "list": menu_list });
            name = check_menu;
            menu_list = [];
            id = 0; menu_id = 0;
          }
          return res.json({
            sucess: 1,
            data: menu
          });
        }       
      });
    });
  },
  getcomment: (req, res) => {
    const id = req.params.id;
    var comment_arr = new Array();
    
    getallcomment (id, (err, results) => {
      var list = new Array();
      var all_star_avg = 0; var all_star_num = 0; var num = 2;
      forEach(results, function (item, index) {
        all_star_avg += results[index].Star_avg * results[index].Star_num;
        all_star_num += results[index].Star_num;
        if (results[index].menu == "세트 메뉴")
          list.unshift({ "id": 1, "menu": results[index].menu, "Star_avg": results[index].Star_avg, "Star_num": results[index].Star_num });
        else {
          list.push({ "id": num, "menu": results[index].menu, "Star_avg": results[index].Star_avg, "Star_num": results[index].Star_num });
          num++;
        }
      });
      if (all_star_num == 0)
        list.unshift({ "id": 0, "All_Star_avg": 0, "All_Star_num": all_star_num });
      else
        list.unshift({ "id": 0, "All_Star_avg": Math.round(all_star_avg / all_star_num, 1), "All_Star_num": all_star_num });
      comment_arr.push( list ); list = [];
    }),
    setTimeout(function() {
    getphotocomment (id, (err, results) => {
      comment_arr.push( results );
      return res.json({
        sucess: 1,
        data: comment_arr
      });
    });}, 100);
  },
  getdetail_list: (req, res) => {
    const content_id = req.params.content_id;
    const id = req.params.id;
    getdetail_list ([content_id, id], (err, results) => {
      var menu_list = new Array();
      var index = 0;
      console.log(results);
      if (results[0].value != null) {
        if (results[0].image == null)
          menu_list.push({"id": results[0].id, "name": results[index].cont_name, "value": results[index].cont_value, "time": results[index].time, "discount": results[index].value, "discount_value": results[index].cont_value * (100 - results[index].value) / 100});
        else
          menu_list.push({"id": results[0].id, "image": results[index].image, "name": results[index].cont_name, "value": results[index].cont_value, "time": results[index].time, "discount": results[index].value, "discount_value": results[index].cont_value * (100 - results[index].value) / 100});
      }
      else {
        if (results[0].image == null)
          menu_list.push({"id": results[0].id, "name": results[index].cont_name, "value": results[index].cont_value, "time": results[index].time });
        else
          menu_list.push({"id": results[0].id, "image": results[index].image, "name": results[index].cont_name, "value": results[index].cont_value, "time": results[index].time});
      }
      return res.json({
            sucess: 1,
            data: menu_list[0]
      });
    });
  },
  getdetail_info: (req, res) => {
    const content_id = req.params.content_id;
    const id = req.params.id;
    getdetail_info ([content_id, id], (err, results) => {
      var info_all = new Array();
      var info_list = new Array();
      var detail_list = new Array();
      forEach(results, function (item, index) {
       if (index < results.length - 1) {
        if (results[index].type == true) {
          info_list.push({ "info_name": results[index].info, "info_value": "+ " +  results[index].info_value });
          if (results[index].detail_id != results[index + 1].detail_id) {
            info_all.push({ "title": results[index].title, "info": info_list })
            info_list = [];
          }
        }
        
        else {
          info_list.push(results[index].info);
          if (results[index].detail_id != results[index + 1].detail_id) {
            info_all.push({ "title": results[index].title, "info": info_list })
            info_list= [];
          }
        }
       }
       else {
        if (results[index].type == true) {
          info_list.push({ "info_name": results[index].info, "info_value": "+ " +  results[index].info_value });
          info_all.push({ "title": results[index].title, "info": info_list })
          info_list = [];
        }
        else {
          info_list.push(results[index].info);
          info_all.push({ "title": results[index].title, "info": info_list })
          info_list=[];
        }
        if (results[index].discount != null)
          detail_list.push({ "image": results[index].image, "name": results[index].name, "menu": results[index].menu, "value": results[index].value, "discount": results[index].discount, "heart": results[index].heart, "time": results[index].time, "info_list": info_all, "information": results[index].information });
        else
          detail_list.push({ "image": results[index].image, "name": results[index].name, "menu": results[index].menu, "value": results[index].value, "heart": results[index].heart, "time": results[index].time, "info_list": info_all, "information": results[index].information });
       }
      });
      return res.json({
        sucess: 1,
        data: detail_list
      });
    });
  },
  getcommentlist: (req, res) => {
    const id = req.params.id;
    var comment_arr = new Array();
    getcomment (id, (err, results) => {
      var list = new Array();
      //console.log(results[0].username[1]);
      forEach(results, function (item, index) {
        var username = results[index].username[0] + '*';
        if (results[index].username.length > 2)
	for (var i = 2; i < results[index].username.length; i++)
            username += results[index].username[i];
        if (results[index].image == null)
          list.push({ "id": index, "menu": results[index].menu, "name": results[index].name, "manager": results[index].managername, "star": results[index].star, "username": username, "date": results[index].comment_date, "text": results[index].text });
        else {
          list.push({ "id": index, "menu": results[index].menu, "name": results[index].name, "manager": results[index].managername,"star": results[index].star, "username": username, "date": results[index].comment_date, "text": results[index].text, "image": results[index].image});
        }
      });
      comment_arr.push( list );
      return res.json({
        sucess: 1,
        data: comment_arr[0]
      }); 
    });
  },
  getdetail_comment: (req, res) => {
    const content_id = req.params.content_id;
    const id = req.params.id;
    getdetail_comment ([content_id, id], (err, results) => {
      var comment_arr = new Array();
      var list = new Array();
      forEach(results, function (item, index) {
        var username = results[index].username[0] + '*';
        if (results[index].username.length > 2)
          for (var i = 2; i < results[index].username.length; i++)
            username += results[index].username[i];
        if (results[index].image == null)
          list.push({ "id": index, "menu": results[index].menu, "name": results[index].name, "manager": results[index].managername, "star": results[index].star, "username": username, "date": results[index].comment_date, "text": results[index].text });
        else {
          list.push({ "id": index, "menu": results[index].menu, "name": results[index].name, "manager": results[index].managername,"star": results[index].star, "username": username, "date": results[index].comment_date, "text": results[index].text, "image": results[index].image});
        }
      });
      comment_arr.push( list );
      return res.json({
        sucess: 1,
        data: comment_arr[0]
      });
    });
  },
  getreserve_date: (req, res) => {
    const content_id = req.body.content_id;
    const reserve_date = req.body.reserve_date;
    getreserve_date ([content_id, reserve_date], (err, results) => {
      var reserve = new Array();
      var reserve_list = new Array();
      var today = new Date(req.body.reserve_date).getDay();
      
      console.log(today);
      forEach(results, function (item, index) {
        if (results[index].day == today) {
          reserve_list.push({ "id": results[index].id, "image": results[index].image, "name": results[index].name, "information": results[index].information, "text": "정기 휴일" });
        }
        else {
          var timecnt = 0;
          if (results[index].type == false) timecnt = 30;
          else timecnt = 60;
          if (results[index].reserve_date == null) {
            reserve_list.push({ "id": results[index].id, "image": results[index].image, "name": results[index].name, "information": results[index].information, "start_time": results[index].start_time, "end_time": results[index].end_time, "type": timecnt, "reserve": false });
          }
          else {
            var start = moment(results[index].reserve_date).format('HH:mm:ss');         
            var during = moment(results[index].reserve_date,'HH:mm:ss');
            during.add(results[index].time,'m');
            var end = during.format('HH:mm:ss');
            //reserve.push (start);
            var startduring = moment(results[index].reserve_date,'HH:mm:ss');
            while (true) {
              if (startduring.format('HH:mm:ss') >= end)
                break;
              else {
               // startduring.add(timecnt,'m');
                reserve.push(startduring.format('HH:mm:ss'));
                startduring.add(timecnt,'m');
              }
            }
            if (index < results.length - 1) {
              if (results[index].name != results[index + 1].name) {
                reserve_list.push({ "id": results[index].id, "image": results[index].image, "name": results[index].name, "information": results[index].information, "start_time": results[index].start_time, "end_time": results[index].end_time, "type": timecnt, "reserve": reserve });
                reserve = [];
              }
            }
            else {
              reserve_list.push({ "id": results[index].id, "image": results[index].image, "name": results[index].name, "information": results[index].information, "start_time": results[index].start_time, "end_time": results[index].end_time, "type": timecnt, "reserve": reserve });
            }
          }
          /*if (results[index].name == results[test].name && index == (results.length - 1)) {
            reserve_list.push({ "id": results[index].id, "image": results[index].image, "name": results[index].name, "information": results[index].information, "start_time": moment(results[index].start_time).format('HH:mm'), "end_time": moment(results[index].end_time).format('HH:mm'), "type": timecnt, "reserve": reserve });
          }*/
        }
      });
      return res.json({
        sucess: 1,
        data: reserve_list
      });
    });
  },
  getmanager_detail: (req, res) => {
    const id = req.params.id;
    getmanager_detail (id, (err, results) => {
      console.log(id);
      return res.json({
            sucess: 1,
            data: results[0]
      });
    });
  },
  getmanager_detail_tag: (req, res) => {
    const tag = req.params.tag;
    const id = req.params.id;
    if (tag == "style") {
    getmanager_style_detail (id, (err, results) => {
      return res.json({
        sucess: 1,
        data: results
      });
    });
    }
    else if (tag == "review") {
    getmanager_comment_detail (id, (err, results) => {
      var comment_arr = new Array();
      var list = new Array();
      forEach(results, function (item, index) {
        var username = results[index].username[0] + '*';
        if (results[index].username.length > 2)
          for (var i = 2; i < results[index].username.length; i++)
            username += results[index].username[i];
        if (results[index].image == null)
          list.push({ "id": index, "menu": results[index].menu, "name": results[index].name, "manager": results[index].managername, "star": results[index].star, "username": username, "date": results[index].comment_date, "text": results[index].text });
        else {
          list.push({ "id": index, "menu": results[index].menu, "name": results[index].name, "manager": results[index].managername,"star": results[index].star, "username": username, "date": results[index].comment_date, "text": results[index].text, "image": results[index].image});
        }
      });
      comment_arr.push( list );
      return res.json({
        sucess: 1,
        data: comment_arr[0]
      });
    });
    }
  }
}
