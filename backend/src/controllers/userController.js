import {asyncHandler} from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import { User } from "../models/user.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import path from "path"

const generateAccessANDrefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        // console.log(user)
    
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefrehsToken()
    
        user.refreshToken = refreshToken

        await user.save({
            validateBeforeSave : false
        })
    
        return { refreshToken , accessToken }
    } catch (error) {
        throw new ApiError(500 , "Something went wrong while generating the tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, fullname, email, password } = req.body;

    // Validate input fields
    if (
        [username, fullname, email, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }

    // Check for existing user
    const existingUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existingUser) {
        return res.status(409).json({
            message: "User with the same username or email already exists",
        });
    }

    // Handle avatar upload
    const localPath = path.resolve(req.files?.avatar?.[0]?.path);

    if (!localPath) {
        return res.status(400).json({
            message: "Avatar is required",
        });
    }

    const avatar = await uploadOnCloudinary(localPath);

    if (!avatar) {
        return res.status(400).json({
            message: "Avatar upload failed",
        });
    }

    // Create user
    const user = await User.create({
        fullname,
        email,
        username,
        password,
        avatar: avatar.url,
    });

    // Fetch the created user with excluded fields
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        return res.status(500).json({
            message: "Something went wrong while registering the user",
        });
    }

    // Return the created user in response
    return res.status(201).json({
        statusCode: 201,
        data: createdUser,
        message: "User registered successfully",
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    // Debugging input
    console.log("Request body:", req.body);

    // Validation
    if (!(username || email)) {
        throw new ApiError(400, "Username or email is required");
    }

    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    // Find user by username or email
    const user = await User.findOne({
        $or: [{ username }, { email }],
    });
    // console.log(user)

    if (!user) {
        throw new ApiError(400, "User not found");
    }

    // Compare password
    const passwordValid = await user.isPasswordCorrect(password);
    // console.log(passwordValid)

    if (!passwordValid) {
        throw new ApiError(400, "Invalid Credentials");
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessANDrefreshToken(user._id);

    const loggedUser = await User.findById(user._id).select("-password");

    // Set cookies
    const option = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(
                200,
                { user: loggedUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    try {
      // Clear the refreshToken in the database
      await User.findByIdAndUpdate(req.user._id, {
        $set: { refreshToken: null }, // Ensure this field is cleared
      });
  
      const options = {
        httpOnly: true,
        secure: true, // Use secure cookies in production
        sameSite: "Strict", // Prevent CSRF attacks
      };
  
      // Clear cookies on client-side
      res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
    } catch (error) {
      console.error("Error during logout:", error.message);
      throw new ApiError(500, "Failed to log out user.");
    }
  });
  
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshtoken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshtoken){
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshtoken,process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refreshtoken")
        }
    
        if(incomingRefreshtoken !== user?.refreshToken){
            throw new ApiError(401, "refreshtoken is expired")
        }
    
        const option = {
            httpOnly : true,
            secure: true
        }
    
        const { accessToken , newRefreshToken} = await generateAccessANDrefreshToken(user._id)
    
        return res.status(200)
        .cookie("accessToken",accessToken)
        .cookie("refreshToken",newRefreshToken)
        .json(
            new ApiResponse(200 ,
                {accessToken,refreshToken : newRefreshToken},
                "Token refreshed successfully"
            )
        )
    } catch (error) {
        throw new ApiError(402,"invalid refresh token")
    }

})

const getProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id; // Extracted from the verified JWT in verifyJWT middleware
  
    const user = await User.findById(userId).select("username fullname email avatar");
    if (!user) {
      throw new ApiError(404, "User not found");
    }
  
    // Return the profile data using ApiResponse
    res.status(200).json(
      new ApiResponse(200, {
        user,
      }, "User profile fetched successfully")
    );
  });

export { registerUser , loginUser , logoutUser , refreshAccessToken ,getProfile}