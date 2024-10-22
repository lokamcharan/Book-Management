const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const {verify,restrict} = require("../middlewares/authMiddleware")


router.post("/addBooks",verify, restrict("admin"),bookController.addBook);
router.put("/update/:id", verify,restrict("admin"),bookController.updateBook);
router.delete("/delete/:id",verify, restrict("admin"),bookController.deleteBook);
router.get("/allBooks", bookController.listBooks);

module.exports = router;
