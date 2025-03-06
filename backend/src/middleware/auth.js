import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.js";



export const verifyJWT = asyncHandler( async (req , res , next) => {

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " ,"" )
        // console.log(req.cookies)

        if(!token){
            throw new ApiError(400 , "Unauthorized request")
        }
        
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        if(!decodedToken){
            throw new ApiError(401 , "Not able to decode token")
        }
        
        const user =await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            throw new ApiError(401 , "Invalid access token")
        }
    
        req.user = user 
        next()
    } catch (error) {
        console.log(error)
        throw new ApiError(401 , "Invalid access token2")
    }
})
