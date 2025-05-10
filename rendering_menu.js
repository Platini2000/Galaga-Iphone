// --- START OF FILE rendering_menu.js ---
// --- DEEL 1      van 3 dit code blok    --- (<<< REVISE: Lower Results Screen Text by One Line >>>)
// <<< GEWIJZIGD: pollControllerForMenu checkt nu ook op isShowingResultsScreen om showMenuState aan te roepen. >>>
// <<< GEWIJZIGD: MENU_SUBTITLE_FONT expliciet 'bold' gemaakt. >>>
// <<< GEWIJZIGD: MENU_SUBTITLE_FONT grootte aangepast van 15px naar 18px. >>>
// <<< GEWIJZIGD: MENU_SUBTITLE_COLOR aangepast van "darkred" naar "red". >>>
// <<< GEWIJZIGD: RESULTS_HEADER_COLOR aangepast van "darkred" naar "red". >>>
// <<< GEWIJZIGD: RESULTS_START_Y verder verhoogd om tekst te laten zakken. >>>
// <<< GEWIJZIGD: RESULTS_START_Y nu verlaagd om tekst 4 regels hoger te plaatsen. >>>
// <<< GEWIJZIGD: RESULTS_START_Y nu met nog 1 regel verlaagd (dus totaal 3 regels hoger dan origineel). >>>

// --- Menu/UI Constanten ---
const MENU_LOGO_APPROX_HEIGHT = 85;
const MENU_SUBTITLE_TEXT = "Written By Platini2000(c)";
const MENU_SUBTITLE_FONT = "bold 18px 'Arial Black', Gadget, sans-serif";
const MENU_SUBTITLE_COLOR = "red";
const MENU_BUTTON_FONT = "22px 'Arial Black', Gadget, sans-serif";
const MENU_BUTTON_COLOR = "white";
const MENU_BUTTON_COLOR_HOVER = 'rgba(0, 191, 255, 0.9)';
const MENU_BUTTON_WIDTH = 300;
const MENU_BUTTON_HEIGHT = 55;
const MENU_LOGO_BOTTOM_TO_START_GAP = 5;
const MENU_BUTTON_V_GAP = -15;
const MENU_BUTTON_SUBTITLE_V_GAP = -0;
const MENU_SCORE_FONT = "20px 'Press Start 2P'";
const MENU_SCORE_COLOR = "white";
const MENU_SCORE_LABEL_COLOR = "red"; // Blijft "red" voor score labels die geen 1UP/2UP zijn.
const GAME_OVER_FONT = "bold 18px 'Press Start 2P'";
const GAME_OVER_COLOR = "rgba(0, 191, 255, 0.9)";
const GAME_OVER_SHADOW = true;
const DEMO_TEXT_LINE1_FONT = "bold 18px 'Press Start 2P'";
const DEMO_TEXT_COLOR = "rgba(0, 191, 255, 0.9)";
const DEMO_TEXT_BLINK_ON_MS = 1000;
const DEMO_TEXT_BLINK_OFF_MS = 1000;
const DEMO_TEXT_BLINK_CYCLE_MS = DEMO_TEXT_BLINK_ON_MS + DEMO_TEXT_BLINK_OFF_MS;
const LOGO_SCALE_FACTOR = 0.45;
const MENU_LOGO_EXTRA_Y_OFFSET = 0;
const MENU_GENERAL_Y_OFFSET = 50; // Verhoogde offset
const INTRO_TEXT_FONT = "bold 18px 'Press Start 2P'";
const INTRO_TEXT_COLOR_NORMAL = "rgba(0, 191, 255, 0.9)";
const INTRO_TEXT_COLOR_DARK_YELLOW = "yellow";
const INTRO_TEXT_COLOR_CS_TEXT = INTRO_TEXT_COLOR_NORMAL;
const PERFECT_TEXT_COLOR = "red";
const EXTRA_LIFE_TEXT_COLOR = INTRO_TEXT_COLOR_NORMAL;
const READY_TEXT_COLOR = INTRO_TEXT_COLOR_NORMAL;
const CS_BONUS_SCORE_TEXT_COLOR = INTRO_TEXT_COLOR_DARK_YELLOW;
const CS_CLEAR_TEXT_COLOR = INTRO_TEXT_COLOR_NORMAL;
const CS_HITS_TEXT_COLOR = INTRO_TEXT_COLOR_NORMAL;
const CS_CLEAR_SCORE_TEXT_COLOR = INTRO_TEXT_COLOR_NORMAL;
const PAUSE_TEXT_FONT = INTRO_TEXT_FONT;
const PAUSE_TEXT_COLOR = INTRO_TEXT_COLOR_NORMAL;
const PAUSE_TEXT_SHADOW = true;

// GAME_OVER_DURATION is defined in setup_utils.js
const RESULTS_SCREEN_DURATION = 20000;
const PLAYER_GAME_OVER_MESSAGE_DURATION = 5000;

// --- Score Screen Constanten ---
const SCORE_SCREEN_TEXT_FONT = INTRO_TEXT_FONT;
const SCORE_SCREEN_TEXT_COLOR_TOP = INTRO_TEXT_COLOR_NORMAL;
const SCORE_SCREEN_TEXT_COLOR_BONUS = INTRO_TEXT_COLOR_DARK_YELLOW;
const SCORE_SCREEN_LINE_V_SPACING = 40;
const SCORE_SCREEN_ICON_TEXT_H_SPACING = 15;
const SCORE_SCREEN_VERTICAL_OFFSET = 75;
const SCORE_SCREEN_PLATINI_TEXT = "2025   PLATINI2000(c)   LTD";


// --- Resultaten Scherm Kleuren & Layout ---
const RESULTS_HEADER_COLOR = "red";
const RESULTS_VALUE_COLOR_YELLOW = INTRO_TEXT_COLOR_DARK_YELLOW;
const RESULTS_LABEL_COLOR = "white";
const RESULTS_VALUE_COLOR_CYAN = INTRO_TEXT_COLOR_NORMAL;
const RESULTS_LINE_V_SPACING_SINGLE = 35;
const RESULTS_LINE_V_SPACING_DOUBLE = 90;
const RESULTS_START_Y = 175; // <<< GEWIJZIGD: Verhoogd met 20 (was 155) om 1 regel lager te komen. >>>
const RESULTS_FOOTER_FONT = MENU_SUBTITLE_FONT;
const RESULTS_FOOTER_COLOR = MENU_SUBTITLE_COLOR;
const RESULTS_PLATINI_TEXT = "Platini2000(c) LTD";

// --- Verticale Offset voor CS berichten ---
const CS_MESSAGE_VERTICAL_OFFSET = 30;

// --- Helper Functie voor Hoogte ---
function getSubtitleApproxHeight(font) { const sizeMatch = font.match(/(\d+)px/); return sizeMatch?.[1] ? parseInt(sizeMatch[1], 10) : 25; }

// --- Helper Functie voor Tijd Formattering ---
/** Formatteert milliseconden naar een "MM:SS" string. */
function formatMillisecondsToMMSS(ms) { if (ms <= 0 || typeof ms !== 'number' || !isFinite(ms)) { return "00:00"; } const totalSeconds = Math.floor(ms / 1000); const minutes = Math.floor(totalSeconds / 60); const seconds = totalSeconds % 60; const paddedMinutes = String(minutes).padStart(2, '0'); const paddedSeconds = String(seconds).padStart(2, '0'); return `${paddedMinutes}:${paddedSeconds}`; }

// --- Menu State & Interactie ---

/** Berekent de rechthoek (positie en grootte) voor een menuknop. */
function getMenuButtonRect(buttonIndex) {
    // <<< Functie ongewijzigd tov vorige iteratie >>>
    if (!gameCtx || !gameCanvas || gameCanvas.width === 0 || gameCanvas.height === 0) return null;
    const canvasWidth = gameCanvas.width; const canvasHeight = gameCanvas.height;
    const buttonX = (canvasWidth / 2 - MENU_BUTTON_WIDTH / 2) - 1;
    let actualLogoHeight = MENU_LOGO_APPROX_HEIGHT;
    if (typeof logoImage !== 'undefined' && logoImage.complete && logoImage.naturalHeight !== 0) { actualLogoHeight = logoImage.naturalHeight * LOGO_SCALE_FACTOR; }
    const subtitleHeight = getSubtitleApproxHeight(MENU_SUBTITLE_FONT); // Hoogte gebaseerd op nieuwe font
    const totalContentHeight = actualLogoHeight + MENU_LOGO_BOTTOM_TO_START_GAP + MENU_BUTTON_HEIGHT + MENU_BUTTON_V_GAP + MENU_BUTTON_HEIGHT + MENU_BUTTON_SUBTITLE_V_GAP + subtitleHeight;
    let groupStartY = (canvasHeight - totalContentHeight) / 2 - 70;
    groupStartY += MENU_GENERAL_Y_OFFSET;
    const startButtonTopY = groupStartY + actualLogoHeight + MENU_LOGO_BOTTOM_TO_START_GAP;
    const exitButtonTopY = startButtonTopY + MENU_BUTTON_HEIGHT + MENU_BUTTON_V_GAP;
    if (buttonIndex === 0) { return { x: buttonX, y: Math.round(startButtonTopY), width: MENU_BUTTON_WIDTH, height: MENU_BUTTON_HEIGHT }; }
    else if (buttonIndex === 1) { return { x: buttonX, y: Math.round(exitButtonTopY), width: MENU_BUTTON_WIDTH, height: MENU_BUTTON_HEIGHT }; }
    return null;
}


/**
 * Verwerkt controller input in het menu, score screen, of game over/results sequence.
 */
