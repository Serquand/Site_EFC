import Games from './Games.js'
import Player from './Players.js'

export default async function setup() {
    await Player.sync()
    await Games.sync()
}