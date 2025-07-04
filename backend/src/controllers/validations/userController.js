const Sequelize = require("sequelize");
const db = require("../../../models/index");
const { User } = db;
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

class UsersController {
  static async getAllUsers(req, res) {
    try {
      const allUsers = await User.findAll({
        attributes: { exclude: ["password"] },
      });

      res
        .status(200)
        .send({ message: "Users fetched successfully", users: allUsers });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  static async getUserById(req, res) {
    const userId = req.params.id;
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      return res
        .status(200)
        .send({ message: "User fetched successfully", user: user });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  // userController.js
  static async updateUser(req, res) {
    const userId = req.params.id;
    const {
      username,
      email,
      password,
      first_name,
      gender,
      phoneNumber,
      sectorofOperations,
      last_name,
      roleId,
      status,
    } = req.body;

    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      const updateData = {
        roleId,
        username,
        email,
        first_name,
        gender,
        phoneNumber,
        sectorofOperations,
        last_name,
        status,
      };

      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      if (req.file) {
        const imageUrl = req.file.filename;
        updateData.profileImage = imageUrl;
      }

      const updatedUser = await user.update(updateData);

      return res
        .status(200)
        .send({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  static async updateMultipleUsers(req, res) {
    const userIds = req.body.userIds;
    const {
      username,
      profileImage,
      email,
      first_name,
      gender,
      phoneNumber,
      sectorofOperations,
      last_name,
      roleId,
      status,
    } = req.body;

    try {
      const [updatedCount] = await User.update(
        {
          roleId: roleId,
          profileImage: profileImage,
          username: username,
          email: email,
          first_name: first_name,
          gender: gender,
          phoneNumber: phoneNumber,
          sectorofOperations: sectorofOperations,
          last_name: last_name,
          status: status,
        },
        {
          where: {
            id: userIds,
          },
        },
      );

      if (updatedCount === 0) {
        return res.status(404).send({ message: "No users found for update" });
      }

      return res
        .status(200)
        .send({ message: `${updatedCount} users updated successfully` });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  static async deleteUser(req, res) {
    const userId = req.params.id;

    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      await user.destroy();

      return res.status(200).send({ message: "User deleted successfully" });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  static async deleteMultipleUsers(req, res) {
    const userIds = req.body.userIds;

    try {
      const deletedCount = await User.destroy({
        where: {
          id: userIds,
        },
      });

      if (deletedCount === 0) {
        return res.status(404).send({ message: "No users found for deletion" });
      }

      return res
        .status(200)
        .send({ message: `${deletedCount} users deleted successfully` });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  static async createUser(req, res) {
    const {
      username,
      profileImage,
      email,
      first_name,
      gender,
      phoneNumber,
      sectorofOperations,
      last_name,
      roleId,
      status,
    } = req.body;

    // Generate a temporary password
    const tempPassword = crypto.randomBytes(10).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    try {
      const newUser = await User.create({
        profileImage,
        username,
        email,
        password: hashedPassword,
        first_name,
        last_name,
        gender,
        phoneNumber,
        sectorofOperations,
        roleId,
        status: "Pending",
      });

      // Send the temporary password to the user via email
      let transporter = nodemailer.createTransport({
        service: "Gmail",
        port: 465,
        secure: true, // Changed to true for Gmail with port 465
        auth: {
          user: process.env.EMAIL_USERNAME || "jeannineuwasee@gmail.com",
          pass: process.env.EMAIL_PASSWORD || "yeur whbl uqmm bpea",
        },
        debug: true,
      });

      // Verify transporter configuration
      transporter.verify(function (error, success) {
        if (error) {
          console.log("❌ Email transporter verification failed:", error);
        } else {
          console.log("✅ Email server is ready to take our messages");
        }
      });

      const loginLink = `http://localhost:5174/auth/login`;

      let mailOptions = {
        from: `"Intego360 Team" <${process.env.EMAIL_USERNAME || "jeannineuwasee@gmail.com"}>`,
        to: newUser.email,
        subject: "Welcome to Intego360",
        html: `
          <div style="text-align: center;">
            <img src="https://www.minagri.gov.rw/index.php?eID=dumpFile&t=f&f=1679&token=c456432515e20118795fbbd0cce379ac2bcd0a14" alt="Logo" style="width: 100px; height: 100px;">
          </div>
          <div style="background-color: #137775; color: white; text-align: center; padding: 10px;">
            <h2 style="font-weight: bold;">Welcome to Intego360</h2>
          </div>
          <p style="text-align: center;">Hello ${newUser.first_name},</p>
          <p style="text-align: center;">  account has been created successfully.</p>
          <p style="text-align: center;">  username is:</p>
          <pre style="text-align: center; font-size: 20px; background: #f0f0f0; padding: 10px; border-radius: 5px;">${newUser.username}</pre>
          <p style="text-align: center;">  temporary password is:</p>
          <pre style="text-align: center; font-size: 20px; background: #f0f0f0; padding: 10px; border-radius: 5px;">${tempPassword}</pre>
          <p style="text-align: center;">Please use the following link to login:</p>
          <p style="text-align: center;"><a href="${loginLink}" style="color: #137775; text-decoration: none; font-weight: bold;">${loginLink}</a></p>
          <p style="text-align: center; color: #666; font-size: 14px;">Please change   password after   first login for security purposes.</p>
          <div style="text-align: center; color: #137775; margin-top: 20px;">
            <p>The Local Government | Rwanda</p>
          </div>
        `,
      };

      // Send email asynchronously to avoid blocking the response
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("❌ Failed to send welcome email:", error);
        } else {
          console.log("✅ Welcome email sent successfully:", info.response);
        }
      });

      console.log("✅ New user created:", {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        sectorofOperations: newUser.sectorofOperations
      });

      // Return response without password
      const userResponse = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        gender: newUser.gender,
        phoneNumber: newUser.phoneNumber,
        sectorofOperations: newUser.sectorofOperations,
        profileImage: newUser.profileImage,
        roleId: newUser.roleId,
        status: newUser.status,
        loginAttempts: newUser.loginAttempts
      };

      return res.status(201).json({
        message: "User created successfully",
        user: userResponse
      });

    } catch (error) {
      console.error('❌ Full error details:', error);
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);
      
      if (error instanceof Sequelize.ValidationError) {
        console.error('🔍 Validation errors:', error.errors);
        // Validation error(s) occurred
        const messages = error.errors.map((err) => ({
          field: err.path,
          message: err.message,
          value: err.value
        }));
        res.status(400).json({ errors: messages });
      } else if (error.name === 'SequelizeUniqueConstraintError') {
        console.error('🔍 Unique constraint error:', error.errors);
        res.status(400).json({ error: "Email or username already exists" });
      } else if (error.name === 'SequelizeDatabaseError') {
        console.error('🔍 Database error:', error.sql);
        res.status(400).json({ 
          error: "Database error", 
          details: error.message 
        });
      } else {
        // Some other error occurred
        console.error('🔍 Unknown error:', error.stack);
        res.status(500).json({ 
          error: "Something went wrong", 
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    }
  }
}

module.exports = UsersController;