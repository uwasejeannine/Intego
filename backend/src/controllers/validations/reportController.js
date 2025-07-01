const db = require("../../../models/index");
const { Report } = db;
const { Project } = db;

class ReportController {
  static async getAllReports(req, res) {
    try {
      const allReports = await Report.findAll({
        attributes: [
          "id",
          "projectId",
          "projectName",
          "totalBudgetSpending",
          "location",
          "totalProjectBudget",
          "projectDuration",
          "projectDescription",
          "projectObjectives",
          "keyOutputs",
          "keyChallengesFaced",
          "proposedSolutions",
          "categoryOfProject",
          "keyIndicators",
          "annTargets",
          "cumulativeAchievements",
          "nonCumulativeAchievements",
          "term",
          "status",
          "createdAt",
        ],
      });

      res
        .status(200)
        .send({ message: "Reports fetched successfully", reports: allReports });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  static async getReportById(req, res) {
    const reportId = req.params.id;
    try {
      const report = await Report.findByPk(reportId);

      if (!report) {
        return res.status(404).send({ message: "Report not found" });
      }

      return res
        .status(200)
        .send({ message: "Report fetched successfully", report: report });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  static async createReport(req, res) {
    const {
      projectName,
      totalBudgetSpending,
      location,
      totalProjectBudget,
      projectDuration,
      projectDescription,
      projectObjectives,
      keyOutputs,
      keyChallengesFaced,
      proposedSolutions,
      categoryOfProject,
      keyIndicators,
      annTargets,
      cumulativeAchievements,
      nonCumulativeAchievements,
      term,
      userId,
    } = req.body;

    // Validate request body
    if (!projectName || !totalBudgetSpending) {
      return res.status(400).send({
        message: "Project name and total budget spending are required fields.",
      });
    }

    try {
      // Check if project exists
      const project = await Project.findOne({ where: { projectName } });
      if (!project) {
        return res.status(404).send({ message: "Project not found" });
      }

      // Fetch all reports with the same projectId
      const allReports = await Report.findAll({
        where: { projectId: project.id },
      });

      // Calculate the total cumulativeAchievements by adding all cumulativeAchievements from reports
      let totalCumulativeAchievements = 0;
      allReports.forEach((report) => {
        totalCumulativeAchievements += parseFloat(
          report.cumulativeAchievements,
        );
      });

      // Add the new cumulativeAchievements provided by the user
      totalCumulativeAchievements += parseFloat(cumulativeAchievements);

      // Calculate the new totalBudgetSpending
      const mostRecentReport = allReports.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      )[0];
      const newTotalBudgetSpending = mostRecentReport
        ? parseFloat(mostRecentReport.totalBudgetSpending) +
          parseFloat(totalBudgetSpending)
        : parseFloat(totalBudgetSpending);

      // Create the new report
      const newReport = await Report.create({
        projectId: project.id,
        projectName,
        totalBudgetSpending: newTotalBudgetSpending,
        location,
        totalProjectBudget,
        projectDuration,
        projectDescription,
        projectObjectives,
        keyOutputs,
        keyChallengesFaced,
        proposedSolutions,
        categoryOfProject,
        keyIndicators,
        annTargets,
        cumulativeAchievements: totalCumulativeAchievements.toString(),
        nonCumulativeAchievements,
        term,
        userId,
      });

      return res.status(201).send({
        message: "Report created successfully",
        totalBudgetSpending: newTotalBudgetSpending,
        cumulativeAchievements: totalCumulativeAchievements,
        projectId: project.id,
        report: newReport,
      });
    } catch (error) {
      console.error("Error creating report:", error);
      return res.status(500).send({
        message: "An error occurred while creating the report.",
      });
    }
  }

  static async updateReport(req, res) {
    const reportId = req.params.id;
    const {
      projectId,
      projectName,
      totalBudgetSpending,
      location,
      totalProjectBudget,
      projectDuration,
      projectDescription,
      projectObjectives,
      keyOutputs,
      keyChallengesFaced,
      proposedSolutions,
      categoryOfProject,
      keyIndicators,
      annTargets,
      cumulativeAchievements,
      nonCumulativeAchievements,
      status,
      term,
      userId,
    } = req.body;

    try {
      const report = await Report.findByPk(reportId);

      if (!report) {
        return res.status(404).send({
          message: "Report not found",
        });
      }

      const updateData = {
        projectId,
        projectName,
        totalBudgetSpending,
        location,
        totalProjectBudget,
        projectDuration,
        projectDescription,
        projectObjectives,
        keyOutputs,
        keyChallengesFaced,
        proposedSolutions,
        categoryOfProject,
        keyIndicators,
        annTargets,
        cumulativeAchievements,
        nonCumulativeAchievements,
        term,
        status,
        userId,
      };

      // Remove undefined fields from updateData
      Object.keys(updateData).forEach(
        (key) => updateData[key] === undefined && delete updateData[key],
      );

      // Update the report
      const updatedReport = await report.update(updateData);

      return res.status(200).send({
        message: "Report updated successfully",
        report: updatedReport,
      });
    } catch (error) {
      return res.status(500).send({
        message: error.message,
      });
    }
  }

  static async deleteReport(req, res) {
    const reportId = req.params.id;

    try {
      const report = await Report.findByPk(reportId);

      if (!report) {
        return res.status(404).send({ message: "Report not found" });
      }

      await report.destroy();

      return res.status(200).send({ message: "Report deleted successfully" });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }
}

module.exports = ReportController;