function pollControllerForMenu() {
    try {
        if (connectedGamepadIndex === null && connectedGamepadIndexP2 === null) { joystickMovedVerticallyLastFrame = false; if(previousButtonStates.length > 0) previousButtonStates = []; if(previousGameButtonStates.length > 0) previousGameButtonStates = []; if(previousGameButtonStatesP2.length > 0) previousGameButtonStatesP2 = []; return; }
        let primaryGamepadIndex = connectedGamepadIndex !== null ? connectedGamepadIndex : connectedGamepadIndexP2;
        if (primaryGamepadIndex === null) return;
        const gamepads = navigator.getGamepads();
        if (!gamepads?.[primaryGamepadIndex]) return;
        const gamepad = gamepads[primaryGamepadIndex];
        const currentButtonStates = gamepad.buttons.map(b => b.pressed);
        const currentGeneralButtonStates = currentButtonStates;
        const currentGameButtonStates = currentButtonStates;
        let actionTakenThisFrame = false;
        const now = Date.now();
        let blockAllMenuInput = false;
        if (isShowingPlayerGameOverMessage || gameOverSequenceStartTime > 0) { blockAllMenuInput = true; }
        if (blockAllMenuInput) { if (connectedGamepadIndex !== null) { previousButtonStates = currentGeneralButtonStates.slice(); previousGameButtonStates = currentGameButtonStates.slice(); } if (connectedGamepadIndexP2 !== null) { const gamepadsP2 = navigator.getGamepads(); if (gamepadsP2?.[connectedGamepadIndexP2]) { previousGameButtonStatesP2 = gamepadsP2[connectedGamepadIndexP2].buttons.map(b => b.pressed); } } return; }
        if (isInGameState && playerLives > 0 && gameOverSequenceStartTime === 0 && !isShowingPlayerGameOverMessage) {
            const trianglePressedNow = currentGameButtonStates[PS5_BUTTON_TRIANGLE];
            const trianglePressedLast = previousGameButtonStates[PS5_BUTTON_TRIANGLE] ?? false;
            if (trianglePressedNow && !trianglePressedLast) { stopGameAndShowMenu(); actionTakenThisFrame = true; }
        }
        if (!actionTakenThisFrame && isInGameState && playerLives > 0 && gameOverSequenceStartTime === 0 && !isShowingPlayerGameOverMessage) {
            const r1PressedNow = currentGameButtonStates[PS5_BUTTON_R1];
            const r1PressedLast = previousGameButtonStates[PS5_BUTTON_R1] ?? false;
            if (r1PressedNow && !r1PressedLast) { if(typeof togglePause === 'function') togglePause(); actionTakenThisFrame = true; }
        }
        if (!actionTakenThisFrame) {
             const canConsiderReturningToMenu = isShowingScoreScreen || isShowingResultsScreen;
             if (canConsiderReturningToMenu) {
                let anyButtonPressedNow = false;
                for (let i = 0; i < currentGeneralButtonStates.length; i++) {
                    if (i === PS5_BUTTON_R1 || i === PS5_BUTTON_TRIANGLE) continue;
                    const wasPressedLast = previousButtonStates[i] ?? false;
                    if (currentGeneralButtonStates[i] && !wasPressedLast) {
                        anyButtonPressedNow = true;
                        break;
                    }
                }
                if (anyButtonPressedNow) {
                    if(typeof showMenuState === 'function') showMenuState();
                    actionTakenThisFrame = true;
                }
             }
            else if (!isInGameState && !actionTakenThisFrame) { // Menu navigatie
                const crossPressedNow = currentGeneralButtonStates[PS5_BUTTON_CROSS];
                const crossPressedLast = previousButtonStates[PS5_BUTTON_CROSS] ?? false;
                const circlePressedNow = currentGeneralButtonStates[PS5_BUTTON_CIRCLE];
                const circlePressedLast = previousButtonStates[PS5_BUTTON_CIRCLE] ?? false;
                const axisY = gamepad.axes[PS5_LEFT_STICK_Y] ?? 0;
                const dpadUp = currentGeneralButtonStates[PS5_DPAD_UP];
                const dpadDown = currentGeneralButtonStates[PS5_DPAD_DOWN];
                let verticalInput = 0;
                if (axisY < -AXIS_DEAD_ZONE_MENU || dpadUp) verticalInput = -1;
                else if (axisY > AXIS_DEAD_ZONE_MENU || dpadDown) verticalInput = 1;
                let currentJoystickMoved = (verticalInput !== 0);
                if (currentJoystickMoved && !joystickMovedVerticallyLastFrame) { let newIndex = selectedButtonIndex; const numButtons = 2; if (newIndex === -1) { newIndex = (verticalInput === 1) ? 0 : numButtons - 1; } else { newIndex += verticalInput; } if (newIndex < 0) newIndex = numButtons - 1; if (newIndex >= numButtons) newIndex = 0; if (newIndex !== selectedButtonIndex) { selectedButtonIndex = newIndex; startAutoDemoTimer(); } }
                joystickMovedVerticallyLastFrame = currentJoystickMoved;
                 if (crossPressedNow && !crossPressedLast) {
                     stopAutoDemoTimer();
                     if (isFiringModeSelectMode) { if (selectedButtonIndex === 0) { selectedFiringMode = 'rapid'; } else { selectedFiringMode = 'single'; } baseStartGame(true); actionTakenThisFrame = true; }
                     else if (isPlayerSelectMode) { if (selectedButtonIndex === 0) { startGame1P(); } else { startGame2P(); } actionTakenThisFrame = true; }
                     else { if (selectedButtonIndex === 0) { isPlayerSelectMode = true; isFiringModeSelectMode = false; selectedButtonIndex = 0; startAutoDemoTimer(); actionTakenThisFrame = true; } else if (selectedButtonIndex === 1) { exitGame(); actionTakenThisFrame = true; } }
                 }
                 if (!actionTakenThisFrame && circlePressedNow && !circlePressedLast) {
                      stopAutoDemoTimer();
                      if (isFiringModeSelectMode) { isFiringModeSelectMode = false; isPlayerSelectMode = true; selectedButtonIndex = 0; startAutoDemoTimer(); actionTakenThisFrame = true; }
                      else if (isPlayerSelectMode) { isPlayerSelectMode = false; isFiringModeSelectMode = false; selectedButtonIndex = 0; startAutoDemoTimer(); actionTakenThisFrame = true; }
                      else { triggerFullscreen(); playSound(menuMusicSound, true); actionTakenThisFrame = true; }
                 }
            }
        }
         if (connectedGamepadIndex !== null) { previousButtonStates = currentGeneralButtonStates.slice(); previousGameButtonStates = currentGameButtonStates.slice(); }
         if (connectedGamepadIndexP2 !== null) { const gamepadsP2 = navigator.getGamepads(); if (gamepadsP2?.[connectedGamepadIndexP2]) { previousGameButtonStatesP2 = gamepadsP2[connectedGamepadIndexP2].buttons.map(b => b.pressed); } }
    } catch (e) { console.error("Error in pollControllerForMenu:", e); previousButtonStates = []; previousGameButtonStates = []; previousGameButtonStatesP2 = []; selectedButtonIndex = -1; joystickMovedVerticallyLastFrame = false; }
}


/** Start de timer die naar het score screen leidt. */
function startAutoDemoTimer() { /* ... ongewijzigd ... */ try { stopAutoDemoTimer(); autoStartTimerId = setTimeout(() => { if (!isInGameState && !isShowingScoreScreen) { isPlayerSelectMode = false; isFiringModeSelectMode = false; showScoreScreen(); } else { autoStartTimerId = null; } }, MENU_INACTIVITY_TIMEOUT); } catch (e) { console.error("Error starting auto demo timer:", e); } }
/** Stopt de timer voor menu inactiviteit / score screen. */
function stopAutoDemoTimer() { /* ... ongewijzigd ... */ try { if (autoStartTimerId) { clearTimeout(autoStartTimerId); autoStartTimerId = null; } } catch (e) { console.error("Error stopping auto demo timer:", e); } }

/** Activeert de score screen state. */
function showScoreScreen() { /* ... ongewijzigd ... */ if (isInGameState || isShowingScoreScreen) return; stopAutoDemoTimer(); isShowingScoreScreen = true; isPlayerSelectMode = false; isFiringModeSelectMode = false; scoreScreenStartTime = Date.now(); selectedButtonIndex = -1; }

// --- EINDE deel 1      van 3 dit codeblok ---
// --- END OF FILE rendering_menu.js ---







// --- START OF FILE rendering_menu.js ---
// --- DEEL 2      van 3 dit code blok    --- (<<< REVISE: Refactor Menu Interaction for Touch >>>)
// <<< GEWIJZIGD: Gebruikt Web Audio API (impliciet via playSound/stopSound). >>>
// <<< GEWIJZIGD: Overbodige logs/warnings verwijderd. >>>
// <<< GEWIJZIGD: Expliciet stopSound(resultsMusicSound) toegevoegd in showMenuState. >>>
// <<< GEWIJZIGD: Delay voor starten menu muziek in showMenuState VERWIJDERD. >>>
// <<< GEWIJZIGD: Diagnostische log verwijderd uit showMenuState. >>>
// <<< GEWIJZIGD: Touch state variabelen gereset in showMenuState. >>>
// <<< GEWIJZIGD: showMenuState stopt nu expliciet startSound, levelUpSound, entranceSound. >>>
// <<< GEWIJZIGD: Menu interactie logica verplaatst naar processMenuInteraction. >>>
// <<< GEWIJZIGD: handleCanvasClick roept nu processMenuInteraction aan. >>>

// --- Game State Transitions & Control ---
/** Schakelt naar de menu state, stopt geluiden, reset game state en vlaggen. */
function showMenuState() {
    try {
       if (wasLastGameAIDemo) { highScore = 20000; }
       wasLastGameAIDemo = false;

       isInGameState = false;
       isShowingScoreScreen = false; scoreScreenStartTime = 0;
       isManualControl = false; isShowingDemoText = false;
       isPaused = false;
       isPlayerSelectMode = false;
       isFiringModeSelectMode = false;
       selectedFiringMode = 'rapid';
       isTwoPlayerMode = false; currentPlayer = 1;
       showCsHitsMessage = false; csHitsMessageStartTime = 0; showPerfectMessage = false; perfectMessageStartTime = 0; showCsBonusScoreMessage = false; csBonusScoreMessageStartTime = 0; showCSClearMessage = false; csClearMessageStartTime = 0; showCsHitsForClearMessage = false; showCsScoreForClearMessage = false; showExtraLifeMessage = false; extraLifeMessageStartTime = 0;
       showReadyMessage = false; readyMessageStartTime = 0; readyForNextWave = false; readyForNextWaveReset = false; isCsCompletionDelayActive = false; csCompletionDelayStartTime = 0; csCompletionResultIsPerfect = false; csIntroSoundPlayed = false; isShowingPlayerGameOverMessage = false; playerGameOverMessageStartTime = 0; playerWhoIsGameOver = 0; nextActionAfterPlayerGameOver = '';
       player1TriggeredHighScoreSound = false;
       player2TriggeredHighScoreSound = false;

       stopAllGameSounds(); // Stops looping sounds (now iterates over all)
       stopSound(resultsMusicSound); // Extra check for results music
       stopSound(startSound);
       stopSound(levelUpSound);
       stopSound(entranceSound);
       isGridSoundPlaying = false;

       playerLives = 3; score = 0; level = 1;
       player1Lives = 3; player2Lives = 3; player1Score = 0; player2Score = 0; player1ShotsFired = 0; player2ShotsFired = 0; player1EnemiesHit = 0; player2EnemiesHit = 0; player1MaxLevelReached = 1; player2MaxLevelReached = 1;
       scoreEarnedThisCS = 0; enemies = []; bullets = []; enemyBullets = []; explosions = []; isShowingIntro = false; introStep = 0; isChallengingStage = false; challengingStageEnemiesHit = 0; currentGridOffsetX = 0; gridMoveDirection = 1; currentWaveDefinition = null; isEntrancePhaseActive = false; totalEnemiesScheduledForWave = 0; enemiesSpawnedThisWave = 0; if(typeof enemySpawnTimeouts !== 'undefined' && Array.isArray(enemySpawnTimeouts)){ enemySpawnTimeouts.forEach(clearTimeout); } enemySpawnTimeouts = []; lastEnemyDetachTime = 0; selectedButtonIndex = -1; joystickMovedVerticallyLastFrame = false; previousButtonStates = []; previousGameButtonStates = []; previousDemoButtonStates = []; previousGameButtonStatesP2 = [];
       isShowingResultsScreen = false;
       gameOverSequenceStartTime = 0; gameStartTime = 0; forceCenterShipNextReset = false; player1CompletedLevel = -1;
       p1JustFiredSingle = false; p2JustFiredSingle = false;
       p1FireInputWasDown = false; p2FireInputWasDown = false;
       isTouching = false; touchCurrentX = 0; isDraggingShip = false; shipTouchOffsetX = 0; lastTapTime = 0; touchJustFiredSingle = false;

       if (ship && gameCanvas && gameCanvas.width > 0 && gameCanvas.height > 0) { ship.x = Math.round(gameCanvas.width / 2 - SHIP_WIDTH / 2); ship.targetX = ship.x; ship.y = gameCanvas.height - SHIP_HEIGHT - SHIP_BOTTOM_MARGIN; }

       clearTimeout(mouseIdleTimerId);
       mouseIdleTimerId = setTimeout(hideCursor, 2000);

       playSound(menuMusicSound, true);

       startAutoDemoTimer();
   } catch(e) {
       console.error("Error in showMenuState:", e);
       wasLastGameAIDemo = false; isInGameState = false; isShowingScoreScreen = false; isPaused = false; isPlayerSelectMode = false; isFiringModeSelectMode = false; isTwoPlayerMode = false; currentPlayer = 1; isShowingPlayerGameOverMessage = false;
       player1TriggeredHighScoreSound = false;
       player2TriggeredHighScoreSound = false;
       isTouching = false; touchCurrentX = 0; isDraggingShip = false; shipTouchOffsetX = 0; lastTapTime = 0; touchJustFiredSingle = false;
       clearTimeout(mouseIdleTimerId); mouseIdleTimerId = null;
       if(mainLoopId) cancelAnimationFrame(mainLoopId); mainLoopId = null;
       alert("Error returning to menu. Please refresh the page."); document.body.innerHTML = '<p style="color:white;">Error returning to menu. Please refresh.</p>';
   }
}

/** Start de AI demo modus. */
function startAIDemo() {
    if (isInGameState) return;
    stopSound(menuMusicSound);
    isShowingScoreScreen = false; isPlayerSelectMode = false; isFiringModeSelectMode = false; selectedFiringMode = 'rapid'; isTwoPlayerMode = false; isManualControl = false; isShowingDemoText = true; wasLastGameAIDemo = true; baseStartGame(false); gameJustStarted = true;
}

/** Start een handmatig bestuurde 1-speler game. */
function startGame1P() {
    if (isInGameState) return;
    isTwoPlayerMode = false;
    isPlayerSelectMode = false;
    isFiringModeSelectMode = true;
    selectedButtonIndex = 0;
    startAutoDemoTimer();
}

/** Start een 2-speler game. */
function startGame2P() {
    if (isInGameState) return;
    isTwoPlayerMode = true;
    isPlayerSelectMode = false;
    isFiringModeSelectMode = true;
    selectedButtonIndex = 0;
    startAutoDemoTimer();
}


