const db = require("../../../models/index");
const { HealthFacility, Region } = db;
const { Op } = require("sequelize");

class HealthFacilityController {
  static async getAllHealthFacilities(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        region_id, 
        facility_type,
        ownership_type,
        operational_status,
        is_active,
        search,
        equipment_status,
        has_emergency
      } = req.query;
      
      const offset = (page - 1) * limit;
      
      const whereClause = {};
      
      // Filters
      if (region_id) whereClause.region_id = region_id;
      if (facility_type) whereClause.facility_type = facility_type;
      if (ownership_type) whereClause.ownership_type = ownership_type;
      if (operational_status) whereClause.operational_status = operational_status;
      if (equipment_status) whereClause.equipment_status = equipment_status;
      if (is_active !== undefined) whereClause.is_active = is_active === 'true';
      if (has_emergency !== undefined) whereClause.has_emergency = has_emergency === 'true';
      
      // Search functionality
      if (search) {
        whereClause[Op.or] = [
          { facility_name: { [Op.iLike]: `%${search}%` } },
          { facility_code: { [Op.iLike]: `%${search}%` } },
          { director_name: { [Op.iLike]: `%${search}%` } },
        ];
      }

      const healthFacilities = await HealthFacility.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [
          {
            model: Region,
            as: "region",
            attributes: ['id', 'region_name', 'region_code'],
          },
        ],
        order: [['facility_name', 'ASC']],
      });

      // Add computed fields to each facility
      const facilitiesWithComputedData = healthFacilities.rows.map(facility => {
        const facilityData = facility.toJSON();
        facilityData.fullAddress = facility.getFullAddress();
        facilityData.occupancyRate = facility.getOccupancyRate();
        facilityData.occupancyStatus = facility.getOccupancyStatus();
        facilityData.capacityUtilization = facility.getCapacityUtilization();
        facilityData.servicesOfferedArray = facility.getServicesOffered();
        facilityData.staffSummary = facility.getStaffSummary();
        facilityData.facilityCapabilities = facility.getFacilityCapabilities();
        facilityData.isOperational = facility.isOperational();
        facilityData.facilityRating = facility.getFacilityRating();
        facilityData.isLicenseValid = facility.isLicenseValid();
        facilityData.daysUntilLicenseExpiry = facility.getDaysUntilLicenseExpiry();
        return facilityData;
      });

      res.status(200).json({
        message: "Health facilities fetched successfully",
        data: facilitiesWithComputedData,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(healthFacilities.count / limit),
          totalItems: healthFacilities.count,
          itemsPerPage: parseInt(limit),
        },
      });
    } catch (error) {
      console.error('Error fetching health facilities:', error);
      res.status(500).json({ message: error.message });
    }
  }

  static async getHealthFacilityById(req, res) {
    const facilityId = req.params.id;
    try {
      const healthFacility = await HealthFacility.findByPk(facilityId, {
        include: [
          {
            model: Region,
            as: "region",
          },
        ],
      });

      if (!healthFacility) {
        return res.status(404).json({ message: "Health facility not found" });
      }

      // Add computed fields
      const facilityData = healthFacility.toJSON();
      facilityData.fullAddress = healthFacility.getFullAddress();
      facilityData.occupancyRate = healthFacility.getOccupancyRate();
      facilityData.occupancyStatus = healthFacility.getOccupancyStatus();
      facilityData.capacityUtilization = healthFacility.getCapacityUtilization();
      facilityData.servicesOfferedArray = healthFacility.getServicesOffered();
      facilityData.staffSummary = healthFacility.getStaffSummary();
      facilityData.facilityCapabilities = healthFacility.getFacilityCapabilities();
      facilityData.isOperational = healthFacility.isOperational();
      facilityData.facilityRating = healthFacility.getFacilityRating();
      facilityData.isLicenseValid = healthFacility.isLicenseValid();
      facilityData.daysUntilLicenseExpiry = healthFacility.getDaysUntilLicenseExpiry();

      return res.status(200).json({
        message: "Health facility fetched successfully",
        data: facilityData,
      });
    } catch (error) {
      console.error('Error fetching health facility:', error);
      return res.status(500).json({ message: error.message });
    }
  }

  static async createHealthFacility(req, res) {
    try {
      console.log('=== CREATE HEALTH FACILITY DEBUG ===');
      console.log('Raw request body:', JSON.stringify(req.body, null, 2));

      const {
        facility_name,
        facility_code,
        facility_type,
        ownership_type,
        region_id,
        phone,
        email,
        bed_capacity,
        current_occupancy,
        total_staff,
        doctors,
        nurses,
        medical_assistants,
        support_staff,
        services_offered,
        has_laboratory,
        has_pharmacy,
        has_radiology,
        has_maternity,
        has_emergency,
        has_ambulance,
        equipment_status,
        infrastructure_status,
        power_source,
        water_source,
        operational_status,
        operating_hours,
        monthly_patient_capacity,
        average_monthly_patients,
        last_inspection_date,
        accreditation_status,
        license_number,
        license_expiry_date,
        director_name,
        director_phone,
        director_email,
        emergency_preparedness_level,
        isolation_beds,
        icu_beds,
        established_date,
        notes,
      } = req.body;

      // Check if facility with same name or code exists
      const existingFacility = await HealthFacility.findOne({
        where: {
          [Op.or]: [
            { facility_name },
            { facility_code: facility_code?.toUpperCase() }
          ],
        },
      });

      if (existingFacility) {
        return res.status(400).json({
          message: "Health facility with the same name or code already exists",
        });
      }

      // Verify region exists if provided
      if (region_id) {
        const region = await Region.findByPk(region_id);
        if (!region) {
          return res.status(400).json({ message: "Invalid region ID" });
        }
      }

      // Convert services_offered array to JSON string if it's an array
      let servicesOfferedString = services_offered;
      if (Array.isArray(services_offered)) {
        servicesOfferedString = JSON.stringify(services_offered);
      }

      const newHealthFacility = await HealthFacility.create({
        facility_name,
        facility_code: facility_code?.toUpperCase(),
        facility_type,
        ownership_type: ownership_type || 'public',
        region_id,
        phone,
        email,
        bed_capacity: bed_capacity ? parseInt(bed_capacity) : 0,
        current_occupancy: current_occupancy ? parseInt(current_occupancy) : 0,
        total_staff: total_staff ? parseInt(total_staff) : 0,
        doctors: doctors ? parseInt(doctors) : 0,
        nurses: nurses ? parseInt(nurses) : 0,
        medical_assistants: medical_assistants ? parseInt(medical_assistants) : 0,
        support_staff: support_staff ? parseInt(support_staff) : 0,
        services_offered: servicesOfferedString,
        has_laboratory: has_laboratory || false,
        has_pharmacy: has_pharmacy || false,
        has_radiology: has_radiology || false,
        has_maternity: has_maternity || false,
        has_emergency: has_emergency || false,
        has_ambulance: has_ambulance || false,
        equipment_status: equipment_status || 'good',
        infrastructure_status: infrastructure_status || 'good',
        power_source: power_source || 'grid',
        water_source: water_source || 'piped',
        operational_status: operational_status || 'fully_operational',
        operating_hours: operating_hours || '24/7',
        monthly_patient_capacity: monthly_patient_capacity ? parseInt(monthly_patient_capacity) : 0,
        average_monthly_patients: average_monthly_patients ? parseInt(average_monthly_patients) : 0,
        last_inspection_date,
        accreditation_status: accreditation_status || 'pending',
        license_number,
        license_expiry_date,
        director_name,
        director_phone,
        director_email,
        emergency_preparedness_level: emergency_preparedness_level || 'medium',
        isolation_beds: isolation_beds ? parseInt(isolation_beds) : 0,
        icu_beds: icu_beds ? parseInt(icu_beds) : 0,
        established_date,
        notes,
        is_active: true,
      });

      return res.status(201).json({
        message: "Health facility created successfully",
        data: newHealthFacility,
      });
    } catch (error) {
      console.error('Error creating health facility:', error);
      
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map(err => ({
          field: err.path,
          message: err.message,
          value: err.value,
        }));
        
        return res.status(400).json({
          error: 'Validation Error',
          message: error.message,
          details: validationErrors
        });
      }
      
      return res.status(500).json({ message: error.message });
    }
  }

  static async updateHealthFacility(req, res) {
    const facilityId = req.params.id;
    try {
      const healthFacility = await HealthFacility.findByPk(facilityId);

      if (!healthFacility) {
        return res.status(404).json({ message: "Health facility not found" });
      }

      // Handle services_offered conversion if it's an array
      const updateData = { ...req.body };
      if (Array.isArray(updateData.services_offered)) {
        updateData.services_offered = JSON.stringify(updateData.services_offered);
      }

      // Convert facility_code to uppercase if provided
      if (updateData.facility_code) {
        updateData.facility_code = updateData.facility_code.toUpperCase();
      }

      const updatedHealthFacility = await healthFacility.update(updateData);

      return res.status(200).json({
        message: "Health facility updated successfully",
        data: updatedHealthFacility,
      });
    } catch (error) {
      console.error('Error updating health facility:', error);
      
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map(err => ({
          field: err.path,
          message: err.message,
          value: err.value
        }));
        
        return res.status(400).json({
          error: 'Validation Error',
          message: error.message,
          details: validationErrors
        });
      }

      return res.status(500).json({ message: error.message });
    }
  }

  static async deleteHealthFacility(req, res) {
    const facilityId = req.params.id;
    try {
      const healthFacility = await HealthFacility.findByPk(facilityId);

      if (!healthFacility) {
        return res.status(404).json({ message: "Health facility not found" });
      }

      // TODO: Check if facility has associated records (patients, vaccinations, etc.)
      // const patientCount = await PatientRecord.count({ where: { facility_id: facilityId } });
      // if (patientCount > 0) {
      //   return res.status(400).json({
      //     message: "Cannot delete health facility with associated patient records",
      //   });
      // }

      await healthFacility.destroy();

      return res.status(200).json({
        message: "Health facility deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting health facility:', error);
      return res.status(500).json({ message: error.message });
    }
  }

  // Get health facility statistics
  static async getHealthFacilityStats(req, res) {
    try {
      const { region_id, facility_type } = req.query;
      
      const whereClause = { is_active: true };
      if (region_id) whereClause.region_id = region_id;
      if (facility_type) whereClause.facility_type = facility_type;

      const stats = await Promise.all([
        // Total active facilities
        HealthFacility.count({ where: whereClause }),
        
        // Facilities by type
        HealthFacility.count({ where: { ...whereClause, facility_type: 'hospital' } }),
        HealthFacility.count({ where: { ...whereClause, facility_type: 'health_center' } }),
        HealthFacility.count({ where: { ...whereClause, facility_type: 'health_post' } }),
        HealthFacility.count({ where: { ...whereClause, facility_type: 'clinic' } }),
        HealthFacility.count({ where: { ...whereClause, facility_type: 'dispensary' } }),
        
        // Facilities by ownership
        HealthFacility.count({ where: { ...whereClause, ownership_type: 'public' } }),
        HealthFacility.count({ where: { ...whereClause, ownership_type: 'private' } }),
        HealthFacility.count({ where: { ...whereClause, ownership_type: 'faith_based' } }),
        
        // Operational status
        HealthFacility.count({ where: { ...whereClause, operational_status: 'fully_operational' } }),
        HealthFacility.count({ where: { ...whereClause, operational_status: 'partially_operational' } }),
        HealthFacility.count({ where: { ...whereClause, operational_status: 'under_maintenance' } }),
        
        // Facilities with emergency services
        HealthFacility.count({ where: { ...whereClause, has_emergency: true } }),
        HealthFacility.count({ where: { ...whereClause, has_ambulance: true } }),
        
        // Total bed capacity and occupancy
        HealthFacility.sum('bed_capacity', { where: whereClause }),
        HealthFacility.sum('current_occupancy', { where: whereClause }),
        
        // Total staff
        HealthFacility.sum('total_staff', { where: whereClause }),
        HealthFacility.sum('doctors', { where: whereClause }),
        HealthFacility.sum('nurses', { where: whereClause }),
        
        // Equipment status distribution
        HealthFacility.count({ where: { ...whereClause, equipment_status: 'excellent' } }),
        HealthFacility.count({ where: { ...whereClause, equipment_status: 'good' } }),
        HealthFacility.count({ where: { ...whereClause, equipment_status: 'fair' } }),
        HealthFacility.count({ where: { ...whereClause, equipment_status: 'poor' } }),
        HealthFacility.count({ where: { ...whereClause, equipment_status: 'critical' } }),
        
        // Average monthly patients
        HealthFacility.findOne({
          where: whereClause,
          attributes: [
            [db.sequelize.fn('AVG', db.sequelize.col('average_monthly_patients')), 'avgMonthlyPatients']
          ],
          raw: true
        }),
      ]);

      const totalBedCapacity = parseInt(stats[15]) || 0;
      const totalCurrentOccupancy = parseInt(stats[16]) || 0;
      const overallOccupancyRate = totalBedCapacity > 0 ? 
        Math.round((totalCurrentOccupancy / totalBedCapacity) * 100) : 0;

      res.status(200).json({
        message: "Health facility statistics fetched successfully",
        data: {
          totalActiveFacilities: stats[0],
          facilitiesByType: {
            hospital: stats[1],
            health_center: stats[2],
            health_post: stats[3],
            clinic: stats[4],
            dispensary: stats[5],
          },
          facilitiesByOwnership: {
            public: stats[6],
            private: stats[7],
            faith_based: stats[8],
          },
          operationalStatus: {
            fully_operational: stats[9],
            partially_operational: stats[10],
            under_maintenance: stats[11],
          },
          emergencyServices: {
            withEmergency: stats[12],
            withAmbulance: stats[13],
          },
          capacity: {
            totalBedCapacity: totalBedCapacity,
            totalCurrentOccupancy: totalCurrentOccupancy,
            overallOccupancyRate: overallOccupancyRate,
          },
          staffing: {
            totalStaff: parseInt(stats[17]) || 0,
            totalDoctors: parseInt(stats[18]) || 0,
            totalNurses: parseInt(stats[19]) || 0,
          },
          equipmentStatus: {
            excellent: stats[20],
            good: stats[21],
            fair: stats[22],
            poor: stats[23],
            critical: stats[24],
          },
          averageMonthlyPatients: parseFloat(stats[25]?.avgMonthlyPatients) || 0,
        },
      });
    } catch (error) {
      console.error('Error fetching health facility statistics:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // Get facilities by type
  static async getFacilitiesByType(req, res) {
    try {
      const { facility_type } = req.params;
      const { region_id } = req.query;
      
      const validTypes = ['hospital', 'health_center', 'health_post', 'clinic', 'dispensary'];
      if (!validTypes.includes(facility_type)) {
        return res.status(400).json({ message: "Invalid facility type" });
      }

      const whereClause = { 
        facility_type,
        is_active: true 
      };
      
      if (region_id) whereClause.region_id = region_id;

      const facilities = await HealthFacility.findAll({
        where: whereClause,
        attributes: [
          'facility_id', 'facility_name', 'facility_code', 'district', 'sector',
          'bed_capacity', 'current_occupancy', 'operational_status', 'equipment_status'
        ],
        include: [
          {
            model: Region,
            as: "region",
            attributes: ['regionName'],
          },
        ],
        order: [['facility_name', 'ASC']],
      });

      const facilitiesWithComputedData = facilities.map(facility => {
        const facilityData = facility.toJSON();
        facilityData.occupancyRate = facility.getOccupancyRate();
        facilityData.occupancyStatus = facility.getOccupancyStatus();
        facilityData.isOperational = facility.isOperational();
        return facilityData;
      });

      res.status(200).json({
        message: `${facility_type} facilities fetched successfully`,
        data: facilitiesWithComputedData,
      });
    } catch (error) {
      console.error('Error fetching facilities by type:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // Get facilities with critical status
  static async getCriticalFacilities(req, res) {
    try {
      const { region_id } = req.query;
      
      const whereClause = { is_active: true };
      if (region_id) whereClause.region_id = region_id;

      const criticalFacilities = await HealthFacility.findAll({
        where: {
          ...whereClause,
          [Op.or]: [
            { equipment_status: 'critical' },
            { infrastructure_status: 'critical' },
            { operational_status: 'under_maintenance' },
            { operational_status: 'closed' },
          ]
        },
        include: [
          {
            model: Region,
            as: "region",
            attributes: ['regionName'],
          },
        ],
        order: [['facility_name', 'ASC']],
      });

      const facilitiesWithComputedData = criticalFacilities.map(facility => {
        const facilityData = facility.toJSON();
        facilityData.occupancyRate = facility.getOccupancyRate();
        facilityData.facilityRating = facility.getFacilityRating();
        facilityData.isOperational = facility.isOperational();
        
        // Determine criticality reasons
        const criticalReasons = [];
        if (facility.equipment_status === 'critical') criticalReasons.push('Critical equipment status');
        if (facility.infrastructure_status === 'critical') criticalReasons.push('Critical infrastructure status');
        if (facility.operational_status === 'under_maintenance') criticalReasons.push('Under maintenance');
        if (facility.operational_status === 'closed') criticalReasons.push('Facility closed');
        
        facilityData.criticalReasons = criticalReasons;
        return facilityData;
      });

      res.status(200).json({
        message: "Critical facilities fetched successfully",
        data: facilitiesWithComputedData,
      });
    } catch (error) {
      console.error('Error fetching critical facilities:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // Get nearby facilities (if coordinates provided)
  static async getNearbyFacilities(req, res) {
    try {
      const { latitude, longitude, radius = 50 } = req.query; // radius in km
      
      if (!latitude || !longitude) {
        return res.status(400).json({ 
          message: "Latitude and longitude are required" 
        });
      }

      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      const rad = parseFloat(radius);

      if (isNaN(lat) || isNaN(lon) || isNaN(rad)) {
        return res.status(400).json({ 
          message: "Invalid coordinates or radius" 
        });
      }

      // Using Haversine formula to calculate distance
      const facilities = await HealthFacility.findAll({
        where: {
          is_active: true,
          latitude: { [Op.not]: null },
          longitude: { [Op.not]: null },
        },
        attributes: {
          include: [
            [
              db.sequelize.literal(`
                6371 * acos(
                  cos(radians(${lat})) * 
                  cos(radians(latitude)) * 
                  cos(radians(longitude) - radians(${lon})) + 
                  sin(radians(${lat})) * 
                  sin(radians(latitude))
                )
              `),
              'distance'
            ]
          ]
        },
        having: db.sequelize.literal(`
          6371 * acos(
            cos(radians(${lat})) * 
            cos(radians(latitude)) * 
            cos(radians(longitude) - radians(${lon})) + 
            sin(radians(${lat})) * 
            sin(radians(latitude))
          ) <= ${rad}
        `),
        include: [
          {
            model: Region,
            as: "region",
            attributes: ['regionName'],
          },
        ],
        order: [[db.sequelize.literal('distance'), 'ASC']],
      });

      const facilitiesWithComputedData = facilities.map(facility => {
        const facilityData = facility.toJSON();
        facilityData.occupancyRate = facility.getOccupancyRate();
        facilityData.isOperational = facility.isOperational();
        facilityData.facilityCapabilities = facility.getFacilityCapabilities();
        return facilityData;
      });

      res.status(200).json({
        message: "Nearby facilities fetched successfully",
        data: facilitiesWithComputedData,
        searchCriteria: {
          latitude: lat,
          longitude: lon,
          radius: rad,
          unit: 'km'
        }
      });
    } catch (error) {
      console.error('Error fetching nearby facilities:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // Get facilities dashboard summary
  static async getFacilitiesDashboardSummary(req, res) {
    try {
      const { region_id } = req.query;
      
      const whereClause = { is_active: true };
      if (region_id) whereClause.region_id = region_id;

      // Get all facilities with their computed data
      const facilities = await HealthFacility.findAll({
        where: whereClause,
        include: [
          {
            model: Region,
            as: "region",
            attributes: ['regionName'],
          },
        ],
      });

      // Calculate summary statistics
      const summary = {
        totalFacilities: facilities.length,
        facilitiesByType: {
          hospitals: facilities.filter(f => f.facility_type === 'hospital').length,
          healthCenters: facilities.filter(f => f.facility_type === 'health_center').length,
          healthPosts: facilities.filter(f => f.facility_type === 'health_post').length,
          clinics: facilities.filter(f => f.facility_type === 'clinic').length,
          dispensaries: facilities.filter(f => f.facility_type === 'dispensary').length,
        },
        operationalStatus: {
          fullyOperational: facilities.filter(f => f.operational_status === 'fully_operational').length,
          partiallyOperational: facilities.filter(f => f.operational_status === 'partially_operational').length,
          underMaintenance: facilities.filter(f => f.operational_status === 'under_maintenance').length,
          closed: facilities.filter(f => f.operational_status === 'closed').length,
        },
        capacity: {
          totalBeds: facilities.reduce((sum, f) => sum + (f.bed_capacity || 0), 0),
          totalOccupied: facilities.reduce((sum, f) => sum + (f.current_occupancy || 0), 0),
          averageOccupancyRate: 0,
        },
        staffing: {
          totalStaff: facilities.reduce((sum, f) => sum + (f.total_staff || 0), 0),
          totalDoctors: facilities.reduce((sum, f) => sum + (f.doctors || 0), 0),
          totalNurses: facilities.reduce((sum, f) => sum + (f.nurses || 0), 0),
        },
        services: {
          withLaboratory: facilities.filter(f => f.has_laboratory).length,
          withPharmacy: facilities.filter(f => f.has_pharmacy).length,
          withRadiology: facilities.filter(f => f.has_radiology).length,
          withMaternity: facilities.filter(f => f.has_maternity).length,
          withEmergency: facilities.filter(f => f.has_emergency).length,
          withAmbulance: facilities.filter(f => f.has_ambulance).length,
        },
        equipmentStatus: {
          excellent: facilities.filter(f => f.equipment_status === 'excellent').length,
          good: facilities.filter(f => f.equipment_status === 'good').length,
          fair: facilities.filter(f => f.equipment_status === 'fair').length,
          poor: facilities.filter(f => f.equipment_status === 'poor').length,
          critical: facilities.filter(f => f.equipment_status === 'critical').length,
        },
        criticalIssues: {
          highOccupancy: facilities.filter(f => f.getOccupancyRate() >= 95).length,
          criticalEquipment: facilities.filter(f => f.equipment_status === 'critical').length,
          criticalInfrastructure: facilities.filter(f => f.infrastructure_status === 'critical').length,
          expiredLicenses: facilities.filter(f => !f.isLicenseValid()).length,
        }
      };

      // Calculate average occupancy rate
      const facilitiesWithBeds = facilities.filter(f => f.bed_capacity > 0);
      if (facilitiesWithBeds.length > 0) {
        const totalOccupancyRate = facilitiesWithBeds.reduce((sum, f) => sum + f.getOccupancyRate(), 0);
        summary.capacity.averageOccupancyRate = Math.round(totalOccupancyRate / facilitiesWithBeds.length);
      }

      // Get top performing facilities
      const topFacilities = facilities
        .map(facility => ({
          facility_id: facility.facility_id,
          facility_name: facility.facility_name,
          facility_type: facility.facility_type,
          rating: facility.getFacilityRating(),
          occupancyRate: facility.getOccupancyRate(),
          totalStaff: facility.total_staff,
          averageMonthlyPatients: facility.average_monthly_patients,
        }))
        .sort((a, b) => {
          const ratingOrder = { excellent: 5, good: 4, fair: 3, poor: 2, critical: 1 };
          return ratingOrder[b.rating] - ratingOrder[a.rating];
        })
        .slice(0, 5);

      // Get facilities needing attention
      const facilitiesNeedingAttention = facilities
        .filter(facility => {
          return facility.equipment_status === 'critical' ||
                 facility.infrastructure_status === 'critical' ||
                 facility.operational_status === 'under_maintenance' ||
                 facility.getOccupancyRate() >= 95 ||
                 !facility.isLicenseValid();
        })
        .map(facility => ({
          facility_id: facility.facility_id,
          facility_name: facility.facility_name,
          facility_type: facility.facility_type,
          issues: [
            ...(facility.equipment_status === 'critical' ? ['Critical equipment'] : []),
            ...(facility.infrastructure_status === 'critical' ? ['Critical infrastructure'] : []),
            ...(facility.operational_status === 'under_maintenance' ? ['Under maintenance'] : []),
            ...(facility.getOccupancyRate() >= 95 ? ['High occupancy'] : []),
            ...(!facility.isLicenseValid() ? ['Expired license'] : []),
          ],
          priority: facility.equipment_status === 'critical' || 
                   facility.infrastructure_status === 'critical' ? 'HIGH' : 'MEDIUM'
        }))
        .sort((a, b) => (b.priority === 'HIGH' ? 1 : 0) - (a.priority === 'HIGH' ? 1 : 0))
        .slice(0, 10);

      res.status(200).json({
        message: "Health facilities dashboard summary fetched successfully",
        data: {
          summary,
          topFacilities,
          facilitiesNeedingAttention,
          lastUpdated: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Error fetching facilities dashboard summary:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // Get facilities performance metrics
  static async getFacilitiesPerformanceMetrics(req, res) {
    try {
      const { region_id, facility_type, period = 'monthly' } = req.query;
      
      const whereClause = { is_active: true };
      if (region_id) whereClause.region_id = region_id;
      if (facility_type) whereClause.facility_type = facility_type;

      const facilities = await HealthFacility.findAll({
        where: whereClause,
        include: [
          {
            model: Region,
            as: "region",
            attributes: ['regionName'],
          },
        ],
      });

      // Calculate performance metrics
      const performanceMetrics = {
        occupancyTrends: facilities.map(f => ({
          facility_name: f.facility_name,
          facility_type: f.facility_type,
          occupancy_rate: f.getOccupancyRate(),
          capacity_utilization: f.getCapacityUtilization(),
          rating: f.getFacilityRating()
        })),
        staffingMetrics: {
          averageStaffPerFacility: facilities.length > 0 ? 
            Math.round(facilities.reduce((sum, f) => sum + (f.total_staff || 0), 0) / facilities.length) : 0,
          doctorToPatientRatio: this.calculateStaffRatio(facilities, 'doctors'),
          nurseToPatientRatio: this.calculateStaffRatio(facilities, 'nurses'),
          facilitiesUnderStaffed: facilities.filter(f => {
            const staffRatio = f.getStaffSummary().staffRatio;
            return staffRatio < 0.5; // Less than 0.5 staff per bed
          }).length
        },
        equipmentAndInfrastructure: {
          needingUpgrade: facilities.filter(f => 
            f.equipment_status === 'poor' || f.equipment_status === 'critical' ||
            f.infrastructure_status === 'poor' || f.infrastructure_status === 'critical'
          ).length,
          recentlyInspected: facilities.filter(f => {
            if (!f.last_inspection_date) return false;
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            return new Date(f.last_inspection_date) >= sixMonthsAgo;
          }).length,
          accreditationCompliance: facilities.filter(f => 
            f.accreditation_status === 'accredited'
          ).length
        },
        serviceAvailability: {
          emergencyServicesCoverage: (facilities.filter(f => f.has_emergency).length / facilities.length * 100).toFixed(1),
          laboratoryServicesCoverage: (facilities.filter(f => f.has_laboratory).length / facilities.length * 100).toFixed(1),
          pharmacyServicesCoverage: (facilities.filter(f => f.has_pharmacy).length / facilities.length * 100).toFixed(1),
          maternityServicesCoverage: (facilities.filter(f => f.has_maternity).length / facilities.length * 100).toFixed(1),
        }
      };

      res.status(200).json({
        message: "Health facilities performance metrics fetched successfully",
        data: performanceMetrics,
        period: period,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching facilities performance metrics:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // Helper method to calculate staff ratios
  static calculateStaffRatio(facilities, staffType) {
    const totalStaff = facilities.reduce((sum, f) => sum + (f[staffType] || 0), 0);
    const totalPatients = facilities.reduce((sum, f) => sum + (f.average_monthly_patients || 0), 0);
    return totalPatients > 0 ? Math.round((totalStaff / totalPatients) * 1000) / 1000 : 0;
  }

  // Get facilities capacity analysis
  static async getFacilitiesCapacityAnalysis(req, res) {
    try {
      const { region_id } = req.query;
      
      const whereClause = { is_active: true };
      if (region_id) whereClause.region_id = region_id;

      const facilities = await HealthFacility.findAll({
        where: whereClause,
        include: [
          {
            model: Region,
            as: "region",
            attributes: ['regionName'],
          },
        ],
      });

      // Capacity analysis by facility type
      const capacityAnalysis = {
        byFacilityType: ['hospital', 'health_center', 'health_post', 'clinic', 'dispensary'].map(type => {
          const typeFacilities = facilities.filter(f => f.facility_type === type);
          const totalBeds = typeFacilities.reduce((sum, f) => sum + (f.bed_capacity || 0), 0);
          const totalOccupied = typeFacilities.reduce((sum, f) => sum + (f.current_occupancy || 0), 0);
          
          return {
            facility_type: type,
            count: typeFacilities.length,
            total_beds: totalBeds,
            total_occupied: totalOccupied,
            occupancy_rate: totalBeds > 0 ? Math.round((totalOccupied / totalBeds) * 100) : 0,
            average_beds_per_facility: typeFacilities.length > 0 ? Math.round(totalBeds / typeFacilities.length) : 0
          };
        }),
        
        byOccupancyLevel: {
          critical: facilities.filter(f => f.getOccupancyRate() >= 95).length,
          high: facilities.filter(f => f.getOccupancyRate() >= 80 && f.getOccupancyRate() < 95).length,
          moderate: facilities.filter(f => f.getOccupancyRate() >= 60 && f.getOccupancyRate() < 80).length,
          low: facilities.filter(f => f.getOccupancyRate() < 60).length,
        },
        
        specializedBeds: {
          total_icu_beds: facilities.reduce((sum, f) => sum + (f.icu_beds || 0), 0),
          total_isolation_beds: facilities.reduce((sum, f) => sum + (f.isolation_beds || 0), 0),
          facilities_with_icu: facilities.filter(f => (f.icu_beds || 0) > 0).length,
          facilities_with_isolation: facilities.filter(f => (f.isolation_beds || 0) > 0).length,
        },
        
        emergencyPreparedness: {
          high_preparedness: facilities.filter(f => f.emergency_preparedness_level === 'high').length,
          medium_preparedness: facilities.filter(f => f.emergency_preparedness_level === 'medium').length,
          low_preparedness: facilities.filter(f => f.emergency_preparedness_level === 'low').length,
          facilities_with_ambulance: facilities.filter(f => f.has_ambulance).length,
        }
      };

      res.status(200).json({
        message: "Health facilities capacity analysis fetched successfully",
        data: capacityAnalysis,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching facilities capacity analysis:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // Get facilities geographic distribution
  static async getFacilitiesGeographicDistribution(req, res) {
    try {
      const { region_id } = req.query;
      
      const whereClause = { is_active: true };
      if (region_id) whereClause.region_id = region_id;

      const facilities = await HealthFacility.findAll({
        where: whereClause,
        include: [
          {
            model: Region,
            as: "region",
            attributes: ['id', 'region_name', 'region_code'],
          },
        ],
      });

      // Geographic distribution analysis
      const geographicDistribution = {
        byRegion: this.groupFacilitiesByRegion(facilities),
        
        totalFacilities: facilities.length,
        
        coverageGaps: this.identifyCoverageGaps(facilities),
        
        accessibilityMetrics: {
          facilitiesPerRegion: this.calculateFacilitiesPerRegion(facilities),
          populationCoverageEstimate: this.estimatePopulationCoverage(facilities)
        }
      };

      res.status(200).json({
        message: "Health facilities geographic distribution fetched successfully",
        data: geographicDistribution,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching facilities geographic distribution:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // Helper methods for geographic analysis
  static groupFacilitiesByRegion(facilities) {
    const grouped = {};
    facilities.forEach(facility => {
      const regionName = facility.region ? facility.region.regionName : 'Unknown Region';
      const regionId = facility.region_id || 'unknown';
      
      if (!grouped[regionId]) {
        grouped[regionId] = {
          region_id: regionId,
          region_name: regionName,
          count: 0,
          facilities: [],
          totalBeds: 0,
          totalStaff: 0
        };
      }
      grouped[regionId].count++;
      grouped[regionId].facilities.push({
        facility_id: facility.facility_id,
        facility_name: facility.facility_name,
        facility_type: facility.facility_type
      });
      grouped[regionId].totalBeds += facility.bed_capacity || 0;
      grouped[regionId].totalStaff += facility.total_staff || 0;
    });
    return grouped;
  }

  static identifyCoverageGaps(facilities) {
    // Analysis based on region facility density
    const regions = [...new Set(facilities.map(f => f.region_id).filter(Boolean))];
    const gaps = [];
    
    regions.forEach(regionId => {
      const regionFacilities = facilities.filter(f => f.region_id === regionId);
      const regionName = regionFacilities[0]?.region?.regionName || `Region ${regionId}`;
      const facilityCount = regionFacilities.length;
      const totalBeds = regionFacilities.reduce((sum, f) => sum + (f.bed_capacity || 0), 0);
      
      if (facilityCount < 2) {
        gaps.push({
          region_id: regionId,
          region_name: regionName,
          issue: 'Low facility density',
          severity: facilityCount === 0 ? 'HIGH' : 'MEDIUM',
          details: `Only ${facilityCount} facilities in ${regionName}`
        });
      }
      
      if (totalBeds < 50) {
        gaps.push({
          region_id: regionId,
          region_name: regionName,
          issue: 'Low bed capacity',
          severity: totalBeds < 20 ? 'HIGH' : 'MEDIUM',
          details: `Only ${totalBeds} beds available in ${regionName}`
        });
      }
    });
    
    return gaps;
  }

  static calculateFacilitiesPerRegion(facilities) {
    const regions = [...new Set(facilities.map(f => f.region_id).filter(Boolean))];
    return regions.length > 0 ? Math.round((facilities.length / regions.length) * 100) / 100 : 0;
  }

  static estimatePopulationCoverage(facilities) {
    // Simplified estimation based on facility capacity and WHO recommendations
    const totalBeds = facilities.reduce((sum, f) => sum + (f.bed_capacity || 0), 0);
    const estimatedPopulationCovered = totalBeds * 1000; // Rough estimate: 1 bed per 1000 people
    return Math.round(estimatedPopulationCovered);
  }
}

module.exports = {
  HealthFacilityController,
};