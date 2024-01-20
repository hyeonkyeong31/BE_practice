const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const ensureAuthorization = require("../auth");

const addLike = (req, res) => {
    const book_id = res.params.id;
    // const { user_id } = req.body;

    let authriaztion = ensureAuthorization(req, res);

    if (authriaztion instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message ": "로그인만료",
        });
    } else if (authriaztion instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message ": "잘못된 토큰",
        });
    } else {
        let sql = "INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)";
        let values = [authriaztion.id, book_id];
        conn.query(sql, values, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.OK).json(results);
        });
    }
};

const removeLike = (req, res) => {
    const book_id = res.params.id;

    let authriaztion = ensureAuthorization(req, res);

    if (authriaztion instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message ": "로그인만료",
        });
    } else if (authriaztion instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message ": "잘못된 토큰",
        });
    } else {
        let sql = "DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?;";
        let values = [authriaztion.id, book_id];
        conn.query(sql, values, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.OK).json(results);
        });
    }
};

module.exports = {
    addLike,
    removeLike,
};
