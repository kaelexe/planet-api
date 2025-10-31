"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("tasks", "dateDue", {
      type: Sequelize.DATE,
      allowNull: true,
      after: "description", // optional: adjust this if you want a specific column order
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("tasks", "dateDue");
  },
};
