import mongoose from "mongoose";

const documentsSchema =new mongoose.Schema({
    adharcard: {
        type: String,
    },
    birthcertificate:{
        type : String,
    },
    utilitybill: {
        type: String,
    },
} , {timestamps : true})

export const Document =new mongoose.model("Document" , documentsSchema)