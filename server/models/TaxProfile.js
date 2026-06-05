import mongoose from "mongoose";

const taxProfileSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },

    financialYear:String,

    income:{
        salary:Number,
        business:Number,
        capitalGains:Number,
        rentalIncome:Number,
        interestIncome:Number,
        otherIncome:Number
    },

    deductions:{
        section80C:Number,
        section80D:Number,
        section80E:Number,
        section80G:Number,
        homeLoanInterest:Number,
        nps:Number,
        other:Number
    },

    expenses:{
        rent:Number,
        education:Number,
        medical:Number,
        insurance:Number
    },

    investments:{
        ppf:Number,
        elss:Number,
        fd5Year:Number,
        nps:Number,
        ulip:Number
    },

    taxes:{
        tds:Number,
        advanceTax:Number,
        selfAssessmentTax:Number
    }
},{
    timestamps:true
});

export default mongoose.model("TaxProfile",taxProfileSchema);