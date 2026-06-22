import mongoose from "mongoose";
const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },  
    password:{
        type:String, 
    },
    googleId:{
        type:String
    },
    provider:{
        type:String,
        default:"local"
    },
    profile: {
        dob: Date,
        gender: String,
        phoneNumber: String,
        address: String,
        panNumber: String,
        panVerified: {
            type: Boolean,
            default: false
        },

        aadhaarNumber: String,
        aadhaarVerified: {
            type: Boolean,
            default: false
        },

        taxpayerClassification: {
            type: String,
            enum: [
                "individual",
                "huf",
                "company",
                "firm",
                "local_authority",
                "ajp"
            ],
            default: "individual"
        },

        residentialStatus: {
            type: String,
            enum: [
                "resident",
                "resident_not_ordinary",
                "non_resident"
            ],
            default: "resident"
        },

        taxRegime: {
            type: String,
            enum: ["old", "new"],
            default: "new"
        },

        employmentType: {
            type: String,
            enum: [
                "salaried",
                "self-employed",
                "business",
                "student",
                "retired"
            ]
        },

        incomeSources: [{
            type: String
        }]
    }
});


export default mongoose.model("User",userSchema);