/** Basis functie om het spel te starten (manual of AI). */
function baseStartGame(setManualControl) {
    try {
        if (!gameCanvas || !gameCtx) { console.error("Cannot start game - canvas not ready."); showMenuState(); return; }
        stopSound(menuMusicSound); // Stop menu muziek loop
        stopAutoDemoTimer();
        isInGameState = true; isShowingScoreScreen = false; isPlayerSelectMode = false; isFiringModeSelectMode = false;
        isManualControl = setManualControl; isShowingDemoText = !setManualControl; isPaused = false;
        previousButtonStates = []; previousGameButtonStates = []; previousDemoButtonStates = []; previousGameButtonStatesP2 = [];
        p1JustFiredSingle = false; p2JustFiredSingle = false;
        p1FireInputWasDown = false; p2FireInputWasDown = false;
        if (setManualControl) { wasLastGameAIDemo = false; }

        clearTimeout(mouseIdleTimerId);
        mouseIdleTimerId = setTimeout(hideCursor, 2000);

        if (typeof resetGame === 'function') { resetGame(); } else { console.error("FATAL: resetGame function is not defined! Cannot start game properly."); alert("Critical error: Game logic not loaded correctly!"); showMenuState(); return; }
        if (setManualControl) { playSound(coinSound); } // Speel coin geluid
        gameStartTime = Date.now();
        leftPressed = false; rightPressed = false; shootPressed = false;
        p2LeftPressed = false; p2RightPressed = false; p2ShootPressed = false;
        keyboardP1LeftDown = false; keyboardP1RightDown = false; keyboardP1ShootDown = false;
        keyboardP2LeftDown = false; keyboardP2RightDown = false; keyboardP2ShootDown = false;
        selectedButtonIndex = -1;
        if (ship && gameCanvas && gameCanvas.width > 0 && gameCanvas.height > 0) { ship.x = Math.round(gameCanvas.width / 2 - SHIP_WIDTH / 2); ship.targetX = ship.x; ship.y = gameCanvas.height - SHIP_HEIGHT - SHIP_BOTTOM_MARGIN; }
        if (mainLoopId === null) { startMainLoop(); }
    } catch (e) {
        console.error("Error in baseStartGame:", e);
        wasLastGameAIDemo = false;
        clearTimeout(mouseIdleTimerId); mouseIdleTimerId = null;
        alert("Critical error starting game!"); showMenuState();
    }
}
/** Stopt het spel en keert direct terug naar het menu. */
function stopGameAndShowMenu() { isPaused = false; if (isManualControl) saveHighScore(); showMenuState(); }
/** Probeert het spel/venster te sluiten, valt terug naar menu state. */
function exitGame() { isPaused = false; stopAutoDemoTimer(); saveHighScore(); isInGameState = false; isPlayerSelectMode = false; isFiringModeSelectMode = false; showMenuState(); try { window.close(); setTimeout(() => { if(!isInGameState) showMenuState(); }, 200); } catch(e) { console.error("window.close() failed:", e); showMenuState(); } }
/** Triggert de Game Over sequence. */
function triggerGameOver() { triggerFinalGameOverSequence(); }

/** Start de timer die naar het score screen leidt. */
function startAutoDemoTimer() { try { stopAutoDemoTimer(); autoStartTimerId = setTimeout(() => { if (!isInGameState && !isShowingScoreScreen) { isPlayerSelectMode = false; isFiringModeSelectMode = false; showScoreScreen(); } else { autoStartTimerId = null; } }, MENU_INACTIVITY_TIMEOUT); } catch (e) { console.error("Error starting auto demo timer:", e); } }
/** Stopt de timer voor menu inactiviteit / score screen. */
function stopAutoDemoTimer() { try { if (autoStartTimerId) { clearTimeout(autoStartTimerId); autoStartTimerId = null; } } catch (e) { console.error("Error stopping auto demo timer:", e); } }

/** Activeert de score screen state. */
function showScoreScreen() {
    if (isInGameState || isShowingScoreScreen) return;
    stopAutoDemoTimer();
    isShowingScoreScreen = true;
    isPlayerSelectMode = false;
    isFiringModeSelectMode = false;
    scoreScreenStartTime = Date.now();
    selectedButtonIndex = -1;
    clearTimeout(mouseIdleTimerId);
    mouseIdleTimerId = setTimeout(hideCursor, 2000);
}

// --- <<< NIEUW: Helper functie voor Menu Interactie >>> ---
/** Verwerkt interactie (klik/tap) op een specifieke canvas positie in het menu/score screen. */
function processMenuInteraction(canvasX, canvasY) {
    if (isShowingScoreScreen) {
        if (typeof showMenuState === 'function') showMenuState();
    } else {
        const button0Rect = getMenuButtonRect(0);
        const button1Rect = getMenuButtonRect(1);
        let clickedButton0 = button0Rect && checkCollision({ x: canvasX, y: canvasY, width: 1, height: 1 }, button0Rect);
        let clickedButton1 = button1Rect && checkCollision({ x: canvasX, y: canvasY, width: 1, height: 1 }, button1Rect);

        if (isFiringModeSelectMode) {
            if (clickedButton0) { selectedFiringMode = 'rapid'; baseStartGame(true); stopAutoDemoTimer(); }
            else if (clickedButton1) { selectedFiringMode = 'single'; baseStartGame(true); stopAutoDemoTimer(); }
            else { isFiringModeSelectMode = false; isPlayerSelectMode = true; selectedButtonIndex = 0; startAutoDemoTimer(); }
        } else if (isPlayerSelectMode) {
            if (clickedButton0) { startGame1P(); stopAutoDemoTimer(); }
            else if (clickedButton1) { startGame2P(); stopAutoDemoTimer(); }
            else { isPlayerSelectMode = false; isFiringModeSelectMode = false; selectedButtonIndex = 0; startAutoDemoTimer(); }
        } else { // Hoofdmenu
            if (clickedButton0) { isPlayerSelectMode = true; isFiringModeSelectMode = false; selectedButtonIndex = 0; startAutoDemoTimer(); }
            else if (clickedButton1) { if (typeof exitGame === 'function') exitGame(); stopAutoDemoTimer(); }
            else { triggerFullscreen(); playSound(menuMusicSound, true); stopAutoDemoTimer(); } // Klik buiten knoppen = fullscreen
        }
    }
}


// --- Canvas Event Handlers ---
/** <<< GEWIJZIGD: Roept nu processMenuInteraction aan >>> */
function handleCanvasClick(event) {
    if (!gameCanvas) return;
    const rect = gameCanvas.getBoundingClientRect();
    const scaleX = gameCanvas.width / rect.width;
    const scaleY = gameCanvas.height / rect.height;
    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;
    let blockAllClickInput = false;

    if (isShowingPlayerGameOverMessage || gameOverSequenceStartTime > 0) {
        blockAllClickInput = true;
    }
    if (blockAllClickInput) {
        return;
    }

    if (isInGameState) {
        if (isPaused) {
            if(typeof togglePause === 'function') togglePause();
            return;
        }
        if (!isManualControl) {
            if(typeof stopGameAndShowMenu === 'function') stopGameAndShowMenu();
        }
        // Klik in-game heeft verder geen menu-functie meer
    } else { // Menu of Score Screen
        processMenuInteraction(clickX, clickY);
    }
}


// --- Rendering Functies ---
function createExplosion(x, y) {
    try {
        playSound(explosionSound); // Gebruik identifier
        let particles = []; for (let i = 0; i < EXPLOSION_PARTICLE_COUNT; i++) { const angle = Math.random() * Math.PI * 2; const speed = Math.random() * (EXPLOSION_MAX_SPEED - EXPLOSION_MIN_SPEED) + EXPLOSION_MIN_SPEED; particles.push({ x: x, y: y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, radius: EXPLOSION_PARTICLE_RADIUS, alpha: 1.0 }); } explosions.push({ creationTime: Date.now(), duration: EXPLOSION_DURATION, particles: particles }); } catch (e) { console.error("Error creating explosion:", e); }
}


// --- EINDE deel 2      van 3 dit codeblok ---
// --- END OF rendering_menu.js ---








// --- START OF FILE rendering_menu.js ---
// --- DEEL 3      van 3 dit code blok    --- (<<< REVISE: Make Entire Menu Subtitle Bold >>>)
// <<< GEWIJZIGD: Gebruikt Web Audio API (impliciet via playSound/stopSound). >>>
// <<< GEWIJZIGD: Overbodige logs/warnings verwijderd. >>>
// <<< GEWIJZIGD: Cursor wordt nu alleen getoond bij beweging en verdwijnt na 2s inactiviteit. >>>
// <<< GEWIJZIGD: Volgorde in initializeGame aangepast voor correcte paddefinitie. >>>
// <<< CORRECTIE: Syntax error bij catch block in renderGame opnieuw gecontroleerd en gecorrigeerd. >>>
// <<< GEWIJZIGD: Touch event listeners en handlers toegevoegd voor ship control en firing. >>>
// <<< GEWIJZIGD: handleTouchEnd staat nu toe om intro af te breken met een tik. >>>
// <<< GEWIJZIGD: handleTouchMove staat nu toe om schip te slepen tijdens intro. >>>
// <<< GEWIJZIGD: handleTouchEnd implementeert nu logica voor 'rapid' vs 'single' firing mode. >>>
// <<< GEWIJZIGD: handleTouchStart reset nu touchJustFiredSingle. >>>
// <<< GEWIJZIGD: handleTouchEnd roept nu processMenuInteraction aan voor menu/score screen taps. >>>
// <<< GEWIJZIGD: handleTouchEnd negeert nu touchJustFiredSingle volledig voor 'rapid' mode. >>>
// <<< GEWIJZIGD: handleTouchStart slaat nu touchStartX op. >>>
// <<< GEWIJZIGD: handleTouchMove update nu isDraggingShip op basis van afstand en tijd. >>>
// <<< GEWIJZIGD: handleTouchEnd gebruikt de verfijnde isDraggingShip. >>>
// <<< GEWIJZIGD: handleTouchStart zet nu isTouchFiringActive voor rapid mode. >>>
// <<< GEWIJZIGD: handleTouchEnd en handleTouchCancel zetten isTouchFiringActive op false. >>>
// <<< GEWIJZIGD: handleTouchStart probeert direct te vuren bij tik in rapid mode. >>>
// <<< GEWIJZIGD: handleTouchMove zet isTouchFiringActive NIET meer uit bij drag. >>>
// <<< GEWIJZIGD: handleTouchStart zet isTouchFiringActive direct voor rapid mode, zonder tik-check. >>>
// <<< GEWIJZIGD: renderGame tekent subtitel nu met expliciet bold font (uit deel 1). Split is niet nodig. >>>
// <<< GEWIJZIGD: "Platini2000(c)" tekst in Score Screen (demo) gebruikt nu MENU_SUBTITLE_FONT en MENU_SUBTITLE_COLOR. >>>
// <<< GEWIJZIGD: "Platini2000(c)" tekst in Results Screen (footer) gebruikt nu RESULTS_PLATINI_TEXT, RESULTS_FOOTER_FONT en RESULTS_FOOTER_COLOR. >>>
// <<< GEWIJZIGD: LABEL_COLOR voor 1UP/2UP/HIGH SCORE/DEMO bovenaan het scherm aangepast naar "rgb(255, 80, 80)". >>>
// <<< GEWIJZIGD: Kleur van 1UP/2UP/DEMO labels teruggezet naar "red". HIGH SCORE blijft lichter rood. >>>
// <<< GEWIJZIGD: Kleur van HIGH SCORE label nu ook teruggezet naar "red". >>>
// <<< GEWIJZIGD: Y-positie van PLATINI tekst in Results Screen aangepast. >>>
// <<< GEWIJZIGD: Y-positie van "PLAYER X WINS" tekst in Results Screen aangepast. >>>

/** Rendert de actieve explosies op het game canvas. */
function renderExplosions() { /* ... ongewijzigd ... */ try { if (!gameCtx) return; gameCtx.save(); gameCtx.globalCompositeOperation = 'lighter'; explosions.forEach(explosion => { explosion.particles.forEach(p => { const drawAlpha = p.alpha * EXPLOSION_MAX_OPACITY; if (drawAlpha > 0.01) { gameCtx.beginPath(); gameCtx.arc(Math.round(p.x), Math.round(p.y), p.radius, 0, Math.PI * 2); gameCtx.fillStyle = `rgba(255, 200, 80, ${drawAlpha.toFixed(3)})`; gameCtx.fill(); } }); }); gameCtx.restore(); } catch (e) { console.error("Error rendering explosions:", e); } }
/** Helper functie om tekst te tekenen op het canvas met opties. */
function drawCanvasText(text, x, y, font, color, align = 'center', baseline = 'middle', shadow = false) { /* ... ongewijzigd ... */ if (!gameCtx) return; gameCtx.save(); gameCtx.font = font; gameCtx.fillStyle = color; gameCtx.textAlign = align; gameCtx.textBaseline = baseline; if (shadow) { gameCtx.shadowColor = 'rgba(0, 0, 0, 0.8)'; gameCtx.shadowBlur = 8; gameCtx.shadowOffsetX = 3; gameCtx.shadowOffsetY = 3; } gameCtx.fillText(text, x, y); gameCtx.restore(); }
/** Tekent een menuknop met hover state. */
function drawCanvasButton(text, index, isSelected) { /* ... ongewijzigd ... */ if (!gameCtx) return; const rect = getMenuButtonRect(index); if (!rect) return; gameCtx.save(); drawCanvasText( text, rect.x + rect.width / 2, rect.y + rect.height / 2, MENU_BUTTON_FONT, isSelected ? MENU_BUTTON_COLOR_HOVER : MENU_BUTTON_COLOR, 'center', 'middle' ); gameCtx.restore(); }

