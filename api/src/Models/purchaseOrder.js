const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('PurchaseOrder', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        totalCost: {
            type: DataTypes.INTEGER,
            //allowNull: false,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        statusDetail: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        preferenceId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        transactionId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });
};
