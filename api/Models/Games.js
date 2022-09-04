import sequelize from "./Connection.js"
import { DataTypes } from "sequelize"
import Player from './Players.js'

export default sequelize.define("Game", {
    id: {
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        unique: true, 
        primaryKey: true,
        allowNull: false
    }, 

    player1: {
        type: DataTypes.UUID, 
        references: {
            model: Player, 
            key: 'id'
        }
    }, 

    player2: {
        type: DataTypes.UUID, 
        references: {
            model: Player, 
            key: 'id'
        }
    }, 

    pgn: {
        type: DataTypes.TEXT,
        allowNull: false, 
    }
}, {
    timestamps: false,
    sequelize, 
    modelName: "Game",
    tableName: 'Games',
})