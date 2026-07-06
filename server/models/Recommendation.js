import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },

    recommendedRegime:{
        type:String,
        default:"New"
    },

    estimatedSaving:{
        type:Number,
        default:0
    },

    recommendations:[
        {
            title:String,
            description:String,
            priority:String
        }
    ],

    governmentSchemes:[
        {
            name:String,
            reason:String
        }
    ],

    missingDocuments:[
        String
    ],

    warnings:[
        String
    ],

    summary:String

},
{
    timestamps:true
}
);

export default mongoose.model(
    "Recommendation",
    recommendationSchema
);