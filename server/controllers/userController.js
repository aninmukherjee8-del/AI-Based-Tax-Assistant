import User from "../models/User.js";

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            name,
            email,
            phoneNumber,
            panNumber,
            taxpayerClassification,
            employmentType,
            address
        } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        if (!user.profile) {
            user.profile = {};
        }
        user.name = name;
        user.email = email;
        user.profile.phoneNumber = phoneNumber;
        user.profile.panNumber = panNumber;
        user.profile.taxpayerClassification =
            taxpayerClassification;
        user.profile.employmentType =
            employmentType;
        user.profile.address = address;
        await user.save();
        res.status(200).json({
            success: true,
            message: "Profile updated successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};