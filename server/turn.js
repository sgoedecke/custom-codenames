class Turn {
  constructor() {
    this.clue = '';
    this.remainingGuesses = 0;
    this.totalGuesses = null;
    this.submitted = false;
  }

  setTurnDetails(clue, remainingGuesses, totalGuesses) {
    this.clue = clue;
    this.remainingGuesses = remainingGuesses;
    if (!this.totalGuesses) {
      this.totalGuesses = totalGuesses;
    }
    this.submitted = true;
  }
}

exports.default = Turn;
