
(() => {
  "use strict";

  const $ = id => document.getElementById(id);

  const squares = Array.isArray(window.caselles) ? window.caselles : [];
  const layout = [
    [0, 18, 17, 16, 15, 14, 13],
    [null, 19, 32, 31, 30, 29, 12],
    [null, 20, 33, 38, 37, 28, 11],
    [null, 21, 34, 35, 36, 27, 10],
    [1, 22, 23, 24, 25, 26, 9],
    [2, 3, 4, 5, 6, 7, 8]
  ];

  let players = [];
  let positions = [];
  let currentPlayer = 0;
  let lastRoll = null;
  let gameFinished = false;
  let cellElements = {};

  function squareText(index) {
    return squares[index] ?? `Casella ${index}`;
  }

  function setMessage(icon, title, text) {
    $("messageIcon").textContent = icon;
    $("messageTitle").textContent = title;
    $("messageText").textContent = text;
  }

  function buildBoard() {
    const board = $("board");
    board.replaceChildren();
    cellElements = {};

    layout.forEach((row, rowIndex) => {
      row.forEach((index, colIndex) => {
        if (index === null) return;

        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.index = String(index);
        cell.style.gridRow = String(rowIndex + 1);
        cell.style.gridColumn = String(colIndex + 1);

        if (index === 0) cell.classList.add("start-cell");
        if (index === 38) cell.classList.add("finish-cell");

        const number = document.createElement("span");
        number.className = "cell-number";
        number.textContent = index === 0 ? "INICI" : String(index);

        const label = document.createElement("span");
        label.className = "cell-label";
        label.textContent = index === 0 ? "Comenceu aquí" : squareText(index);

        const pawns = document.createElement("div");
        pawns.className = "cell-pawns";
        pawns.id = `pawns-${index}`;

        cell.append(number, label, pawns);
        board.appendChild(cell);
        cellElements[index] = cell;
      });
    });
  }

  function render() {
    Object.keys(cellElements).forEach(index => {
      $(`pawns-${index}`).replaceChildren();
      cellElements[index].classList.remove("active-cell");
    });

    players.forEach((player, index) => {
      const pawn = document.createElement("span");
      pawn.className = "pawn";
      pawn.style.backgroundColor = player.color;
      pawn.textContent = player.name.charAt(0).toLocaleUpperCase("ca");
      pawn.title = `${player.name}, casella ${positions[index]}`;

      $(`pawns-${positions[index]}`).appendChild(pawn);
    });

    const active = players[currentPlayer];

    $("turnAvatar").textContent = active.name.charAt(0).toLocaleUpperCase("ca");
    $("turnAvatar").style.backgroundColor = active.color;
    $("turnName").textContent = active.name;
    $("turnPosition").textContent = `Casella ${positions[currentPlayer]}`;
    $("diceResult").textContent = lastRoll === null ? "—" : String(lastRoll);

    cellElements[positions[currentPlayer]]?.classList.add("active-cell");

    const scoreboard = $("scoreboard");
    scoreboard.replaceChildren();

    players.forEach((player, index) => {
      const item = document.createElement("div");
      item.className = "score-item";

      const dot = document.createElement("span");
      dot.className = "score-dot";
      dot.style.backgroundColor = player.color;

      const name = document.createElement("span");
      name.className = "score-name";
      name.textContent = player.name;

      const position = document.createElement("span");
      position.className = "score-position";
      position.textContent = `${positions[index]}/38`;

      item.append(dot, name, position);
      scoreboard.appendChild(item);
    });

    $("playersSummary").textContent = `${players.length} jugadors`;
    $("rollBtn").disabled = gameFinished;
    $("rollBtn").textContent = gameFinished
      ? "🏁 Partida acabada"
      : "🎲 Tirar el dau";
  }

  function startOcaGame(configuredPlayers) {
    players = configuredPlayers.map(player => ({
      name: player.name,
      color: player.color
    }));

    positions = players.map(() => 0);
    currentPlayer = 0;
    lastRoll = null;
    gameFinished = false;

    buildBoard();

    $("setupScreen").hidden = true;
    $("gameScreen").hidden = false;

    setMessage(
      "✨",
      "Tot a punt!",
      "Tira el dau per començar la partida."
    );

    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function rollDice() {
    if (gameFinished || players.length === 0) return;

    const player = players[currentPlayer];
    const dice = Math.floor(Math.random() * 6) + 1;
    lastRoll = dice;

    const destination = positions[currentPlayer] + dice;

    if (destination >= 38) {
      positions[currentPlayer] = 38;
      gameFinished = true;

      setMessage(
        "🏆",
        `${player.name} ha guanyat!`,
        "Has arribat a la meta. Reinicia la partida si voleu tornar a jugar."
      );
    } else {
      positions[currentPlayer] = destination;

      if (destination === 32) {
        positions[currentPlayer] = Math.max(0, destination - 3);

        setMessage(
          "↩️",
          `${player.name} retrocedeix`,
          `Has tret un ${dice}. Retrocedeixes tres caselles fins a la ${positions[currentPlayer]}.`
        );
      } else {
        setMessage(
          "🎲",
          `${player.name} ha tret un ${dice}`,
          `Casella ${destination}: ${squareText(destination)}.`
        );
      }

      currentPlayer = (currentPlayer + 1) % players.length;
    }

    render();
  }

  function resetGame() {
    if (!players.length) return;

    if (!window.confirm("Vols reiniciar la partida?")) return;

    positions = players.map(() => 0);
    currentPlayer = 0;
    lastRoll = null;
    gameFinished = false;

    setMessage(
      "🔄",
      "Partida reiniciada",
      "Tira el dau per tornar a començar."
    );

    render();
  }

  $("rollBtn").addEventListener("click", rollDice);
  $("resetBtn").addEventListener("click", resetGame);

  $("backBtn").addEventListener("click", () => {
    if (!window.confirm("Vols tornar a la configuració? La partida actual es perdrà.")) {
      return;
    }

    $("gameScreen").hidden = true;
    $("setupScreen").hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.startOcaGame = startOcaGame;
})();
