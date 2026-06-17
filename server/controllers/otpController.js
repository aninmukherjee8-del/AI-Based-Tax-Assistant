import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const verifyMSG91Token = async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: "Access token required",
      });
    }

    const response = await axios.post(
      "https://control.msg91.com/api/v5/widget/verifyAccessToken",
      {
        authkey: process.env.MSG91_AUTH_KEY,
        "access-token": accessToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("MSG91 Verify Error:", error.response?.data || error);

    return res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};