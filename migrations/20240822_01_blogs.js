const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'year', {
      type: DataTypes.DATE,
      validate: {
        isDate: true,
        isAfter: "1990-12-31",
        isBefore: `${new Date(new Date().getFullYear(), 1).getFullYear()}-01-01`
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'year')
  },
}