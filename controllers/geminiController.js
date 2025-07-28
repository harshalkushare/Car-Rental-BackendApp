const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chatWithGemini = async (req, res) => {
  try {
    const { userMessage } = req.body;

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    };

    const systemPrompt = `You are a helpful car rental assistant. Here are the specific questions and answers you should provide:

1. For questions about car models and prices:
   - Economy Car (Honda Amaze): ₹2000/day
   - Sedan (Honda City): ₹2500/day
   - SUV (Toyota Fortuner): ₹4000/day
   - Luxury (Mercedes C-Class): ₹6000/day

2. For rental process questions:
   - Required Documents: Valid Driver's License, ID Proof, Address Proof
   - Booking Process: Online booking or visit nearest branch
   - Payment Options: Credit/Debit Cards, UPI, Cash

3. For rental requirements:
   - Minimum age: 21 years
   - Minimum driving experience: 2 years
   - Security deposit: ₹5000 (refundable)

4. For rental locations:
   - Main Branch: banglore
   - Airport Branch: banglore
   - Downtown Branch: Business District

For any questions outside these topics, respond with:
"For this specific inquiry, please contact our customer care at 1800-123-4567 or email us at support@carrentals.com"

Keep responses concise and friendly. Format prices and important information in bold using **text**.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent([systemPrompt, userMessage]);
    const response = result.response;
    const text = response.text();

    res.json({ success: true, reply: text });
  } catch (error) {
    console.error("Gemini error:", error.message);
    res.status(500).json({ success: false, message: "Gemini API failed" });
  }
};
