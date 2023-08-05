const { Model, DataTypes } = require("sequelize");
const sequelize = require('../sequelize');
class SearchImages extends Model { }
SearchImages.init({
    searchImgId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    imgUrl: {
        type: DataTypes.STRING,
        validate: {
            isUrl: true
        }
    },
}, {
    sequelize,
    freezeTableName: true,//表名与模型名相同
    indexes: [
        {
            fields: ['sId', 'imgUrl']
        },
    ],
    createdAt: true,
    deletedAt: true,
    paranoid: true
})

module.exports = SearchImages;