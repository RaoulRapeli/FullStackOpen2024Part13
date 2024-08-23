const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {

        await queryInterface.createTable('active_sessions', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            session: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id' },
            },
        })

        await queryInterface.addColumn('users', 'disabled', {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('active_sessions')
        await queryInterface.removeColumn('users', 'disabled')
    },
}