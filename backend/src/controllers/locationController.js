const { District, Sector } = require('../../models');

const getAllDistricts = async (req, res) => {
  try {
    const districts = await District.findAll({ include: 'sectors' });
    res.status(200).json({
      success: true,
      message: 'Districts retrieved successfully',
      data: districts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving districts',
      error: error.message,
    });
  }
};

const getAllSectors = async (req, res) => {
  try {
    const sectors = await Sector.findAll();
    res.status(200).json({
      success: true,
      message: 'Sectors retrieved successfully',
      data: sectors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving sectors',
      error: error.message,
    });
  }
};

module.exports = {
  getAllDistricts,
  getAllSectors,
}; 