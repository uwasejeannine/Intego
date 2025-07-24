'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('healthfacilities', {
      facility_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      facility_name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      facility_code: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      facility_type: {
        type: Sequelize.ENUM('hospital', 'health_center', 'health_post', 'clinic', 'dispensary'),
        allowNull: false
      },
      ownership_type: {
        type: Sequelize.ENUM('public', 'private', 'faith_based', 'ngo', 'cooperative'),
        allowNull: false,
        defaultValue: 'public'
      },
      region_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'regions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: true
      },
      // Capacity and Infrastructure
      bed_capacity: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      current_occupancy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      total_staff: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      doctors: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      nurses: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      medical_assistants: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      support_staff: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      // Services Offered
      services_offered: {
        type: Sequelize.TEXT, // JSON string of services array
        allowNull: true
      },
      has_laboratory: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      has_pharmacy: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      has_radiology: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      has_maternity: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      has_emergency: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      has_ambulance: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      // Equipment and Infrastructure Status
      equipment_status: {
        type: Sequelize.ENUM('excellent', 'good', 'fair', 'poor', 'critical'),
        allowNull: false,
        defaultValue: 'good'
      },
      infrastructure_status: {
        type: Sequelize.ENUM('excellent', 'good', 'fair', 'poor', 'critical'),
        allowNull: false,
        defaultValue: 'good'
      },
      power_source: {
        type: Sequelize.ENUM('grid', 'generator', 'solar', 'hybrid', 'none'),
        allowNull: false,
        defaultValue: 'grid'
      },
      water_source: {
        type: Sequelize.ENUM('piped', 'borehole', 'well', 'rainwater', 'none'),
        allowNull: false,
        defaultValue: 'piped'
      },
      // Operational Status
      operational_status: {
        type: Sequelize.ENUM('fully_operational', 'partially_operational', 'under_maintenance', 'closed'),
        allowNull: false,
        defaultValue: 'fully_operational'
      },
      operating_hours: {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: '24/7'
      },
      // Financial and Performance
      monthly_patient_capacity: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      average_monthly_patients: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      last_inspection_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      accreditation_status: {
        type: Sequelize.ENUM('accredited', 'provisional', 'pending', 'not_accredited'),
        allowNull: false,
        defaultValue: 'pending'
      },
      license_number: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      license_expiry_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      // Director Information
      director_name: {
        type: Sequelize.STRING(150),
        allowNull: true
      },
      director_phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      director_email: {
        type: Sequelize.STRING(150),
        allowNull: true
      },
      // Emergency Preparedness
      emergency_preparedness_level: {
        type: Sequelize.ENUM('high', 'medium', 'low', 'none'),
        allowNull: false,
        defaultValue: 'medium'
      },
      isolation_beds: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      icu_beds: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      // Administrative
      established_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add indexes for better performance
    await queryInterface.addIndex('healthfacilities', ['facility_type']);
    await queryInterface.addIndex('healthfacilities', ['region_id']);
    await queryInterface.addIndex('healthfacilities', ['operational_status']);
    await queryInterface.addIndex('healthfacilities', ['is_active']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('healthfacilities');
  }
};