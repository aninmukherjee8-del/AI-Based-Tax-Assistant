import TaxProfile from "../models/taxProfile.js";

export const getTaxProfile = async (req, res) => {
    try {
        const profile = await TaxProfile.findOne({
            user: req.user.id,
            financialYear: "2026-27"
        });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Tax profile not found"
            });
        }
        res.json({
            success: true,
            profile
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch tax profile"
        });
    }
};

export const updateTaxProfile = async (req, res) => {
    try {
        const profile = await TaxProfile.findOne({
            user: req.user.id,
            financialYear: "2026-27"
        });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Tax profile not found"
            });
        }
        Object.assign(profile.income, req.body.income || {});
        Object.assign(profile.deductions, req.body.deductions || {});
        Object.assign(profile.taxes, req.body.taxes || {});
        Object.assign(profile.investments, req.body.investments || {});
        Object.assign(profile.expenses, req.body.expenses || {});

        profile.profileVersion++;

        await profile.save();

        res.json({
            success: true,
            profile
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to update tax profile"
        });
    }
};