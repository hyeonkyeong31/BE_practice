INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("어린왕자들", "종이책", 0, "어리다..", "많이 어리다", "김어림", 100, "목차입니다.", 20000, "2019-01-01");

INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("신데렐라들", "종이책", 1, "유리구두..", "투명한 유리구두", "김구두", 100, "목차입니다.", 20000, "2019-01-02");

INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("백설공주들", "종이책", 2, "사과..", "빨간사과..", "김사과", 100, "목차입니다.", 20000, "2020-01-02");

INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("흥부와 놀부들", "종이책", 3, "제비..", "까만 제비..", "김제비", 100, "목차입니다.", 20000, "2023-01-02");

SELECT * FROM books LEFT
JOIN category ON books.category_id = category.id;

SELECT * FROM books LEFT JOIN category ON books.category_id = category.id WHERE books.id=1;

INSERT INTO likes (user_id, liked_book_id)
VALUES (1, 1);

DELETE FROM likes
WHERE user_id = 1 AND liked_book_id = 3;

INSERT INTO cartItems (book_id, quantity, user_id)
VALUES (1, 1, 1);

SELECT * FROM cartItems.id, book_id, title, summary, quantity, price 
FROM cartItems LEFT JOIN books ON cartItems.book_id = books.id;

DELETE FROM cartItems WHERE id = ?;

SELECT * FROM Bookshop.cartItems WHERE user_id=1 AND id IN (1,3)

INSERT INTO delivery (address, receiver, contact) VALUES ("경기도 용인시", "갱", "010-1230-1234");
const order_id = SELECT max(id) FROM orders;


INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id)
VALUES ("어린왕자들", 3, 60000, 1, delivery_id);
const order_id = SELECT max(id) FROM orders;

INSERT INTO orderedBook (order_id, book_id, quantity)
VALUES (order_id, 1, 1);
INSERT INTO orderedBook (order_id, book_id, quantity)
VALUES(order_id, 3, 2);

SELECT max(id) FROM Bookshop.orderedBook;
SELECT last_insert_id();