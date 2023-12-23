const {DataTypes}= require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Genre',{
        id:{
            type: DataTypes.INTEGER, 
            autoIncrement:true, 
            primaryKey: true
        },
        name:{
            type: DataTypes.STRING, 
            allowNull: false
        },
        deleteAt:{
            type: DataTypes.BOOLEAN, 
            defaultValue: false
        },
    },
        {timestamps: true}
    )
};