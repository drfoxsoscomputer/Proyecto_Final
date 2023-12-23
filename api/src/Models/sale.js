const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    // Definir el modelo Sale
    sequelize.define(
        "Sale",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            total: {
                type: DataTypes.DECIMAL(7,2),
                allowNull: false
            }
        }
    )
}