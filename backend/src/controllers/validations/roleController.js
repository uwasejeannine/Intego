const db = require("../../../models/index");
const { Role } = db;

class RoleController {
  static async getAllRoles(req, res) {
    try {
      const allRoles = await Role.findAll();

      res
        .status(200)
        .send({ message: "Roles fetched successfully", roles: allRoles });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  static async getRoleById(req, res) {
    const roleId = req.params.id;
    try {
      const role = await Role.findByPk(roleId);

      if (!role) {
        return res.status(404).send({ message: "Role not found" });
      }

      return res
        .status(200)
        .send({ message: "Role fetched successfully", role: role });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  static async createRole(req, res) {
    const { name, description } = req.body;

    try {
      // Check if the role already exists in the database
      const existingRole = await Role.findOne({ where: { name } });

      if (existingRole) {
        return res.status(400).send({ message: "Role already exists" });
      }

      // Create the new role
      const newRole = await Role.create({
        name,
        description,
      });

      return res
        .status(201)
        .send({ message: "Role created successfully", role: newRole });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  static async updateRole(req, res) {
    const roleId = req.params.id;
    const { name, description } = req.body;

    try {
      const role = await Role.findByPk(roleId);

      if (!role) {
        return res.status(404).send({ message: "Role not found" });
      }

      const updatedRole = await role.update({
        name,
        description,
      });

      return res
        .status(200)
        .send({ message: "Role updated successfully", role: updatedRole });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  static async deleteRole(req, res) {
    const roleId = req.params.id;

    try {
      const role = await Role.findByPk(roleId);

      if (!role) {
        return res.status(404).send({ message: "Role not found" });
      }

      await role.destroy();

      return res.status(200).send({ message: "Role deleted successfully" });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }
}

module.exports = RoleController;