/** Rendert de actieve floating score teksten op het game canvas. */
function renderFloatingScores() { /* ... ongewijzigd ... */ try { if (!gameCtx || !floatingScores || floatingScores.length === 0) return; const now = Date.now(); gameCtx.save(); gameCtx.globalAlpha = FLOATING_SCORE_OPACITY; floatingScores.forEach(fs => { if (now >= fs.displayStartTime) { drawCanvasText(fs.text, fs.x, fs.y, FLOATING_SCORE_FONT, fs.color, 'center', 'middle', false); } }); gameCtx.globalAlpha = 1.0; gameCtx.restore(); } catch (e) { console.error("Error rendering floating scores:", e); } }

/**
 * Rendert de hit spark particles (met nieuwe look)
 */
function renderHitSparks() { /* ... ongewijzigd ... */ if (!gameCtx || !hitSparks || hitSparks.length === 0) return; gameCtx.save(); gameCtx.globalCompositeOperation = 'lighter'; hitSparks.forEach(s => { if (s && s.alpha > 0.01) { gameCtx.fillStyle = s.color; gameCtx.globalAlpha = s.alpha; gameCtx.beginPath(); const currentSize = s.size * Math.sqrt(s.alpha); gameCtx.arc(Math.round(s.x), Math.round(s.y), Math.max(0.5, currentSize / 2), 0, Math.PI * 2); gameCtx.fill(); } }); gameCtx.globalAlpha = 1.0; gameCtx.restore(); }


/**
 * Tekent de volledige game scène.
 */
