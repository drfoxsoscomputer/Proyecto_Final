//const sequelize = require("sequelize");
const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define("User", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        email: { type: DataTypes.STRING, allowNull: false },
        password: {type:DataTypes.STRING, allowNull: true},
        nickname:{type: DataTypes.STRING, allowNull: true},
        given_name: { type: DataTypes.STRING, allowNull: true },
        picture: { type: DataTypes.STRING, allowNull: false, defaultValue:'https://res.cloudinary.com/dmhxl1rpc/image/upload/c_scale,w_250/v1701669223/gameworld/avatar_gamer.jpg' },
        sub:{type: DataTypes.STRING, allowNull:true},
        role:{type: DataTypes.SMALLINT, allowNull: false,defaultValue: 1,
          validate: {
            isIn: [[0, 1, 2]], // Por ejemplo, 0: admin, 1: user, 2: moderator
          },
        created: { type: DataTypes.BOOLEAN, defaultValue: true },
      },
        country: {
            type: DataTypes.STRING,
            allowNull: true
        },
        enable: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        deleteAt:{
          type: DataTypes.BOOLEAN,
          defaultValue:false
      } 
    });
};
