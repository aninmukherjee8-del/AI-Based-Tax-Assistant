import ai from "../config/gemini.js";
import Recommendation from "../models/Recommendation.js";
console.log("Generating AI recommendations...");

export const generateRecommendations = async(profile)=>{
console.log("===== ENTERED generateRecommendations =====");
    try{

        const profileData={

            income:profile.income,

            deductions:profile.deductions,

            taxes:profile.taxes,

            investments:profile.investments,

            expenses:profile.expenses

        };

        const prompt=`

You are an expert Indian Chartered Accountant.

Analyse the following taxpayer profile.

${JSON.stringify(profileData,null,2)}

Provide:

1. Recommended tax regime (Old/New)

2. Estimated additional tax savings

3. Tax saving recommendations

4. Government schemes applicable

5. Missing deductions

6. Missing supporting documents

7. Any tax warnings

Return ONLY valid JSON.

Use this schema:

{

"recommendedRegime":"",

"estimatedSaving":0,

"recommendations":[

{

"title":"",

"description":"",

"priority":"High"

}

],

"governmentSchemes":[

{

"name":"",

"reason":""

}

],

"missingDocuments":[],

"warnings":[],

"summary":""

}

`;

        const response=
        await ai.models.generateContent({

            model:"gemini-3.5-flash",

            contents:prompt

        });
        console.log("RAW GEMINI RESPONSE:");
        console.log(response.text);

        let text=response.text;

        text=text
        .replace(/```json/g,"")
        .replace(/```/g,"")
        .trim();

        const recommendation=
        JSON.parse(text);

        await Recommendation.findOneAndUpdate(
            
            {

                user:profile.user

            },

            {

                user:profile.user,

                ...recommendation

            },

            {

                upsert:true,

                new:true

            }

        );
        console.log("Gemini returned:");

        console.log(recommendation);

        console.log("Saving recommendation...");

        return recommendation;

    }

    catch(err){

        console.error(err);

        return null;

    }

};