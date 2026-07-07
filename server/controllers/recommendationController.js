import Recommendation from "../models/Recommendation.js";

export const getRecommendations=async(req,res)=>{

    try{

        const recommendation=
        await Recommendation.findOne({

            user:req.user.id

        });
        console.log("Recommendation from DB:", recommendation);

        res.status(200).json({

            success:true,

            recommendation

        });

    }

    catch(err){

        console.error(err);

        res.status(500).json({

            success:false,

            message:"Failed to fetch recommendations"

        });

    }

};