function renderGame() {
    try { // <<< START renderGame try >>>
        if (!gameCtx || !gameCanvas) { if (mainLoopId) cancelAnimationFrame(mainLoopId); mainLoopId = null; return; }
        gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        const now = Date.now();

        // --- STAP 1: Teken UI ---
        gameCtx.save();
        const UI_FONT="20px 'Press Start 2P'";
        const TOP_UI_LABEL_COLOR_DEFAULT = "red"; // Voor 1UP, 2UP, DEMO, en nu ook HIGH SCORE
        const SCORE_COLOR="white";
        gameCtx.font=UI_FONT; gameCtx.textBaseline="top";
        const drawTopUiElement=(label, scoreValue, labelAlign, labelX, shouldBlink = false)=>{
            let showLabel=true;
            let blinkOnDuration = UI_1UP_BLINK_ON_MS * 1.5;
            let blinkCycleDuration = UI_1UP_BLINK_CYCLE_MS * 1.5;
            let currentLabelColor = TOP_UI_LABEL_COLOR_DEFAULT; // Gebruik standaard rood voor alle labels

            if (label === "DEMO") {
                blinkOnDuration = DEMO_TEXT_BLINK_ON_MS * 0.7;
                blinkCycleDuration = DEMO_TEXT_BLINK_CYCLE_MS;
            } else if (label === "HIGH SCORE") {
                // HIGH SCORE gebruikt nu ook TOP_UI_LABEL_COLOR_DEFAULT
                blinkOnDuration = UI_1UP_BLINK_ON_MS * 1.5;
                blinkCycleDuration = UI_1UP_BLINK_CYCLE_MS * 1.5;
                if (isInGameState && !isManualControl) {
                    blinkOnDuration = DEMO_TEXT_BLINK_ON_MS * 0.7;
                    blinkCycleDuration = DEMO_TEXT_BLINK_CYCLE_MS;
                } else if (isInGameState && isTwoPlayerMode && currentPlayer === 2) {
                    blinkOnDuration = UI_1UP_BLINK_ON_MS * 1.5;
                    blinkCycleDuration = UI_1UP_BLINK_CYCLE_MS * 1.5;
                }
            }

            if(shouldBlink){
                if(isPaused || gameOverSequenceStartTime > 0 || isShowingPlayerGameOverMessage || !((now % blinkCycleDuration) < blinkOnDuration)){
                    showLabel=false;
                }
            }
            if(showLabel){
                gameCtx.fillStyle=currentLabelColor;
                gameCtx.textAlign=labelAlign;
                gameCtx.fillText(label, labelX, MARGIN_TOP);
            }
            const labelWidth=gameCtx.measureText(label).width;
            let scoreCenterX;
            if(labelAlign==='left')scoreCenterX=labelX+labelWidth/2;
            else if(labelAlign==='right')scoreCenterX=labelX-labelWidth/2;
            else scoreCenterX=labelX;
            gameCtx.fillStyle=SCORE_COLOR;
            gameCtx.textAlign='center';
            let scoreOffsetY=MARGIN_TOP+SCORE_OFFSET_Y+5;
            if(label==="HIGH SCORE"){scoreCenterX=labelX;}
            gameCtx.fillText(scoreValue.toString(), scoreCenterX, scoreOffsetY);
        };
        let score1PValue, score2PValue, sessionHighScore, label1P; let show1UPBlink = false, show2UPBlink = false, highScoreConditionMet = false;
        if (isShowingResultsScreen) { score1PValue = player1Score || 0; score2PValue = player2Score || 0; sessionHighScore = highScore || 20000; sessionHighScore = Math.max(sessionHighScore, score1PValue, score2PValue); label1P = wasLastGameAIDemo ? "DEMO" : "1UP"; highScoreConditionMet = false; show1UPBlink = false; show2UPBlink = false; }
        else if (gameOverSequenceStartTime > 0 && !isShowingPlayerGameOverMessage) { score1PValue = player1Score || 0; score2PValue = player2Score || 0; sessionHighScore = highScore || 20000; sessionHighScore = Math.max(sessionHighScore, score1PValue, score2PValue); label1P = wasLastGameAIDemo ? "DEMO" : "1UP"; highScoreConditionMet = false; show1UPBlink = false; show2UPBlink = false; }
        else if (isShowingPlayerGameOverMessage) { score1PValue = player1Score || 0; score2PValue = player2Score || 0; sessionHighScore = highScore || 20000; sessionHighScore = Math.max(sessionHighScore, score1PValue, score2PValue); label1P = "1UP"; highScoreConditionMet = false; show1UPBlink = false; show2UPBlink = false; }
        else if (!isInGameState) { score1PValue = player1Score || 0; score2PValue = player2Score || 0; sessionHighScore = highScore || 20000; sessionHighScore = Math.max(sessionHighScore, score1PValue, score2PValue); label1P = "1UP"; highScoreConditionMet = false; show1UPBlink = false; show2UPBlink = false; }
        else { sessionHighScore = highScore || 0; if (!isManualControl) { score1PValue = score; score2PValue = 0; sessionHighScore = Math.max(sessionHighScore, score); label1P = "DEMO"; show1UPBlink = !isShowingIntro && !isPaused && !isShipCaptured; highScoreConditionMet = !isPaused && !isShowingIntro && score > 0 && sessionHighScore > 0 && score >= sessionHighScore; } else if (isTwoPlayerMode) { score1PValue = (currentPlayer === 1) ? score : player1Score; score2PValue = (currentPlayer === 2) ? score : player2Score; sessionHighScore = Math.max(sessionHighScore, player1Score, player2Score, score); label1P = "1UP"; show1UPBlink = !isShowingIntro && !isPaused && currentPlayer === 1 && playerLives > 0 && !isShipCaptured; show2UPBlink = !isShowingIntro && !isPaused && currentPlayer === 2 && playerLives > 0 && !isShipCaptured; highScoreConditionMet = !isPaused && !isShowingIntro && score > 0 && sessionHighScore > 0 && score >= sessionHighScore; } else { score1PValue = score; score2PValue = player2Score || 0; sessionHighScore = Math.max(sessionHighScore, score); label1P = "1UP"; show1UPBlink = !isShowingIntro && !isPaused && playerLives > 0 && !isShipCaptured; highScoreConditionMet = !isPaused && !isShowingIntro && score > 0 && sessionHighScore > 0 && score >= sessionHighScore; } }
        let isHighScoreBlinkingNow = false; if (highScoreConditionMet) { if (!isManualControl) { isHighScoreBlinkingNow = show1UPBlink && player1TriggeredHighScoreSound; /* DEMO */ } else if (isTwoPlayerMode) { if (currentPlayer === 1) { isHighScoreBlinkingNow = show1UPBlink && player1TriggeredHighScoreSound; /* P1 */ } else { isHighScoreBlinkingNow = show2UPBlink && player2TriggeredHighScoreSound; /* P2 */ } } else { isHighScoreBlinkingNow = show1UPBlink && player1TriggeredHighScoreSound; /* 1P */ } }
        if(typeof MARGIN_SIDE!=='undefined' && typeof MARGIN_TOP!=='undefined' && typeof SCORE_OFFSET_Y!=='undefined'){ drawTopUiElement(label1P, score1PValue, 'left', MARGIN_SIDE, show1UPBlink); drawTopUiElement("HIGH SCORE", sessionHighScore, 'center', gameCanvas.width / 2, isHighScoreBlinkingNow); drawTopUiElement("2UP", score2PValue, 'right', gameCanvas.width - MARGIN_SIDE, show2UPBlink); }
        if (typeof shipImage !== 'undefined' && typeof LIFE_ICON_MARGIN_BOTTOM !== 'undefined' && typeof LIFE_ICON_SIZE !== 'undefined' && typeof LIFE_ICON_MARGIN_LEFT !== 'undefined' && typeof LIFE_ICON_SPACING !== 'undefined') { if (shipImage.complete && shipImage.naturalHeight !== 0) { const lifeIconY = gameCanvas.height - LIFE_ICON_MARGIN_BOTTOM - LIFE_ICON_SIZE; let livesIconsToDisplay = 0; if (isShowingResultsScreen || gameOverSequenceStartTime > 0 || isShowingPlayerGameOverMessage) { livesIconsToDisplay = 2; } else if (!isInGameState || isShowingScoreScreen) { livesIconsToDisplay = 2; } else if (isInGameState && playerLives > 0) { livesIconsToDisplay = Math.max(0, playerLives - 1); } else { livesIconsToDisplay = 0; } const maxLivesIcons = 5; for (let i = 0; i < Math.min(livesIconsToDisplay, maxLivesIcons); i++) { const currentIconX = LIFE_ICON_MARGIN_LEFT + i * (LIFE_ICON_SIZE + LIFE_ICON_SPACING); gameCtx.drawImage(shipImage, Math.round(currentIconX), Math.round(lifeIconY), LIFE_ICON_SIZE, LIFE_ICON_SIZE); } } }
        let levelToShow = 1; if (gameOverSequenceStartTime > 0 || isShowingPlayerGameOverMessage) { levelToShow = Math.max(1, player1MaxLevelReached, player2MaxLevelReached); } else if (!isInGameState || isShowingScoreScreen) { levelToShow = 1; } else if (isInGameState) { levelToShow = level; } if (levelToShow > 0 && typeof LEVEL_ICON_MARGIN_BOTTOM !== 'undefined' && typeof LEVEL_ICON_SIZE !== 'undefined' && typeof LEVEL_ICON_MARGIN_RIGHT !== 'undefined' && typeof LEVEL_ICON_SPACING !== 'undefined') { const iconTypes = [ { val: 50, img: level50Image }, { val: 30, img: level30Image }, { val: 20, img: level20Image }, { val: 10, img: level10Image }, { val: 5, img: level5Image }, { val: 1, img: level1Image } ]; let remainingLevelValue = levelToShow; let iconsToDrawList = []; let usedIconTypes = new Set(); const canCompleteLevel = (startLevel, startIndex, currentUsedTypes) => { let tempRemaining = startLevel; let tempUsedTypes = new Set(currentUsedTypes); for (let i = startIndex; i < iconTypes.length; i++) { const iconVal = iconTypes[i].val; if (tempRemaining >= iconVal) { const canAddThisType = tempUsedTypes.size < 3 || tempUsedTypes.has(iconVal); if (!canAddThisType) continue; const howMany = Math.floor(tempRemaining / iconVal); tempRemaining -= howMany * iconVal; tempUsedTypes.add(iconVal); if (tempRemaining === 0) return true; } } return tempRemaining === 0; }; for (let i = 0; i < iconTypes.length - 1; i++) { const currentIcon = iconTypes[i]; const iconVal = currentIcon.val; const iconImg = currentIcon.img; if (remainingLevelValue >= iconVal) { const howMany = Math.floor(remainingLevelValue / iconVal); const potentialRemaining = remainingLevelValue - howMany * iconVal; let hypotheticalUsedTypes = new Set(usedIconTypes); hypotheticalUsedTypes.add(iconVal); if (canCompleteLevel(potentialRemaining, i + 1, hypotheticalUsedTypes)) { for (let k = 0; k < howMany; k++) { iconsToDrawList.push(iconImg); } remainingLevelValue = potentialRemaining; usedIconTypes.add(iconVal); if (remainingLevelValue === 0) break; } } } if (remainingLevelValue > 0) { const canAddOnes = usedIconTypes.size < 3 || usedIconTypes.has(1); if (canAddOnes) { for (let k = 0; k < remainingLevelValue; k++) { iconsToDrawList.push(level1Image); } usedIconTypes.add(1); remainingLevelValue = 0; } else { console.warn(`Could not add ${remainingLevelValue} level 1 icons due to 3-type limit. Used types:`, usedIconTypes); } } if (iconsToDrawList.length === 0) { iconsToDrawList.push(level1Image); } const totalIcons = iconsToDrawList.length; const totalWidth = totalIcons * LEVEL_ICON_SIZE + Math.max(0, totalIcons - 1) * LEVEL_ICON_SPACING; const startX_rightmost = gameCanvas.width - LEVEL_ICON_MARGIN_RIGHT; const startX_leftmost = startX_rightmost - totalWidth; const iconY = gameCanvas.height - LEVEL_ICON_MARGIN_BOTTOM - LEVEL_ICON_SIZE; let currentX = startX_leftmost; for (const iconImage of iconsToDrawList) { if (iconImage && iconImage.complete && iconImage.naturalHeight !== 0) { gameCtx.drawImage(iconImage, Math.round(currentX), Math.round(iconY), LEVEL_ICON_SIZE, LEVEL_ICON_SIZE); } currentX += LEVEL_ICON_SIZE + LEVEL_ICON_SPACING; } }
        gameCtx.restore();

        // --- STAP 1.6: Teken Spelersschip ---
        gameCtx.save(); if (ship && !isShowingCaptureMessage) { let shouldDrawShip = true; if (isInGameState && !gameOverSequenceStartTime && !isShowingPlayerGameOverMessage && isInvincible) { const blinkCycleTime = INVINCIBILITY_BLINK_ON_MS + INVINCIBILITY_BLINK_OFF_MS; const timeInCycle = now % blinkCycleTime; if (timeInCycle >= INVINCIBILITY_BLINK_ON_MS) { shouldDrawShip = false; } } if (shouldDrawShip) { let shipDrawX = ship.x; let shouldCenterSingleShip = (isShowingPlayerGameOverMessage || gameOverSequenceStartTime > 0 || !isInGameState || isShowingScoreScreen || (isInGameState && isShowingIntro && !isManualControl && (introStep === 1 || introStep === 2 || introStep === 3))) && !isDualShipActive; if (shouldCenterSingleShip) { shipDrawX = Math.round(gameCanvas.width / 2 - ship.width / 2); } const shipDrawY = gameCanvas.height - SHIP_HEIGHT - SHIP_BOTTOM_MARGIN; if (typeof shipImage !== 'undefined' && shipImage.complete && shipImage.naturalHeight !== 0) { gameCtx.drawImage(shipImage, Math.round(shipDrawX), Math.round(shipDrawY), ship.width, ship.height); } else { gameCtx.fillStyle = "blue"; gameCtx.fillRect(Math.round(shipDrawX), Math.round(shipDrawY), ship.width, ship.height); } if (isInGameState && !gameOverSequenceStartTime && !isShowingPlayerGameOverMessage && isDualShipActive && !isShipCaptured && typeof shipImage !== 'undefined' && shipImage.complete && shipImage.naturalHeight !== 0) { const dualShipDrawX = shipDrawX + DUAL_SHIP_OFFSET_X; gameCtx.drawImage(shipImage, Math.round(dualShipDrawX), Math.round(shipDrawY), ship.width, ship.height); } } } if (fallingShips.length > 0 && typeof shipImage !== 'undefined' && shipImage.complete) { fallingShips.forEach(fs => { if (fs) { gameCtx.save(); const centerX = fs.x + fs.width / 2; const centerY = fs.y + fs.height / 2; gameCtx.translate(centerX, centerY); gameCtx.rotate(fs.rotation || 0); const drawX = -fs.width / 2; const drawY = -fs.height / 2; const drawW = fs.width; const drawH = fs.height; gameCtx.drawImage(shipImage, drawX, drawY, drawW, drawH); if (typeof fs.tintProgress === 'number' && fs.tintProgress > 0.01) { gameCtx.save(); gameCtx.globalAlpha = fs.tintProgress; gameCtx.fillStyle = CAPTURED_SHIP_TINT_COLOR; gameCtx.globalCompositeOperation = 'source-atop'; gameCtx.fillRect(drawX, drawY, drawW, drawH); gameCtx.restore(); } gameCtx.restore(); } }); } gameCtx.restore();


        // --- STAP 2: State-specifieke content ---
        if (!isInGameState) { // Menu of Score Screen
             if (isShowingScoreScreen) { /* ... score screen rendering ... */
                if (typeof LIFE_ICON_SIZE !== 'undefined') {
                    gameCtx.save(); const centerX = gameCanvas.width / 2; let scoreScreenBaseY = gameCanvas.height * 0.25 + SCORE_SCREEN_VERTICAL_OFFSET; let alignedIconStartX = 0;
                    let yPos1 = scoreScreenBaseY + 0;
                    drawCanvasText("PUSH START BUTTON", centerX, yPos1 - 30, SCORE_SCREEN_TEXT_FONT, SCORE_SCREEN_TEXT_COLOR_TOP, 'center', 'middle', true);
                    let yPos2 = yPos1 + SCORE_SCREEN_LINE_V_SPACING * 1.8; const text1 = " 1ST LIFE BONUS FOR 20000 PTS";
                    gameCtx.font = SCORE_SCREEN_TEXT_FONT; const text1Width = gameCtx.measureText(text1).width; const totalWidth1 = LIFE_ICON_SIZE + SCORE_SCREEN_ICON_TEXT_H_SPACING + text1Width; alignedIconStartX = (centerX - totalWidth1 / 2) - 30;
                    if (typeof shipImage !== 'undefined' && shipImage.complete && shipImage.naturalHeight !== 0) { gameCtx.drawImage(shipImage, Math.round(alignedIconStartX), Math.round(yPos2 - LIFE_ICON_SIZE/2 - 5), LIFE_ICON_SIZE, LIFE_ICON_SIZE); }
                    drawCanvasText(text1, alignedIconStartX + LIFE_ICON_SIZE + SCORE_SCREEN_ICON_TEXT_H_SPACING, yPos2, SCORE_SCREEN_TEXT_FONT, SCORE_SCREEN_TEXT_COLOR_BONUS, 'left', 'middle', false);
                    let yPos3 = yPos2 + SCORE_SCREEN_LINE_V_SPACING * 1.0; const text2 = ` 2ND LIFE BONUS FOR ${RECURRING_EXTRA_LIFE_INTERVAL} PTS`;
                    if (typeof shipImage !== 'undefined' && shipImage.complete && shipImage.naturalHeight !== 0) { gameCtx.drawImage(shipImage, Math.round(alignedIconStartX), Math.round(yPos3 - LIFE_ICON_SIZE/2 - 5), LIFE_ICON_SIZE, LIFE_ICON_SIZE); }
                    drawCanvasText(text2, alignedIconStartX + LIFE_ICON_SIZE + SCORE_SCREEN_ICON_TEXT_H_SPACING, yPos3, SCORE_SCREEN_TEXT_FONT, SCORE_SCREEN_TEXT_COLOR_BONUS, 'left', 'middle', false);
                    let yPos4 = yPos3 + SCORE_SCREEN_LINE_V_SPACING * 1.0; const text3 = ` EXT LIFE FOR EVERY ${RECURRING_EXTRA_LIFE_INTERVAL} PTS`;
                    if (typeof shipImage !== 'undefined' && shipImage.complete && shipImage.naturalHeight !== 0) { gameCtx.drawImage(shipImage, Math.round(alignedIconStartX), Math.round(yPos4 - LIFE_ICON_SIZE/2 - 5), LIFE_ICON_SIZE, LIFE_ICON_SIZE); }
                    drawCanvasText(text3, alignedIconStartX + LIFE_ICON_SIZE + SCORE_SCREEN_ICON_TEXT_H_SPACING, yPos4, SCORE_SCREEN_TEXT_FONT, SCORE_SCREEN_TEXT_COLOR_BONUS, 'left', 'middle', false);
                    let yPos5 = yPos4 + SCORE_SCREEN_LINE_V_SPACING * 1.8;
                    drawCanvasText(SCORE_SCREEN_PLATINI_TEXT, centerX - 10, yPos5 + 30, MENU_SUBTITLE_FONT, MENU_SUBTITLE_COLOR, 'center', 'middle', false);
                    gameCtx.restore();
                }
            }
             else { // Menu rendering
                gameCtx.save();
                const canvasWidth = gameCanvas.width; const canvasHeight = gameCanvas.height; const canvasCenterX = canvasWidth / 2;
                if (selectedButtonIndex === -1) { selectedButtonIndex = 0; }
                let actualLogoHeight = MENU_LOGO_APPROX_HEIGHT; let actualLogoWidth = actualLogoHeight * (logoImage.naturalWidth / logoImage.naturalHeight || 1);
                if (typeof logoImage !== 'undefined' && logoImage.complete && logoImage.naturalHeight !== 0) { actualLogoHeight = logoImage.naturalHeight * LOGO_SCALE_FACTOR; actualLogoWidth = logoImage.naturalWidth * LOGO_SCALE_FACTOR; }
                const subtitleHeight = getSubtitleApproxHeight(MENU_SUBTITLE_FONT);
                const totalContentHeight = actualLogoHeight + MENU_LOGO_BOTTOM_TO_START_GAP + MENU_BUTTON_HEIGHT + MENU_BUTTON_V_GAP + MENU_BUTTON_HEIGHT + MENU_BUTTON_SUBTITLE_V_GAP + subtitleHeight;
                let groupStartY = (canvasHeight - totalContentHeight) / 2 - 70; groupStartY += MENU_GENERAL_Y_OFFSET;
                const logoDrawX = canvasCenterX - actualLogoWidth / 2; const logoDrawY = groupStartY + MENU_LOGO_EXTRA_Y_OFFSET;
                if (typeof logoImage !== 'undefined' && logoImage.complete && logoImage.naturalHeight !== 0) { gameCtx.drawImage(logoImage, Math.round(logoDrawX), Math.round(logoDrawY), actualLogoWidth, actualLogoHeight); }
                else { drawCanvasText("LOGO", canvasCenterX, logoDrawY + actualLogoHeight / 2, "30px Arial", "grey"); }

                // Draw buttons
                if (isFiringModeSelectMode) { drawCanvasButton("EASY", 0, selectedButtonIndex === 0); drawCanvasButton("NORMAL", 1, selectedButtonIndex === 1); }
                else if (isPlayerSelectMode) { drawCanvasButton("1 PLAYER", 0, selectedButtonIndex === 0); drawCanvasButton("2 PLAYER", 1, selectedButtonIndex === 1); }
                else { drawCanvasButton("START GAME", 0, selectedButtonIndex === 0); drawCanvasButton("GAME EXIT", 1, selectedButtonIndex === 1); }

                const exitButtonRect = getMenuButtonRect(1);
                let subtitleCenterY;
                if (exitButtonRect) { subtitleCenterY = exitButtonRect.y + exitButtonRect.height + MENU_BUTTON_SUBTITLE_V_GAP + (subtitleHeight / 2); }
                else { subtitleCenterY = groupStartY + actualLogoHeight + MENU_LOGO_BOTTOM_TO_START_GAP + MENU_BUTTON_HEIGHT + MENU_BUTTON_V_GAP + MENU_BUTTON_HEIGHT + MENU_BUTTON_SUBTITLE_V_GAP + (subtitleHeight / 2); }
                drawCanvasText( MENU_SUBTITLE_TEXT, canvasCenterX - 1, Math.round(subtitleCenterY), MENU_SUBTITLE_FONT,
                                MENU_SUBTITLE_COLOR, 'center', 'middle', true );
                gameCtx.restore();
             }
        } else { // --- Game bezig OF Game Over / Results ---
            // --- STAP 2.1: Gameplay Actief (of PAUSED) ---
            if (gameOverSequenceStartTime === 0 && !isShowingPlayerGameOverMessage) {
                gameCtx.save();
                // --- Teken Kogels ---
                 let showBullets = !showReadyMessage && !showCsHitsMessage && !showPerfectMessage && !showCsBonusScoreMessage && !showCSClearMessage && !isCsCompletionDelayActive && !isShowingIntro && !isShowingCaptureMessage;
                 if (showBullets) {
                     bullets.forEach(b => { /* ... teken kogel ... */ if (b) { if (typeof bulletImage !== 'undefined' && bulletImage.complete) { gameCtx.drawImage(bulletImage, Math.round(b.x), Math.round(b.y), b.width, b.height); } else { gameCtx.fillStyle = "yellow"; gameCtx.fillRect(Math.round(b.x), Math.round(b.y), b.width, b.height); } } });
                     enemyBullets.forEach(eb => { /* ... teken vijandelijke kogel ... */ if (eb) { if (typeof enemyBulletImage !== 'undefined' && enemyBulletImage.complete && enemyBulletImage.naturalWidth > 0) { gameCtx.drawImage(enemyBulletImage, Math.round(eb.x), Math.round(eb.y), eb.width, eb.height); } else { gameCtx.fillStyle = "white"; gameCtx.fillRect(Math.round(eb.x), Math.round(eb.y), eb.width, eb.height); } } });
                 }

                // --- Teken Vijanden ---
                enemies.forEach(e => { /* ... vijand tekenen ongewijzigd ... */ if (e && e.y < gameCanvas.height + e.height * 2 && e.y > -e.height * 2) { gameCtx.save(); try { let currentEnemyImage = null; let fallbackColor = "grey"; const useSecondFrame = !isPaused && (now % (ENEMY_ANIMATION_INTERVAL_MS * 2)) >= ENEMY_ANIMATION_INTERVAL_MS; if (e.type === ENEMY3_TYPE) { currentEnemyImage = useSecondFrame ? bossGalagaImage2 : bossGalagaImage; fallbackColor = "purple"; } else if (e.type === ENEMY2_TYPE) { currentEnemyImage = useSecondFrame ? butterflyImage2 : butterflyImage; fallbackColor = "cyan"; } else { currentEnemyImage = useSecondFrame ? beeImage2 : beeImage; fallbackColor = "red"; } const drawX = Math.round(e.x); const drawY = Math.round(e.y); const drawW = e.width; const drawH = e.height; const needsTint = (e.type === ENEMY3_TYPE && e.isDamaged); const shouldRotateEnemy = !isPaused && (e.state === 'attacking' || e.state === 'following_bezier_path' || e.state === 'following_entrance_path') && e.y > -e.height * 0.5 && (Math.abs(e.velocityX) > 0.1 || Math.abs(e.velocityY) > 0.1); const shouldDrawCapturedShipAnim = e.state === 'showing_capture_message' && e.type === ENEMY3_TYPE && e.hasCapturedShip && e.capturedShipDimensions && typeof e.capturedShipX === 'number' && typeof e.capturedShipY === 'number' && typeof e.captureAnimationRotation === 'number'; const shouldDrawStaticCapturedShip = e.state !== 'showing_capture_message' && e.type === ENEMY3_TYPE && e.hasCapturedShip && e.capturedShipDimensions; const capturedW = (shouldDrawCapturedShipAnim || shouldDrawStaticCapturedShip) ? e.capturedShipDimensions.width : 0; const capturedH = (shouldDrawCapturedShipAnim || shouldDrawStaticCapturedShip) ? e.capturedShipDimensions.height : 0; let capturedX = 0; let capturedY = 0; if (shouldDrawCapturedShipAnim) { capturedX = Math.round(e.capturedShipX); capturedY = Math.round(e.capturedShipY); } else if (shouldDrawStaticCapturedShip) { capturedX = Math.round(e.x + CAPTURED_SHIP_OFFSET_X); capturedY = Math.round(e.y + CAPTURED_SHIP_OFFSET_Y); } const drawEnemyAndTint = (imgX, imgY, imgW, imgH) => { if (typeof currentEnemyImage !== 'undefined' && currentEnemyImage.complete && currentEnemyImage.naturalHeight !== 0) { gameCtx.drawImage(currentEnemyImage, imgX, imgY, imgW, imgH); } else { gameCtx.fillStyle = fallbackColor; gameCtx.fillRect(imgX, imgY, imgW, imgH); } if (needsTint) { gameCtx.globalCompositeOperation = 'source-atop'; gameCtx.fillStyle = 'rgba(0, 0, 139, 0.5)'; gameCtx.fillRect(imgX, imgY, imgW, imgH); gameCtx.globalCompositeOperation = 'source-over'; } }; if (shouldRotateEnemy) { const centerX = drawX + drawW / 2; const centerY = drawY + drawH / 2; gameCtx.translate(centerX, centerY); let angle = Math.atan2(e.velocityY, e.velocityX) + Math.PI / 2; if (e.type === ENEMY3_TYPE && e.state === 'attacking') angle += Math.PI; gameCtx.rotate(angle); drawEnemyAndTint(-drawW / 2, -drawH / 2, drawW, drawH); if (shouldDrawStaticCapturedShip && typeof shipImage !== 'undefined' && shipImage.complete) { gameCtx.globalAlpha = 0.8; const rotatedOffsetX = CAPTURED_SHIP_OFFSET_X; const rotatedOffsetY = CAPTURED_SHIP_OFFSET_Y; gameCtx.drawImage(shipImage, rotatedOffsetX - capturedW / 2, rotatedOffsetY - capturedH / 2, capturedW, capturedH); gameCtx.globalAlpha = 1.0; gameCtx.save(); gameCtx.fillStyle = CAPTURED_SHIP_TINT_COLOR; gameCtx.globalCompositeOperation = 'source-atop'; gameCtx.fillRect(rotatedOffsetX - capturedW / 2, rotatedOffsetY - capturedH / 2, capturedW, capturedH); gameCtx.restore(); } gameCtx.rotate(-angle); gameCtx.translate(-centerX, -centerY); } else { drawEnemyAndTint(drawX, drawY, drawW, drawH); if (shouldDrawStaticCapturedShip && typeof shipImage !== 'undefined' && shipImage.complete) { gameCtx.globalAlpha = 0.8; gameCtx.drawImage(shipImage, capturedX, capturedY, capturedW, capturedH); gameCtx.globalAlpha = 1.0; gameCtx.save(); gameCtx.fillStyle = CAPTURED_SHIP_TINT_COLOR; gameCtx.globalCompositeOperation = 'source-atop'; gameCtx.fillRect(capturedX, capturedY, capturedW, capturedH); gameCtx.restore(); } } if (shouldDrawCapturedShipAnim && typeof shipImage !== 'undefined' && shipImage.complete) { gameCtx.save(); const animCenterX = capturedX + capturedW / 2; const animCenterY = capturedY + capturedH / 2; gameCtx.translate(animCenterX, animCenterY); gameCtx.rotate(e.captureAnimationRotation); gameCtx.globalAlpha = 0.8; gameCtx.drawImage(shipImage, -capturedW / 2, -capturedH / 2, capturedW, capturedH); gameCtx.globalAlpha = 1.0; gameCtx.save(); gameCtx.fillStyle = CAPTURED_SHIP_TINT_COLOR; gameCtx.globalCompositeOperation = 'source-atop'; gameCtx.fillRect(-capturedW / 2, -capturedH / 2, capturedW, capturedH); gameCtx.restore(); gameCtx.restore(); } } catch (drawError) { console.error(`Error drawing enemy:`, drawError); gameCtx.fillStyle = "orange"; gameCtx.fillRect(Math.round(e.x), Math.round(e.y), e.width, e.height); } finally { gameCtx.restore(); } } });

                // --- Teken Capture Beam ---
                if (captureBeamActive && capturingBossId && captureBeamProgress > 0) { /* ... beam tekenen ongewijzigd ... */ gameCtx.save(); const pulseAlpha = 0.4 + (Math.sin(now * CAPTURE_BEAM_PULSE_SPEED) + 1) / 2 * 0.6; const fadeAlpha = captureBeamProgress; gameCtx.globalAlpha = fadeAlpha * pulseAlpha; const capturingBoss = enemies.find(e => e.id === capturingBossId); if (capturingBoss) { const beamSourceX = capturingBoss.x + BOSS_WIDTH / 2; const beamVisualStartY = capturingBoss.y + BOSS_HEIGHT; const beamVisualEndY = gameCanvas.height - LIFE_ICON_MARGIN_BOTTOM - LIFE_ICON_SIZE - 10; const topWidth = BOSS_WIDTH * CAPTURE_BEAM_WIDTH_TOP_FACTOR; const bottomWidth = SHIP_WIDTH * CAPTURE_BEAM_WIDTH_BOTTOM_FACTOR; if (beamVisualStartY < beamVisualEndY) { const grad = gameCtx.createLinearGradient(beamSourceX, beamVisualStartY, beamSourceX, beamVisualEndY); grad.addColorStop(0, CAPTURE_BEAM_COLOR_START); grad.addColorStop(1, CAPTURE_BEAM_COLOR_END); gameCtx.fillStyle = grad; gameCtx.beginPath(); gameCtx.moveTo(beamSourceX - topWidth / 2, beamVisualStartY); gameCtx.lineTo(beamSourceX + topWidth / 2, beamVisualStartY); gameCtx.lineTo(beamSourceX + bottomWidth / 2, beamVisualEndY); gameCtx.lineTo(beamSourceX - bottomWidth / 2, beamVisualEndY); gameCtx.closePath(); gameCtx.fill(); } } gameCtx.restore(); }

                // --- Teken Explosies, Scores & Sparks ---
                renderExplosions();
                renderFloatingScores();
                renderHitSparks();

                // --- Teken Berichten ---
                let messageDrawn = false; const midScreenY = gameCanvas.height / 2; const midScreenX = gameCanvas.width / 2; const hitsText = `NUMBER OF HITS ${challengingStageEnemiesHit}`; const clearBonusText = `BONUS ${scoreEarnedThisCS}`;
                if (isPaused) { drawCanvasText("PAUSED", midScreenX, midScreenY, PAUSE_TEXT_FONT, PAUSE_TEXT_COLOR, 'center', 'middle', PAUSE_TEXT_SHADOW); messageDrawn = true; }
                else if (isShowingCaptureMessage) { drawCanvasText("FIGHTER CAPTURED", midScreenX, midScreenY - 40, INTRO_TEXT_FONT, "red", 'center', 'middle', true); messageDrawn = true; }
                else if (showCsBonusScoreMessage || showPerfectMessage || showCsHitsMessage) { /* ... CS Perfect/Bonus ... */ drawCanvasText(hitsText, midScreenX, midScreenY, INTRO_TEXT_FONT, CS_HITS_TEXT_COLOR, 'center', 'middle', true); messageDrawn = true; if (showCsBonusScoreMessage || showPerfectMessage) { drawCanvasText("PERFECT !", midScreenX, midScreenY - CS_MESSAGE_VERTICAL_OFFSET, INTRO_TEXT_FONT, PERFECT_TEXT_COLOR, 'center', 'middle', true); } if (showCsBonusScoreMessage) { drawCanvasText("SPECIAL BONUS 10000 PTS", midScreenX, midScreenY + CS_MESSAGE_VERTICAL_OFFSET, INTRO_TEXT_FONT, CS_BONUS_SCORE_TEXT_COLOR, 'center', 'middle', true); } }
                else if (showCSClearMessage) { /* ... CS Clear ... */ drawCanvasText("STAGE CLEARED", midScreenX, midScreenY - CS_MESSAGE_VERTICAL_OFFSET, INTRO_TEXT_FONT, CS_CLEAR_TEXT_COLOR, 'center', 'middle', true); messageDrawn = true; if (showCsHitsForClearMessage) { drawCanvasText(hitsText, midScreenX, midScreenY, INTRO_TEXT_FONT, CS_HITS_TEXT_COLOR, 'center', 'middle', true); } if (showCsScoreForClearMessage) { drawCanvasText(clearBonusText, midScreenX, midScreenY + CS_MESSAGE_VERTICAL_OFFSET, INTRO_TEXT_FONT, CS_CLEAR_SCORE_TEXT_COLOR, 'center', 'middle', true); } }
                else if (showExtraLifeMessage) { drawCanvasText("EXTRA LIFE", midScreenX, midScreenY, INTRO_TEXT_FONT, EXTRA_LIFE_TEXT_COLOR, 'center', 'middle', true); messageDrawn = true; }
                else if (isShowingIntro) { /* ... Intro ... */ let introText = ""; let introColor = INTRO_TEXT_COLOR_NORMAL; if (introStep === 1) { introText = !isManualControl ? "DEMO" : `PLAYER ${isTwoPlayerMode ? currentPlayer : 1}`; } else if (introStep === 2) { introText = "STAGE " + level; } else if (introStep === 3) { introText = "CHALLENGING STAGE"; introColor = INTRO_TEXT_COLOR_CS_TEXT; if (!csIntroSoundPlayed) { playSound(entranceSound); csIntroSoundPlayed = true; } } if (introText) { drawCanvasText(introText, midScreenX, midScreenY, INTRO_TEXT_FONT, introColor, 'center', 'middle', true); messageDrawn = true; } }
                // else if (showReadyMessage) { /* Ready message is nu verwijderd */ }
                else if (!isManualControl && isShowingDemoText && !messageDrawn && !isEntrancePhaseActive && !isCsCompletionDelayActive) { /* ... Demo Text ... */ const demoBlinkCycle = DEMO_TEXT_BLINK_CYCLE_MS * 1.5; const demoBlinkOn = DEMO_TEXT_BLINK_ON_MS * 1.5; if ((now % demoBlinkCycle) < demoBlinkOn) { drawCanvasText("PUSH START BUTTON", midScreenX, midScreenY, DEMO_TEXT_LINE1_FONT, DEMO_TEXT_COLOR, 'center', 'middle', true); } }
                gameCtx.restore();
            } // <<< EINDE van if (gameOverSequenceStartTime === 0 ...)' >>>
            // --- STAP 2.2: Game Over State ---
            else { // gameOverSequenceStartTime > 0 OR isShowingPlayerGameOverMessage
                if (isShowingPlayerGameOverMessage) { /* ... player x game over text ... */ const playerText = `PLAYER ${playerWhoIsGameOver}`; const lineSpacing = RESULTS_LINE_V_SPACING_SINGLE; const messageCenterY = gameCanvas.height * 0.45; drawCanvasText(playerText, gameCanvas.width / 2, messageCenterY - lineSpacing / 2, INTRO_TEXT_FONT, INTRO_TEXT_COLOR_NORMAL, 'center', 'middle', true); drawCanvasText("GAME OVER", gameCanvas.width / 2, messageCenterY + lineSpacing / 2, INTRO_TEXT_FONT, INTRO_TEXT_COLOR_NORMAL, 'center', 'middle', true); }
                else if (gameOverSequenceStartTime > 0) {
                    const elapsedTime = now - gameOverSequenceStartTime;
                    const isShowingGameOverText = elapsedTime < GAME_OVER_DURATION;
                    const isShowingResultsScreenActive = elapsedTime >= GAME_OVER_DURATION; // Gebruik andere naam om conflict te vermijden met globale vlag
                    if (isShowingGameOverText) { /* ... game over text ... */ drawCanvasText("GAME OVER", gameCanvas.width / 2, gameCanvas.height / 2, GAME_OVER_FONT, GAME_OVER_COLOR, 'center', 'middle', GAME_OVER_SHADOW); }
                    else if (isShowingResultsScreenActive) { // Controleer lokale vlag
                        // --- Resultaten Scherm ---
                        gameCtx.save(); const centerX = gameCanvas.width / 2; const canvasWidth = gameCanvas.width; let initialY = RESULTS_START_Y + RESULTS_LINE_V_SPACING_SINGLE;
                        const drawPlayerResultsColumn = (playerIdentifier, scoreVal, shotsVal, hitsVal, ratioVal, lastLevel, columnX, startY) => {
                            let currentColumnY = startY; const STAGE_LABEL_COLOR = RESULTS_VALUE_COLOR_YELLOW; const LEVEL_NUMBER_COLOR = RESULTS_VALUE_COLOR_CYAN;
                            drawCanvasText("- RESULTS -", columnX, currentColumnY, INTRO_TEXT_FONT, RESULTS_HEADER_COLOR, 'center', 'top', true); currentColumnY += getSubtitleApproxHeight(INTRO_TEXT_FONT) + RESULTS_LINE_V_SPACING_SINGLE;
                            drawCanvasText(playerIdentifier, columnX, currentColumnY, INTRO_TEXT_FONT, 'white', 'center', 'middle', false); currentColumnY += RESULTS_LINE_V_SPACING_SINGLE;
                            drawCanvasText("STAGE", columnX, currentColumnY, INTRO_TEXT_FONT, STAGE_LABEL_COLOR, 'center', 'middle', false); currentColumnY += RESULTS_LINE_V_SPACING_SINGLE * 0.8;
                            drawCanvasText(lastLevel.toString(), columnX, currentColumnY, INTRO_TEXT_FONT, LEVEL_NUMBER_COLOR, 'center', 'middle', false); currentColumnY += RESULTS_LINE_V_SPACING_SINGLE;
                            drawCanvasText("SCORE", columnX, currentColumnY, INTRO_TEXT_FONT, RESULTS_VALUE_COLOR_YELLOW, 'center', 'middle', false); currentColumnY += RESULTS_LINE_V_SPACING_SINGLE * 0.8;
                            drawCanvasText(scoreVal.toString(), columnX, currentColumnY, INTRO_TEXT_FONT, RESULTS_VALUE_COLOR_CYAN, 'center', 'middle', false); currentColumnY += RESULTS_LINE_V_SPACING_SINGLE;
                            drawCanvasText("SHOTS FIRED", columnX, currentColumnY, INTRO_TEXT_FONT, RESULTS_VALUE_COLOR_YELLOW, 'center', 'middle', false); currentColumnY += RESULTS_LINE_V_SPACING_SINGLE * 0.8;
                            drawCanvasText(shotsVal.toString(), columnX, currentColumnY, INTRO_TEXT_FONT, RESULTS_VALUE_COLOR_CYAN, 'center', 'middle', false); currentColumnY += RESULTS_LINE_V_SPACING_SINGLE;
                            drawCanvasText("NUMBER OF HITS", columnX, currentColumnY, INTRO_TEXT_FONT, RESULTS_VALUE_COLOR_YELLOW, 'center', 'middle', false); currentColumnY += RESULTS_LINE_V_SPACING_SINGLE * 0.8;
                            drawCanvasText(hitsVal.toString(), columnX, currentColumnY, INTRO_TEXT_FONT, RESULTS_VALUE_COLOR_CYAN, 'center', 'middle', false); currentColumnY += RESULTS_LINE_V_SPACING_SINGLE;
                            drawCanvasText("HIT-MISS-RATIO", columnX, currentColumnY, INTRO_TEXT_FONT, RESULTS_VALUE_COLOR_YELLOW, 'center', 'middle', false); currentColumnY += RESULTS_LINE_V_SPACING_SINGLE * 0.8;
                            drawCanvasText(ratioVal, columnX, currentColumnY, INTRO_TEXT_FONT, RESULTS_VALUE_COLOR_CYAN, 'center', 'middle', false); currentColumnY += RESULTS_LINE_V_SPACING_SINGLE * 1.5;
                            // <<< GEWIJZIGD: Y-positie aangepast >>>
                            drawCanvasText(RESULTS_PLATINI_TEXT, columnX, currentColumnY - 10, RESULTS_FOOTER_FONT, RESULTS_FOOTER_COLOR, 'center', 'middle', false);
                        };
                        if (isTwoPlayerMode) { /* ... draw 2P results ... */
                            const shots1 = player1ShotsFired || 0; const hits1 = player1EnemiesHit || 0; const ratio1 = shots1 > 0 ? Math.round((hits1 / shots1) * 100) + "%" : "0%";
                            const shots2 = player2ShotsFired || 0; const hits2 = player2EnemiesHit || 0; const ratio2 = shots2 > 0 ? Math.round((hits2 / shots2) * 100) + "%" : "0%";
                            const columnWidth = canvasWidth * 0.4; const columnGap = canvasWidth * 0.1;
                            const leftColumnX = centerX - columnGap / 2 - columnWidth / 2 + (columnWidth * 0.1);
                            const rightColumnX = centerX + columnGap / 2 + columnWidth / 2 - (columnWidth * 0.1);
                            const player1Label = "PLAYER 1";
                            drawPlayerResultsColumn(player1Label, player1Score, shots1, hits1, ratio1, player1MaxLevelReached, leftColumnX, initialY);
                            drawPlayerResultsColumn("PLAYER 2", player2Score, shots2, hits2, ratio2, player2MaxLevelReached, rightColumnX, initialY);
                            let winnerNum = 0;
                            if (player1Score > player2Score) winnerNum = 1;
                            else if (player2Score > player1Score) winnerNum = 2;

                            if (winnerNum > 0) {
                                // <<< GEWIJZIGD: Y-positie voor "PLAYER X WINS" aangepast >>>
                                let yPosForWinsText = initialY;
                                yPosForWinsText += getSubtitleApproxHeight(INTRO_TEXT_FONT) + RESULTS_LINE_V_SPACING_SINGLE; // Na "- RESULTS -"
                                yPosForWinsText += RESULTS_LINE_V_SPACING_SINGLE; // Na "PLAYER X" (in de kolom)
                                yPosForWinsText += RESULTS_LINE_V_SPACING_SINGLE * 2; // Extra 2 regels lager

                                const playerWinsText = `PLAYER ${winnerNum}`;
                                const winsText = "WINS";
                                drawCanvasText(playerWinsText, centerX, yPosForWinsText, INTRO_TEXT_FONT, 'white', 'center', 'middle', true);
                                drawCanvasText(winsText, centerX, yPosForWinsText + RESULTS_LINE_V_SPACING_SINGLE, INTRO_TEXT_FONT, RESULTS_VALUE_COLOR_CYAN, 'center', 'middle', true);
                            }
                        }
                        else { /* ... draw 1P results ... */ const shotsValue = player1ShotsFired || 0; const hitsValue = player1EnemiesHit || 0; const finalScore = wasLastGameAIDemo ? score : player1Score; const finalLevel = wasLastGameAIDemo ? level : player1MaxLevelReached; const ratioValue = shotsValue > 0 ? Math.round((hitsValue / shotsValue) * 100) + "%" : "0%"; const playerIdentifier = wasLastGameAIDemo ? "DEMO" : "PLAYER 1"; drawPlayerResultsColumn(playerIdentifier, finalScore, shotsValue, hitsValue, ratioValue, finalLevel, centerX, initialY); }
                        gameCtx.restore();
                    }
                }
            } // <<< EINDE else van 'if (gameOverSequenceStartTime === 0 ...)' >>>
        } // <<< EINDE else van 'if (!isInGameState)' >>>

    } // <<< EINDE van het hoof 'try' blok in renderGame >>>
    catch (e) { // <<< START van het catch blok >>>
        console.error("Error in renderGame:", e, e.stack);
        if (mainLoopId) cancelAnimationFrame(mainLoopId); mainLoopId = null;
        try {
            if (gameCtx && gameCanvas) {
                gameCtx.fillStyle = 'red';
                gameCtx.font = '20px sans-serif';
                gameCtx.textAlign = 'center';
                gameCtx.fillText('FATAL RENDER ERROR.', gameCanvas.width / 2, gameCanvas.height / 2);
            }
        } catch (err) {}
        try { showMenuState(); } catch (menuErr) {}
    } // <<< EINDE catch blok >>>
} // Einde renderGame

