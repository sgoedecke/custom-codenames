const randomWords = require('random-words');
const shuffle = require('shuffle-array');

class CodenamesGame {
  constructor() {
    // generate a list of 25 tiles. we don't need to track order, just
    // remember which words belong to which team and sort it out at runtime.
    this.tiles = randomWords(25);
    this.redTiles = this.tiles.slice(0, 9); // 9 tiles for red
    this.blueTiles = this.tiles.slice(9, 16); // 8 for blue
    this.assassinTile = this.tiles[16];
    shuffle(this.tiles); // shuffle to randomize who has what tiles

    this.redPlayers = [];
    this.bluePlayers = [];
    this.revealedTiles = [];
    this.redLeader = undefined;
    this.blueLeader = undefined;
    this.playing = false;
    this.winner = undefined;
  }

  // add a new player to the team with the fewest players
  addPlayer(player) {
    if (this.redPlayers.length < this.bluePlayers.length) {
      this.redPlayers = this.redPlayers.concat(player);
    } else {
      this.bluePlayers = this.bluePlayers.concat(player);
    }
  }

  assignLeader(player) {
    if (this.winner || this.playing) { return; }
    if (this.redPlayers.indexOf(player) > 0) {
      if (!this.redLeader) {
        this.redLeader = player;
      }
    } else if (this.bluePlayers.indexOf(player) > 0) {
      if (!this.blueLeader) {
        this.blueLeader = player;
      }
    }
  }

  chooseTile(tile, player) {
    if (this.winner || !this.playing) { return; }
    if (this.revealedTiles.indexOf(tile) > 0) {
      return; // already chosen
    }

    this.revealedTiles = this.revealedTiles.concat(tile);
    if (tile === this.assassinTile) {
      const otherTeam = this.bluePlayers.indexOf(player) > 0 ? 'blue' : 'red';
      this.winner = otherTeam;
    }

    // check if the choosing team has won
  }

  // what the client needs to render the game
  serialize() {
    return ({
      tiles: this.tiles,
      redPlayers: this.redPlayers,
      bluePlayers: this.bluePlayers,
      redLeader: this.redLeader,
      blueLeader: this.blueLeader,
      revealedTiles: this.revealedTiles,
      playing: this.playing,
      winner: this.winner,
    });
  }
}

export default CodenamesGame;
