<?php
$caselles = require __DIR__ . '/JocOca_caselles.php';
$colors = require __DIR__ . '/JocOca_colors.php';

if (!is_array($caselles) || !is_array($colors)) {
    http_response_code(500);
    exit('No s’han pogut carregar les dades del joc.');
}

?>
<!doctype html>
<html lang="ca">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#171526">
  <meta name="description" content="Joc de l'Oca Party per jugar en grup.">
  <title>La Oca Party</title>
  <link rel="icon" href="images/favicon.png" type="image/png">
  <link rel="stylesheet" href="JocOca.css">
  <script>
    window.caselles = <?= json_encode(
        $caselles,
        JSON_UNESCAPED_UNICODE |
        JSON_HEX_TAG |
        JSON_HEX_AMP |
        JSON_HEX_APOS |
        JSON_HEX_QUOT
    ) ?>;
    window.colors = <?= json_encode(
        $colors,
        JSON_UNESCAPED_UNICODE |
        JSON_HEX_TAG |
        JSON_HEX_AMP |
        JSON_HEX_APOS |
        JSON_HEX_QUOT
    ) ?>;
  </script>
  <script src="JocOca_setup.js" defer></script>
  <script src="JocOca.js" defer></script>
</head>
<body>
  <main class="app">
    <header class="site-header">
      <div class="brand-icon" aria-hidden="true">🎲</div>
      <div>
        <p class="eyebrow">JOC DE TAULA · MULTIJUGADOR LOCAL</p>
        <h1>La Oca <span>Party</span></h1>
      </div>
    </header>

    <section id="setupScreen" class="panel setup-panel">
      <div class="intro">
        <p class="eyebrow">PREPARATS?</p>
        <h2>Que comenci la partida</h2>
        <p>Afegiu els jugadors, trieu els colors i passeu-vos el dispositiu per torns.</p>
      </div>

      <div class="setup-toolbar">
        <label for="numPlayers">Nombre de jugadors</label>
        <div class="counter">
          <button id="minusPlayers" class="counter-button" type="button" aria-label="Treure un jugador">−</button>
          <output id="playerCount" for="numPlayers">4</output>
          <button id="plusPlayers" class="counter-button" type="button" aria-label="Afegir un jugador">+</button>
          <input id="numPlayers" type="number" min="2" max="8" value="4" hidden>
        </div>
      </div>

      <div id="playersList" class="players-list"></div>
      <p class="helper-text">De 2 a 8 jugadors. Cada jugador necessita un nom i un color.</p>

      <p id="setupError" class="error-message" role="alert" hidden></p>
      <button id="startBtn" class="button button-primary button-wide" type="button">
        Començar partida <span aria-hidden="true">→</span>
      </button>
    </section>

    <section id="gameScreen" class="game-screen" hidden>
      <div class="game-heading">
        <div>
          <p class="eyebrow">PARTIDA EN CURS</p>
          <h2>El tauler</h2>
        </div>
        <button id="resetBtn" class="button button-secondary" type="button">↻ Reiniciar</button>
      </div>

      <section class="turn-card" aria-live="polite">
        <div id="turnAvatar" class="turn-avatar">J</div>
        <div class="turn-details">
          <span class="eyebrow">ÉS EL TORN DE</span>
          <strong id="turnName">Jugador 1</strong>
          <span id="turnPosition" class="muted">Casella 0</span>
        </div>
        <div id="diceResult" class="dice-result" aria-label="Resultat del dau">—</div>
      </section>

      <div class="board-frame">
        <div id="board" class="board" aria-label="Tauler del Joc de l'Oca"></div>
      </div>

      <section class="game-sidebar">
        <div class="message-card" aria-live="polite" aria-atomic="true">
          <span id="messageIcon" class="message-icon" aria-hidden="true">✨</span>
          <div>
            <strong id="messageTitle">Tot a punt!</strong>
            <p id="messageText">Tira el dau per començar la partida.</p>
          </div>
        </div>

        <button id="rollBtn" class="button button-primary button-wide roll-button" type="button">
          🎲 Tirar el dau
        </button>

        <section class="panel players-panel">
          <div class="section-heading">
            <h3>Jugadors</h3>
            <span id="playersSummary" class="muted"></span>
          </div>
          <div id="scoreboard" class="scoreboard"></div>
        </section>

        <button id="backBtn" class="text-button" type="button">
          ← Tornar a la configuració
        </button>
      </section>
    </section>

    <footer>
      Fet per jugar en grup · Respecteu els límits de tothom i jugueu amb responsabilitat.
    </footer>
  </main>
</body>
</html>
