const db = require('../../../models');
const School = db.School;

exports.getAllSchools = async (req, res) => {
  try {
    const schools = await School.findAll();
    res.json(schools);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSchoolById = async (req, res) => {
  try {
    const school = await School.findByPk(req.params.id);
    if (!school) return res.status(404).json({ error: 'School not found' });
    res.json(school);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSchool = async (req, res) => {
  try {
    const school = await School.create(req.body);
    res.status(201).json(school);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateSchool = async (req, res) => {
  try {
    const school = await School.findByPk(req.params.id);
    if (!school) return res.status(404).json({ error: 'School not found' });
    await school.update(req.body);
    res.json(school);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteSchool = async (req, res) => {
  try {
    const school = await School.findByPk(req.params.id);
    if (!school) return res.status(404).json({ error: 'School not found' });
    await school.destroy();
    res.json({ message: 'School deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 