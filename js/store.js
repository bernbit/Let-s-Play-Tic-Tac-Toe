const initialValue = {
  currentGameMoves: [],
  history: {
    currentRoundGames: [],
    allGames: [],
  },
};
export default class Store extends EventTarget {
  // #state = initialValue;

  constructor(key, playerUser) {
    super();
    this.storageKey = key;
    this.playerUser = playerUser;
  }

  get stats() {
    // console.log(this.#getState());
    const state = this.#getState();
    return {
      playerWithStats: this.playerUser.map((player) => {
        const wins = state.history.currentRoundGames.filter(
          (game) => game.status.winner?.id === player.id
        ).length;

        return {
          ...player,
          wins,
        };
      }),
      ties: state.history.currentRoundGames.filter(
        (game) => game.status.winner === null
      ).length,
    };
  }

  get game() {
    const state = this.#getState();
    const currentPlayer = this.playerUser[state.currentGameMoves.length % 2];

    const winningPattern = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [1, 5, 9],
      [3, 5, 7],
    ];

    let winner = null;

    for (const player of this.playerUser) {
      const selectedBoxIds = state.currentGameMoves
        .filter((move) => move.player.id === player.id)
        .map((move) => move.boxId);

      for (const pattern of winningPattern) {
        if (pattern.every((v) => selectedBoxIds.includes(v))) {
          winner = player;
        }
      }
    }
    return {
      moves: state.currentGameMoves,
      currentPlayer,
      status: {
        isComplete: winner != null || state.currentGameMoves.length === 9,
        winner,
      },
    };
  }

  playerMove(boxId) {
    const stateClone = structuredClone(this.#getState());

    stateClone.currentGameMoves.push({
      boxId,
      player: this.game.currentPlayer,
    });
    this.#saveState(stateClone);
  }

  reset() {
    const stateClone = structuredClone(this.#getState());

    const { status, moves } = this.game;

    if (status.isComplete) {
      stateClone.history.currentRoundGames.push({
        moves,
        status,
      });
    }
    stateClone.currentGameMoves = [];
    this.#saveState(stateClone);
  }

  newRound() {
    this.reset();

    const stateClone = structuredClone(this.#getState());
    stateClone.history.allGames.push(...stateClone.history.currentRoundGames);
    stateClone.history.currentRoundGames = [];

    this.#saveState(stateClone);
  }
  #getState() {
    const item = window.localStorage.getItem(this.storageKey);

    return item ? JSON.parse(item) : initialValue;
  }

  #saveState(stateOrFn) {
    const prevState = this.#getState;

    let newState;

    switch (typeof stateOrFn) {
      case "function":
        newState = stateOrFn(prevState);
        break;
      case "object":
        newState = stateOrFn;
        break;
      default:
        throw new Error("Invlaid argument passed to savedSatate");
    }

    window.localStorage.setItem(this.storageKey, JSON.stringify(newState));
    this, this.dispatchEvent(new Event("statechange"));
  }
}
