const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const ensureAuthorization = require("../auth");

//장바구니 담기
const addToCart = (req, res) => {
    const { book_id, quantity } = req.body;

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
        let sql =
            "INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?)";
        let values = [book_id, quantity, authriaztion];
        conn.query(sql, values, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.OK).json(results);
        });
    }
};

//장바구니 조회
const getCartItems = (req, res) => {
    const { selected } = req.body;

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
        let sql = `SELECT * FROM cartItems.id, book_id, title, summary, quantity, price 
        FROM cartItems LEFT JOIN books 
        ON cartItems.book_id = books.id
        WHERE user_id=?`;

        let values = [authriaztion.id];

        if (selected) {
            sql += `AND cartItems.id IN (?)`;
            values.push(selected);
        }

        conn.query(sql, values, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.OK).json(results);
        });
    }
};

//장바구니 삭제
const removeCartItem = (req, res) => {
    const cartItemId = res.params.id;

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
        let sql = "DELETE FROM cartItems WHERE id = ?";
        conn.query(sql, cartItemId, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.OK).json(results);
        });
    }
};

module.exports = { addToCart, getCartItems, removeCartItem };
