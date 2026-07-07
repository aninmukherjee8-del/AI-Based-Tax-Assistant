import TaxProfile from "../models/taxProfile.js";
import { generateRecommendations } from "../services/recommendationService.js";

export const getTaxProfile = async (req, res) => {
  try {
    const profile = await TaxProfile.findOne({
      user: req.user.id,
      financialYear: "2026-27",
    }).populate("documents", "documentType originalFileName");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Tax profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tax profile",
    });
  }
};

export const updateTaxProfile = async (req, res) => {
  try {
    let profile = await TaxProfile.findOne({
      user: req.user.id,
      financialYear: "2026-27",
    });

    if (!profile) {
      profile = await TaxProfile.create({
        user: req.user.id,
        financialYear: "2026-27",
      });
    }

    Object.assign(profile.income, req.body.income || {});
    Object.assign(profile.deductions, req.body.deductions || {});
    Object.assign(profile.taxes, req.body.taxes || {});
    Object.assign(profile.investments, req.body.investments || {});
    Object.assign(profile.expenses, req.body.expenses || {});

    profile.profileVersion++;

    await profile.save();
    await generateRecommendations(profile);

    await profile.save();

    res.json({
      success: true,
      profile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to update tax profile",
    });
  }
};