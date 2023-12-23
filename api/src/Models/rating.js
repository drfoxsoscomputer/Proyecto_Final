const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    //definir el modelo
    sequelize.define('Rating', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            itemId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            comment: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            score: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min : 0,
                    max: 5
                }
            },
            userId: {
                type: DataTypes.STRING,
                allowNull: false,
            }
    });
};