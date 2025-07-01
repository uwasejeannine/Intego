// controllers/validations/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { User, Sequelize } = require("../../../models/index");
const { Op } = Sequelize;

class AuthController {
  static async login(req, res) {
    console.log('📨 Login request received:', req.body);
    
    // Accept multiple field names for flexibility
    const { 
      usernameOrEmail, 
      email, 
      username, 
      password 
    } = req.body;

    // Use the first available identifier
    const identifier = usernameOrEmail || email || username;

    console.log('🔍 Extracted identifier:', identifier);
    console.log('🔍 Password provided:', password ? 'Yes' : 'No');

    if (!identifier || !password) {
      return res.status(400).json({ 
        message: "Username/email and password are required",
        received: {
          identifier: !!identifier,
          password: !!password
        }
      });
    }

    try {
      // Check if the user exists by username or email
      console.log('🔍 Searching for user with identifier:', identifier);
      
      const user = await User.findOne({
        where: {
          [Op.or]: [{ username: identifier }, { email: identifier }],
        },
        attributes: [
          "id",
          "username",
          "email",
          "password",
          "roleId",
          "first_name",
          "last_name",
          "profileImage",
          "loginAttempts",
          "status",
        ],
      });

      console.log('👤 User found:', user ? `Yes (ID: ${user.id})` : 'No');

      if (!user) {
        console.log('❌ User not found');
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the account is locked
      if (user.status === "Locked") {
        console.log('🔒 Account is locked');
        
        // Send an email about the account lockout
        const transporter = nodemailer.createTransporter({
          service: "Gmail",
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL_USERNAME || "jeannineuwasee@gmail.com",
            pass: process.env.EMAIL_PASSWORD || "yeur whbl uqmm bpea",
          },
          debug: true,
        });

        const mailOptions = {
          from: `"Digital Office" <${process.env.EMAIL_USERNAME || "jeannineuwasee@gmail.com"}>`,
          to: user.email,
          subject: "Account Lockout Notification",
          html: `
          <div style="text-align: center;">
            <img src="https://www.minagri.gov.rw/index.php?eID=dumpFile&t=f&f=1679&token=c456432515e20118795fbbd0cce379ac2bcd0a14" alt="Logo" style="width: 100px; height: 100px;">
          </div>
          <div style="background-color: #078ECE; color: white; text-align: center; padding: 10px;">
            <h2 style="font-weight: bold;">Account Lockout Notification</h2>
          </div>
          <p style="text-align: center;">Your account has been temporarily locked due to multiple unsuccessful login attempts. Please contact the administrator to unlock your account.</p>
          <div style="text-align: center; color: #078ECE;">
            <p>The Digital Office | MINAGRI</p>
          </div>
        `,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log('📧 Lockout notification email sent');
        } catch (emailError) {
          console.error('❌ Failed to send lockout email:', emailError);
        }

        return res.status(403).json({
          message: "Account locked. Please check your email for instructions to unlock your account.",
        });
      }

      // Validate password
      console.log('🔐 Validating password...');
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log('🔐 Password valid:', isValidPassword);
      
      if (!isValidPassword) {
        console.log('❌ Invalid password, incrementing login attempts');
        
        // Increment login attempts
        await user.increment("loginAttempts");

        // Check if login attempts exceed five times
        if (user.loginAttempts >= 4) { // Will be 5 after increment
          console.log('🔒 Locking account due to too many attempts');
          
          // Lock the account
          await user.update({ status: "Locked" });

          // Send lockout email (similar to above)
          // ... email code ...

          return res.status(403).json({
            message: "Account locked due to too many failed attempts. Please check your email for instructions.",
          });
        }

        const remainingAttempts = 5 - (user.loginAttempts + 1);
        return res.status(401).json({ 
          message: `Invalid credentials. ${remainingAttempts} attempts remaining.` 
        });
      }

      // Reset login attempts on successful login
      console.log('✅ Login successful, resetting attempts and updating status');
      await user.update({ 
        loginAttempts: 0,
        status: "Active"
      });

      // Generate JWT token with proper secret
      const token = jwt.sign(
        { 
          userId: user.id,
          id: user.id, // For compatibility
          roleId: user.roleId,
          username: user.username,
          email: user.email
        }, 
        process.env.JWT_SECRET || process.env.JWT_SECRET_KEY || "your_secret_key",
        { expiresIn: "24h" }
      );

      console.log('🎫 JWT token generated successfully');

      // Return the success response
      const response = {
        message: "Login successful",
        success: true,
        token,
        userId: user.id,
        roleId: user.roleId,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        status: "Active"
      };

      console.log('✅ Sending successful login response');
      res.status(200).json(response);

    } catch (error) {
      console.error('❌ Login error:', error);
      res.status(500).json({ 
        message: error.message,
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  static async logout(req, res) {
    try {
      // Get the username or email from the request body
      const { usernameOrEmail, email, username } = req.body;
      const identifier = usernameOrEmail || email || username;

      if (!identifier) {
        return res.status(400).json({ message: "Username or email is required" });
      }

      // Check if the user exists
      const user = await User.findOne({
        where: {
          [Op.or]: [{ username: identifier }, { email: identifier }],
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user's status to "Offline"
      await user.update({ status: "Offline" });

      res.status(200).json({ 
        message: "Logout successful",
        success: true 
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async forgotPassword(req, res) {
    const { email } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if there is already a code sent to this email within the last 15 minutes
      const currentTime = new Date();
      const codeExpirationTime = user.passwordResetExpires;

      if (codeExpirationTime && currentTime < codeExpirationTime) {
        const timeDiff = Math.ceil(
          (codeExpirationTime - currentTime) / (1000 * 60),
        ); // Calculate time difference in minutes
        return res.status(400).json({
          message: `A code was already sent to your email. Please wait ${timeDiff} minutes before requesting a new one.`,
        });
      }

      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000);

      // Hash the code before storing it in the database
      const hashedCode = await bcrypt.hash(code.toString(), 10);

      // Update user's passwordResetExpires field
      user.passwordResetExpires = new Date(
        currentTime.getTime() + 15 * 60 * 1000,
      ); // Set expiration time to 15 minutes from now
      user.passwordResetCode = hashedCode; // Save the hashed code
      await user.save();

      // Send email with unhashed code
      const transporter = nodemailer.createTransporter({
        service: "Gmail",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USERNAME || "jeannineuwasee@gmail.com",
          pass: process.env.EMAIL_PASSWORD || "yeur whbl uqmm bpea",
        },
        debug: true,
      });

      const mailOptions = {
        from: `"Digital Office" <${process.env.EMAIL_USERNAME || "jeannineuwasee@gmail.com"}>`,
        to: email,
        subject: "Password Reset Code",
        html: `
        <div style="text-align: center;">
          <img src="https://www.minagri.gov.rw/index.php?eID=dumpFile&t=f&f=1679&token=c456432515e20118795fbbd0cce379ac2bcd0a14" alt="Logo" style="width: 100px; height: 100px;">
        </div>
        <div style="background-color: #078ECE; color: white; text-align: center; padding: 10px;">
          <h2 style="font-weight: bold;">Password Reset Code</h2>
        </div>
        <p style="text-align: center;">Your password reset code is:</p>
        <pre style="text-align: center; font-size: 20px; background: #f0f0f0; padding: 10px; border-radius: 5px;">${code}</pre>
        <p style="text-align: center; color: #666; font-size: 14px;">This code will expire in 15 minutes.</p>
        <div style="text-align: center; color: #078ECE;">
          <p>The Digital Office | MINAGRI</p>
        </div>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('❌ Failed to send password reset email:', error);
          return res.status(500).json({ message: "Failed to send email" });
        } else {
          console.log('✅ Password reset email sent:', info.response);
          return res.status(200).json({ 
            message: "Password reset code sent to your email",
            success: true 
          });
        }
      });
    } catch (error) {
      console.error('❌ Forgot password error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  static async validateCode(req, res) {
    const { code } = req.body;

    try {
      if (!code) {
        return res.status(400).json({ message: "Reset code is required" });
      }

      // Find the user by the provided code
      const users = await User.findAll({
        where: {
          passwordResetCode: {
            [Op.not]: null
          },
          passwordResetExpires: {
            [Op.gt]: new Date() // Only get users with non-expired codes
          }
        }
      });

      console.log(`🔍 Found ${users.length} users with active reset codes`);

      // Loop through users to find a match for the provided code
      let matchedUser = null;
      for (const user of users) {
        if (user.passwordResetCode && bcrypt.compareSync(code.toString(), user.passwordResetCode)) {
          matchedUser = user;
          break;
        }
      }

      if (!matchedUser) {
        console.log('❌ Invalid or expired reset code');
        return res.status(401).json({ message: "Invalid or expired code" });
      }

      // Check if the stored code has expired (double-check)
      const currentTime = new Date();
      const codeExpirationTime = matchedUser.passwordResetExpires;

      if (!codeExpirationTime || currentTime > codeExpirationTime) {
        console.log('❌ Reset code has expired');
        return res.status(401).json({ message: "Code has expired" });
      }

      console.log('✅ Reset code validated successfully for user:', matchedUser.email);

      // Code is valid - Clear code and expiration time from user
      await matchedUser.update({
        passwordResetCode: null,
        passwordResetExpires: null,
      });

      return res.status(200).json({ 
        message: "Code is valid", 
        success: true,
        userId: matchedUser.id,
        email: matchedUser.email
      });
    } catch (error) {
      console.error('❌ Validate code error:', error);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = AuthController;