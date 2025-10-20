"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("tasks", "archived", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      after: "isComplete", // optional: adjust this if you want a specific column order
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("tasks", "archived");
  },
};
