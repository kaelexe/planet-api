"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("activity-logs", "status", {
      type: Sequelize.ENUM("success", "failed"),
      allowNull: true,
      after: "newValues",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("activity-logs", "status");
  },
};
