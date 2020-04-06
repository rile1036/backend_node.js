const pool = require("../../config/database");

module.exports = {
  getQueen: callBack => {
    pool.query(
      `select content.id as content_id, reserve.list_id as menu_id, comment_image.image, content.category from content, comment, reserve, mimo_queen, comment_image where comment.reserve_id = reserve.id and mimo_queen.comment_id = comment.id and reserve.content_id = content.id and comment.id = comment_image.comment_id`,
      [],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
};
