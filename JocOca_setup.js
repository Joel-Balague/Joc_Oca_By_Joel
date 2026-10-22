(() => {
  "use strict";

  const $ = id => document.getElementById(id);

  const countInput = $("numPlayers");
  const countOutput = $("playerCount");
  const playersList = $("playersList");
  const setupError = $("setupError");

  const colors = Array.isArray(window.colors) && window.colors.length
    ? window.colors
    : ["#ff6b6b", "#51cf66", "#4dabf7", "#ffd43b",
       "#da77f2", "#3bc9db", "#ff922b", "#f06595"];

  function clamp(value) {
    return Math.max(2, Math.min(8, Number(value) || 2));
  }

  function createRows() {
    const count = clamp(countInput.value);
    countInput.value = count;
    countOutput.textContent = count;

    const previous = Array.from(playersList.querySelectorAll(".player-row"))
      .map(row => ({
        name: row.querySelector(".player-name").value,
        color: row.dataset.color
      }));

    playersList.replaceChildren();

    for (let i = 0; i < count; i++) {
      const row = document.createElement("div");
      row.className = "player-row";
      row.dataset.color = previous[i]?.color || colors[i % colors.length];

      const input = document.createElement("input");
      input.className = "player-name";
      input.type = "text";
      input.maxLength = 24;
      input.autocomplete = "off";
      input.placeholder = `Nom del jugador ${i + 1}`;
      input.setAttribute("aria-label", `Nom del jugador ${i + 1}`);
      input.value = previous[i]?.name || "";

      const picker = document.createElement("div");
      picker.className = "color-picker";
      picker.setAttribute("aria-label", `Color del jugador ${i + 1}`);

      colors.forEach(color => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "color-option";
        button.style.backgroundColor = color;
        button.setAttribute("aria-label", `Seleccionar color ${color}`);
        button.setAttribute(
          "aria-pressed",
          String(row.dataset.color === color)
        );

        button.addEventListener("click", () => {
          row.dataset.color = color;

          picker.querySelectorAll(".color-option").forEach(option => {
            option.setAttribute(
              "aria-pressed",
              String(option === button)
            );
          });
        });

        picker.appendChild(button);
      });

      row.append(input, picker);
      playersList.appendChild(row);
    }

    setupError.hidden = true;
  }

  function getPlayers() {
    const rows = Array.from(playersList.querySelectorAll(".player-row"));
    const names = new Set();
    const result = [];

    for (let i = 0; i < rows.length; i++) {
      const name = rows[i].querySelector(".player-name").value.trim();

      if (!name) {
        setupError.textContent =
          `Escriu el nom del jugador ${i + 1}.`;
        setupError.hidden = false;
        rows[i].querySelector(".player-name").focus();
        return null;
      }

      const normalized = name.toLocaleLowerCase("ca");

      if (names.has(normalized)) {
        setupError.textContent =
          `El nom "${name}" està repetit. Tria noms diferents.`;
        setupError.hidden = false;
        rows[i].querySelector(".player-name").focus();
        return null;
      }

      names.add(normalized);

      result.push({
        name,
        color: rows[i].dataset.color || colors[i % colors.length]
      });
    }

    setupError.hidden = true;
    return result;
  }

  $("minusPlayers").addEventListener("click", () => {
    countInput.value = clamp(Number(countInput.value) - 1);
    createRows();
  });

  $("plusPlayers").addEventListener("click", () => {
    countInput.value = clamp(Number(countInput.value) + 1);
    createRows();
  });

  countInput.addEventListener("change", createRows);

  $("startBtn").addEventListener("click", () => {
    const players = getPlayers();
    if (!players) return;

    if (typeof window.startOcaGame !== "function") {
      setupError.textContent =
        "No s'ha pogut iniciar el joc. Comprova que JocOca.js s'hagi carregat.";
      setupError.hidden = false;
      return;
    }

    window.startOcaGame(players);
  });

  window.getOcaSetupPlayers = getPlayers;
  createRows();
})();
