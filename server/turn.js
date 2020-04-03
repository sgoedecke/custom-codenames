class Turn {
  constructor() {
    this.clue = '';
    this.remainingGuesses = 0;
    this.submitted = false;
  }

  setTurnDetails(clue, remainingGuesses) {
    this.clue = clue;
    this.remainingGuesses = remainingGuesses;
    this.submitted = true;
  }
}

exports.default = Turn;
