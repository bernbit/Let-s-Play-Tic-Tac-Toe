export default class View {
  $ = {};

  $$ = {};
  constructor() {
    // Action or Menu
    this.$.menubtn = this.#elementSelect('[data-id="menu"]');
    this.$.menuContent = this.#elementSelect('[data-id="menu-content"]');
    this.$.newRoundbtn = this.#elementSelect('[data-id="new-round"]');
    this.$.resetbtn = this.#elementSelect('[data-id="reset"]');

    //How to Play Button
    this.$.manualbtn = this.#elementSelect('[data-id="manual"]');
    this.$.manualClose = this.#elementSelect('[data-id="manual-close"]');
    this.$.manualContent = this.#elementSelect('[data-id="manual-content"]');

    //Shortcut Keys
    this.$.shortcutbtn = this.#elementSelect('[data-id="shortcut-btn"]');
    this.$.shortcutContent = this.#elementSelect(
      '[data-id="shortcut-content"]'
    );
    this.$.shortcutClose = this.#elementSelect('[data-id="shortcut-close"]');

    //Alert Box
    this.$.alertBox = this.#elementSelect('[data-id="alert-box"]');
    this.$.alertText = this.#elementSelect('[data-id="alert-text"]');
    this.$.alertBtn = this.#elementSelect('[data-id="alert-btn"]');

    //Reset Button Confirmation
    this.$.resetBox = this.#elementSelect('[data-id="reset-confirmation-box"]');
    this.$.resetYesbtn = this.#elementSelect('[data-id="yes-btn"]');
    this.$.resetNobtn = this.#elementSelect('[data-id="no-btn"]');

    // Player Tun Indicator
    this.$.playerTurn = this.#elementSelect('[data-id="player-turn"]');
    this.$.playerIcon = this.#elementSelect('[data-id="player-icon"]');
    this.$.playerText = this.#elementSelect('[data-id="player-text"]');

    //Scorebaoard Below
    this.$.p1wins = this.#elementSelect('[data-id="p1-wins"]');
    this.$.ties = this.#elementSelect('[data-id="ties"]');
    this.$.p2wins = this.#elementSelect('[data-id="p2-wins"]');

    //Board or Boxes
    //Parent Box
    this.$$.box = this.#elementSelect('[data-id="box"]');
    //Box Children
    this.$$.boxes = this.#elementSelectAll('[data-id="boxes"]');

    //Sound Effects
    this.$.p1Audio = this.#elementSelect('[data-id="p1-audio"]');
    this.$.p2Audio = this.#elementSelect('[data-id="p2-audio"]');
    this.$.winAudio = this.#elementSelect('[data-id="alert-audio"]');

    this.$.alertBtn.addEventListener("click", (event) => {
      this.stopAlertAudio();
    });

    /* Action Menu Toggle Event */
    this.$.menubtn.addEventListener("click", (event) => {
      this.#toggleMenuAction();
    });

    /* How to Play Button Toggle Event */
    // How to Play Toggle Open
    this.$.manualbtn.addEventListener("click", (event) => {
      this.#toggleHowtoPlay();
    });
    // How to Play Toggle Close
    this.$.manualClose.addEventListener("click", (event) => {
      this.#toggleHowtoPlay();
    });

    /* Shortcut Button Toggle Event */
    // Shortcut Toggle Open
    this.$.shortcutbtn.addEventListener("click", (event) => {
      this.#toggleShortcut();
    });
    // Shortcut Toggle Close
    this.$.shortcutClose.addEventListener("click", (event) => {
      this.#toggleShortcut();
    });

    //ResetBox Toggle Event
    //Reset Box Open
    this.$.resetbtn.addEventListener("click", (event) => {
      this.#toggleResetBox();
    });
    //Reset Box Close
    this.$.resetNobtn.addEventListener("click", (event) => {
      this.#toggleResetBox();
      this.#toggleMenuAction();
    });
    this.$.resetYesbtn.addEventListener("click", (event) => {
      this.#toggleResetBox();
      this.#toggleMenuAction();
    });

    //New Round Click Close Menu Action
    this.$.newRoundbtn.addEventListener("click", (event) => {
      this.#toggleMenuAction();
    });

    // Shortcut Keys
    document.addEventListener("keydown", (event) => {
      if (event.key.toLowerCase() === "Escape") {
        this.#toggleResetBox();
        this.#toggleMenuAction();
      }
      if (event.key.toLowerCase() === "a") {
        this.#toggleMenuAction();
      }
      if (event.key.toLowerCase() === "n") {
        this.$.newRoundbtn.click();
        this.#toggleMenuAction();
      }
      if (event.key.toLowerCase() === "r") {
        this.$.resetbtn.click();
        this.#toggleMenuAction();
      }
    });
  }

  render(game, stats) {
    const { playerWithStats, ties } = stats;
    const {
      moves,
      currentPlayer,
      status: { isComplete, winner },
    } = game;

    this.#closeAlertBox();
    this.#clearBox();

    this.#updateScoreBoard(
      playerWithStats[0].wins,
      playerWithStats[1].wins,
      ties
    );
    this.#initializeBox(moves);

    if (isComplete) {
      this.playAlertAudio();
      this.#openAlertBox(winner ? `${winner.playerName} Wins!` : "It's a Draw");
      return;
    }
    this.#setTurnIndicator(currentPlayer);
  }

  /* Regsiter Methods */

  bindNewRoundEvent(handler) {
    this.$.newRoundbtn.addEventListener("click", handler);
  }

  bindResetYesEvent(handler) {
    this.$.resetYesbtn.addEventListener("click", handler);
    this.$.alertBox.addEventListener("click", handler);
  }

  bindAlertEvent(handler) {
    this.$.alertBtn.addEventListener("click", handler);
  }

  bindPlayerMove(handler) {
    this.#delegate(this.$$.box, '[data-id="boxes"]', "click", handler);
    // this.$$.boxes.forEach((box) => {
    //   box.addEventListener("click", () => handler(box));
    //   box.style.backgroundColor = "#d83f31";
    // });
  }

  /*DOM Helper Methods */

  #updateScoreBoard(p1wins, p2wins, ties) {
    this.$.p1wins.innerText = `${p1wins}`;
    this.$.ties.innerText = `${ties}`;
    this.$.p2wins.innerText = `${p2wins}`;
  }
  #openAlertBox(message) {
    this.$.alertBox.classList.remove("hidden");
    this.$.alertText.innerText = message;
  }
  #closeAlertBox() {
    this.$.alertBox.classList.add("hidden");
  }

  #toggleMenuAction() {
    this.$.menuContent.classList.toggle("hidden");
    this.$.menubtn.classList.toggle("border");

    const icon = this.$.menubtn.querySelector("i");
    icon.classList.toggle("fa-chevron-down");
    icon.classList.toggle("fa-chevron-up");
  }

  #toggleHowtoPlay() {
    this.$.manualContent.classList.toggle("hidden");
  }
  #toggleShortcut() {
    this.$.shortcutContent.classList.toggle("hidden");
  }

  #toggleResetBox() {
    this.$.resetBox.classList.toggle("hidden");
  }

  /* Query Selector Validation Start Here */
  #elementSelect(selector, parent) {
    const element = parent
      ? parent.querySelector(selector)
      : document.querySelector(selector);

    if (!element) {
      throw Error("Element doesn't exist");
    }

    return element;
  }

  #elementSelectAll(selector) {
    const elementList = document.querySelectorAll(selector);
    if (!elementList) {
      throw Error("Element doesn't exist");
    }

    return elementList;
  }

  /* Query Selector Validation End Here */

  // Sound Effects Start Here
  playP1Audio() {
    this.$.p1Audio.play();
  }

  playP2Audio() {
    this.$.p2Audio.play();
  }

  playAlertAudio() {
    this.$.winAudio.play();
  }
  stopAlertAudio() {
    this.$.winAudio.pause();
    this.$.winAudio.currentTime = 0;
  }

  setPlayerAudio(player) {
    if (player.id === "1") {
      this.playP1Audio();
    } else {
      this.playP2Audio();
    }
  }
  // Sound Effects End Here

  #clearBox() {
    this.$$.boxes.forEach((box) => {
      box.replaceChildren();
    });
  }

  #initializeBox(moves) {
    this.$$.boxes.forEach((box) => {
      const existingMove = moves.find((move) => move.boxId === +box.id);

      if (existingMove) {
        this.#handlePlayerMove(box, existingMove.player);
      }
    });
  }

  #setTurnIndicator(player) {
    const icon = document.createElement("i");
    const label = document.createElement("p");
    const playerTurn = this.$.playerTurn;

    icon.classList.add("fa-solid", player.playerIcon, player.playerColor);
    label.classList.add(player.playerColor);

    label.textContent = `${player.playerName} , your turn`;

    playerTurn.replaceChildren(icon, label);
  }

  #handlePlayerMove(squareEl, player) {
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", player.playerIcon, player.playerColor);
    squareEl.replaceChildren(icon);
  }

  #delegate(el, selector, eventKey, handler) {
    el.addEventListener(eventKey, (event) => {
      if (event.target.matches(selector)) {
        handler(event.target);
      }
    });
  }
}
