const { District, Sector } = require('../../../models');

class LocationController {
  static async getDistricts(req, res) {
    try {
      const districts = await District.findAll();
      res.status(200).json({
        status: 'success',
        data: districts
      });
    } catch (error) {
      console.error('Error fetching districts:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch districts'
      });
    }
  }

  static async getSectors(req, res) {
    try {
      const sectors = await Sector.findAll();
      res.status(200).json({
        status: 'success',
        data: sectors
      });
    } catch (error) {
      console.error('Error fetching sectors:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch sectors'
      });
    }
  }

  static async getSectorsByDistrict(req, res) {
    try {
      const { districtId } = req.params;
      const sectors = await Sector.findAll({
        where: { district_id: districtId }
      });
      res.status(200).json({
        status: 'success',
        data: sectors
      });
    } catch (error) {
      console.error('Error fetching sectors by district:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch sectors'
      });
    }
  }
}

module.exports = LocationController; 