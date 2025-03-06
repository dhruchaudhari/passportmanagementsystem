import mongoose from "mongoose"

const passportApplicationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref : "User",
            required: true
        },
        centerId: {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Center",
            required: true
        },
        phonenumber:{
            type: String,
            required: true,
        },
        dateofbirth:{
            type: Date,
            required: true,
        },
        placeofbirth:{
            type: String,
            required: true,
        },
        mothername:{
            type: String,
            required: true,
        },
        fathername:{
            type: String,
            required: true,
        },
        district:{
            type: String,
            required: true,
        },
        state:{
            type: String,
            required: true,
        },
        country:{
            type: String,
            required: true,
        },
        gender:{
            type: String,
            required: true,
            enum :["MALE","FEMALE","OTHER"],
            default: ""
        },
        documents:[{
            type : mongoose.Schema.Types.ObjectId,
            ref : "Document",
            required: true
        }],
        status : {
            type: String,
            enum :["PENDING","APPROVED","REJECTED"],
            default: "PENDING",
            required : true
        },
        visitDate: {  
            type: Date,
            required: true
        }
    } , {timestamps : true})

    export const PassportApplication =
    mongoose.models.PassportApplication ||
    mongoose.model("PassportApplication", passportApplicationSchema);