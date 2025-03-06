import { Router } from "express";
import { loginUser, logoutUser, registerUser , refreshAccessToken, getProfile } from "../controllers/userController.js";
import {upload } from "../middleware/multer.js"
import { verifyJWT } from "../middleware/auth.js"

const router = Router()

router.route("/register").post(
    upload.fields(
        [{
            name: 'avatar', maxCount: 1 
        }]
    ) ,registerUser)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT , logoutUser)

router.route("/refreshtoken").post(refreshAccessToken)

router.route("/profile").get(verifyJWT,getProfile)

export default router