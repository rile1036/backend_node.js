const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = 'mimo321';

exports.certifyPassword = (requestPassword, storedPassword) => {
    return bcrypt.compareSync(requestPassword, storedPassword);
};

exports.encryptPassword = (userPW) => {
    return bcrypt.hashSync(userPW, 10)
};

exports.generateSalt = () => {
    return bcrypt.genSaltSync(10);
};

exports.generateAccessToken = (information) => {
    return jwt.sign(information, secretKey, { expiresIn: '30m' });
};

exports.generateRefreshToken = (information) => {
    const { userID, userPW } = information;
    return jwt.sign({ userID }, secretKey + userPW, { expiresIn: '7d' });
};

exports.certifyAccessToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                console.log(token);
                reject(err);
            } else {
                resolve(decoded);
            }
        })
    });
};

exports.decodedRefreshToken = (token) => {
    return new Promise((resolve, reject) => {
        try {
            const decoded = jwt.decode(token);
            resolve(decoded);
        } catch (e) {
            reject(e);
        }
    });
};

exports.certifyRefreshToken = (token, userPW) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey + userPW, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        })
    });
};



/*module.export = {
  certifyPassword: (requestPassword, storedPassword) => {
    return bcrypt.compareSync(requestPassword, storedPassword) 
  }, 
  encryptPassword: (password) => {
    return bcrypt.hashSync(password, 7)
  },
  generateSalt: () => {
    return bcrypt.genSaltSync(7);
  },
  generateAccessToken: (information) => {
    return jwt.sign(information, secretKey, { expiresIn: '1m' })
  },
  generateRefreshToken: (information) => {
    const { uid, password } = information;
    return jwt.sign({ uid }, secretKey + password, { expiresIn: '7d' });
  },
  certifyAccessToken: (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        })
    });
  },
  decodedRefreshToken: (token) => {
    return new Promise((resolve, reject) => {
        try {
            const decoded = jwt.decode(token);
            resolve(decoded);
        } catch (e) {
            reject(e);
        }
    });
  },
  certifyRefreshToken: (token, password) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey + password, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        })
    });
  }
}*/
