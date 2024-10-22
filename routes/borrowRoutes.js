const express =require("express")
const router= express.Router({ mergeParams: true });
const borrowController=require("../controllers/borrowController")
const{verify,restrict}= require("../middlewares/authMiddleware")
router.post("/borrowBooks",borrowController.borrowBook)
router.put("/return/:id",borrowController.returnBook)
router.get("/history",borrowController.borrowHistory)
router.get("/mostBorrowed",verify,restrict("admin"),borrowController.mostBorrowedBooks)
router.get("/mostActive",verify,restrict("admin"),borrowController.activeMembers)
router.get("/bookAvailable",verify,restrict("admin"),borrowController.bookAvailability)

module.exports =router