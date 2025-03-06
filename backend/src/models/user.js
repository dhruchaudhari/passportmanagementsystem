import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const userSchema = new mongoose.Schema(
    {
        username : {
            type : String,
            required: true,
            unique: true
        },
        email : {
            type : String,
            required: true,
            unique: true
        },
        fullname : {
            type : String,
            required: true,
        },
        avatar : {
            type : String,
            required: true,
        },
        password : {
            type : String,
            required: true
        },
        refreshToken : {
            type : String
        },
        role: {
            type : String,
            enum : ["admin" , "user"],
            default: "user"
        }
    } , {timestamps: true}
)

userSchema.pre("save" ,async function (next) {
    if(this.isModified("password")) {
    this.password = await bcrypt.hash(this.password , 10)
    }
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken =  async function() {
    return jwt.sign ({
        _id : this._id,
        username : this.username,
        fullname: this.fullname
    },process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}
userSchema.methods.generateRefrehsToken = async function() {
    return jwt.sign ({
        _id : this._id
    },process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}


export const User = new mongoose.model("User" , userSchema)