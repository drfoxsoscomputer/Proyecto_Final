const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {

    sequelize.define('Videogame', {
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        released: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        price:{
            type: DataTypes.DECIMAL(7,2),
            allowNull: false,
        },
        physicalGame:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        stock:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        enable:{
            type: DataTypes.BOOLEAN,
            defaultValue:true
        },
        deleteAt:{
            type: DataTypes.BOOLEAN,
            defaultValue:false
        }       
    },
    {timestamps: false}
    );
}