const db = require("../../../models/index");
const { Archive } = db;

class ArchiveController {
  static async getAllArchives(req, res) {
    try {
      const allArchives = await Archive.findAll();

      res.status(200).send({
        message: "Archives fetched successfully",
        archives: allArchives,
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  static async getArchiveById(req, res) {
    const archiveId = req.params.id;
    try {
      const archive = await Archive.findByPk(archiveId);

      if (!archive) {
        return res.status(404).send({ message: "Archive not found" });
      }

      return res
        .status(200)
        .send({ message: "Archive fetched successfully", archive: archive });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  static async createArchive(req, res) {
    const { projectId, archive_date, categoriesId } = req.body;

    try {
      const newArchive = await Archive.create({
        projectId,
        categoriesId,
        archive_date,
      });

      return res
        .status(201)
        .send({ message: "Archive created successfully", archive: newArchive });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  static async updateArchive(req, res) {
    const archiveId = req.params.id;
    const { name, description, categoriesId } = req.body;

    try {
      const archive = await Archive.findByPk(archiveId);

      if (!archive) {
        return res.status(404).send({ message: "Archive not found" });
      }

      const updatedArchive = await archive.update({
        projectId,
        archive_date,
        categoriesId,
      });

      if (!updatedArchive) {
        return res.status(404).send({ message: "Updating archive failed" });
      }

      return res.status(200).send({ message: "Archive updated successfully" });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  static async deleteArchive(req, res) {
    const archiveId = req.params.id;

    try {
      const archive = await Archive.findByPk(archiveId);

      if (!archive) {
        return res.status(404).send({ message: "Archive not found" });
      }

      await archive.destroy();

      return res.status(200).send({ message: "Archive deleted successfully" });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }
}

module.exports = ArchiveController;
