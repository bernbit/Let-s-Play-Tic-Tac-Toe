import View from "./view.js";
import Store from "./store.js";

const playerUser = [
  {
    id: "1",
    playerName: "Player 1",
    playerIcon: "fa-x",
    playerColor: "player1-color",
  },
  {
    id: "2",
    playerName: "Player 2",
    playerIcon: "fa-o",
    playerColor: "player2-color",
  },
];

function init() {
  const view = new View();
  const store = new Store("tic-tac-toe-key", playerUser);

  store.addEventListener("statechange", () => {
    view.render(store.game, store.stats);
  });

  window.addEventListener("storage", () => {
    console.log("Other tab make a move");
    view.render(store.game, store.stats);
  });

  view.render(store.game, store.stats);

  view.bindResetYesEvent((event) => {
    store.reset();
  });

  view.bindNewRoundEvent((event) => {
    store.newRound();
  });

  view.bindPlayerMove((box) => {
    const currentPlayer = store.game.currentPlayer;

    /* Two Player Move */
    if (currentPlayer.id === "1") {
      view.playP1Audio();
    } else {
      view.playP2Audio();
    }
    const existingIcon = store.game.moves.find(
      (move) => move.boxId === +box.id
    );
    if (existingIcon) {
      return;
    }
    store.playerMove(+box.id);
  });
}

window.addEventListener("load", init);
