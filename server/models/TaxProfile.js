import mongoose from "mongoose";

const taxProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    financialYear: {
      type: String,
      required: true,
    },
    salaryBreakdown: {
        type: Map,
        of: Number,
        default: () => new Map()
    },

    epfBreakdown: {
        type: Map,
        of: Number,
        default: () => new Map()
    },
    income: {
      salary: {
        type: Number,
        default: 0,
      },

      business: {
        type: Number,
        default: 0,
      },

      capitalGains: {
        type: Number,
        default: 0,
      },

      rentalIncome: {
        type: Number,
        default: 0,
      },

      interestIncome: {
        type: Number,
        default: 0,
      },

      otherIncome: {
        type: Number,
        default: 0,
      },
    },

    deductions: {
      section80C: {
        type: Number,
        default: 0,
      },

      section80D: {
        type: Number,
        default: 0,
      },

      section80E: {
        type: Number,
        default: 0,
      },

      section80G: {
        type: Number,
        default: 0,
      },

      homeLoanInterest: {
        type: Number,
        default: 0,
      },

      nps: {
        type: Number,
        default: 0,
      },

      other: {
        type: Number,
        default: 0,
      },
    },

    taxes: {
      tds: {
        type: Number,
        default: 0,
      },

      advanceTax: {
        type: Number,
        default: 0,
      },

      selfAssessmentTax: {
        type: Number,
        default: 0,
      },
    },

    investments: {
      ppf: {
        type: Number,
        default: 0,
      },

      elss: {
        type: Number,
        default: 0,
      },

      ulip: {
        type: Number,
        default: 0,
      },

      nps: {
        type: Number,
        default: 0,
      },

      fd5Year: {
        type: Number,
        default: 0,
      },
    },


    expenses: {
      rent: {
        type: Number,
        default: 0,
      },

      education: {
        type: Number,
        default: 0,
      },

      medical: {
        type: Number,
        default: 0,
      },

      insurance: {
        type: Number,
        default: 0,
      },
    },


    taxSummary: {
      taxableIncome: {
        type: Number,
        default: 0,
      },

      oldRegimeTax: {
        type: Number,
        default: 0,
      },

      newRegimeTax: {
        type: Number,
        default: 0,
      },

      recommendedRegime: {
        type: String,
        enum: ["Old", "New"],
        default: "New",
      },

      taxSaved: {
        type: Number,
        default: 0,
      },
    },

    aiSuggestions: [
      {
        title: String,

        description: String,

        priority: {
          type: String,
          enum: ["High", "Medium", "Low"],
          default: "Medium",
        },

        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],


    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],

    profileStatus: {
      completed: {
        type: Boolean,
        default: false,
      },

      percentage: {
        type: Number,
        default: 0,
      },
    },
    lastUpdatedFrom: {
      type: String,
      default: "",
    },

    profileVersion: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);


taxProfileSchema.index(
  { user: 1, financialYear: 1 },
  { unique: true }
);

export default mongoose.model("TaxProfile", taxProfileSchema);