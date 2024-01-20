const express = require("express");
const router = express.Router();
const { allBooks, bookDetail } = require("../controller/BookController");
router.use(express.json());

router.get("/", allBooks);
router.get("/:id", bookDetail);
router.get("/category");

module.exports = router;
