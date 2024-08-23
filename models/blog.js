const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Blog extends Model { }

Blog.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author: {
        type: DataTypes.TEXT
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    year: {
        type: DataTypes.DATE,
        validate: {
            isDate: true,
            isAfter: "1990-12-31",
            isBefore: `${new Date(new Date().getFullYear(), 1).getFullYear()}-01-01`
        }
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog'
})

module.exports = Blog