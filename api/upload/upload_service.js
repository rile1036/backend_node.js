const pool = require("../../config/database");

module.exports = {
  getid: (callBack) => {
        pool.query(
          `select ifnull(max(id) + 1, 1) as id from content`,
          [],
          (error, results, fields) => {
            if (error) {
              return callBack(error);
            }
            return callBack(null, results);
          }
        );
  },
  create: ({image, content_id} ,callBack) => {
    pool.query(
      `INSERT INTO content_image (id, image, content_id) VALUES ((select ifnull(max(id) + 1, 1) from content_image as u), ?, ?)`,
      [
        image, content_id
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getimage: (data, callBack) => {
    pool.query(
      `select image from content, content_image where content.id = content_image.content_id`,
      [
        data.content_id
      ],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
}
