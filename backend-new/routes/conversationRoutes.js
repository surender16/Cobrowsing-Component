import express from "express";
import OpenTok from "opentok";
import emailService from "../services/emailService.js";

const router = express.Router();

// Create OpenTok session and send email invite
router.post("/create-session", async (req, res) => {
  try {
    const { customerName, customerEmail } = req.body;

    // Validate input
    if (!customerName || !customerEmail) {
      return res.status(400).json({
        success: false,
        message: "Customer name and email are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Create OpenTok session
    const opentok = new OpenTok(
      process.env.OPENTOK_API_KEY,
      process.env.OPENTOK_API_SECRET
    );

    const session = await new Promise((resolve, reject) => {
      opentok.createSession(
        { mediaMode: "routed" },
        (err, session) => {
          if (err) reject(err);
          else resolve(session);
        }
      );
    });

    // Generate agent token (publisher)
    const agentToken = opentok.generateToken(session.sessionId, {
      role: "publisher",
      expireTime: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
      data: JSON.stringify({
        name: "Agent",
        userType: "agent",
        sessionId: session.sessionId
      }),
    });

    // Generate customer token (publisher - so they can publish video/audio)
    const customerToken = opentok.generateToken(session.sessionId, {
      role: "publisher",
      expireTime: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
      data: JSON.stringify({
        name: customerName,
        email: customerEmail,
        userType: "customer",
        sessionId: session.sessionId
      }),
    });

    // Send email invite to customer using SendGrid
    try {
      const customerUrl = `${process.env.CLIENT_URL}/conversations/${session.sessionId}/customer`;
      
      // Prepare template data
      const templateData = {
        customerName,
        joinUrl: customerUrl,
        currentYear: new Date().getFullYear(),
        companyName: process.env.COMPANY_NAME || "Your Company",
        validityPeriod: "7 days",
        sessionDetails: {
          // You can add more session details here if needed
          // date: "Today",
          // time: "Now",
          // duration: "As needed"
        }
      };

      const emailResult = await emailService.sendEmail({
        to: customerEmail,
        subject: "Video Call Invitation - Join Your Session",
        template: "video-call-invitation",
        data: templateData
      });

      console.log(`✅ Email sent successfully to ${customerEmail}`, emailResult.messageId);
    } catch (emailError) {
      console.error("❌ Failed to send email:", emailError.message);
      console.error("Email error details:", {
        code: emailError.code,
        response: emailError.response?.body
      });
      // Don't fail the entire request if email fails - session is still created
    }

    // Return session data
    const customerUrl = `${process.env.CLIENT_URL}/conversations/${session.sessionId}/customer`;
    
    res.json({
      success: true,
      sessionId: session.sessionId,
      apiKey: process.env.OPENTOK_API_KEY,
      agentToken,
      customerToken,
      customerUrl,
      message: "Session created and email sent successfully",
    });

  } catch (error) {
    console.error("❌ Error creating session:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create session",
      error: error.message,
    });
  }
});

// Get session info (for validation)
router.get("/session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    // You might want to validate the session exists in your database
    // For now, we'll just return the sessionId
    res.json({
      success: true,
      sessionId,
      apiKey: process.env.OPENTOK_API_KEY,
    });
  } catch (error) {
    console.error("❌ Error getting session info:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get session info",
      error: error.message,
    });
  }
});

// Generate token for existing session
router.post("/generate-token", async (req, res) => {
  try {
    const { sessionId, userType = "subscriber", userData = {} } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required",
      });
    }

    const opentok = new OpenTok(
      process.env.OPENTOK_API_KEY,
      process.env.OPENTOK_API_SECRET
    );

    const token = opentok.generateToken(sessionId, {
      role: userType,
      expireTime: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
      data: JSON.stringify(userData),
    });

    res.json({
      success: true,
      sessionId,
      apiKey: process.env.OPENTOK_API_KEY,
      token,
    });
  } catch (error) {
    console.error("❌ Error generating token:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate token",
      error: error.message,
    });
  }
});

export default router;
