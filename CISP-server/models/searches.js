const { Model, DataTypes } = require("sequelize");
const sequelize = require('../sequelize');
const { permissionOpt } = require('../utils');
const SearchImgs = require('./searchImgs');
class Searches extends Model { }
Searches.init({
    searchId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            len: [2, 20]
        },
    },
    intro: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: [10, 255]
        }
    },
    commentNumber: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        validate: {
            min: 0,
        }
    },
    scanNumber: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        validate: {
            min: 0,
        }
    },
    typeId: permissionOpt()
}, {
    sequelize,
    freezeTableName: true,//表名与模型名相同
    indexes: [
        {
            unique: true,
            fields: ['searchId'],
        },
        {
            fields: ['scanNumber', 'commentNumber', 'intro', 'title', 'uId']
        },
    ],
    createdAt: true,
    deletedAt: true,
    paranoid: true,
    hooks: {
        async beforeBulkDestroy({ where: { searchId } }) {
            await SearchImgs.destroy({ where: { sId: searchId } })
        }
    }
})

module.exports = Searches;