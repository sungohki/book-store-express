const { StatusCodes } = require('http-status-codes');
const conn = require('../../mariadb');
const dotenv = require('dotenv');
dotenv.config();
const { decodeJwt } = require('../../hooks/decodeJwt');
const jwt = require('jsonwebtoken');

const deleteLike = (req, res) => {
  const book_id = req.params.id;
  const decodedJwt = decodeJwt(req, res);

  if (decodedJwt instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '로그인 세션 만료. 다시 로그인 하세요.',
    });
  } else if (decodedJwt instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: '잘못된 토큰 입니다.',
    });
  }

  const sql = `DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?;`;
  const values = [decodedJwt.id, book_id];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = deleteLike;
