const db = require('../../../models');
const VaccinationCampaign = db.VaccinationCampaign;

exports.getAll = async (req, res) => {
  try {
    const campaigns = await VaccinationCampaign.findAll();
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const campaign = await VaccinationCampaign.findByPk(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Not found' });
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const campaign = await VaccinationCampaign.create(req.body);
    res.status(201).json(campaign);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const campaign = await VaccinationCampaign.findByPk(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Not found' });
    await campaign.update(req.body);
    res.json(campaign);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const campaign = await VaccinationCampaign.findByPk(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Not found' });
    await campaign.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 