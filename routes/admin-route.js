const express = require("express")
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware.js')
const adminMiddleware = require("../middlewares/admin-middleware.js")

router.get("/welcome",authMiddleware,adminMiddleware,(req,res)=>{
    res.json({
        message : "Welcome to the admin page"
    })
})

module.exports = router;