const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class ActiveSessions extends Model { }

ActiveSessions.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    session: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
    },
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'active_sessions'
})

module.exports = ActiveSessions