"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("activity-logs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      entityType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      entityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      action: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      actorType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      actorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      oldValues: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      newValues: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ActivityLogs");
  },
};
