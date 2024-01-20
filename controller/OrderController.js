const jwt = require("jsonwebtoken");
const ensureAuthorization = require("../auth");
const { StatusCodes } = require("http-status-codes");
const mariadb = require("mysql2/promise");

const order = async (req, res) => {
    const conn = await mariadb.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "root",
        database: "Bookshop",
        dateStrings: true,
    });

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
        const { items, delivery, totalQuantity, totalPrice, firstBookTitle } =
            req.body;

        let sql =
            "INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)";
        let values = [delivery.address, delivery.receiver, delivery.contact];
        let [results] = await conn.execute(sql, values);
        let delivery_id = results.insertId;

        sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES (?, ?, ?, ?, ?)`;
        values = [
            firstBookTitle,
            totalQuantity,
            totalPrice,
            authriaztion.id,
            delivery_id,
        ];
        [results] = await conn.execute(sql, values);
        let order_id = results.insertId;

        sql = `INSERT INTO book_id, quantity FROM cartItems WHERE id IN (?)`;
        let orderItems = await conn.query(sql, [items]);

        sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;

        values = [];
        orderItems.forEach((item) => {
            values.push([order_id, item.book_id, item.quantity]);
        });

        results = await conn.query(sql, [values]);
        let result = await deleteCartItems(conn, items);
        return res.status(StatusCodes.OK).json(result);
    }
};

const deleteCartItems = async (conn, items) => {
    let sql = "DELETE FROM cartItems WHERE id IN (?)";

    let result = await conn.query(sql, [items]);
    return result;
};

const getOrders = async (req, res) => {
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
        const conn = await mariadb.createConnection({
            host: "127.0.0.1",
            user: "root",
            password: "root",
            database: "Bookshop",
            dateStrings: true,
        });

        let sql = `SELECT orders.id, created_at, address, receiver, contactm
                book_title, total_quantity, total_price
                FROM orders LEFT JOIN delivery
                ON orders.delivery_id = delivery.id;`;
        let [rows, fields] = await conn.query(sql);
        return res.status(StatusCodes.OK).json(rows);
    }
};

const getOrderDetail = async (req, res) => {
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
        const { id } = req.params;
        const conn = await mariadb.createConnection({
            host: "127.0.0.1",
            user: "root",
            password: "root",
            database: "Bookshop",
            dateStrings: true,
        });

        let sql = `SELECT book.id, title, author, price, quantity
                FROM orderedBook LEFT JOIN books
                ON orderedBook.book_id = books.id
                WHERE order_id=?;`;
        let [rows, fields] = await conn.query(sql);
        return res.status(StatusCodes.OK).json(rows);
    }
};

module.exports = {
    order,
    getOrders,
    getOrderDetail,
};
