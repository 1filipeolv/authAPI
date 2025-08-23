const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")

router.post("/register", authController.register)
router.post("/login", authController.login)
router.post("/logout", authController.logout)
router.delete("/delete-account", authController.deleteAccount)
router.post("/verify-token", authController.verifyToken)
router.get("/profile", authController.getProfile)
router.post("/refresh-token", authController.refreshToken)

module.exports = router