/**
 * Functie om de cursor te verbergen na inactiviteit.
 */
function hideCursor() {
    if (gameCanvas) {
        gameCanvas.style.cursor = 'none';
    }
    mouseIdleTimerId = null;
}

/**
 * Verwerkt muisbewegingen op het canvas voor menu-interactie en cursor zichtbaarheid.
 */
function handleCanvasMouseMove(event) {
    if (!gameCanvas) return;
    let currentCursorStyle = 'default';
    const isInMenuOrScores = !isInGameState || isShowingScoreScreen || (gameOverSequenceStartTime > 0 && (Date.now() - gameOverSequenceStartTime >= GAME_OVER_DURATION));
    let hoveringButton = false;
    let newSelectedButtonIndex = selectedButtonIndex;

    if (isInMenuOrScores) {
        const rect = gameCanvas.getBoundingClientRect();
        const scaleX = gameCanvas.width / rect.width;
        const scaleY = gameCanvas.height / rect.height;
        const mouseX = (event.clientX - rect.left) * scaleX;
        const mouseY = (event.clientY - rect.top) * scaleY;
        const button0Rect = getMenuButtonRect(0);
        const button1Rect = getMenuButtonRect(1);
        if (button0Rect && checkCollision({ x: mouseX, y: mouseY, width: 1, height: 1 }, button0Rect)) { newSelectedButtonIndex = 0; hoveringButton = true; }
        else if (button1Rect && checkCollision({ x: mouseX, y: mouseY, width: 1, height: 1 }, button1Rect)) { newSelectedButtonIndex = 1; hoveringButton = true; }
        else { newSelectedButtonIndex = -1; hoveringButton = false; }
        if (newSelectedButtonIndex !== selectedButtonIndex) { selectedButtonIndex = newSelectedButtonIndex; if (hoveringButton) { stopAutoDemoTimer(); } }
        currentCursorStyle = hoveringButton ? 'pointer' : 'default';
    } else {
        currentCursorStyle = 'none';
        selectedButtonIndex = -1;
    }

    if (gameCanvas.style.cursor === 'none' || gameCanvas.style.cursor !== currentCursorStyle) {
        gameCanvas.style.cursor = currentCursorStyle;
    }

    clearTimeout(mouseIdleTimerId);
    mouseIdleTimerId = setTimeout(hideCursor, 2000);

    if (!isInGameState) {
        const now = Date.now();
        if (now - lastMouseMoveResetTime > 500) {
            if (typeof startAutoDemoTimer === 'function') startAutoDemoTimer();
            lastMouseMoveResetTime = now;
        }
    }
}

