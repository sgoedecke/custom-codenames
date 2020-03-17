const randomWords = require('random-words');
const shuffle = require('shuffle-array');

class CodenamesGame {
  constructor() {
    // generate a list of 25 tiles. we don't need to track order, just
    // remember which words belong to which team and sort it out at runtime.
    this.tiles = randomWords(25)
    this.redTiles = this.tiles.slice(0,9) // 9 tiles for red
    this.blueTiles = this.tiles.slice(9,16) // 8 for blue
    this.assassinTile = this.tiles[16]
    shuffle(this.tiles) // shuffle to randomize who has what tiles

    this.redPlayers = []
    this.bluePlayers = []
    this.revealedTiles = []
    this.redLeader = undefined
    this.blueLeader = undefined
    this.playing = false
    this.winner = undefined
  }

  // add a new player to the team with the fewest players
  addPlayer(player) {
    if (this.redPlayers.length < this.bluePlayers.length) {
      this.redPlayers = this.redPlayers.concat(player)
    } else {
      this.bluePlayers = this.bluePlayers.concat(player)
    }
  }

  assignLeader(player) {
    if (winner || playing) { return }
    if (indexOf(this.redPlayers, player) > 0) {
      if (!this.redLeader) {
        this.redLeader = player
      }
    } else if (indexOf(this.bluePlayers, player) > 0) {
      if (!this.blueLeader) {
        this.blueLeader = player
      }
    }
  }

  chooseTile(tile, player) {
    if (winner || !playing) { return}
    if(indexOf(this.revealedTiles, tile) > 0) {
      return // already chosen
    }

    this.revealedTiles = this.revealedTiles.concat(tile)
    if (tile == this.assassinTile) {
      const otherTeam = indexOf(this.bluePlayers, player) > 0 ? 'blue' : 'red'
      this.winner = playerTeam
    }

  }

  // what the client needs to render the game
  serialize() {
    return ({
      tiles: tiles,
      redPlayers: redPlayers,
      bluePlayers: bluePlayers,
      redLeader: redLeader,
      blueLeader: blueLeader,
      revealedTiles: revealedTiles,
      playing: playing,
      winner: winner
    })
  }
}
