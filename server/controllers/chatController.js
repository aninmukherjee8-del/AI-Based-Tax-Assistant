import { generateChatResponse } from "../services/chatService.js";

export const sendMessage = async (req, res) => {

    try {
        const { message, history } = req.body;
        if (!message || message.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }
        const reply = await generateChatResponse(
            message,
            history || []
        );
        res.json({
            success: true,
            reply
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};