// --- Touch Event Handlers ---

/** Haalt de canvas-coördinaten op uit een touch event */
function getTouchPos(canvas, touchEvent) {
    // Gebruik event.changedTouches[0] voor touchend/touchcancel
    const touchList = touchEvent.changedTouches && touchEvent.changedTouches.length > 0 ? touchEvent.changedTouches : touchEvent.touches;
    if (!canvas || !touchList || touchList.length === 0) {
        return null;
    }
    const rect = canvas.getBoundingClientRect();
    const touch = touchList[0];
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
    };
}


function handleTouchStart(event) {
    if (!gameCanvas) return;
    event.preventDefault();

    const touchPos = getTouchPos(gameCanvas, event);
    if (!touchPos) return;

    isTouching = true;
    touchStartX = touchPos.x;
    touchCurrentX = touchPos.x;
    isDraggingShip = false;
    lastTapTime = Date.now();
    touchJustFiredSingle = false;
    isTouchFiringActive = false; // Reset rapid fire flag

    const inGameReady = isInGameState && !isPaused && ship && isManualControl && playerLives > 0 && gameOverSequenceStartTime === 0 && !isShowingPlayerGameOverMessage && !isShowingIntro && !isShipCaptured && !isShowingCaptureMessage;

    if (inGameReady) {
        const shipCenterX = ship.x + ship.width / 2;
        const shipTouchRect = {
            x: ship.x - ship.width * 0.25, y: ship.y - ship.height * 0.5,
            width: ship.width * 1.5, height: ship.height * 2
        };
        if (checkCollision({ x: touchPos.x, y: touchPos.y, width: 1, height: 1 }, shipTouchRect)) {
            shipTouchOffsetX = touchPos.x - shipCenterX;
        } else {
            shipTouchOffsetX = 0;
        }

        // <<< GEWIJZIGD: Activeer direct rapid fire bij touch start >>>
        if (selectedFiringMode === 'rapid') {
            isTouchFiringActive = true; // Zet flag aan
            // Probeer direct eerste schot (respecteert cooldown)
            if (typeof firePlayerBullet === 'function') {
                // Forceer vuren niet, laat cooldown checken
                firePlayerBullet(false);
            }
        }
        // <<< EINDE GEWIJZIGD >>>

    } else {
        shipTouchOffsetX = 0;
    }
}

