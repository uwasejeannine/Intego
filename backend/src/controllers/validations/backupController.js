const db = require("../../../models/index");
const { Backup } = db;

class BackupController {
  static async getAllBackups(req, res) {
    try {
      const allBackups = await Backup.findAll();

      res
        .status(200)
        .send({ message: "Backups fetched successfully", backups: allBackups });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  static async getBackupById(req, res) {
    const backupId = req.params.id;
    try {
      const backup = await Backup.findByPk(backupId);

      if (!backup) {
        return res.status(404).send({ message: "Backup not found" });
      }

      return res
        .status(200)
        .send({ message: "Backup fetched successfully", backup: backup });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  static async createBackup(req, res) {
    const { name, filePath, backuptype, creationTime, scheduleId } = req.body;

    try {
      const newBackup = await Backup.create({
        name,
        filePath,
        backuptype,
        creationTime,
        scheduleId,
      });

      return res
        .status(201)
        .send({ message: "Backup created successfully", backup: newBackup });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  static async updateBackup(req, res) {
    const backupId = req.params.id;
    const { name, filePath, backuptype, creationTime, scheduleId } = req.body;

    try {
      const backup = await Backup.findByPk(backupId);

      if (!backup) {
        return res.status(404).send({ message: "Backup not found" });
      }

      const updatedBackup = await backup.update({
        name,
        filePath,
        backuptype,
        creationTime,
        scheduleId,
      });

      return res.status(200).send({
        message: "Backup updated successfully",
        backup: updatedBackup,
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  static async deleteBackup(req, res) {
    const backupId = req.params.id;

    try {
      const backup = await Backup.findByPk(backupId);

      if (!backup) {
        return res.status(404).send({ message: "Backup not found" });
      }

      await backup.destroy();

      return res.status(200).send({ message: "Backup deleted successfully" });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }
}

module.exports = BackupController;