function handleTouchMove(event) {
    if (!isTouching || !gameCanvas) return;
    event.preventDefault();

    const touchPos = getTouchPos(gameCanvas, event);
    if (!touchPos) return;

    touchCurrentX = touchPos.x;

    const dx = Math.abs(touchCurrentX - touchStartX);
    const timeSinceTouchStart = Date.now() - lastTapTime;

    if (!isDraggingShip) {
        if (dx > MIN_DRAG_DISTANCE_FOR_TAP_CANCEL || timeSinceTouchStart > MIN_DRAG_TIME_FOR_TAP_CANCEL) {
            isDraggingShip = true;
            // <<< VERWIJDERD: Zet isTouchFiringActive NIET meer uit bij drag >>>
        }
    }

    if (isDraggingShip && isInGameState && !isPaused && ship && isManualControl && playerLives > 0 && gameOverSequenceStartTime === 0 && !isShowingPlayerGameOverMessage /* || isShowingIntro */ && !isShipCaptured && !isShowingCaptureMessage && !isWaitingForRespawn && !isCsCompletionDelayActive) {
        let targetShipCenterX = touchCurrentX - shipTouchOffsetX;
        let targetShipX = targetShipCenterX - ship.width / 2;

        const effectiveShipWidth = isDualShipActive ? ship.width + DUAL_SHIP_OFFSET_X : ship.width;
        ship.x = Math.max(0, Math.min(gameCanvas.width - effectiveShipWidth, targetShipX));
        ship.targetX = ship.x;
    }
}


function handleTouchEnd(event) {
    if (!isTouching || !gameCanvas) return;
    event.preventDefault();

    const wasTap = !isDraggingShip;

    if (wasTap) {
        const touchPosEnd = getTouchPos(gameCanvas, event);
        if (!touchPosEnd) {
             isTouching = false; isDraggingShip = false; shipTouchOffsetX = 0; touchStartX = 0; isTouchFiringActive = false; return;
        }

        if (isShowingIntro && isInGameState) {
            if (typeof stopGameAndShowMenu === 'function') {
                stopGameAndShowMenu();
            }
        }
        else if (!isInGameState || isShowingScoreScreen) {
            if (typeof processMenuInteraction === 'function') {
                processMenuInteraction(touchPosEnd.x, touchPosEnd.y);
            }
        }
        else if (isInGameState && isManualControl && playerLives > 0 &&
            !isPaused && gameOverSequenceStartTime === 0 && !isShowingPlayerGameOverMessage && !isShowingIntro && !isShipCaptured && !isShowingCaptureMessage && !isWaitingForRespawn && !isCsCompletionDelayActive && !showCsHitsMessage && !showPerfectMessage && !showCsBonusScoreMessage && !showCSClearMessage && !showExtraLifeMessage)
        {
             // Alleen single shot afhandelen bij tik
             if (selectedFiringMode === 'single') {
                 if (typeof firePlayerBullet === 'function') {
                     if (!touchJustFiredSingle) {
                         if (firePlayerBullet(false)) {
                             touchJustFiredSingle = true;
                         }
                     }
                 }
             }
             // Rapid fire wordt afgehandeld door isTouchFiringActive in handlePlayerInput
        }
    }

    isTouching = false;
    isDraggingShip = false;
    shipTouchOffsetX = 0;
    touchStartX = 0;
    isTouchFiringActive = false; // Stop continu vuur bij loslaten
}


function handleTouchCancel(event) {
    if (!isTouching) return;
     event.preventDefault();
    isTouching = false;
    isDraggingShip = false;
    shipTouchOffsetX = 0;
    touchStartX = 0;
    isTouchFiringActive = false; // Stop continu vuur
    touchJustFiredSingle = false;
}
// --- EINDE Touch Event Handlers ---

/**
 * Hoofd game loop.
 */
function mainLoop(timestamp) {
    try {
        drawStars();
        if (retroGridCtx && retroGridCanvas) { drawRetroGrid(); }
        pollControllerForMenu();

        if (isInGameState && !isPaused) {
            if (!isManualControl && connectedGamepadIndex !== null) {
                const gamepads = navigator.getGamepads();
                if (gamepads?.[connectedGamepadIndex]) {
                     const gamepad = gamepads[connectedGamepadIndex];
                     const currentDemoButtonStates = gamepad.buttons.map(b => b.pressed);
                     let anyButtonPressedNow = false;
                     for (let i = 0; i < currentDemoButtonStates.length; i++) { if (i === PS5_BUTTON_R1 || i === PS5_BUTTON_TRIANGLE) continue; if (currentDemoButtonStates[i] && !(previousDemoButtonStates[i] ?? false)) { anyButtonPressedNow = true; break; } }
                     if (anyButtonPressedNow) { stopSound(menuMusicSound); showMenuState(); requestAnimationFrame(mainLoop); return; }
                     previousDemoButtonStates = currentDemoButtonStates.slice();
                 } else { if(previousDemoButtonStates.length > 0) previousDemoButtonStates = []; }
            } else { if(previousDemoButtonStates.length > 0) previousDemoButtonStates = []; }

            if(typeof runSingleGameUpdate === 'function') { runSingleGameUpdate(timestamp); }
            else { console.error("FATAL: runSingleGameUpdate is not defined!"); if (mainLoopId) cancelAnimationFrame(mainLoopId); mainLoopId = null; showMenuState(); requestAnimationFrame(mainLoop); return; }

            if (gameOverSequenceStartTime > 0) {
                const now = Date.now(); const elapsedTime = now - gameOverSequenceStartTime; const totalSequenceDuration = GAME_OVER_DURATION + RESULTS_SCREEN_DURATION;
                if (elapsedTime >= totalSequenceDuration) { showMenuState(); requestAnimationFrame(mainLoop); return; }
            }
        } else if (isShowingScoreScreen) {
             const elapsedScoreTime = Date.now() - scoreScreenStartTime;
             if (elapsedScoreTime >= SCORE_SCREEN_DURATION) { startAIDemo(); requestAnimationFrame(mainLoop); return; }
             if(typeof renderGame === 'function') renderGame();
        } else if (isInGameState && gameOverSequenceStartTime > 0) {
             if(typeof renderGame === 'function') renderGame();
             const now = Date.now(); const elapsedTime = now - gameOverSequenceStartTime; const totalSequenceDuration = GAME_OVER_DURATION + RESULTS_SCREEN_DURATION;
             if (elapsedTime >= totalSequenceDuration) { showMenuState(); requestAnimationFrame(mainLoop); return; }
        } else if (isInGameState && isPaused) {
             if(typeof renderGame === 'function') renderGame();
        } else if (isInGameState && isCsCompletionDelayActive) {
             if(typeof runSingleGameUpdate === 'function') runSingleGameUpdate(timestamp);
             else if (typeof renderGame === 'function') renderGame();
        } else if (isInGameState && isShowingPlayerGameOverMessage) {
             if(typeof runSingleGameUpdate === 'function') runSingleGameUpdate(timestamp);
             else if (typeof renderGame === 'function') renderGame();
        } else {
             if(typeof renderGame === 'function') renderGame();
        }

        mainLoopId = requestAnimationFrame(mainLoop);

    } catch (e) {
        console.error("!!! CRITICAL ERROR IN mainLoop:", e, e.stack);
        if (mainLoopId) cancelAnimationFrame(mainLoopId); mainLoopId = null; isPaused = false;
        stopAllGameSounds(); // Stops looping sounds
        isGridSoundPlaying = false;
        try { showMenuState(); } catch(menuErr) { console.error("Failed to return to menu after loop error:", menuErr); document.body.innerHTML = '<p style="color:white;">CRITICAL LOOP ERROR. Please refresh.</p>';}
    }
}

// startMainLoop() - ongewijzigd
function startMainLoop() { if (mainLoopId === null) { gridOffsetY = 0; mainLoop(); } }

// initializeGame() - aangepast
function initializeGame() {
    try {
        if (typeof initializeDOMElements === 'function') {
            if (!initializeDOMElements()) {
                console.error("DOM element initialization failed.");
                return;
            }
        } else {
            console.error("initializeDOMElements function not found!");
            return;
        }

        if (typeof resizeCanvases === 'function') {
            resizeCanvases();
        } else {
            console.error("resizeCanvases not found!");
            if (gameCanvas && starrySkyCanvas && retroGridCanvas) {
                 const width = window.innerWidth; const height = window.innerHeight;
                 starrySkyCanvas.width = width; starrySkyCanvas.height = height;
                 retroGridCanvas.width = width; retroGridCanvas.height = height;
                 gameCanvas.width = width; gameCanvas.height = height;
            } else { console.error("Cannot set fallback canvas sizes."); return; }
        }

        if (typeof defineNormalWaveEntrancePaths === 'function') { defineNormalWaveEntrancePaths(); }
        else { console.error("defineNormalWaveEntrancePaths not found!"); }
        if (typeof defineChallengingStagePaths === 'function') { defineChallengingStagePaths(); }
        else { console.error("defineChallengingStagePaths not found!"); }

        if(typeof loadHighScore === 'function') loadHighScore(); else console.warn("loadHighScore function not found.");

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        if (gameCanvas) {
            gameCanvas.addEventListener('click', handleCanvasClick);
            gameCanvas.addEventListener('mousemove', handleCanvasMouseMove);
            // Touch listeners
            gameCanvas.addEventListener('touchstart', handleTouchStart, { passive: false });
            gameCanvas.addEventListener('touchmove', handleTouchMove, { passive: false });
            gameCanvas.addEventListener('touchend', handleTouchEnd, { passive: false });
            gameCanvas.addEventListener('touchcancel', handleTouchCancel, { passive: false });
        } else {
            console.error("Cannot add canvas listeners: gameCanvas not found during init.");
        }
        window.addEventListener("gamepadconnected", handleGamepadConnected);
        window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);
        window.addEventListener('resize', resizeCanvases);

        showMenuState();
        startMainLoop();

    } catch (e) {
        console.error("FATAL INITIALIZATION ERROR:", e, e.stack);
        document.body.innerHTML = `<div style="color:white; padding: 20px; font-family: sans-serif;"><h1>Fatal Initialization Error</h1><p>The game could not be started. Please check the browser console (F12) for details.</p><p>Error: ${e.message}</p></div>`;
        if (mainLoopId) { cancelAnimationFrame(mainLoopId); mainLoopId = null; }
    }
}

// --- Start de initialisatie bij het laden van de pagina ---
window.addEventListener('load', initializeGame);

// --- EINDE deel 3      van 3 dit codeblok ---
// --- END OF FILE rendering_menu.js ---