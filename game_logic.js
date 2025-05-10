// --- START OF FILE game_logic.js ---
// --- DEEL 1      van 8 dit code blok    --- (<<< REVISE: Restore Touch Rapid Fire (Hold) >>>)
// <<< GEWIJZIGD: playSound/stopSound aanroepen gebruiken nu identifiers. >>>
// <<< GEWIJZIGD: stopAllGameSounds itereert nu over playingLoopSources. >>>
// <<< GEWIJZIGD: Touch state variabelen gereset in resetGame. >>>
// <<< GEWIJZIGD: touchJustFiredSingle wordt nu gereset in resetGame en resetWave. >>>
// <<< GEWIJZIGD: touchStartX wordt nu gereset in resetGame en resetWave. >>>
// <<< GEWIJZIGD: isTouchFiringActive wordt nu gereset in resetGame en resetWave. >>>

// Contains: Game State Reset & Wave Definition

// --- Globale State Variabelen worden nu GEDECLAREERD in setup_utils.js ---
// ... (variabelen lijst ongewijzigd) ...
let currentWavePatternIndex = -1; let aiNeedsStabilization = true; let aiStabilizationEndTime = 0; let smoothedShipX = undefined;
// firstEnemyLanded (declared in setup_utils.js)
// lastGridFireCheckTime (declared in setup_utils.js)
// playerIntroSoundPlayed (declared in setup_utils.js)
// stageIntroSoundPlayed (declared in setup_utils.js)
// isTouching, touchCurrentX, isDraggingShip, shipTouchOffsetX, lastTapTime (declared in setup_utils.js)
// touchJustFiredSingle (declared in setup_utils.js)
// touchStartX (declared in setup_utils.js)
// isTouchFiringActive (declared in setup_utils.js)

// Globale counters (gedeclareerd in setup_utils.js, hier alleen gebruikt)
// totalEnemiesScheduledForWave
// enemiesSpawnedThisWave

/** Resets game state for the VERY FIRST start or when returning to menu.
 * <<< GEWIJZIGD: lastGridFireCheckTime wordt nu hier op 0 gezet. >>>
 * <<< GEWIJZIGD: Reset sound flags. >>>
 * <<< GEWIJZIGD: Reset touch state variables. >>>
*/
function resetGame() {
    // ... (inhoud ongewijzigd tot reset lijst) ...
     try {
         level = 1; currentWavePatternIndex = -1; isPaused = false; isShowingIntro = false; introStep = 0; isWaveTransitioning = false; isGridSoundPlaying = false; isEntrancePhaseActive = false; totalEnemiesScheduledForWave = 0; enemiesSpawnedThisWave = 0; enemySpawnTimeouts.forEach(clearTimeout); enemySpawnTimeouts = []; squadronCompletionStatus = {}; squadronEntranceFiringStatus = {}; isGridBreathingActive = false; gridBreathStartTime = 0; currentGridBreathFactor = 0; isCsCompletionDelayActive = false; csCompletionDelayStartTime = 0; csCompletionResultIsPerfect = false; csIntroSoundPlayed = false; gameOverSequenceStartTime = 0; gameStartTime = 0;
         stopAllGameSounds(); // <<< Stops looping Web Audio sounds >>>
         player1CompletedLevel = -1; forceCenterShipNextReset = false; isShowingPlayerGameOverMessage = false; playerGameOverMessageStartTime = 0; playerWhoIsGameOver = 0; nextActionAfterPlayerGameOver = ''; isShipCaptured = false; capturingBossId = null; captureBeamActive = false; captureBeamSource = { x: 0, y: 0 }; captureBeamTargetY = 0; captureBeamProgress = 0; captureAttemptMadeThisLevel = false; isShowingCaptureMessage = false; captureMessageStartTime = 0; capturedBossIdWithMessage = null; fallingShips = []; isDualShipActive = false; player1IsDualShipActive = false; player2IsDualShipActive = false; isWaitingForRespawn = false; respawnTime = 0; isInvincible = false; invincibilityEndTime = 0; player1Score = 0; player2Score = 0; player1Lives = 3; player2Lives = 3; player1ShotsFired = 0; player2ShotsFired = 0; player1EnemiesHit = 0; player2EnemiesHit = 0; player1MaxLevelReached = 1; player2MaxLevelReached = 1;
         lastGridFireCheckTime = 0; // <<< Reset grid fire timer >>>
         firstEnemyLanded = false; // <<< Reset de 'first landed' vlag >>>
         player1LifeThresholdsMet = new Set();
         player2LifeThresholdsMet = new Set();
         currentPlayer = 1; score = player1Score; playerLives = player1Lives; player1TriggeredHighScoreSound = false; player2TriggeredHighScoreSound = false; scoreEarnedThisCS = 0;
         playerIntroSoundPlayed = false; // Reset sound flag
         stageIntroSoundPlayed = false; // Reset sound flag
         // <<< Reset Touch State >>>
         isTouching = false; touchCurrentX = 0; touchStartX = 0; isDraggingShip = false; shipTouchOffsetX = 0; lastTapTime = 0; touchJustFiredSingle = false; isTouchFiringActive = false;
         // <<< EINDE Reset Touch State >>>
         resetAllMessages(); explosions = []; isChallengingStage = false; challengingStageEnemiesHit = 0; isShowingResultsScreen = false; currentWaveDefinition = null; isFullGridWave = false; hitSparks = []; resetWave(); // resetWave reset nu ook de vlaggen
        } catch (e) {
            console.error("FATAL Error in resetGame:", e);
            isWaveTransitioning = false; isGridSoundPlaying = false; isEntrancePhaseActive = false; isCsCompletionDelayActive = false; csCompletionDelayStartTime = 0; csCompletionResultIsPerfect = false; csIntroSoundPlayed = false; isPaused = false; currentWavePatternIndex = -1; player1CompletedLevel = -1; isShowingPlayerGameOverMessage = false; playerGameOverMessageStartTime = 0; playerWhoIsGameOver = 0; nextActionAfterPlayerGameOver = ''; squadronCompletionStatus = {}; squadronEntranceFiringStatus = {}; isGridBreathingActive = false; gridBreathStartTime = 0; currentGridBreathFactor = 0; resetAllMessages(); forceCenterShipNextReset = false; player1ShotsFired = 0; player2ShotsFired = 0; player1EnemiesHit = 0; player2EnemiesHit = 0; player1MaxLevelReached = 1; player2MaxLevelReached = 1; isShipCaptured = false; capturingBossId = null; captureBeamActive = false; captureBeamSource = { x: 0, y: 0 }; captureBeamTargetY = 0; captureBeamProgress = 0; captureAttemptMadeThisLevel = false; isShowingCaptureMessage = false; captureMessageStartTime = 0; capturedBossIdWithMessage = null; fallingShips = []; isDualShipActive = false; player1IsDualShipActive = false; player2IsDualShipActive = false; isWaitingForRespawn = false; respawnTime = 0; isInvincible = false; invincibilityEndTime = 0; isFullGridWave = false; hitSparks = []; player1TriggeredHighScoreSound = false; player2TriggeredHighScoreSound = false;
             lastGridFireCheckTime = 0; // <<< Reset grid fire timer (in catch) >>>
             firstEnemyLanded = false; // <<< Reset de 'first landed' vlag (in catch) >>>
             player1LifeThresholdsMet = new Set();
             player2LifeThresholdsMet = new Set();
             playerIntroSoundPlayed = false; // Reset sound flag in catch
             stageIntroSoundPlayed = false; // Reset sound flag in catch
             // <<< Reset Touch State (in catch) >>>
             isTouching = false; touchCurrentX = 0; touchStartX = 0; isDraggingShip = false; shipTouchOffsetX = 0; lastTapTime = 0; touchJustFiredSingle = false; isTouchFiringActive = false;
             // <<< EINDE Reset Touch State (in catch) >>>
            if(typeof enemySpawnTimeouts !== 'undefined' && Array.isArray(enemySpawnTimeouts)) { enemySpawnTimeouts.forEach(clearTimeout); } enemySpawnTimeouts = []; if(typeof showMenuState === 'function') showMenuState();
        }
}

// Helper functie om alle berichtvlaggen te resetten
function resetAllMessages() { /* ... ongewijzigd ... */ showCsHitsMessage = false; csHitsMessageStartTime = 0; showPerfectMessage = false; perfectMessageStartTime = 0; showCsBonusScoreMessage = false; csBonusScoreMessageStartTime = 0; showCSClearMessage = false; csClearMessageStartTime = 0; showCsHitsForClearMessage = false; showCsScoreForClearMessage = false; showExtraLifeMessage = false; extraLifeMessageStartTime = 0; showReadyMessage = false; readyMessageStartTime = 0; readyForNextWave = false; readyForNextWaveReset = false; }

// Helper functie om game geluiden te stoppen (Web Audio versie in setup_utils.js)
function stopAllGameSounds() {
    // <<< GEWIJZIGD: Itereert nu over *alle* actieve loops in playingLoopSources >>>
    if (typeof playingLoopSources === 'object' && playingLoopSources !== null) {
        const activeLoopKeys = Object.keys(playingLoopSources);
        activeLoopKeys.forEach(soundKey => {
            stopSound(soundKey);
        });
    }
    isGridSoundPlaying = false;
    stopSound(captureSound);
    stopSound(entranceSound);
}


/**
 * Bepaalt het type wave voor een gegeven level.
 */
function getWaveType(level) { /* ... inhoud ongewijzigd ... */ const patternIndex = (level - 1) % 4; switch (patternIndex) { case 0: return 'full_grid'; case 1: return 'entrance_flight_1'; case 2: return 'challenging_stage'; case 3: return 'entrance_flight_2'; default: console.error(`Onbekend wave patroon index ${patternIndex} voor level ${level}`); return 'unknown'; } }

/**
 * Genereert de *structuur* (layout) voor een gegeven wave level.
 */
function generateWaveDefinition(level) { /* ... inhoud ongewijzigd ... */ let waveDef = []; currentWavePatternIndex = -1; const waveType = getWaveType(level); if (typeof waveEntrancePatterns === 'undefined' || !Array.isArray(waveEntrancePatterns) || waveEntrancePatterns.length < 2) { console.error(`CRITICAL: waveEntrancePatterns is not defined or invalid in generateWaveDefinition (Level ${level})!`); return []; } if (waveType === 'challenging_stage') { waveDef = []; } else if (waveType === 'full_grid') { currentWavePatternIndex = 0; const selectedPattern = waveEntrancePatterns[0]; if (!selectedPattern || selectedPattern.length === 0) { console.error(`Wave ${level} (Full Grid): Basis patroon 0 is ongeldig of leeg!`); waveDef = []; } else { try { waveDef = JSON.parse(JSON.stringify(selectedPattern), (key, value) => { if (value && typeof value === 'object' && value.type === ENEMY3_TYPE && typeof value.hasCapturedShip === 'undefined') { value.hasCapturedShip = false; } return value; }); } catch (e) { console.error(`Error deep copying selected pattern 0 for Full Grid:`, e); waveDef = []; } } } else if (waveType === 'entrance_flight_1') { currentWavePatternIndex = 0; const selectedPattern = waveEntrancePatterns[0]; if (!selectedPattern || selectedPattern.length === 0) { console.error(`Wave ${level} (Entrance 1): Basis patroon 0 is ongeldig of leeg!`); waveDef = []; } else { try { waveDef = JSON.parse(JSON.stringify(selectedPattern), (key, value) => { if (value && typeof value === 'object' && value.type === ENEMY3_TYPE && typeof value.hasCapturedShip === 'undefined') { value.hasCapturedShip = false; } return value; }); } catch (e) { console.error(`Error deep copying selected pattern 0 for Entrance 1:`, e); waveDef = []; } } } else if (waveType === 'entrance_flight_2') { currentWavePatternIndex = 1; const selectedPattern = waveEntrancePatterns[1]; if (!selectedPattern || selectedPattern.length === 0) { console.error(`Wave ${level} (Entrance 2): Basis patroon 1 is ongeldig of leeg!`); waveDef = []; } else { try { waveDef = JSON.parse(JSON.stringify(selectedPattern), (key, value) => { if (value && typeof value === 'object' && value.type === ENEMY3_TYPE && typeof value.hasCapturedShip === 'undefined') { value.hasCapturedShip = false; } return value; }); } catch (e) { console.error(`Error deep copying selected pattern 1 for Entrance 2:`, e); waveDef = []; } } } else { waveDef = []; } if (waveType !== 'challenging_stage') { if (typeof normalWaveEntrancePaths === 'undefined' || Object.keys(normalWaveEntrancePaths).length === 0) { console.error(`CRITICAL: normalWaveEntrancePaths is not defined or empty in generateWaveDefinition (Level ${level})! Cannot validate paths.`); return waveDef; } for (let i = waveDef.length - 1; i >= 0; i--) { const squadron = waveDef[i]; if (!normalWaveEntrancePaths?.[squadron.pathId]) { console.warn(`Wave ${level}, Pattern ${currentWavePatternIndex}: Squadron pathId "${squadron.pathId}" does not exist in normalWaveEntrancePaths! Removing squadron.`); waveDef.splice(i, 1); continue; } if (squadron.enemies && Array.isArray(squadron.enemies)) { for (let j = squadron.enemies.length - 1; j >= 0; j--) { const enemy = squadron.enemies[j]; if (!enemy || !normalWaveEntrancePaths?.[enemy.entrancePathId]) { console.warn(`Wave ${level}, Pattern ${currentWavePatternIndex}, Squadron ${squadron.pathId}: Enemy entrancePathId "${enemy?.entrancePathId}" invalid or missing in normalWaveEntrancePaths! Removing enemy.`); squadron.enemies.splice(j, 1); } if (enemy && enemy.type === ENEMY3_TYPE && typeof enemy.hasCapturedShip === 'undefined') { enemy.hasCapturedShip = false; } } if (squadron.enemies.length === 0) { console.warn(`Wave ${level}, Pattern ${currentWavePatternIndex}: Squadron "${squadron.pathId}" became empty after enemy path validation. Removing.`); waveDef.splice(i, 1); } } else { console.warn(`Wave ${level}, Pattern ${currentWavePatternIndex}: Squadron "${squadron.pathId}" has no valid enemies array. Removing.`); waveDef.splice(i, 1); } } } return waveDef; }


/**
 * Resets state for a new wave/level or player switch.
 * <<< GEWIJZIGD: Reset nu ook firstEnemyLanded flag. >>>
 * <<< GEWIJZIGD: lastGridFireCheckTime wordt nu hier op 0 gezet. >>>
 * <<< GEWIJZIGD: Intro sound logic simplified, main part moved to runSingleGameUpdate. >>>
 * <<< GEWIJZIGD: Reset playerIntroSoundPlayed and stageIntroSoundPlayed flags. >>>
 * <<< GEWIJZIGD: Gebruikt playSound() met identifier. >>>
 * <<< GEWIJZIGD: Reset touch state variables. >>>
*/
function resetWave() {
    // --- Stop Geluiden & Reset Vlaggen ---
    stopAllGameSounds(); // Stops looping Web Audio sounds
    isWaveTransitioning = false; isGridSoundPlaying = false; scoreEarnedThisCS = 0;
    resetAllMessages(); isCsCompletionDelayActive = false; csCompletionDelayStartTime = 0; csCompletionResultIsPerfect = false; csIntroSoundPlayed = false; isPaused = false;
    isShipCaptured = false; capturingBossId = null; captureBeamActive = false; captureBeamSource = { x: 0, y: 0 }; captureBeamTargetY = 0; captureBeamProgress = 0; captureAttemptMadeThisLevel = false;
    isShowingCaptureMessage = false; captureMessageStartTime = 0; capturedBossIdWithMessage = null;
    fallingShips = [];
    isWaitingForRespawn = false; respawnTime = 0; isInvincible = false; invincibilityEndTime = 0;
    // <<< Reset sound flags (nu alleen hier nodig) >>>
    playerIntroSoundPlayed = false;
    stageIntroSoundPlayed = false;
    // <<< Reset grid fire timer aan begin van de wave >>>
    lastGridFireCheckTime = 0;
    // <<< Reset de first landed vlag >>>
    firstEnemyLanded = false;
    // <<< Reset Touch State >>>
    isTouching = false; touchCurrentX = 0; touchStartX = 0; isDraggingShip = false; shipTouchOffsetX = 0; lastTapTime = 0; touchJustFiredSingle = false; isTouchFiringActive = false;
    // <<< EINDE Reset Touch State >>>


    const currentP1Score = player1Score;
    const currentP2Score = player2Score;
    if (currentP1Score < highScore) { player1TriggeredHighScoreSound = false; }
    if (currentP2Score < highScore) { player2TriggeredHighScoreSound = false; }

    // Reset Game Elementen
    bullets = []; enemyBullets = []; enemies = []; explosions = []; gridMoveDirection = 1; lastEnemyDetachTime = 0; currentGridOffsetX = 0; isEntrancePhaseActive = false; currentWaveDefinition = null; currentWavePatternIndex = -1; enemySpawnTimeouts.forEach(clearTimeout); enemySpawnTimeouts = []; totalEnemiesScheduledForWave = 0; enemiesSpawnedThisWave = 0; squadronCompletionStatus = {}; squadronEntranceFiringStatus = {}; isGridBreathingActive = false; gridBreathStartTime = 0; currentGridBreathFactor = 0;
    hitSparks = []; isFullGridWave = false; isChallengingStage = false;

    try {
        // --- Bepaal wave type en intro step (ongewijzigd) ---
        const waveType = getWaveType(level); isChallengingStage = (waveType === 'challenging_stage'); isFullGridWave = (waveType === 'full_grid'); challengingStageEnemiesHit = 0; isShowingIntro = true; introDisplayStartTime = Date.now();
        if (isChallengingStage) { if (isTwoPlayerMode) { introStep = 1; } else { introStep = 3; } }
        else if (isFullGridWave) { if (isTwoPlayerMode) { introStep = 1; } else if (level === 1) { introStep = 1; } else { introStep = 2; } }
        else { if (isTwoPlayerMode) { introStep = 1; } else { introStep = 2; } }

        // --- Intro sound logic (VEREENVOUDIGD - Alleen L1 Start hier) ---
        if (level === 1 && currentPlayer === 1) {
            playSound(startSound); // <<< GEWIJZIGD: Gebruik identifier >>>
            // Vlag wordt nu gezet in runSingleGameUpdate
        }

        // --- Reset schip positie (ongewijzigd) ---
        if (gameCanvas?.width > 0 && ship) { ship.y = gameCanvas.height - SHIP_HEIGHT - SHIP_BOTTOM_MARGIN; if (!isManualControl || forceCenterShipNextReset) { if (isDualShipActive) { ship.x = gameCanvas.width / 2 - ship.width; } else { ship.x = gameCanvas.width / 2 - ship.width / 2; } ship.targetX = ship.x; smoothedShipX = ship.x; aiNeedsStabilization = true; } } else { console.warn("Canvas/ship not ready in resetWave."); } forceCenterShipNextReset = false;
    } catch (e) {
        console.error("FATAL Error in resetWave:", e);
        // ... (Error handling ongewijzigd) ...
        isWaveTransitioning = false; isGridSoundPlaying = false; isShowingIntro = false; introStep = 0; isChallengingStage = false; isFullGridWave = false; resetAllMessages(); isCsCompletionDelayActive = false; csCompletionDelayStartTime = 0; csCompletionResultIsPerfect = false; csIntroSoundPlayed = false; isPaused = false; currentWavePatternIndex = -1; squadronCompletionStatus = {}; squadronEntranceFiringStatus = {}; isGridBreathingActive = false; gridBreathStartTime = 0; currentGridBreathFactor = 0; forceCenterShipNextReset = false; isShipCaptured = false; capturingBossId = null; captureBeamActive = false; captureBeamSource = { x: 0, y: 0 }; captureBeamTargetY = 0; captureBeamProgress = 0; captureAttemptMadeThisLevel = false; isShowingCaptureMessage = false; captureMessageStartTime = 0; capturedBossIdWithMessage = null; fallingShips = []; isWaitingForRespawn = false; respawnTime = 0; isInvincible = false; invincibilityEndTime = 0; hitSparks = []; player1TriggeredHighScoreSound = false; player2TriggeredHighScoreSound = false;
         lastGridFireCheckTime = 0; // <<< Reset grid fire timer (in catch) >>>
         firstEnemyLanded = false; // <<< Reset de 'first landed' vlag (in catch) >>>
         playerIntroSoundPlayed = false; // Reset sound flag in catch
         stageIntroSoundPlayed = false; // Reset sound flag in catch
         // <<< Reset Touch State (in catch) >>>
         isTouching = false; touchCurrentX = 0; touchStartX = 0; isDraggingShip = false; shipTouchOffsetX = 0; lastTapTime = 0; touchJustFiredSingle = false; isTouchFiringActive = false;
         // <<< EINDE Reset Touch State (in catch) >>>
        if(typeof enemySpawnTimeouts !== 'undefined' && Array.isArray(enemySpawnTimeouts)) { enemySpawnTimeouts.forEach(clearTimeout); } enemySpawnTimeouts = []; if(typeof showMenuState === 'function') showMenuState();
    }
}

// --- EINDE deel 1      van 8 dit codeblok ---
// --- END OF FILE game_logic.js ---








// --- START OF FILE game_logic.js ---
// --- DEEL 2      van 8 dit code blok    --- (<<< REVISE: Stop Grid Sound for CS, Capture Sound Timing >>>)
// <<< GEWIJZIGD: Diagnostische logs verwijderd uit entrance squadron firing logic. >>>
// <<< GEWIJZIGD: Firing timeout wordt nu centraal gepland na het schedulen van alle enemies in squadron. >>>
// <<< GEWIJZIGD: firstEnemyId opgeslagen in squadronEntranceFiringStatus. >>>
// <<< GEWIJZIGD: startChallengingStageSequence stopt nu expliciet gridBackgroundSound. >>>

// Contains: Wave/Stage Entrance Scheduling & Enemy Detachment

// <<< Helper functie voor het maken van EEN kogel, nu met geschaalde snelheid en mikken >>>
const createBulletSimple = (targetEnemy, overrideStartPos = null) => { /* ... ongewijzigd ... */ if (!targetEnemy || playerLives <= 0 || !isInGameState || !ship || isShipCaptured) return false; const effectiveBulletSpeed = scaleValue(level, BASE_ENEMY_BULLET_SPEED, MAX_ENEMY_BULLET_SPEED); const startX = overrideStartPos ? overrideStartPos.x : targetEnemy.x + targetEnemy.width / 2; const startY = overrideStartPos ? overrideStartPos.y : targetEnemy.y + targetEnemy.height / 2; let bulletVx = 0; let bulletVy = effectiveBulletSpeed; const dx = (ship.x + ship.width/2) - startX; const dy = (ship.y + ship.height/2) - startY; const dist = Math.sqrt(dx*dx + dy*dy); if (dist > 0) { let aimFactor = 0; if (!isChallengingStage) { aimFactor = scaleValue(level, BASE_ENEMY_AIM_FACTOR, MAX_ENEMY_AIM_FACTOR); } let targetAngle = Math.atan2(dy, dx); bulletVx = Math.cos(targetAngle) * effectiveBulletSpeed * aimFactor; bulletVy = Math.sqrt(effectiveBulletSpeed**2 - bulletVx**2); bulletVy = Math.max(effectiveBulletSpeed * (1.0 - aimFactor) * 0.5, bulletVy); if (dy < 0) { bulletVy = Math.abs(bulletVy); } enemyBullets.push({ x: startX - ENEMY_BULLET_WIDTH / 2, y: startY, width: ENEMY_BULLET_WIDTH, height: ENEMY_BULLET_HEIGHT, vx: bulletVx, vy: bulletVy, type: targetEnemy.type }); return true; } return false; };
// <<< Einde createBulletSimple >>>


/**
 * Hulpfunctie om een ENKEL squadron te plannen voor ENTRANCE FLIGHT waves.
 */
function scheduleSingleEntranceSquadron(squadronData, sqIdx, startDelay) {
    // Check 1: Wordt deze functie uberhaupt aangeroepen voor de juiste waves?
    if (isFullGridWave || isChallengingStage) {
        if (squadronData?.enemies?.length > 0) { enemiesSpawnedThisWave += squadronData.enemies.length; if (squadronCompletionStatus[sqIdx]) squadronCompletionStatus[sqIdx].completed = squadronCompletionStatus[sqIdx].total; }
        return false;
    }

    const pathSource = normalWaveEntrancePaths;
    const pathId = squadronData.pathId;
    const pathSegments = pathSource[pathId];

    // Check 2: Is het pad geldig?
    if (!pathSegments || pathSegments.length === 0) {
        console.error(`Entrance Wave (Level ${level}): Path ${pathId} for squadron ${sqIdx} invalid or not found in normalWaveEntrancePaths! Skipping squadron.`);
        if (squadronData?.enemies?.length > 0) { enemiesSpawnedThisWave += squadronData.enemies.length; if (squadronCompletionStatus[sqIdx]) squadronCompletionStatus[sqIdx].completed = squadronCompletionStatus[sqIdx].total; }
        return false;
    }

    const squadronStartTimeoutId = setTimeout(() => {
        const sqTimeoutIdx = enemySpawnTimeouts.indexOf(squadronStartTimeoutId);
        if (sqTimeoutIdx > -1) enemySpawnTimeouts.splice(sqTimeoutIdx, 1);

        if (isPaused || !isInGameState || !isEntrancePhaseActive || isChallengingStage || isWaveTransitioning || playerLives <= 0 || isShipCaptured || isFullGridWave) {
            if (squadronData?.enemies?.length > 0) { enemiesSpawnedThisWave += squadronData.enemies.length; if (squadronCompletionStatus[sqIdx]) squadronCompletionStatus[sqIdx].completed = squadronCompletionStatus[sqIdx].total; }
            return;
        }

        try {
            if (!squadronEntranceFiringStatus[sqIdx]) {
                 squadronEntranceFiringStatus[sqIdx] = {};
            }
            squadronEntranceFiringStatus[sqIdx].scheduledStartTime = Date.now() + startDelay;
            squadronEntranceFiringStatus[sqIdx].hasFired = false;
            squadronEntranceFiringStatus[sqIdx].firstEnemyId = null;

            const spawnDelayBetweenEnemies = ENEMY_SPAWN_DELAY_IN_SQUADRON;
            const spawnDelayBetweenPairs = spawnDelayBetweenEnemies * 2;
            const verySmallDelayForPair = 1;
            let enemyScheduledCount = 0;

            squadronData.enemies.forEach((enemyDef, enemyIndex) => {
                 enemyScheduledCount++;

                if (!enemyDef || !enemyDef.type || typeof enemyDef.gridRow === 'undefined' || typeof enemyDef.gridCol === 'undefined' || !enemyDef.entrancePathId) { console.error(`Entrance Wave: Invalid enemy def in squadron ${sqIdx} (Path ${pathId}), index ${enemyIndex}. Skipping.`); enemiesSpawnedThisWave++; if(squadronCompletionStatus[sqIdx]) { squadronCompletionStatus[sqIdx].completed++; } return; }
                const enemyAssignedPathId = enemyDef.entrancePathId;
                const enemyAssignedPath = pathSource[enemyAssignedPathId];
                if (!enemyAssignedPath || enemyAssignedPath.length === 0) {
                    // console.warn(`Entrance Wave: Assigned entrance path "${enemyAssignedPathId}" for enemy in squadron ${sqIdx}, index ${enemyIndex} not found. Enemy will follow squadron path "${pathId}".`);
                }
                const activePathSegments = (enemyAssignedPath && enemyAssignedPath.length > 0) ? enemyAssignedPath : pathSegments;
                const activePathId = (enemyAssignedPath && enemyAssignedPath.length > 0) ? enemyAssignedPathId : pathId;

                let individualSpawnDelay = 0; const waveTypeForTiming = getWaveType(level); const useWave2SpawnTiming = (waveTypeForTiming === 'entrance_flight_2') && (sqIdx === 2 || sqIdx === 3); if (useWave2SpawnTiming) { const pairIndex = Math.floor(enemyIndex / 2); if (enemyIndex % 2 === 0) { individualSpawnDelay = pairIndex * spawnDelayBetweenPairs; } else { individualSpawnDelay = pairIndex * spawnDelayBetweenPairs + verySmallDelayForPair; } } else { individualSpawnDelay = enemyIndex * ENEMY_SPAWN_DELAY_IN_SQUADRON; }

                const enemyTimeoutId = setTimeout(() => {
                    const enTimeoutIdx = enemySpawnTimeouts.indexOf(enemyTimeoutId);
                    if (enTimeoutIdx > -1) enemySpawnTimeouts.splice(enTimeoutIdx, 1);

                    if (isPaused || !isInGameState || !isEntrancePhaseActive || isChallengingStage || isWaveTransitioning || playerLives <= 0 || isShipCaptured || isFullGridWave) {
                         enemiesSpawnedThisWave++; if(squadronCompletionStatus[sqIdx]) { squadronCompletionStatus[sqIdx].completed++; } return;
                    }
                    try {
                        let enemyType = enemyDef.type; let enemyHealth = (enemyType === ENEMY3_TYPE) ? ENEMY3_MAX_HITS : 1; let enemyWidth, enemyHeight; if (enemyType === ENEMY1_TYPE) { enemyWidth = ENEMY1_WIDTH; enemyHeight = ENEMY1_HEIGHT; } else if (enemyType === ENEMY3_TYPE) { enemyWidth = BOSS_WIDTH; enemyHeight = BOSS_HEIGHT; } else { enemyWidth = ENEMY_WIDTH; enemyHeight = ENEMY_HEIGHT; }
                        let startX = 0, startY = 0;

                        if (activePathSegments && activePathSegments[0]?.p0) {
                            startX = activePathSegments[0].p0.x;
                            startY = activePathSegments[0].p0.y;
                        } else {
                             console.error(`Invalid start segment for active path ${activePathId} (Sq ${sqIdx}, Enemy ${enemyIndex}). Throwing error.`);
                             throw new Error(`Invalid start segment for active path ${activePathId}`);
                        }

                        let targetGridX, targetGridY; try { const { x: finalTargetX, y: finalTargetY } = getCurrentGridSlotPosition(enemyDef.gridRow, enemyDef.gridCol, enemyWidth); targetGridX = finalTargetX; targetGridY = finalTargetY; } catch(e) { console.error(`Error getting target grid pos for new enemy ${enemyDef.type} at [${enemyDef.gridRow},${enemyDef.gridCol}]`, e); targetGridX = gameCanvas?.width / 2 || 200; targetGridY = ENEMY_TOP_MARGIN + enemyDef.gridRow * (ENEMY_HEIGHT + ENEMY_V_SPACING); }
                        let initialPathT = 0; const isPairingSquadron = useWave2SpawnTiming; const isSecondInPairCheck = isPairingSquadron && (enemyIndex % 2 !== 0); if (isSecondInPairCheck) { initialPathT = -ENTRANCE_PAIR_PATH_T_OFFSET; } else { initialPathT = -enemyIndex * PATH_T_OFFSET_PER_ENEMY; }

                        const newEnemy = { x: startX, y: startY, width: enemyWidth, height: enemyHeight, targetGridX: targetGridX, targetGridY: targetGridY, speed: 0, state: 'following_entrance_path', gridRow: enemyDef.gridRow, gridCol: enemyDef.gridCol, type: enemyType, health: enemyHealth, isDamaged: false, velocityX: 0, velocityY: 0, attackPathStep: 0, initialY: 0, initialX: 0, diveDirection: 1, lastFiredTime: 0, targetX1: 0, targetY1: 0, targetX2: 0, targetY2: 0, targetX3: 0, targetY3: 0, attackPathSegments: [], attackPathSegmentIndex: 0, attackPathT: 0, attackStartTime: 0, attackFormationOffsetX: 0, attackGroupId: null, entrancePathId: activePathId, pathSegmentIndex: 0, pathT: initialPathT, squadronId: sqIdx, squadronEnemyIndex: enemyIndex, id: `enemy-entr-${sqIdx}-${enemyIndex}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, justReturned: false, canFireThisDive: false, attackType: 'normal', hasCapturedShip: (enemyType === ENEMY3_TYPE) ? false : undefined, capturedShipX: undefined, capturedShipY: undefined, capturedShipLastFiredTime: (enemyType === ENEMY3_TYPE) ? 0 : undefined, captureStartTime: 0, capturePrepareTimeout: null, pathSpeedMultiplier: 1.0 };

                        enemies.push(newEnemy);
                        enemiesSpawnedThisWave++;
                        if(squadronCompletionStatus[sqIdx]) { squadronCompletionStatus[sqIdx].completed++; }

                        if (enemyIndex === 0) {
                            if (squadronEntranceFiringStatus[sqIdx]) {
                                squadronEntranceFiringStatus[sqIdx].firstEnemyId = newEnemy.id;
                            }
                        }

                    } catch (spawnError) {
                        console.error(`Entrance Wave: Error during enemy spawn execution (Sq ${sqIdx}, Idx ${enemyIndex}, Path ${pathId}):`, spawnError);
                        enemiesSpawnedThisWave++;
                        if(squadronCompletionStatus[sqIdx]) { squadronCompletionStatus[sqIdx].completed++; }
                    }
                }, individualSpawnDelay);
                enemySpawnTimeouts.push(enemyTimeoutId);
            }); // Einde forEach enemy

            // Plan de centrale vuur-timer
            const centralFireCheckTimeout = setTimeout(() => {
                const checkTimeoutIdx = enemySpawnTimeouts.indexOf(centralFireCheckTimeout);
                if (checkTimeoutIdx > -1) enemySpawnTimeouts.splice(checkTimeoutIdx, 1);

                 const fireStatus = squadronEntranceFiringStatus[sqIdx];
                 const targetEnemyId = fireStatus ? fireStatus.firstEnemyId : null;

                if (isPaused || !isInGameState || playerLives <= 0 || isChallengingStage || isWaveTransitioning || isShipCaptured || isFullGridWave || !targetEnemyId) {
                     return;
                }

                const currentFirstEnemy = enemies.find(e => e && e.id === targetEnemyId);

                if (currentFirstEnemy) {
                    if (currentFirstEnemy.state === 'following_entrance_path' || currentFirstEnemy.state === 'moving_to_grid' || currentFirstEnemy.state === 'in_grid') {
                        fireFixedEnemyBurst(targetEnemyId, null, 0, 3);
                    }
                }

            }, ENTRANCE_SQUADRON_FIRE_DELAY_MS);
            enemySpawnTimeouts.push(centralFireCheckTimeout);

        } catch (squadronProcessError) {
            console.error(`Entrance Wave: Error processing enemies for squadron ${sqIdx} (Path ${pathId}):`, squadronProcessError);
            if(squadronData?.enemies?.length > 0) { enemiesSpawnedThisWave += squadronData.enemies.length; if(squadronCompletionStatus[sqIdx]) { squadronCompletionStatus[sqIdx].completed = squadronCompletionStatus[sqIdx].total; } }
        }
    }, startDelay);
    enemySpawnTimeouts.push(squadronStartTimeoutId);
    return true;
};
// --- Einde Hulpfunctie scheduleSingleEntranceSquadron ---


/**
 * Start de sequentie voor een Challenging Stage.
 * <<< GEWIJZIGD: Stopt nu expliciet gridBackgroundSound. >>>
 */
function startChallengingStageSequence() {
    // Stop grid geluid expliciet voor CS
    if (isGridSoundPlaying) {
        stopSound(gridBackgroundSound);
        isGridSoundPlaying = false;
    }

    currentWaveDefinition = []; isEntrancePhaseActive = false; enemySpawnTimeouts.forEach(clearTimeout); enemySpawnTimeouts = []; totalEnemiesScheduledForWave = 0; enemiesSpawnedThisWave = 0; squadronEntranceFiringStatus = {};
    if (Object.keys(challengingStagePaths).length === 0) { defineChallengingStagePaths(); }
    if (Object.keys(challengingStagePaths).length === 0) { console.error("CRITICAL: Failed to define CS paths!"); isWaveTransitioning = true; setTimeout(() => { if ((isInGameState || (!isInGameState && playerLives > 0)) && typeof resetWave === 'function') { resetWave(); } }, NEXT_WAVE_DELAY_AFTER_MESSAGE); return; }

    const fixedPathSequence = [ 'CS3_DiveLoopL_Sharp', 'CS3_DiveLoopR_Sharp', 'CS_HorizontalFlyByL', 'CS_HorizontalFlyByR' ];
    const loopAttackPaths = [ 'CS_LoopAttack_TL', 'CS_LoopAttack_TR', 'CS_LoopAttack_BL', 'CS_LoopAttack_BR' ];
    const requiredPaths = [...fixedPathSequence, ...loopAttackPaths];
    for (const pathId of requiredPaths) { if (!challengingStagePaths.hasOwnProperty(pathId)) { console.error(`CRITICAL: Required CS path "${pathId}" not found! Aborting CS.`); isWaveTransitioning = true; setTimeout(() => { if ((isInGameState || (!isInGameState && playerLives > 0)) && typeof resetWave === 'function') { resetWave(); } }, NEXT_WAVE_DELAY_AFTER_MESSAGE); return; } }

    let finalPathIdsForStage = [...fixedPathSequence];
    let shuffledLoopPaths = [...loopAttackPaths].sort(() => Math.random() - 0.5);
    finalPathIdsForStage.push(...shuffledLoopPaths);

    currentWaveDefinition = [];
    for (let i = 0; i < CHALLENGING_STAGE_SQUADRON_COUNT; i++) {
        const pathId = finalPathIdsForStage[i % finalPathIdsForStage.length];
        const squadron = { pathId: pathId, enemies: [] };
        for (let j = 0; j < CHALLENGING_STAGE_SQUADRON_SIZE; j++) {
            let enemyType = (j < Math.floor(CHALLENGING_STAGE_SQUADRON_SIZE / 2)) ? ENEMY1_TYPE : ENEMY2_TYPE;
            squadron.enemies.push({ type: enemyType, entrancePathId: pathId });
        }
        currentWaveDefinition.push(squadron);
    }

    challengingStageTotalEnemies = CHALLENGING_STAGE_ENEMY_COUNT;
    totalEnemiesScheduledForWave = challengingStageTotalEnemies;
    enemiesSpawnedThisWave = 0;

    if (currentWaveDefinition.length > 0) {
        isEntrancePhaseActive = true;
        enemySpawnTimeouts = [];
        let totalTimeoutsScheduled = 0;
        const CS3_START_SHIFT_X = -28;
        const csLevelIndex = Math.floor(Math.max(0, level - 3) / 4) + 1;
        const effectiveBaseSpeedMultiplier = scaleValue(csLevelIndex, BASE_CS_SPEED_MULTIPLIER, MAX_CS_SPEED_MULTIPLIER);

        currentWaveDefinition.forEach((squadronData, squadronIndex) => {
            let startDelay = 0;
            if (squadronIndex <= 1) { startDelay = 0; }
            else if (squadronIndex <= 3) { startDelay = CHALLENGING_STAGE_SQUADRON_INTERVAL; }
            else { startDelay = (squadronIndex - 2) * CHALLENGING_STAGE_SQUADRON_INTERVAL; }

            let currentSpeedMultiplier = effectiveBaseSpeedMultiplier;
            if (squadronIndex === 2 || squadronIndex === 3) {
                currentSpeedMultiplier *= CS_HORIZONTAL_FLYBY_SPEED_FACTOR;
            }

            const squadronStartTimeoutId = setTimeout(() => {
                const sqIdx = enemySpawnTimeouts.indexOf(squadronStartTimeoutId);
                if (sqIdx > -1) enemySpawnTimeouts.splice(sqIdx, 1);

                if (!isPaused && isInGameState && isEntrancePhaseActive && isChallengingStage && !isWaveTransitioning && playerLives > 0) {
                    try {
                        const pathId = squadronData.pathId;
                        const pathSource = challengingStagePaths;
                        const pathSegments = pathSource[pathId];
                        if (!pathSegments || pathSegments.length === 0) { console.error(`CS: Path ${pathId} for squadron ${squadronIndex} invalid! Skipping.`); enemiesSpawnedThisWave += squadronData.enemies.length; return; }

                        let spawnDelayBetweenEnemies = CS_ENEMY_SPAWN_DELAY_IN_SQUADRON;
                        if (squadronIndex >= 2 && squadronIndex <= 3) { spawnDelayBetweenEnemies = CS_HORIZONTAL_FLYBY_SPAWN_DELAY; }
                        else if (squadronIndex >= 4) { spawnDelayBetweenEnemies = CS_LOOP_ATTACK_SPAWN_DELAY; }
                        let actualEnemiesScheduledThisSq = 0;

                        squadronData.enemies.forEach((enemyDef, enemyIndex) => {
                            actualEnemiesScheduledThisSq++;
                            if (!enemyDef || !enemyDef.type) { console.error(`CS: Invalid enemy def in squadron ${squadronIndex}, index ${enemyIndex}. Skipping.`); enemiesSpawnedThisWave++; return; }
                            const spawnDelay = enemyIndex * spawnDelayBetweenEnemies;
                            const enemyTimeoutId = setTimeout(() => {
                                const enIdx = enemySpawnTimeouts.indexOf(enemyTimeoutId);
                                if (enIdx > -1) enemySpawnTimeouts.splice(enIdx, 1);

                                if (isPaused || !isInGameState || !isEntrancePhaseActive || !isChallengingStage || isWaveTransitioning || playerLives <= 0) {
                                    enemiesSpawnedThisWave++; return;
                                }
                                try {
                                    let enemyType = enemyDef.type; let enemyHealth = (enemyType === ENEMY3_TYPE) ? ENEMY3_MAX_HITS : 1; let enemyWidth, enemyHeight; if (enemyType === ENEMY1_TYPE) { enemyWidth = ENEMY1_WIDTH; enemyHeight = ENEMY1_HEIGHT; } else if (enemyType === ENEMY3_TYPE) { enemyWidth = BOSS_WIDTH; enemyHeight = BOSS_HEIGHT; } else { enemyWidth = ENEMY_WIDTH; enemyHeight = ENEMY_HEIGHT; } let startX = 0, startY = 0; if (pathSegments[0]?.p0) { startX = pathSegments[0].p0.x; startY = pathSegments[0].p0.y; } else { throw new Error(`Invalid start segment for path ${pathId}`); } if (squadronIndex === 0 || squadronIndex === 1) { startX += CS3_START_SHIFT_X; } const initialPathT_CS = -enemyIndex * PATH_T_OFFSET_PER_ENEMY;
                                    const newEnemy = { x: startX, y: startY, width: enemyWidth, height: enemyHeight, targetGridX: 0, targetGridY: 0, speed: 0, state: 'following_bezier_path', gridRow: -1, gridCol: -1, type: enemyType, health: enemyHealth, isDamaged: false, velocityX: 0, velocityY: 0, attackPathStep: 0, initialY: 0, initialX: 0, diveDirection: 1, lastFiredTime: 0, targetX1: 0, targetY1: 0, targetX2: 0, targetY2: 0, targetX3: 0, targetY3: 0, attackPathSegments: [], attackPathSegmentIndex: 0, attackPathT: 0, attackStartTime: 0, attackFormationOffsetX: 0, attackGroupId: null, entrancePathId: pathId, pathSegmentIndex: 0, pathT: initialPathT_CS, squadronId: squadronIndex, id: `enemy-cs-${squadronIndex}-${enemyIndex}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, justReturned: false, canFireThisDive: false, attackType: 'normal', hasCapturedShip: (enemyType === ENEMY3_TYPE) ? false : undefined, capturedShipX: undefined, capturedShipY: undefined, capturedShipLastFiredTime: (enemyType === ENEMY3_TYPE) ? 0 : undefined, captureStartTime: 0, capturePrepareTimeout: null, pathSpeedMultiplier: currentSpeedMultiplier };
                                    enemies.push(newEnemy);
                                    enemiesSpawnedThisWave++;
                                } catch (spawnError) { console.error(`CS: Error during enemy spawn execution (Sq ${squadronIndex}, Idx ${enemyIndex}, Path ${pathId}):`, spawnError); enemiesSpawnedThisWave++; }
                            }, spawnDelay);
                            enemySpawnTimeouts.push(enemyTimeoutId);
                            totalTimeoutsScheduled++;
                        });
                    } catch (squadronSpawnError) { console.error(`CS: Error setting up spawns for squadron ${squadronIndex}:`, squadronSpawnError); enemiesSpawnedThisWave += squadronData.enemies.length;}
                } else {
                    if(squadronData?.enemies?.length > 0) { enemiesSpawnedThisWave += squadronData.enemies.length; }
                }
            }, startDelay);
            enemySpawnTimeouts.push(squadronStartTimeoutId);
        });
    } else { console.warn("CS: No squadrons generated. Skipping CS sequence."); isWaveTransitioning = true; setTimeout(() => { if ((isInGameState || (!isInGameState && playerLives > 0)) && typeof resetWave === 'function') { resetWave(); } }, NEXT_WAVE_DELAY_AFTER_MESSAGE); }
}


/**
 * Vuur een burst van vijandelijke kogels af, met een GESCHAALD aantal kogels.
 */
function fireEnemyBurst(enemyId, requiredState, initialDelayMs) { /* ... ongewijzigd ... */ if (!enemyId || isPaused || !isInGameState || playerLives <= 0 || isChallengingStage || isWaveTransitioning || isShipCaptured) { return; } const bulletCount = Math.round(scaleValue(level, BASE_ENEMY_BULLET_BURST_COUNT, MAX_ENEMY_BULLET_BURST_COUNT)); for (let i = 0; i < bulletCount; i++) { const totalDelay = initialDelayMs + i * ENTRANCE_FIRE_BURST_DELAY_MS; const burstTimeoutId = setTimeout(() => { try { const fireTimeoutIdx = enemySpawnTimeouts.indexOf(burstTimeoutId); if (fireTimeoutIdx > -1) { enemySpawnTimeouts.splice(fireTimeoutIdx, 1); } if (isPaused || !isInGameState || playerLives <= 0 || isChallengingStage || isWaveTransitioning || isShipCaptured) { return; } const currentEnemy = enemies.find(e => e && e.id === enemyId); if (currentEnemy && currentEnemy.state === requiredState) { if (createBulletSimple(currentEnemy)) { if (i === 0) { playSound(enemyShootSound); } currentEnemy.lastFiredTime = Date.now(); } } } catch (fireError) { console.error(`Error during enemy burst firing (bullet ${i + 1}/${bulletCount}) for ${enemyId}:`, fireError); } }, totalDelay); enemySpawnTimeouts.push(burstTimeoutId); } }

/**
 * Vuur een burst van een VAST aantal vijandelijke kogels af.
 */
function fireFixedEnemyBurst(enemyId, requiredState, initialDelayMs, fixedBulletCount) { /* ... ongewijzigd ... */ if (!enemyId || isPaused || !isInGameState || playerLives <= 0 || isChallengingStage || isWaveTransitioning || isShipCaptured || fixedBulletCount <= 0) { return; } for (let i = 0; i < fixedBulletCount; i++) { const totalDelay = initialDelayMs + i * ENTRANCE_FIRE_BURST_DELAY_MS; const burstTimeoutId = setTimeout(() => { try { const fireTimeoutIdx = enemySpawnTimeouts.indexOf(burstTimeoutId); if (fireTimeoutIdx > -1) { enemySpawnTimeouts.splice(fireTimeoutIdx, 1); } if (isPaused || !isInGameState || playerLives <= 0 || isChallengingStage || isWaveTransitioning || isShipCaptured) { return; } const currentEnemy = enemies.find(e => e && e.id === enemyId); if (currentEnemy) { if (requiredState === null || currentEnemy.state === requiredState) { if (createBulletSimple(currentEnemy)) { if (i === 0) { playSound(enemyShootSound); } currentEnemy.lastFiredTime = Date.now(); } } } } catch (fireError) { console.error(`Error during FIXED enemy burst firing (bullet ${i + 1}/${fixedBulletCount}) for ${enemyId}:`, fireError); } }, totalDelay); enemySpawnTimeouts.push(burstTimeoutId); } }


/**
 * Plaatst alle vijanden direct in de grid voor "Full Grid" waves.
 */
function startFullGridWave() { /* ... ongewijzigd ... */ if (!currentWaveDefinition || currentWaveDefinition.length === 0 || !isFullGridWave) { console.error("Attempted to start Full Grid wave without valid definition or when not in Full Grid mode."); isWaveTransitioning = true; readyForNextWaveReset = true; return; } playSound(entranceSound); enemySpawnTimeouts.forEach(clearTimeout); enemySpawnTimeouts = []; totalEnemiesScheduledForWave = 0; enemiesSpawnedThisWave = 0; squadronCompletionStatus = {}; squadronEntranceFiringStatus = {}; let totalEnemiesPlaced = 0; currentWaveDefinition.forEach((squadronData, squadronIndex) => { let enemiesInSquadron = 0; if (squadronData && squadronData.enemies && Array.isArray(squadronData.enemies)) { enemiesInSquadron = squadronData.enemies.length; squadronData.enemies.forEach((enemyDef, enemyIndex) => { try { if (!enemyDef || !enemyDef.type || typeof enemyDef.gridRow === 'undefined' || typeof enemyDef.gridCol === 'undefined') { console.error(`Full Grid: Invalid enemy def in squadron ${squadronIndex}, index ${enemyIndex}. Skipping.`); return; } let enemyType = enemyDef.type; let enemyHealth = (enemyType === ENEMY3_TYPE) ? ENEMY3_MAX_HITS : 1; let enemyWidth, enemyHeight; if (enemyType === ENEMY1_TYPE) { enemyWidth = ENEMY1_WIDTH; enemyHeight = ENEMY1_HEIGHT; } else if (enemyType === ENEMY3_TYPE) { enemyWidth = BOSS_WIDTH; enemyHeight = BOSS_HEIGHT; } else { enemyWidth = ENEMY_WIDTH; enemyHeight = ENEMY_HEIGHT; } let targetGridX, targetGridY; try { const { x: finalTargetX, y: finalTargetY } = getCurrentGridSlotPosition(enemyDef.gridRow, enemyDef.gridCol, enemyWidth); targetGridX = finalTargetX; targetGridY = finalTargetY; } catch(e) { console.error(`Full Grid: Error getting target grid pos for enemy ${enemyDef.type} at [${enemyDef.gridRow},${enemyDef.gridCol}]`, e); targetGridX = gameCanvas?.width / 2 || 200; targetGridY = ENEMY_TOP_MARGIN + enemyDef.gridRow * (ENEMY_HEIGHT + ENEMY_V_SPACING); } const newEnemy = { x: targetGridX, y: targetGridY, width: enemyWidth, height: enemyHeight, targetGridX: targetGridX, targetGridY: targetGridY, speed: 0, state: 'in_grid', gridRow: enemyDef.gridRow, gridCol: enemyDef.gridCol, type: enemyType, health: enemyHealth, isDamaged: false, velocityX: 0, velocityY: 0, attackPathStep: 0, initialY: 0, initialX: 0, diveDirection: 1, lastFiredTime: 0, targetX1: 0, targetY1: 0, targetX2: 0, targetY2: 0, targetX3: 0, targetY3: 0, attackPathSegments: [], attackPathSegmentIndex: 0, attackPathT: 0, attackStartTime: 0, attackFormationOffsetX: 0, attackGroupId: null, entrancePathId: null, pathSegmentIndex: 0, pathT: 0, squadronId: squadronIndex, squadronEnemyIndex: enemyIndex, id: `enemy-grid-${squadronIndex}-${enemyIndex}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, justReturned: false, canFireThisDive: false, attackType: 'normal', hasCapturedShip: (enemyType === ENEMY3_TYPE) ? false : undefined, capturedShipX: undefined, capturedShipY: undefined, capturedShipLastFiredTime: (enemyType === ENEMY3_TYPE) ? 0 : undefined, captureStartTime: 0, capturePrepareTimeout: null, pathSpeedMultiplier: 1.0 }; enemies.push(newEnemy); totalEnemiesPlaced++; } catch (placementError) { console.error(`Full Grid: Error placing enemy (Sq ${squadronIndex}, Idx ${enemyIndex}):`, placementError); } }); } else { console.warn(`Full Grid: Squadron ${squadronIndex} has invalid enemy data.`); } squadronCompletionStatus[squadronIndex] = { completed: enemiesInSquadron, total: enemiesInSquadron }; }); totalEnemiesScheduledForWave = totalEnemiesPlaced; enemiesSpawnedThisWave = totalEnemiesPlaced; isEntrancePhaseActive = false; gridJustCompleted = true; if (!isGridSoundPlaying) { playSound(gridBackgroundSound, true); } if (GRID_BREATH_ENABLED && !isGridBreathingActive) { isGridBreathingActive = true; gridBreathStartTime = Date.now(); currentGridBreathFactor = 0; } lastGridFireCheckTime = Date.now(); firstEnemyLanded = true; }

// --- EINDE deel 2      van 8 dit codeblok ---
// --- END OF FILE game_logic.js ---









// --- START OF FILE game_logic.js ---
// --- DEEL 3      van 8 dit code blok    --- (<<< REVISE: Use Web Audio API >>>)
// <<< GEWIJZIGD: playSound/stopSound aanroepen gebruiken nu identifiers. >>>
// <<< GEWIJZIGD: Initialiseert nu hasFiredPostLanding in squadron status. >>>
// <<< GEWIJZIGD: playSound(entranceSound) verwijderd uit scheduleEntranceFlightWave. >>>

// Contains: Normal Wave Entrance Scheduling (Updated), Squadron Management (Simplified), Attack Path Generation

/**
 * Schedules the entrance sequence for an ENTRANCE FLIGHT wave dynamically.
 * <<< GEWIJZIGD: Initialiseert nu hasFiredPostLanding in squadron status. >>>
 * <<< GEWIJZIGD: playSound(entranceSound) verwijderd. Intro sequence handelt dit af. >>>
 */
function scheduleEntranceFlightWave() {
    // Extra check aan begin (ongewijzigd)
    if (isFullGridWave || isChallengingStage) {
        console.warn(`[scheduleEntranceFlightWave] Called inappropriately for non-entrance wave type (Level ${level}, isFullGrid: ${isFullGridWave}, isCS: ${isChallengingStage}). Skipping.`);
        isEntrancePhaseActive = false; // Zorg dat entrance fase uit staat
        return;
    }

    if (!currentWaveDefinition || currentWaveDefinition.length === 0) {
        console.warn("Attempted to schedule entrance flight wave without valid definition.");
        isEntrancePhaseActive = false;
        // stopSound(entranceSound); // Niet meer nodig hier?
        isWaveTransitioning = true; readyForNextWaveReset = true;
        return;
    }

    const pathSource = normalWaveEntrancePaths;
    if (Object.keys(pathSource).length === 0) {
        console.error("CRITICAL: Failed to define Normal Wave entrance paths!");
        isEntrancePhaseActive = false;
        // stopSound(entranceSound); // Niet meer nodig hier?
        isWaveTransitioning = true; readyForNextWaveReset = true;
        return;
    }

    enemySpawnTimeouts.forEach(clearTimeout); enemySpawnTimeouts = [];
    totalEnemiesScheduledForWave = 0;
    currentWaveDefinition.forEach(squad => totalEnemiesScheduledForWave += squad.enemies.length);
    enemiesSpawnedThisWave = 0;

    squadronCompletionStatus = {};
    squadronEntranceFiringStatus = {};

    isEntrancePhaseActive = true;
    // playSound(entranceSound); // <<< VERWIJDERD: Intro sequence speelt nu stage sound. >>>

    currentWaveDefinition.forEach((squadronData, squadronIndex) => {
        // <<< GEWIJZIGD: Initialiseer squadronCompletionStatus met hasFiredPostLanding >>>
        squadronCompletionStatus[squadronIndex] = {
             completed: 0,
             total: squadronData.enemies?.length || 0,
             hasFiredPostLanding: false // Nieuwe vlag
         };
         // <<< EINDE WIJZIGING >>>

        const squadronStartDelay = squadronIndex * NORMAL_WAVE_SQUADRON_INTERVAL;

        squadronEntranceFiringStatus[squadronIndex] = {
            hasFired: false,
            scheduledStartTime: 0 // Wordt gezet in scheduleSingleEntranceSquadron
        };

        // Gebruik de (eerder) hernoemde functie
        scheduleSingleEntranceSquadron(squadronData, squadronIndex, squadronStartDelay);
    });
}

/**
 * Functie om te controleren of het volgende squadron gepland moet worden.
 * <<< GEWIJZIGD: Leeggemaakt, niet meer nodig voor planning. Kan evt. later gebruikt worden voor andere logica. >>>
 */
function checkAndScheduleNextSquadron(completedSquadronIndex) {
   // Deze functie is niet meer nodig voor het plannen van squadrons.
}

/**
 * Resets justReturned flag for other grid enemies. (Nu met Set<string> of null)
 * <<< GEWIJZIGD: Parameter type aangepast in commentaar en logica >>>
 * @param {Set<string>|string|null} excludedIds - ID(s) to exclude. Set for multiple, string for single, null for none.
 */
function resetJustReturnedFlags(excludedIds) {
    // <<< Functie ongewijzigd >>>
    enemies.forEach(e => {
        let exclude = false;
        if (excludedIds instanceof Set) {
            exclude = excludedIds.has(e.id);
        } else if (typeof excludedIds === 'string') {
            exclude = (e.id === excludedIds);
        }
        // Reset flag if enemy exists, is in grid, has justReturned=true, AND is NOT excluded
        if (e && e.state === 'in_grid' && e.justReturned && !exclude) {
            e.justReturned = false;
        }
    });
}


/**
 * Genereert de Bezier segmenten voor een aanvalspad (niet voor capture dive).
 * <<< GEWIJZIGD: Voegt een initieel opwaarts segment toe. >>>
 * <<< GEWIJZIGD: SyntaxError in catch block nu correct geplaatst. >>>
 * <<< GEWIJZIGD: Houdt rekening met BOSS_WIDTH/BOSS_HEIGHT voor marges. >>>
 * <<< GEWIJZIGD: Logs verwijderd. >>>
 */
function generateAttackPath(enemy) {
    // <<< Functie inhoud ongewijzigd >>>
    try {
        if (!enemy || !gameCanvas) {
            return [];
        }

        const enemyWidth = (enemy.type === ENEMY3_TYPE) ? BOSS_WIDTH : ((enemy.type === ENEMY1_TYPE) ? ENEMY1_WIDTH : ENEMY_WIDTH);
        const enemyHeight = (enemy.type === ENEMY3_TYPE) ? BOSS_HEIGHT : ((enemy.type === ENEMY1_TYPE) ? ENEMY1_HEIGHT : ENEMY_HEIGHT);
        const margin = enemyWidth * 0.5;

        const canvasW = gameCanvas.width;
        const canvasH = gameCanvas.height;
        let generatedSegments = [];

        const initialP0 = { x: enemy.x, y: enemy.y };
        const upwardArcHeight = Math.min(canvasH * 0.06, enemyHeight * 1.8);
        const upwardArcWidth = Math.min(canvasW * 0.04, enemyWidth * 1.2);
        const diveDirection = (enemy.x + enemyWidth / 2 < canvasW / 2) ? 1 : -1;
        const upwardEndPoint = {
            x: initialP0.x - diveDirection * upwardArcWidth * 0.6,
            y: initialP0.y - upwardArcHeight
        };
        upwardEndPoint.x = Math.max(margin, Math.min(canvasW - margin - enemyWidth, upwardEndPoint.x));
        upwardEndPoint.y = Math.max(margin, upwardEndPoint.y);
        const initialP1 = {
            x: initialP0.x + diveDirection * upwardArcWidth * 0.1,
            y: initialP0.y - upwardArcHeight * 1.4
        };
        const initialP2 = {
            x: upwardEndPoint.x + diveDirection * upwardArcWidth * 0.3,
            y: initialP0.y - upwardArcHeight * 1.5
        };
        const initialUpwardSegment = { p0: initialP0, p1: initialP1, p2: initialP2, p3: upwardEndPoint };
        generatedSegments.push(initialUpwardSegment);

        const startPoint = upwardEndPoint;
        const diveDepthBase = canvasH * 0.45;
        const loopWidthBase = canvasW * 0.22;
        const loopHeightBase = canvasH * 0.28;
        const controlTightnessX = 0.5;
        const controlTightnessY = 0.6;
        const bottomAvoidAttackY = canvasH * 0.85;
        const attackPatternType = Math.floor(Math.random() * 3);
        let diveSegments = [];

        if (attackPatternType === 0) { // Patroon 0
            const diveDepth = diveDepthBase + Math.random() * canvasH * 0.1; const loopWidth = loopWidthBase + Math.random() * canvasW * 0.08; const loopHeight = loopHeightBase + Math.random() * canvasH * 0.08;
            const divePointX = startPoint.x + diveDirection * loopWidth * 0.5; const divePointY = Math.min(bottomAvoidAttackY, startPoint.y + diveDepth);
            const loopTopX = divePointX + diveDirection * loopWidth * 0.5; const loopTopY = Math.max(startPoint.y + 20, divePointY - loopHeight);
            const returnPointX = loopTopX - diveDirection * loopWidth * 0.9; const returnPointY = Math.max(startPoint.y + 40, loopTopY + loopHeight * 0.6);
            const exitPointX = returnPointX - diveDirection * loopWidth * 0.3; const exitPointY = canvasH + enemyHeight * 2;
            const clampedDivePointX = Math.max(margin, Math.min(canvasW - margin - enemyWidth, divePointX));
            const clampedLoopTopX = Math.max(margin, Math.min(canvasW - margin - enemyWidth, loopTopX));
            const clampedReturnPointX = Math.max(margin, Math.min(canvasW - margin - enemyWidth, returnPointX));
            const p1_seg1 = { x: startPoint.x, y: startPoint.y + diveDepth * controlTightnessY * 0.5 };
            const p2_seg1 = { x: clampedDivePointX - diveDirection * loopWidth * controlTightnessX, y: divePointY };
            const seg1_p3 = { x: clampedDivePointX, y: divePointY };
            const p1_seg2 = { x: clampedDivePointX + diveDirection * loopWidth * controlTightnessX, y: divePointY };
            const p2_seg2 = { x: clampedLoopTopX, y: loopTopY + loopHeight * controlTightnessY };
            const seg2_p3 = { x: clampedLoopTopX, y: loopTopY };
            const p1_seg3 = { x: clampedLoopTopX, y: loopTopY - loopHeight * controlTightnessY * 0.5 };
            const p2_seg3 = { x: clampedReturnPointX + diveDirection * loopWidth * controlTightnessX, y: returnPointY };
            const seg3_p3 = { x: clampedReturnPointX, y: returnPointY };
            const p1_seg4 = { x: seg3_p3.x, y: seg3_p3.y + canvasH * 0.1 };
            const p2_seg4 = { x: exitPointX, y: exitPointY - canvasH * 0.2 };
            const seg4_p3 = { x: exitPointX, y: exitPointY };
            diveSegments = [ { p0: startPoint, p1: p1_seg1, p2: p2_seg1, p3: seg1_p3 }, { p0: seg1_p3, p1: p1_seg2, p2: p2_seg2, p3: seg2_p3 }, { p0: seg2_p3, p1: p1_seg3, p2: p2_seg3, p3: seg3_p3 }, { p0: seg3_p3, p1: p1_seg4, p2: p2_seg4, p3: seg4_p3 } ];
        } else if (attackPatternType === 1) { // Patroon 1
            const diveDepth = diveDepthBase * 0.8 + Math.random() * canvasH * 0.1; const curveWidth = loopWidthBase * 1.2 + Math.random() * canvasW * 0.1; const curveHeight = loopHeightBase * 0.7 + Math.random() * canvasH * 0.1;
            const midPoint1X = startPoint.x + diveDirection * curveWidth * 0.4; const midPoint1Y = Math.min(bottomAvoidAttackY - curveHeight*0.5, startPoint.y + diveDepth * 0.6);
            const midPoint2X = midPoint1X + diveDirection * curveWidth * 0.6; const midPoint2Y = Math.min(bottomAvoidAttackY, midPoint1Y + curveHeight);
            const exitPointX = midPoint2X - diveDirection * curveWidth * 0.5; const exitPointY = canvasH + enemyHeight * 2;
            const clampedMid1X = Math.max(margin, Math.min(canvasW - margin - enemyWidth, midPoint1X));
            const clampedMid2X = Math.max(margin, Math.min(canvasW - margin - enemyWidth, midPoint2X));
            const p1_seg1 = { x: startPoint.x - diveDirection * curveWidth * 0.1, y: startPoint.y + diveDepth * 0.3 };
            const p2_seg1 = { x: clampedMid1X - diveDirection * curveWidth * controlTightnessX * 0.8, y: midPoint1Y + curveHeight * controlTightnessY * 0.4 };
            const seg1_p3 = { x: clampedMid1X, y: midPoint1Y };
            const p1_seg2 = { x: clampedMid1X + diveDirection * curveWidth * controlTightnessX * 0.8, y: midPoint1Y - curveHeight * controlTightnessY * 0.4 };
            const p2_seg2 = { x: clampedMid2X + diveDirection * curveWidth * controlTightnessX * 0.6, y: midPoint2Y + curveHeight * controlTightnessY * 0.5 };
            const seg2_p3 = { x: clampedMid2X, y: midPoint2Y };
            const p1_seg3 = { x: clampedMid2X - diveDirection * curveWidth * 0.2, y: midPoint2Y + canvasH * 0.1 };
            const p2_seg3 = { x: exitPointX, y: exitPointY - canvasH * 0.3 };
            const seg3_p3 = { x: exitPointX, y: exitPointY };
            diveSegments = [ { p0: startPoint, p1: p1_seg1, p2: p2_seg1, p3: seg1_p3 }, { p0: seg1_p3, p1: p1_seg2, p2: p2_seg2, p3: seg2_p3 }, { p0: seg2_p3, p1: p1_seg3, p2: p2_seg3, p3: seg3_p3 } ];
        } else { // Patroon 2
            const diveDepth = diveDepthBase * 0.6 + Math.random() * canvasH * 0.05; const loopWidth = loopWidthBase * 0.7 + Math.random() * canvasW * 0.05; const loopHeight = loopHeightBase * 0.6 + Math.random() * canvasH * 0.05; const loopOffsetY = loopHeight * 1.5;
            const loop1TopX = startPoint.x + diveDirection * loopWidth * 0.5; const loop1TopY = Math.min(bottomAvoidAttackY - loopOffsetY, startPoint.y + diveDepth);
            const loop1BottomX = loop1TopX + diveDirection * loopWidth * 0.5; const loop1BottomY = loop1TopY + loopHeight;
            const loop2TopX = loop1BottomX - diveDirection * loopWidth * 0.8; const loop2TopY = Math.min(bottomAvoidAttackY, loop1BottomY + loopOffsetY * 0.7);
            const loop2BottomX = loop2TopX + diveDirection * loopWidth * 0.4; const loop2BottomY = loop2TopY + loopHeight * 0.8;
            const exitPointX = loop2BottomX; const exitPointY = canvasH + enemyHeight * 2;
            const clpL1TX = Math.max(margin, Math.min(canvasW - margin - enemyWidth, loop1TopX));
            const clpL1BX = Math.max(margin, Math.min(canvasW - margin - enemyWidth, loop1BottomX));
            const clpL2TX = Math.max(margin, Math.min(canvasW - margin - enemyWidth, loop2TopX));
            const clpL2BX = Math.max(margin, Math.min(canvasW - margin - enemyWidth, loop2BottomX));
            const p1_L1_1 = { x: startPoint.x, y: startPoint.y + diveDepth*0.5 };
            const p2_L1_1 = { x: clpL1TX - diveDirection * loopWidth * controlTightnessX, y: loop1TopY + loopHeight*controlTightnessY*0.3 };
            const p3_L1_1 = { x: clpL1TX, y: loop1TopY };
            const p1_L1_2 = { x: clpL1TX + diveDirection * loopWidth * controlTightnessX, y: loop1TopY - loopHeight*controlTightnessY*0.3 };
            const p2_L1_2 = { x: clpL1BX + diveDirection * loopWidth * controlTightnessX, y: loop1BottomY + loopHeight*controlTightnessY*0.5 };
            const p3_L1_2 = { x: clpL1BX, y: loop1BottomY };
            const p1_L2_1 = { x: clpL1BX - diveDirection * loopWidth * controlTightnessX, y: loop1BottomY - loopHeight*controlTightnessY*0.5 };
            const p2_L2_1 = { x: clpL2TX - diveDirection * loopWidth * controlTightnessX, y: loop2TopY + loopHeight*controlTightnessY*0.4 };
            const p3_L2_1 = { x: clpL2TX, y: loop2TopY };
            const p1_L2_2 = { x: clpL2TX + diveDirection * loopWidth * controlTightnessX, y: loop2TopY - loopHeight*controlTightnessY*0.4 };
            const p2_L2_2 = { x: clpL2BX + diveDirection * loopWidth * controlTightnessX, y: loop2BottomY + loopHeight*controlTightnessY*0.6 };
            const p3_L2_2 = { x: clpL2BX, y: loop2BottomY };
            const p1_EXIT = { x: clpL2BX - diveDirection*loopWidth*0.1, y: loop2BottomY + canvasH*0.05 };
            const p2_EXIT = { x: exitPointX, y: exitPointY - canvasH*0.2 };
            const p3_EXIT = { x: exitPointX, y: exitPointY };
            diveSegments = [ {p0: startPoint, p1: p1_L1_1, p2: p2_L1_1, p3: p3_L1_1}, {p0: p3_L1_1, p1: p1_L1_2, p2: p2_L1_2, p3: p3_L1_2}, {p0: p3_L1_2, p1: p1_L2_1, p2: p2_L2_1, p3: p3_L2_1}, {p0: p3_L2_1, p1: p1_L2_2, p2: p2_L2_2, p3: p3_L2_2}, {p0: p3_L2_2, p1: p1_EXIT, p2: p2_EXIT, p3: p3_EXIT}, ];
        }
        generatedSegments.push(...diveSegments);
        return generatedSegments;

    } catch (e) {
         console.error(`[DEBUG] Error generating attack path for enemy ${enemy?.id}:`, e);
         return [];
    }
} // <<< Functie generateAttackPath EINDE >>>


// --- EINDE deel 3      van 8 dit codeblok ---
// --- END OF FILE game_logic.js ---









// --- START OF FILE game_logic.js ---
// --- DEEL 4      van 8 dit code blok    --- (<<< REVISE: Stop Grid Sound Immediately on Last Kill >>>)
// <<< GEWIJZIGD: stopSound(gridBackgroundSound) wordt nu ook aangeroepen in handleEnemyHit als de laatste vijand wordt vernietigd. >>>

/** Contains: Entity Movement & Collision Detection */

/**
 * Verwerkt de gevolgen van een vijand die geraakt wordt door een spelerkogel.
 * <<< GEWIJZIGD: Stopt grid sound direct bij vernietigen laatste vijand. >>>
 */
function handleEnemyHit(enemy) {
    if (!enemy) return { destroyed: false, pointsAwarded: 0 };
    const now = Date.now();
    let points = 0; let destroyed = false; let wasBossDamagedBeforeHit = enemy.isDamaged; let playHitSoundIdentifier = null;
    const enemyWidthForCalc = (enemy.type === ENEMY3_TYPE) ? BOSS_WIDTH : ((enemy.type === ENEMY1_TYPE) ? ENEMY1_WIDTH : ENEMY_WIDTH);
    const enemyHeightForCalc = (enemy.type === ENEMY3_TYPE) ? BOSS_HEIGHT : ((enemy.type === ENEMY1_TYPE) ? ENEMY1_HEIGHT : ENEMY_HEIGHT);
    const bossHadCapturedShipInitially = enemy.type === ENEMY3_TYPE && enemy.hasCapturedShip;
    const bossHadDimensionsInitially = enemy.type === ENEMY3_TYPE && enemy.capturedShipDimensions;
    const sparkX = enemy.x + enemyWidthForCalc / 2; const sparkY = enemy.y + enemyHeightForCalc * 0.2;
    createHitSparks(sparkX, sparkY);
    enemy.health--;
    if (enemy.type === ENEMY3_TYPE) { enemy.isDamaged = (enemy.health < ENEMY3_MAX_HITS); }

    if (enemy.health <= 0) { // Vijand vernietigd
        destroyed = true;
        if (bossHadCapturedShipInitially && bossHadDimensionsInitially) { /* ... falling ship logic ... */ if (enemy.capturedShipDimensions) { const capturedW = enemy.capturedShipDimensions.width; const capturedH = enemy.capturedShipDimensions.height; const fallingShipX = enemy.x + (enemyWidthForCalc - capturedW) / 2 + CAPTURED_SHIP_OFFSET_X; const fallingShipY = enemy.y + CAPTURED_SHIP_OFFSET_Y; const alreadyFalling = fallingShips.some(fs => Math.abs(fs.x - fallingShipX) < 1 && Math.abs(fs.y - fallingShipY) < 1); if (!alreadyFalling) { fallingShips.push({ x: fallingShipX, y: fallingShipY, width: capturedW, height: capturedH, creationTime: now, tintProgress: 1.0, rotation: 0 }); } } else { console.error("[handleEnemyHit] CRITICAL: Boss destroyed, had ship initially but dimensions missing!"); } enemy.hasCapturedShip = false; enemy.capturedShipDimensions = null; } else if (bossHadCapturedShipInitially && !bossHadDimensionsInitially) { console.error(`[handleEnemyHit] CRITICAL: Boss ${enemy.id} destroyed, had ship initially but dimensions missing! Resetting state anyway.`); enemy.hasCapturedShip = false; enemy.capturedShipDimensions = null; }

        if (isChallengingStage) { /* ... CS score logic ... */ let baseScore = 100; const previousLastHitTime = csLastHitTime; csLastHitTime = now; csLastChainHitPosition = { x: enemy.x, y: enemy.y }; if (csCurrentChainHits > 0 && (now - previousLastHitTime < CS_CHAIN_BREAK_TIME_MS)) { csCurrentChainHits++; } else { csCurrentChainHits = 1; csCurrentChainScore = 0; } if (csCurrentChainHits >= CS_CHAIN_SCORE_THRESHOLD) { baseScore *= 2; } points = baseScore; csCurrentChainScore += points; scoreEarnedThisCS += points; challengingStageEnemiesHit++; playHitSoundIdentifier = explosionSound; }
        else { // Normale wave score
            if (enemy.state === 'in_grid') { points = (enemy.type === ENEMY1_TYPE) ? 50 : (enemy.type === ENEMY2_TYPE ? 80 : 0); if (enemy.type === ENEMY3_TYPE) { points = 150; } playHitSoundIdentifier = explosionSound; }
            else { points = (enemy.type === ENEMY1_TYPE) ? 100 : (enemy.type === ENEMY2_TYPE ? 160 : 0); if (enemy.type === ENEMY3_TYPE) { if (bossHadCapturedShipInitially) { const rescueBonusOptions = [1000, 1500, 2000, 3000]; points = rescueBonusOptions[Math.floor(Math.random() * rescueBonusOptions.length)]; playHitSoundIdentifier = bossHit2Sound; }
                else if (wasBossDamagedBeforeHit) { points = 400; playHitSoundIdentifier = bossHit2Sound; }
                else { points = 0; playHitSoundIdentifier = explosionSound; } }
                else { playHitSoundIdentifier = explosionSound; }
                if (destroyed && points > 0) { const previousNormalLastHitTime = normalWaveLastHitTime; normalWaveLastHitTime = now; normalWaveLastChainHitPosition = { x: enemy.x, y: enemy.y }; if (normalWaveLastChainHitPosition && (now - previousNormalLastHitTime < NORMAL_WAVE_CHAIN_BREAK_TIME_MS)) { normalWaveCurrentChainHits++; } else { normalWaveCurrentChainHits = 1; normalWaveCurrentChainScore = 0; } if (NORMAL_WAVE_CHAIN_BONUS_ENABLED && normalWaveCurrentChainHits >= NORMAL_WAVE_CHAIN_SCORE_THRESHOLD) { const chainBonusOptions = [300, 600, 1000, 1500, 2000, 3000]; const bonusIndex = Math.min(chainBonusOptions.length - 1, normalWaveCurrentChainHits - NORMAL_WAVE_CHAIN_SCORE_THRESHOLD); const chainBonus = chainBonusOptions[bonusIndex]; points += chainBonus; normalWaveCurrentChainScore += chainBonus; } } }
        }

        if (points > 0) {
             const previousScore = score;
             score += points;
             if (!isManualControl || currentPlayer === 1 || !isTwoPlayerMode) { player1Score = score; if (destroyed) player1EnemiesHit++; }
             else { player2Score = score; if (destroyed) player2EnemiesHit++; }
             const crossedHighScore = score >= highScore && previousScore < highScore;
             highScore = Math.max(highScore, score);
             let flagToCheck = false; let setFlagFunction = null;
             if (!isManualControl) { flagToCheck = player1TriggeredHighScoreSound; setFlagFunction = () => { player1TriggeredHighScoreSound = true; };}
             else if (isTwoPlayerMode) { if (currentPlayer === 1) { flagToCheck = player1TriggeredHighScoreSound; setFlagFunction = () => { player1TriggeredHighScoreSound = true; };} else { flagToCheck = player2TriggeredHighScoreSound; setFlagFunction = () => { player2TriggeredHighScoreSound = true; };} }
             else { flagToCheck = player1TriggeredHighScoreSound; setFlagFunction = () => { player1TriggeredHighScoreSound = true; };}
             if (crossedHighScore && !flagToCheck) {
                  if (setFlagFunction) setFlagFunction();
                  playSound(hiScoreSound);
             }
            checkAndAwardExtraLife();
            const scoreColor = (enemy.state === 'in_grid' || isChallengingStage) ? FLOATING_SCORE_COLOR_GRID : FLOATING_SCORE_COLOR_ACTIVE;
            floatingScores.push({ text: points.toString(), x: enemy.x + enemyWidthForCalc / 2, y: enemy.y, color: scoreColor, creationTime: now, displayStartTime: now + FLOATING_SCORE_APPEAR_DELAY });
        }

        createExplosion(enemy.x + enemyWidthForCalc / 2, enemy.y + enemyHeightForCalc / 2);
        if (enemy.id === capturingBossId) { stopSound(captureSound); }
        if (enemy.state === 'attacking' || enemy.state === 'following_entrance_path' || enemy.state === 'diving_to_capture_position' || enemy.state === 'following_bezier_path' || enemy.state === 'returning' || enemy.state === 'showing_capture_message') {
            if (enemy.type === ENEMY3_TYPE) stopSound(bossGalagaDiveSound);
            else stopSound(butterflyDiveSound);
        }

        // <<< NIEUWE CHECK: Stop grid geluid als dit de LAATSTE vijand was >>>
        // Controleer hoeveel vijanden er ZIJN (vóórdat deze mogelijk verwijderd wordt in de volgende loop).
        // Als er maar 1 vijand is (degene die nu geraakt is), stop dan het geluid.
        if (enemies.length === 1 && enemies[0].id === enemy.id && isGridSoundPlaying) {
            stopSound(gridBackgroundSound);
            // isGridSoundPlaying wordt false gezet binnen stopSound()
        }
        // <<< EINDE NIEUWE CHECK >>>

    } else { // Vijand alleen beschadigd (Boss)
        destroyed = false;
        if (enemy.type === ENEMY3_TYPE) { playHitSoundIdentifier = bossHit1Sound; points = 0; }
        else { points = 0; }
    }

    if (playHitSoundIdentifier) {
        playSound(playHitSoundIdentifier);
    }
    return { destroyed: destroyed, pointsAwarded: points };
}


/** Helper functie om hit spark particles te genereren */
function createHitSparks(x, y) { /* ... ongewijzigd ... */ if (!gameCtx) return; const now = Date.now(); for (let i = 0; i < HIT_SPARK_COUNT; i++) { const angle = Math.random() * Math.PI * 2; const speed = HIT_SPARK_SPEED * (0.7 + Math.random() * 0.6); const lifetime = HIT_SPARK_LIFETIME * (0.8 + Math.random() * 0.4); hitSparks.push({ x: x, y: y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, creationTime: now, lifetime: lifetime, size: HIT_SPARK_SIZE, color: HIT_SPARK_COLOR }); } }


/** Update functie voor hit spark particles */
function updateHitSparks() { /* ... ongewijzigd ... */ const now = Date.now(); for (let i = hitSparks.length - 1; i >= 0; i--) { const s = hitSparks[i]; const elapsedTime = now - s.creationTime; if (elapsedTime >= s.lifetime) { hitSparks.splice(i, 1); } else { s.vy += HIT_SPARK_GRAVITY; s.x += s.vx; s.y += s.vy; s.alpha = Math.max(0, 1.0 - (elapsedTime / s.lifetime)); } } }


function moveEntities() { /* ... ongewijzigd tov vorige versie ... */ if (isPaused) return; try { if (ship && isInGameState && playerLives > 0 && gameOverSequenceStartTime === 0 && !isShowingPlayerGameOverMessage && !isWaitingForRespawn) { let effectiveShipWidth = ship.width; if (isDualShipActive) { effectiveShipWidth += DUAL_SHIP_OFFSET_X; } let targetX = ship.x; if (isManualControl) { let moveLeftActive = false; let moveRightActive = false; if (currentPlayer === 1 || !isTwoPlayerMode) { moveLeftActive = leftPressed; moveRightActive = rightPressed; } else { moveLeftActive = p2LeftPressed; moveRightActive = p2RightPressed; } if (moveLeftActive && ship.x > 0) { targetX = ship.x - ship.speed; } else if (moveRightActive && ship.x < gameCanvas.width - effectiveShipWidth) { targetX = ship.x + ship.speed; } ship.x = Math.max(0, Math.min(gameCanvas.width - effectiveShipWidth, targetX)); ship.targetX = ship.x; } else { if (typeof smoothedShipX !== 'undefined') { const AI_MOVEMENT_DEADZONE_MOVE = 0.1; const AI_POSITION_MOVE_SPEED_FACTOR_MOVE = 1.2; smoothedShipX += (ship.targetX - smoothedShipX) * AI_SMOOTHING_FACTOR_MOVE; const deltaX = smoothedShipX - ship.x; const maxSpeed = ship.speed * AI_POSITION_MOVE_SPEED_FACTOR_MOVE; let actualMoveX = 0; if (Math.abs(deltaX) > AI_MOVEMENT_DEADZONE_MOVE) { const currentMoveFraction = isChallengingStage ? CS_AI_MOVE_FRACTION : NORMAL_MOVE_FRACTION; actualMoveX = deltaX * currentMoveFraction; actualMoveX = Math.max(-maxSpeed, Math.min(maxSpeed, actualMoveX)); if (Math.abs(actualMoveX) > Math.abs(deltaX)) { actualMoveX = deltaX; } ship.x += actualMoveX; ship.x = Math.max(0, Math.min(gameCanvas.width - effectiveShipWidth, ship.x)); } } else { ship.x = Math.max(0, Math.min(gameCanvas.width - effectiveShipWidth, ship.targetX)); } } } const now = Date.now(); for (let i = bullets.length - 1; i >= 0; i--) { const b = bullets[i]; if (b) { b.y -= b.speed; if (b.y + PLAYER_BULLET_HEIGHT < 0) { bullets.splice(i, 1); } } else { bullets.splice(i, 1); } } for (let i = enemyBullets.length - 1; i >= 0; i--) { const eb = enemyBullets[i]; if (!eb) { enemyBullets.splice(i, 1); continue; } eb.x += eb.vx; eb.y += eb.vy; if (eb.y > gameCanvas.height || eb.y < -ENEMY_BULLET_HEIGHT || eb.x < -ENEMY_BULLET_WIDTH || eb.x > gameCanvas.width) { enemyBullets.splice(i, 1); } } for (let i = fallingShips.length - 1; i >= 0; i--) { const fs = fallingShips[i]; if (!fs) { fallingShips.splice(i, 1); continue; } fs.y += FALLING_SHIP_SPEED; const elapsedFallingTime = now - fs.creationTime; if (typeof fs.tintProgress === 'number') { fs.tintProgress = Math.max(0, 1.0 - (elapsedFallingTime / FALLING_SHIP_FADE_DURATION_MS)); } else { fs.tintProgress = 0; } if (typeof fs.rotation === 'number') { const rotationProgress = Math.min(1.0, elapsedFallingTime / FALLING_SHIP_ROTATION_DURATION_MS); fs.rotation = rotationProgress * 2 * (2 * Math.PI); } else { fs.rotation = 0; } if (ship && !isDualShipActive && !isShipCaptured && !isWaitingForRespawn && fs.y + fs.height >= gameCanvas.height - AUTO_DOCK_THRESHOLD) { fallingShips.splice(i, 1); isDualShipActive = true; if (currentPlayer === 1) { player1IsDualShipActive = true; } else { player2IsDualShipActive = true; } playSound(dualShipSound); continue; } if (fs.y > gameCanvas.height + fs.height) { fallingShips.splice(i, 1); } } let gridHorizontalShift = 0; const gridEnemiesPresent = enemies.some(e => e?.state === 'in_grid'); const gridShouldBeMoving = !isChallengingStage && !isWaveTransitioning && gridEnemiesPresent && !isShowingPlayerGameOverMessage; if (gridShouldBeMoving) { if (!isGridSoundPlaying) { playSound(gridBackgroundSound, true); } const gridEnemiesList = enemies.filter(e => e?.state === 'in_grid'); if (gridEnemiesList.length > 0) { let minX = gameCanvas.width, maxX = 0; gridEnemiesList.forEach(enemy => { if (enemy) { minX = Math.min(minX, enemy.x); maxX = Math.max(maxX, enemy.x + enemy.width); } }); const leftBoundary = gameCanvas.width * GRID_HORIZONTAL_MARGIN_PERCENT; const rightBoundary = gameCanvas.width * (1 - GRID_HORIZONTAL_MARGIN_PERCENT); if (gridMoveDirection === 1 && maxX >= rightBoundary) { gridMoveDirection = -1; } else if (gridMoveDirection === -1 && minX <= leftBoundary) { gridMoveDirection = 1; } const effectiveGridMoveSpeed = scaleValue(level, BASE_GRID_MOVE_SPEED, MAX_GRID_MOVE_SPEED); gridHorizontalShift = effectiveGridMoveSpeed * gridMoveDirection; currentGridOffsetX += gridHorizontalShift; enemies.forEach(e_loop => { if (e_loop && (e_loop.state === 'returning' || e_loop.state === 'in_grid' || e_loop.state === 'moving_to_grid')) { try { const enemyWidthForGrid = (e_loop.type === ENEMY3_TYPE) ? BOSS_WIDTH : ((e_loop.type === ENEMY1_TYPE) ? ENEMY1_WIDTH : ENEMY_WIDTH); const { x: newTargetX, y: newTargetY } = getCurrentGridSlotPosition(e_loop.gridRow, e_loop.gridCol, enemyWidthForGrid); e_loop.targetGridX = newTargetX; e_loop.targetGridY = newTargetY; } catch (gridPosError) { console.error(`Error updating target grid pos for enemy ${e_loop?.id} (state: ${e_loop?.state}) during shift:`, gridPosError); } } }); } } else { if (isGridSoundPlaying) { stopSound(gridBackgroundSound); } gridHorizontalShift = 0; } for (let i = enemies.length - 1; i >= 0; i--) { let enemy = enemies[i]; if (!enemy) { continue; } const enemyId = enemy.id; if (enemy.capturePrepareTimeout && enemy.state !== 'preparing_capture') { clearTimeout(enemy.capturePrepareTimeout); const timeoutIndex = enemySpawnTimeouts.indexOf(enemy.capturePrepareTimeout); if (timeoutIndex > -1) enemySpawnTimeouts.splice(timeoutIndex, 1); enemy.capturePrepareTimeout = null; } const currentEnemyWidthCorrected = (enemy.type === ENEMY3_TYPE) ? BOSS_WIDTH : ((enemy.type === ENEMY1_TYPE) ? ENEMY1_WIDTH : ENEMY_WIDTH); const currentEnemyHeightCorrected = (enemy.type === ENEMY3_TYPE) ? BOSS_HEIGHT : ((enemy.type === ENEMY1_TYPE) ? ENEMY1_HEIGHT : ENEMY_HEIGHT); switch (enemy.state) { case 'following_bezier_path': { /* ... */ break; } case 'following_entrance_path': { /* ... */ break; } case 'moving_to_grid': { /* ... */ break; } case 'in_grid': { /* ... */ break; } case 'preparing_attack': { /* ... */ break; } case 'preparing_capture': { /* ... */ break; } case 'diving_to_capture_position': { /* ... */ break; } case 'capturing': { /* ... */ break; } case 'showing_capture_message': { /* ... */ break; } case 'attacking': { /* ... */ break; } case 'returning': { /* ... */ break; } } if (enemy && !isShowingPlayerGameOverMessage && !(isShipCaptured && enemy.state === 'capturing')) { const bulletRect = { x: 0, y: 0, width: PLAYER_BULLET_WIDTH, height: PLAYER_BULLET_HEIGHT }; const enemyRectCollisionCheck = { x: enemy.x, y: enemy.y, width: currentEnemyWidthCorrected, height: currentEnemyHeightCorrected }; for (let j = bullets.length - 1; j >= 0; j--) { const b = bullets[j]; if (!b) continue; bulletRect.x = b.x; bulletRect.y = b.y; if (checkCollision(bulletRect, enemyRectCollisionCheck)) { const hitResult = handleEnemyHit(enemy); bullets.splice(j, 1); if (hitResult.destroyed) { enemies.splice(i, 1); enemy = null; break; } } } } if (enemy && ship && !isShipCaptured && !isWaitingForRespawn && !isShowingPlayerGameOverMessage && !isInvincible) { const collisionCausingStates = ['attacking', 'following_entrance_path', 'following_bezier_path', 'diving_to_capture_position']; if (collisionCausingStates.includes(enemy.state)) { const enemyRect = { x: enemy.x, y: enemy.y, width: currentEnemyWidthCorrected, height: currentEnemyHeightCorrected }; const shipRect = { x: ship.x, y: ship.y, width: ship.width, height: ship.height }; const dualShipRect = isDualShipActive ? { x: ship.x + DUAL_SHIP_OFFSET_X, y: ship.y, width: ship.width, height: ship.height } : null; let collisionOccurred = false; let hitDualShip = false; if (checkCollision(enemyRect, shipRect)) { collisionOccurred = true; hitDualShip = false; } else if (dualShipRect && checkCollision(enemyRect, dualShipRect)) { collisionOccurred = true; hitDualShip = true; } if (collisionOccurred) { createExplosion(enemy.x + currentEnemyWidthCorrected / 2, enemy.y + currentEnemyHeightCorrected / 2); playSound(lostLifeSound); enemies.splice(i, 1); enemy = null; if (isDualShipActive) { isDualShipActive = false; if (currentPlayer === 1) player1IsDualShipActive = false; else player2IsDualShipActive = false; if (hitDualShip) { createExplosion(dualShipRect.x + ship.width / 2, dualShipRect.y + ship.height / 2); } else { createExplosion(shipRect.x + ship.width / 2, shipRect.y + ship.height / 2); } isInvincible = true; invincibilityEndTime = now + INVINCIBILITY_DURATION_MS; } else { playerLives--; csCurrentChainHits = 0; csCurrentChainScore = 0; csLastHitTime = 0; csLastChainHitPosition = null; normalWaveCurrentChainHits = 0; normalWaveCurrentChainScore = 0; normalWaveLastHitTime = 0; normalWaveLastChainHitPosition = null; leftPressed = false; rightPressed = false; shootPressed = false; p2LeftPressed = false; p2RightPressed = false; p2ShootPressed = false; p1JustFiredSingle = false; p2JustFiredSingle = false; p1FireInputWasDown = false; p2FireInputWasDown = false; fallingShips = []; isInvincible = true; invincibilityEndTime = now + INVINCIBILITY_DURATION_MS; if (ship && gameCanvas) { ship.y = gameCanvas.height - SHIP_HEIGHT - SHIP_BOTTOM_MARGIN; if (!isManualControl) { aiNeedsStabilization = true; } } else { console.error("Cannot reposition ship Y - ship or canvas not ready."); } if (playerLives <= 0) { const playerWhoDied = currentPlayer; if (playerWhoDied === 1) player1Lives = 0; if (playerWhoDied === 2) player2Lives = 0; if (isTwoPlayerMode) { isShowingPlayerGameOverMessage = true; playerGameOverMessageStartTime = now; playerWhoIsGameOver = playerWhoDied; const nextPlayer = (playerWhoDied === 1) ? 2 : 1; const nextPlayerLives = (nextPlayer === 1) ? player1Lives : player2Lives; if (nextPlayerLives > 0) { nextActionAfterPlayerGameOver = 'switch_player'; } else { nextActionAfterPlayerGameOver = 'show_results'; } bullets = []; enemyBullets = []; explosions = []; playSound(gameOverSound); } else { triggerFinalGameOverSequence(); } break; } else { if (isTwoPlayerMode) { if (currentPlayer === 1) player1Lives = playerLives; else player2Lives = playerLives; } break; } } continue; } } } } if (ship && !isShowingPlayerGameOverMessage && !isShipCaptured && !isWaitingForRespawn && !isInvincible) { const shipRect = { x: ship.x, y: ship.y, width: ship.width, height: ship.height }; const dualShipRect = isDualShipActive ? { x: ship.x + DUAL_SHIP_OFFSET_X, y: ship.y, width: ship.width, height: ship.height } : null; for (let i = enemyBullets.length - 1; i >= 0; i--) { const eb = enemyBullets[i]; if (!eb) { enemyBullets.splice(i, 1); continue; } const bulletRect = { x: eb.x, y: eb.y, width: eb.width, height: eb.height }; let collisionOccurred = checkCollision(shipRect, bulletRect); let hitShipIndex = 0; if (!collisionOccurred && dualShipRect && checkCollision(dualShipRect, bulletRect)) { collisionOccurred = true; hitShipIndex = 1; } if (collisionOccurred) { enemyBullets.splice(i, 1); if (isDualShipActive) { isDualShipActive = false; if (currentPlayer === 1) player1IsDualShipActive = false; else player2IsDualShipActive = false; if (hitShipIndex === 1) { createExplosion(dualShipRect.x + ship.width / 2, dualShipRect.y + ship.height / 2); } else { createExplosion(shipRect.x + ship.width / 2, shipRect.y + ship.height / 2); } playSound(lostLifeSound); isInvincible = true; invincibilityEndTime = now + INVINCIBILITY_DURATION_MS; } else { playerLives--; playSound(lostLifeSound); createExplosion(ship.x + ship.width / 2, ship.y + ship.height / 2); csCurrentChainHits = 0; csCurrentChainScore = 0; csLastHitTime = 0; csLastChainHitPosition = null; normalWaveCurrentChainHits = 0; normalWaveCurrentChainScore = 0; normalWaveLastHitTime = 0; normalWaveLastChainHitPosition = null; leftPressed = false; rightPressed = false; shootPressed = false; p2LeftPressed = false; p2RightPressed = false; p2ShootPressed = false; p1JustFiredSingle = false; p2JustFiredSingle = false; p1FireInputWasDown = false; p2FireInputWasDown = false; fallingShips = []; isInvincible = true; invincibilityEndTime = now + INVINCIBILITY_DURATION_MS; if (ship && gameCanvas) { ship.y = gameCanvas.height - SHIP_HEIGHT - SHIP_BOTTOM_MARGIN; if (!isManualControl) { aiNeedsStabilization = true; } } else { console.error("Cannot reposition ship Y - ship or canvas not ready."); } if (playerLives <= 0) { const playerWhoDied = currentPlayer; if (playerWhoDied === 1) player1Lives = 0; if (playerWhoDied === 2) player2Lives = 0; if (isTwoPlayerMode) { isShowingPlayerGameOverMessage = true; playerGameOverMessageStartTime = now; playerWhoIsGameOver = playerWhoDied; const nextPlayer = (playerWhoDied === 1) ? 2 : 1; const nextPlayerLives = (nextPlayer === 1) ? player1Lives : player2Lives; if (nextPlayerLives > 0) { nextActionAfterPlayerGameOver = 'switch_player'; } else { nextActionAfterPlayerGameOver = 'show_results'; } bullets = []; enemyBullets = []; explosions = []; playSound(gameOverSound); } else { triggerFinalGameOverSequence(); } break; } else { if (isTwoPlayerMode) { if (currentPlayer === 1) player1Lives = playerLives; else player2Lives = playerLives; } break; } } } } } if (ship && !isShipCaptured && !isWaitingForRespawn && !isDualShipActive && fallingShips.length > 0 && !isInvincible) { const shipRect = { x: ship.x, y: ship.y, width: ship.width, height: ship.height }; for (let i = fallingShips.length - 1; i >= 0; i--) { const fs = fallingShips[i]; if (!fs) continue; const fallingRect = { x: fs.x, y: fs.y, width: fs.width, height: fs.height }; if (checkCollision(shipRect, fallingRect)) { fallingShips.splice(i, 1); isDualShipActive = true; if (currentPlayer === 1) player1IsDualShipActive = true; else player2IsDualShipActive = true; playSound(dualShipSound); break; } } } updateHitSparks(); } catch (e) { console.error("FATAL Error in moveEntities:", e, e.stack); isGridSoundPlaying = false; stopSound(gridBackgroundSound); isEntrancePhaseActive = false; stopSound(entranceSound); isShowingPlayerGameOverMessage = false; playerGameOverMessageStartTime = 0; playerWhoIsGameOver = 0; nextActionAfterPlayerGameOver = ''; isShipCaptured = false; captureBeamActive = false; capturingBossId = null; stopSound(captureSound); stopSound(shipCapturedSound); isWaitingForRespawn = false; fallingShips = []; isDualShipActive = false; player1IsDualShipActive = false; player2IsDualShipActive = false; isInvincible = false; invincibilityEndTime = 0; hitSparks = []; if(typeof showMenuState === 'function') showMenuState(); if (mainLoopId) cancelAnimationFrame(mainLoopId); mainLoopId = null; alert("Critical error during entity movement/collision. Returning to menu."); }
} // <<< Einde moveEntities >>>

/**
 * Switches the current player in a 2-player game.
 */
function switchPlayerTurn() { /* ... ongewijzigd tov vorige iteratie ... */ if (!isTwoPlayerMode) return false; stopSound(hiScoreSound); highScore = Math.max(highScore, score); if (currentPlayer === 1) { player1Score = score; player1IsDualShipActive = isDualShipActive; } else { player2Score = score; player2IsDualShipActive = isDualShipActive; } const nextPlayer = (currentPlayer === 1) ? 2 : 1; const nextPlayerLives = (nextPlayer === 1) ? player1Lives : player2Lives; if (nextPlayerLives <= 0) { const currentSpelersLives = (currentPlayer === 1) ? player1Lives : player2Lives; if (currentSpelersLives <= 0) { triggerFinalGameOverSequence(); return false; } else { forceCenterShipNextReset = false; return false; } } currentPlayer = nextPlayer; score = (currentPlayer === 1) ? player1Score : player2Score; playerLives = (currentPlayer === 1) ? player1Lives : player2Lives; isDualShipActive = (currentPlayer === 1) ? player1IsDualShipActive : player2IsDualShipActive; forceCenterShipNextReset = true; scoreEarnedThisCS = 0; csCurrentChainHits = 0; csCurrentChainScore = 0; csLastHitTime = 0; csLastChainHitPosition = null; normalWaveCurrentChainHits = 0; normalWaveCurrentChainScore = 0; normalWaveLastHitTime = 0; normalWaveLastChainHitPosition = null; leftPressed = false; rightPressed = false; shootPressed = false; p2LeftPressed = false; p2RightPressed = false; p2ShootPressed = false; keyboardP1LeftDown = false; keyboardP1RightDown = false; keyboardP1ShootDown = false; keyboardP2LeftDown = false; keyboardP2RightDown = false; keyboardP2ShootDown = false; p1JustFiredSingle = false; p2JustFiredSingle = false; p1FireInputWasDown = false; p2FireInputWasDown = false; isShipCaptured = false; captureBeamActive = false; capturingBossId = null; isWaitingForRespawn = false; respawnTime = 0; isInvincible = false; invincibilityEndTime = 0; fallingShips = []; hitSparks = []; showExtraLifeMessage = false; extraLifeMessageStartTime = 0; return true; }


/**
 * Triggers firing from grid enemies based on level and timing.
 */
function triggerGridFiring() { /* ... ongewijzigd tov vorige iteratie ... */ if (isPaused || !isInGameState || playerLives <= 0 || isChallengingStage || isWaveTransitioning || isShipCaptured) { return; } const gridEnemies = enemies.filter(e => e && e.state === 'in_grid'); if (gridEnemies.length === 0) { return; } const now = Date.now(); const effectiveFireInterval = scaleValue(level, BASE_GRID_FIRE_INTERVAL, MIN_GRID_FIRE_INTERVAL); if (now - lastGridFireCheckTime < effectiveFireInterval) { return; } lastGridFireCheckTime = now; const fireProbability = scaleValue(level, BASE_GRID_FIRE_PROBABILITY, MAX_GRID_FIRE_PROBABILITY); const maxFiringEnemies = Math.round(scaleValue(level, BASE_GRID_MAX_FIRING_ENEMIES, MAX_GRID_MAX_FIRING_ENEMIES)); let firingCount = 0; gridEnemies.sort(() => Math.random() - 0.5); for (const enemy of gridEnemies) { if (firingCount >= maxFiringEnemies) { break; } if (enemy.type === ENEMY2_TYPE || enemy.type === ENEMY3_TYPE) { if (enemy.type === ENEMY3_TYPE && enemy.hasCapturedShip) { continue; } if (Math.random() < fireProbability) { if (createBulletSimple(enemy)) { playSound(enemyShootSound); enemy.lastFiredTime = now; firingCount++; } } } } }

// --- EINDE deel 4      van 8 dit codeblok ---










// --- START OF FILE game_logic.js ---
// --- DEEL 5      van 8 dit code blok    --- (<<< REVISE: Allow Continuous Touch Firing While Dragging >>>)
// <<< GEWIJZIGD: playSound() gebruikt identifier. >>>
// <<< GEWIJZIGD: handlePlayerInput negeert nu keyboard/gamepad input als isTouching true is. >>>
// <<< GEWIJZIGD: handlePlayerInput verwerkt nu isTouchFiringActive voor continu touch vuur. >>>
// <<< GEWIJZIGD: Keyboard/gamepad input wordt NU NIET meer genegeerd door isTouching, maar door isTouchFiringActive. >>>
// <<< GEWIJZIGD: Logica aangepast zodat touch fire prioriteit heeft, maar wasDown flags correct worden bijgehouden. >>>

// Contains: Player Bullet Firing, Player Input Handling, AI Ship Control

/**
 * Fires a player bullet if game state permits.
 * <<< GEWIJZIGD: Gebruikt playSound() met identifier. >>>
 */
function firePlayerBullet(forceShoot = false) {
    // <<< Functie ongewijzigd tov vorige revisie (bevat al cooldown) >>>
    let shootingPlayer = forceShoot ? 1 : currentPlayer;
    let isSingleShotMode = selectedFiringMode === 'single';
    let useP2SingleShotFlag = (!forceShoot && isTwoPlayerMode && currentPlayer === 2);

    if (isPaused || !isInGameState || playerLives <= 0 || gameOverSequenceStartTime > 0 || !ship || isShipCaptured || isWaitingForRespawn || isShowingIntro || showReadyMessage || isCsCompletionDelayActive || showCsHitsMessage || showPerfectMessage || showCsBonusScoreMessage || showCSClearMessage || isShowingPlayerGameOverMessage ) {
        return false;
    }
    try {
        const bulletY = ship.y;
        let bulletsCreated = 0;
        if (isDualShipActive) {
            const ship1CenterX = ship.x + ship.width / 2;
            const ship2CenterX = ship.x + DUAL_SHIP_OFFSET_X + ship.width / 2;
            const bulletX1 = ship1CenterX - PLAYER_BULLET_WIDTH / 2;
            const bulletX2 = ship2CenterX - PLAYER_BULLET_WIDTH / 2;
            bullets.push({ x: bulletX1, y: bulletY, width: PLAYER_BULLET_WIDTH, height: PLAYER_BULLET_HEIGHT, speed: PLAYER_BULLET_SPEED });
            bullets.push({ x: bulletX2, y: bulletY, width: PLAYER_BULLET_WIDTH, height: PLAYER_BULLET_HEIGHT, speed: PLAYER_BULLET_SPEED });
            bulletsCreated = 2;
        } else {
            const bulletX = ship.x + ship.width / 2 - PLAYER_BULLET_WIDTH / 2;
            bullets.push({ x: bulletX, y: bulletY, width: PLAYER_BULLET_WIDTH, height: PLAYER_BULLET_HEIGHT, speed: PLAYER_BULLET_SPEED });
            bulletsCreated = 1;
        }

        playSound(playerShootSound); // <<< Gebruik identifier >>>

        if (shootingPlayer === 1 || forceShoot) {
            player1ShotsFired += bulletsCreated;
        } else if (shootingPlayer === 2) {
            player2ShotsFired += bulletsCreated;
        }
        return true;
    } catch(e) {
        console.error("Error creating player bullet(s):", e);
        return false;
    }
}


/**
 * Handles player input (manual control), considering currentPlayer and input sources.
 * <<< GEWIJZIGD: Verwerkt nu isTouchFiringActive voor continu touch vuur, zelfs tijdens slepen. >>>
 */
function handlePlayerInput() {
    try {
         const now = Date.now();
         const isSingleShotMode = selectedFiringMode === 'single';

         // --- Game State Checks (vroegtijdige exit) ---
         if (isPaused || !isManualControl || playerLives <= 0 || !ship || !gameCanvas || !isInGameState || gameOverSequenceStartTime > 0 || isShowingPlayerGameOverMessage || isWaitingForRespawn || isShipCaptured || isShowingCaptureMessage) {
             leftPressed = false; rightPressed = false; shootPressed = false;
             p2LeftPressed = false; p2RightPressed = false; p2ShootPressed = false;
             p1FireInputWasDown = false; p2FireInputWasDown = false;
             keyboardP1LeftDown = false; keyboardP1RightDown = false; keyboardP1ShootDown = false;
             keyboardP2LeftDown = false; keyboardP2RightDown = false; keyboardP2ShootDown = false;
             isTouchFiringActive = false; // Stop touch fire als game state wijzigt
             return;
         }

         // --- Controller State Lezen & Speciale Acties ---
         let controllerP1Left = false, controllerP1Right = false, controllerP1ShootIsDown = false;
         let controllerP2Left = false, controllerP2Right = false, controllerP2ShootIsDown = false;
         let p1Back = false, p1Pause = false;

         if (connectedGamepadIndex !== null) { /* ... lees P1 controller ... */ const gamepads = navigator.getGamepads(); if (gamepads?.[connectedGamepadIndex]) { const gamepad = gamepads[connectedGamepadIndex]; const controllerResult = processSingleController(gamepad, previousGameButtonStates); controllerP1Left = controllerResult.left; controllerP1Right = controllerResult.right; controllerP1ShootIsDown = controllerResult.shoot; p1Pause = controllerResult.pause; p1Back = controllerResult.back; previousGameButtonStates = controllerResult.newButtonStates; } else { if(previousGameButtonStates.length > 0) previousGameButtonStates = []; } } else { if(previousGameButtonStates.length > 0) previousGameButtonStates = []; }
         if (isTwoPlayerMode && connectedGamepadIndexP2 !== null) { /* ... lees P2 controller ... */ const gamepads = navigator.getGamepads(); if (gamepads?.[connectedGamepadIndexP2]) { const gamepadP2 = gamepads[connectedGamepadIndexP2]; const controllerResultP2 = processSingleController(gamepadP2, previousGameButtonStatesP2); controllerP2Left = controllerResultP2.left; controllerP2Right = controllerResultP2.right; controllerP2ShootIsDown = controllerResultP2.shoot; previousGameButtonStatesP2 = controllerResultP2.newButtonStates; } else { if(previousGameButtonStatesP2.length > 0) previousGameButtonStatesP2 = []; } } else { if(previousGameButtonStatesP2.length > 0) previousGameButtonStatesP2 = []; }

         if (p1Pause) { togglePause(); return; }
         if (p1Back) { stopGameAndShowMenu(); return; }

         // --- Bepaal Keyboard Input State ---
         let currentKeyboardP1Left = keyboardP1LeftDown; let currentKeyboardP1Right = keyboardP1RightDown; let currentKeyboardP1Shoot = keyboardP1ShootDown;
         let currentKeyboardP2Left = keyboardP2LeftDown; let currentKeyboardP2Right = keyboardP2RightDown; let currentKeyboardP2Shoot = keyboardP2ShootDown;

         // --- Combineer Keyboard & Controller voor 'Is Down' ---
         let p1FireInputIsDown = currentKeyboardP1Shoot || controllerP1ShootIsDown;
         let p2FireInputIsDown = false;
         const useP1ControllerForP2 = (isTwoPlayerMode && connectedGamepadIndexP2 === null && connectedGamepadIndex !== null);
         if (isTwoPlayerMode) { p2FireInputIsDown = currentKeyboardP2Shoot || controllerP2ShootIsDown || (useP1ControllerForP2 && controllerP1ShootIsDown); }

         // --- Touch Rapid Fire Check (heeft prioriteit voor vuren) ---
         let firedThisFrame = false;
         if (isTouchFiringActive && !isSingleShotMode) {
             if (now - playerLastShotTime >= SHOOT_COOLDOWN) {
                 if (firePlayerBullet(false)) {
                     playerLastShotTime = now;
                     firedThisFrame = true;
                     // Reset single-shot flags (veiligheid, hoewel niet strikt nodig hier)
                     p1JustFiredSingle = false; p2JustFiredSingle = false; touchJustFiredSingle = false;
                 }
             }
             // BELANGRIJK: Als touch firing actief is, voorkomen we dat keyboard/gamepad *ook* vuren triggert in dezelfde frame.
             // Beweging wordt hieronder nog wel verwerkt.
         }

         // --- Bepaal Beweging & Vuren (Keyboard/Gamepad) ---
         // Reset flags voor deze frame
         leftPressed = false; rightPressed = false; shootPressed = false;
         p2LeftPressed = false; p2RightPressed = false; p2ShootPressed = false;

         let shouldTryFireP1_NonTouch = false;
         let shouldTryFireP2_NonTouch = false;

         // Bepaal input voor de actieve speler
         if (currentPlayer === 1 || !isTwoPlayerMode) {
             leftPressed = currentKeyboardP1Left || controllerP1Left;
             rightPressed = currentKeyboardP1Right || controllerP1Right;
             // Vuur alleen als touch rapid NIET al gevuurd heeft
             if (!firedThisFrame) {
                 const p1InputJustPressed = p1FireInputIsDown && !p1FireInputWasDown;
                 const p1InputJustReleased = !p1FireInputIsDown && p1FireInputWasDown;
                 if (isSingleShotMode) { if (p1InputJustPressed && !p1JustFiredSingle) { shouldTryFireP1_NonTouch = true; } if (p1InputJustReleased) { p1JustFiredSingle = false; } }
                 else { if (p1FireInputIsDown && (now - playerLastShotTime >= SHOOT_COOLDOWN)) { shouldTryFireP1_NonTouch = true; } }
             }
             shootPressed = shouldTryFireP1_NonTouch; // Vlag voor potentieel vuren
         }
         else if (isTwoPlayerMode && currentPlayer === 2) {
             p2LeftPressed = currentKeyboardP2Left || controllerP2Left || (useP1ControllerForP2 && controllerP1Left);
             p2RightPressed = currentKeyboardP2Right || controllerP2Right || (useP1ControllerForP2 && controllerP1Right);
             // Vuur alleen als touch rapid NIET al gevuurd heeft
             if (!firedThisFrame) {
                 const p2InputJustPressed = p2FireInputIsDown && !p2FireInputWasDown;
                 const p2InputJustReleased = !p2FireInputIsDown && p2FireInputWasDown;
                 const p1ControllerForP2Released = useP1ControllerForP2 && (!controllerP1ShootIsDown && (previousGameButtonStates[PS5_BUTTON_CROSS] ?? false));
                 if (isSingleShotMode) { if (p2InputJustPressed && !p2JustFiredSingle) { shouldTryFireP2_NonTouch = true; } if (p2InputJustReleased || p1ControllerForP2Released) { p2JustFiredSingle = false; } }
                 else { if (p2FireInputIsDown && (now - playerLastShotTime >= SHOOT_COOLDOWN)) { shouldTryFireP2_NonTouch = true; } }
             }
             p2ShootPressed = shouldTryFireP2_NonTouch; // Vlag voor potentieel vuren
         }

         // --- Vuur (Keyboard/Gamepad - alleen als touch niet al gevuurd heeft) ---
         if (!firedThisFrame && (shouldTryFireP1_NonTouch || shouldTryFireP2_NonTouch)) {
             if (firePlayerBullet(false)) {
                 playerLastShotTime = now;
                 firedThisFrame = true; // Markeer dat er gevuurd is deze frame
                 if (isSingleShotMode) {
                     if (shouldTryFireP1_NonTouch) p1JustFiredSingle = true;
                     if (shouldTryFireP2_NonTouch) p2JustFiredSingle = true;
                 }
             }
         }

         // --- Altijd 'WasDown' Flags Updaten ---
         // Gebruik de gecombineerde state van DIT frame
         p1FireInputWasDown = p1FireInputIsDown;
         p2FireInputWasDown = p2FireInputIsDown;

    } catch (e) {
        console.error("Error handling player input:", e);
        leftPressed = false; rightPressed = false; shootPressed = false;
        p2LeftPressed = false; p2RightPressed = false; p2ShootPressed = false;
        p1JustFiredSingle = false; p2JustFiredSingle = false;
        p1FireInputWasDown = false; p2FireInputWasDown = false;
        isTouchFiringActive = false; // Stop touch fire bij error
    }
}


/**
 * Controls player ship via AI (demo mode).
 */
 function aiControl() {
     // <<< Functie inhoud ongewijzigd tov vorige versie >>>
     try {
         if (isPaused || isManualControl || playerLives <= 0 || !ship || !gameCanvas || !isInGameState || gameOverSequenceStartTime > 0 || isShowingPlayerGameOverMessage || isShipCaptured || isWaitingForRespawn) { if (ship) ship.targetX = ship.x; aiNeedsStabilization = true; smoothedShipX = undefined; return; }
         if (smoothedShipX === undefined) { smoothedShipX = ship.x; }
         const now = Date.now(); const canvasWidth = gameCanvas.width; const canvasHeight = gameCanvas.height; let effectiveShipWidth = ship.width; if (isDualShipActive) { effectiveShipWidth = DUAL_SHIP_OFFSET_X + ship.width; }
         const shipCenterX = ship.x + effectiveShipWidth / 2; const shipTopY = ship.y; const AI_CENTER_TARGET_X_VISUAL = canvasWidth / 2; let targetCenterShipX; if (isDualShipActive) { targetCenterShipX = AI_CENTER_TARGET_X_VISUAL - effectiveShipWidth / 2; } else { targetCenterShipX = AI_CENTER_TARGET_X_VISUAL - ship.width / 2; }
         const isShowingBlockingMessage = showReadyMessage || showCSClearMessage || showCsHitsMessage || showPerfectMessage || showCsBonusScoreMessage || showExtraLifeMessage || isCsCompletionDelayActive;
         let desiredTargetX = smoothedShipX; let shouldTryShoot = false; let isDodgingThreat = false; let dodgeTargetX = smoothedShipX; let targetEnemy = null; let isMovingToCapture = false;
         if (aiNeedsStabilization && !isShowingBlockingMessage) { aiStabilizationEndTime = now + AI_STABILIZATION_DURATION; aiNeedsStabilization = false; smoothedShipX = ship.x; }
         if (now < aiStabilizationEndTime && !isShowingBlockingMessage) { desiredTargetX = targetCenterShipX; }
         else {
             isDodgingThreat = false; dodgeTargetX = smoothedShipX;
             if (!isInvincible) {
                  let threateningBullets = []; const bulletLookahead = isChallengingStage ? FINAL_DODGE_LOOKAHEAD * 0.8 : (isEntrancePhaseActive ? ENTRANCE_BULLET_DODGE_LOOKAHEAD : FINAL_DODGE_LOOKAHEAD); const bulletBuffer = isChallengingStage ? FINAL_DODGE_BUFFER_BASE * 0.8 : (isEntrancePhaseActive ? ENTRANCE_BULLET_DODGE_BUFFER : FINAL_DODGE_BUFFER_BASE); const dangerZoneForBullets = { x: ship.x - bulletBuffer / 2, y: ship.y - bulletLookahead, width: effectiveShipWidth + bulletBuffer, height: bulletLookahead + ship.height }; for (const bullet of enemyBullets) { if (bullet && bullet.y + bullet.height > 0 && bullet.y < canvasHeight) { const bulletRect = { x: bullet.x, y: bullet.y, width: bullet.width, height: bullet.height }; if (checkCollision(dangerZoneForBullets, bulletRect)) { threateningBullets.push(bullet); } } }
                  if (threateningBullets.length > 0) { isDodgingThreat = true; let minThreatX = canvasWidth; let maxThreatX = 0; let minThreatYDist = Infinity; threateningBullets.forEach(b => { minThreatX = Math.min(minThreatX, b.x); maxThreatX = Math.max(maxThreatX, b.x + b.width); minThreatYDist = Math.min(minThreatYDist, shipTopY - (b.y + b.height)); }); const threatCenterX = (minThreatX + maxThreatX) / 2; const dodgeDirection = (shipCenterX < threatCenterX) ? -1 : 1; const dodgeProximityFactor = 1.0 - Math.min(1, Math.max(0, minThreatYDist) / bulletLookahead); const dodgeAmountBaseFactor = isChallengingStage ? 1.6 : (isEntrancePhaseActive ? 2.2 : 1.8); const dodgeAmountProximityFactor = isChallengingStage ? 1.3 : (isEntrancePhaseActive ? 1.8 : 1.5); const multiBulletBonus = Math.max(0, threateningBullets.length - 1) * effectiveShipWidth * 0.3; const dodgeAmount = effectiveShipWidth * (dodgeAmountBaseFactor + dodgeProximityFactor * dodgeAmountProximityFactor) + multiBulletBonus; dodgeTargetX = smoothedShipX + dodgeDirection * dodgeAmount; }
                  if (!isDodgingThreat && !isChallengingStage && !isFullGridWave) { let isDodgingDivingBoss = false; let closestBossYDist = Infinity; for (const enemy of enemies) { if (enemy && enemy.type === ENEMY3_TYPE && enemy.state === 'diving_to_capture_position' && enemy.targetX != null) { const bossDiveLookahead = AI_COLLISION_LOOKAHEAD * 1.5; const bossDiveBuffer = FINAL_DODGE_BUFFER_BASE * 1.8; const predictionFactor = 0.2; const predictedBossX = enemy.x + (enemy.targetX - enemy.x) * predictionFactor; const predictedBossRect = { x: predictedBossX, y: enemy.y, width: enemy.width, height: enemy.height }; const dangerZoneForDivingBoss = { x: ship.x - bossDiveBuffer / 2, y: ship.y - bossDiveLookahead, width: effectiveShipWidth + bossDiveBuffer, height: bossDiveLookahead + ship.height }; if (checkCollision(dangerZoneForDivingBoss, predictedBossRect)) { const distY = shipTopY - (enemy.y + enemy.height); if (distY < closestBossYDist) { closestBossYDist = distY; isDodgingThreat = true; isDodgingDivingBoss = true; const enemyTargetX = enemy.targetX + enemy.width / 2; const midX = canvasWidth / 2; const dodgeDirection = (enemyTargetX < midX) ? 1 : -1; const dodgeProximityFactor = 1.0 - Math.min(1, Math.max(0, distY) / bossDiveLookahead); const dodgeAmount = effectiveShipWidth * (2.5 + dodgeProximityFactor * 2.0); dodgeTargetX = smoothedShipX + dodgeDirection * dodgeAmount; } } } } }
                   if (!isDodgingThreat) { const currentLookahead = AI_COLLISION_LOOKAHEAD; const enemyBufferMultiplier = NORMAL_WAVE_ATTACKING_DODGE_BUFFER_MULTIPLIER; const beeBufferMultiplier = BEE_DODGE_BUFFER_HORIZONTAL_FACTOR; let closestAttackerYDist = Infinity; for (const enemy of enemies) { if (enemy && enemy.state === 'attacking' && enemy.y + enemy.height > 0 && enemy.y < canvasHeight) { let currentDodgeBuffer = FINAL_DODGE_BUFFER_BASE * enemyBufferMultiplier; if (enemy.type === ENEMY1_TYPE) { currentDodgeBuffer *= beeBufferMultiplier; } const dangerZoneForEnemy = { x: ship.x - currentDodgeBuffer / 2, y: ship.y - currentLookahead, width: effectiveShipWidth + currentDodgeBuffer, height: currentLookahead + ship.height }; const enemyRect = { x: enemy.x, y: enemy.y, width: enemy.width, height: enemy.height }; if (checkCollision(dangerZoneForEnemy, enemyRect)) { const distY = shipTopY - (enemy.y + enemy.height); if (distY < closestAttackerYDist) { closestAttackerYDist = distY; isDodgingThreat = true; const enemyCenterX = enemy.x + enemy.width / 2; const dodgeDirection = (shipCenterX < enemyCenterX) ? -1 : 1; const dodgeProximityFactor = 1.0 - Math.min(1, Math.max(0, distY) / currentLookahead); const dodgeAmount = effectiveShipWidth * (2.0 + dodgeProximityFactor * 1.8); dodgeTargetX = smoothedShipX + dodgeDirection * dodgeAmount; } } } } }
                   if (!isDodgingThreat && !isFullGridWave) { const currentLookahead = AI_COLLISION_LOOKAHEAD; let closestEnteringYDist = Infinity; for (const enemy of enemies) { const isActiveThreat = enemy && (enemy.state === 'following_entrance_path' || enemy.state === 'returning'); if (isActiveThreat && enemy.y + enemy.height > 0 && enemy.y < canvasHeight) { let currentDodgeBuffer = FINAL_DODGE_BUFFER_BASE; if (enemy.type === ENEMY1_TYPE) { currentDodgeBuffer *= BEE_DODGE_BUFFER_HORIZONTAL_FACTOR; } const dangerZoneForEnemy = { x: ship.x - currentDodgeBuffer / 2, y: ship.y - currentLookahead, width: effectiveShipWidth + currentDodgeBuffer, height: currentLookahead + ship.height }; const enemyRect = { x: enemy.x, y: enemy.y, width: enemy.width, height: enemy.height }; if (checkCollision(dangerZoneForEnemy, enemyRect)) { const distY = shipTopY - (enemy.y + enemy.height); if (distY < closestEnteringYDist) { closestEnteringYDist = distY; isDodgingThreat = true; const enemyCenterX = enemy.x + enemy.width / 2; const dodgeDirection = (shipCenterX < enemyCenterX) ? -1 : 1; const dodgeProximityFactor = 1.0 - Math.min(1, Math.max(0, distY) / currentLookahead); const dodgeAmount = effectiveShipWidth * (2.0 + dodgeProximityFactor * 1.8); dodgeTargetX = smoothedShipX + dodgeDirection * dodgeAmount; } } } } }
             }
             if (isDodgingThreat && !isInvincible) { const clampedDodgeTargetX = Math.max(AI_ANTI_CORNER_BUFFER, Math.min(canvasWidth - effectiveShipWidth - AI_ANTI_CORNER_BUFFER, dodgeTargetX)); desiredTargetX = clampedDodgeTargetX; targetEnemy = null; shouldTryShoot = false; }
             else if (fallingShips.length > 0 && !isShipCaptured && !isWaitingForRespawn) { const fallingShip = fallingShips[0]; if (fallingShip) { const targetFallCenterX = fallingShip.x + fallingShip.width / 2; desiredTargetX = targetFallCenterX - (effectiveShipWidth / 2); desiredTargetX = Math.max(AI_EDGE_BUFFER, Math.min(canvasWidth - effectiveShipWidth - AI_EDGE_BUFFER, desiredTargetX)); targetEnemy = null; let bestCatchTargetScore = -Infinity; let catchTargetEnemy = null; for (const enemy of enemies) { if (enemy && enemy.y < shipTopY) { const enemyCenterX = enemy.x + enemy.width / 2; const alignmentDiff = Math.abs(enemyCenterX - shipCenterX); const verticalDistance = shipTopY - (enemy.y + enemy.height); if (alignmentDiff < effectiveShipWidth * 1.5 && verticalDistance > 0) { const currentScore = (canvasHeight - enemy.y) - alignmentDiff * 2 - verticalDistance; if (currentScore > bestCatchTargetScore) { bestCatchTargetScore = currentScore; catchTargetEnemy = enemy; } } } } if (catchTargetEnemy) { let shootPathClearOfBullets = true; const dangerZoneForCatchShoot = { x: ship.x - ENTRANCE_SHOOT_BULLET_CHECK_BUFFER / 2, y: ship.y - ENTRANCE_SHOOT_BULLET_CHECK_LOOKAHEAD, width: effectiveShipWidth + ENTRANCE_SHOOT_BULLET_CHECK_BUFFER, height: ENTRANCE_SHOOT_BULLET_CHECK_LOOKAHEAD + ship.height }; for (const bullet of enemyBullets) { if (bullet && bullet.y + bullet.height > 0 && bullet.y < canvasHeight) { const bulletRect = { x: bullet.x, y: bullet.y, width: bullet.width, height: bullet.height }; if (checkCollision(dangerZoneForCatchShoot, bulletRect)) { shootPathClearOfBullets = false; break; } } } if (shootPathClearOfBullets && !(catchTargetEnemy.type === ENEMY3_TYPE && catchTargetEnemy.state === 'preparing_capture')) { shouldTryShoot = true; targetEnemy = catchTargetEnemy; } } } }
             else { let shouldConsiderCapture = false; let capturingBoss = null; if (!isFullGridWave && !isManualControl && captureBeamActive && capturingBossId && playerLives > 1 && !isShipCaptured && !isInvincible) { capturingBoss = enemies.find(e => e.id === capturingBossId); if (capturingBoss && capturingBoss.state === 'capturing') { shouldConsiderCapture = true; const timeSinceCaptureStart = now - capturingBoss.captureStartTime; if (timeSinceCaptureStart >= AI_CAPTURE_WAIT_DURATION_MS) { isMovingToCapture = true; const bossCenterX = capturingBoss.x + capturingBoss.width / 2; desiredTargetX = bossCenterX - effectiveShipWidth / 2; targetEnemy = null; shouldTryShoot = false; } } }
                  if (!isMovingToCapture) { targetEnemy = null; if (isEntrancePhaseActive && !isChallengingStage && !isFullGridWave) { desiredTargetX = targetCenterShipX; let bestEntranceTargetScore = -Infinity; let potentialTarget = null; for (const enemy of enemies) { if (enemy && (enemy.state === 'following_entrance_path' || enemy.state === 'moving_to_grid') && enemy.y < shipTopY) { const enemyCenterX = enemy.x + enemy.width / 2; const enemyCenterY = enemy.y + enemy.height / 2; const dx = enemyCenterX - shipCenterX; const dy = shipTopY - enemyCenterY; const distance = Math.sqrt(dx*dx + dy*dy); const alignmentScore = Math.max(0, (effectiveShipWidth * 1.5) - Math.abs(dx)); const currentScore = (canvasHeight - enemy.y) * 1.5 + alignmentScore - distance * 0.5; if (currentScore > bestEntranceTargetScore) { bestEntranceTargetScore = currentScore; potentialTarget = enemy; } } } if (potentialTarget) { targetEnemy = potentialTarget; const targetCenterX = targetEnemy.x + targetEnemy.width / 2; const alignmentDiff = Math.abs(shipCenterX - targetCenterX); const alignmentThreshold = effectiveShipWidth * ENTRANCE_SHOOT_ALIGNMENT_FACTOR; let shootPathClearOfBullets = true; const dangerZoneForEntranceShoot = { x: ship.x - ENTRANCE_SHOOT_BULLET_CHECK_BUFFER / 2, y: ship.y - ENTRANCE_SHOOT_BULLET_CHECK_LOOKAHEAD, width: effectiveShipWidth + ENTRANCE_SHOOT_BULLET_CHECK_BUFFER, height: ENTRANCE_SHOOT_BULLET_CHECK_LOOKAHEAD + ship.height }; for (const bullet of enemyBullets) { if (bullet && bullet.y + bullet.height > 0 && bullet.y < canvasHeight) { const bulletRect = { x: bullet.x, y: bullet.y, width: bullet.width, height: bullet.height }; if (checkCollision(dangerZoneForEntranceShoot, bulletRect)) { shootPathClearOfBullets = false; break; } } } if (shootPathClearOfBullets && alignmentDiff < alignmentThreshold) { if (isDualShipActive || targetEnemy.type !== ENEMY3_TYPE || captureAttemptMadeThisLevel || isShipCaptured) { shouldTryShoot = true; } } } } else if (isChallengingStage) { let bestTargetScore = Infinity; targetEnemy = null; for (const enemy of enemies) { if (enemy && enemy.state === 'following_bezier_path' && enemy.y < shipTopY) { const enemyCenterX = enemy.x + enemy.width / 2; const alignmentDiff = Math.abs(enemyCenterX - shipCenterX); const verticalPriority = (1.0 - Math.min(1.0, enemy.y / shipTopY)) * 2.0; const horizontalPriority = (alignmentDiff / canvasWidth) * 0.5; const currentScore = verticalPriority + horizontalPriority; if (currentScore < bestTargetScore) { bestTargetScore = currentScore; targetEnemy = enemy; } } } let aimX_CS = shipCenterX; if (targetEnemy) { const enemyCenterX = targetEnemy.x + targetEnemy.width / 2; const enemyCenterY = targetEnemy.y + targetEnemy.height / 2; const dyTarget = shipTopY - enemyCenterY; let predictedTargetX_CS = enemyCenterX; const isHorizontalSquadron = (targetEnemy.squadronId === 2 || targetEnemy.squadronId === 3); if (!isHorizontalSquadron && dyTarget > 0 && PLAYER_BULLET_SPEED > 0.1) { const timeToReachApproxCS = Math.min(MAX_PREDICTION_TIME_CS, dyTarget / PLAYER_BULLET_SPEED); const adjustedPredictionFactor = 0.4; const predictedOffset = (targetEnemy.velocityX || 0) * timeToReachApproxCS; predictedTargetX_CS = enemyCenterX + predictedOffset * adjustedPredictionFactor; predictedTargetX_CS = Math.max(targetEnemy.width / 2, Math.min(canvasWidth - targetEnemy.width / 2, predictedTargetX_CS)); } aimX_CS = predictedTargetX_CS; desiredTargetX = aimX_CS - effectiveShipWidth / 2; desiredTargetX = Math.max(AI_EDGE_BUFFER, Math.min(canvasWidth - effectiveShipWidth - AI_EDGE_BUFFER, desiredTargetX)); const CS_SHOOT_ALIGNMENT_THRESHOLD_EXTRA_WIDE = effectiveShipWidth * 1.5; const currentAlignmentDiff = Math.abs(shipCenterX - aimX_CS); if (currentAlignmentDiff < CS_SHOOT_ALIGNMENT_THRESHOLD_EXTRA_WIDE) { shouldTryShoot = true; } } else { const wiggleOffset = Math.sin(now / AI_WIGGLE_PERIOD * 2 * Math.PI) * AI_WIGGLE_AMPLITUDE * 0.5; desiredTargetX = targetCenterShipX + wiggleOffset; desiredTargetX = Math.max(AI_EDGE_BUFFER, Math.min(canvasWidth - effectiveShipWidth - AI_EDGE_BUFFER, desiredTargetX)); } } else { let bestTargetScore = -Infinity; targetEnemy = null; const isWaitingForCaptureButNotMoving = shouldConsiderCapture && !isMovingToCapture; for (const enemy of enemies) { if (!enemy) continue; if (isWaitingForCaptureButNotMoving && enemy.id === capturingBossId) { continue; } let isValidTarget = false; let basePriority = 0; switch(enemy.state) { case 'in_grid': isValidTarget = true; basePriority = isWaitingForCaptureButNotMoving ? 20000 : 18000; break; case 'moving_to_grid': case 'returning': isValidTarget = true; basePriority = 9000; break; case 'preparing_attack': isValidTarget = true; basePriority = 7000; break; case 'attacking': isValidTarget = true; basePriority = 6000; break; case 'preparing_capture': isValidTarget = true; basePriority = 25000; break; } if (isValidTarget) { let currentScore = basePriority; let damageBonus = (enemy.isDamaged && enemy.type === ENEMY3_TYPE) ? 5000 : 0; let yPriority = (canvasHeight - enemy.y) * 2; let xAlignmentBonus = Math.max(0, (effectiveShipWidth * 1.0) - Math.abs((enemy.x + enemy.width/2) - shipCenterX)) * 1; currentScore += yPriority + damageBonus + xAlignmentBonus; if (currentScore > bestTargetScore) { bestTargetScore = currentScore; targetEnemy = enemy; } } } let aimX = targetCenterShipX + effectiveShipWidth / 2; if (targetEnemy) { const enemyCenterX = targetEnemy.x + targetEnemy.width / 2; const enemyCenterY = targetEnemy.y + targetEnemy.height / 2; const dy = shipTopY - enemyCenterY; let predictedTargetX = enemyCenterX; if (targetEnemy.state !== 'in_grid' && targetEnemy.state !== 'preparing_capture') { if (dy > 0 && PLAYER_BULLET_SPEED > 0.1) { const timeToReachApprox = Math.min(MAX_PREDICTION_TIME, dy / PLAYER_BULLET_SPEED); let enemyPredictedXCalc = enemyCenterX + (targetEnemy.velocityX || 0) * timeToReachApprox; predictedTargetX = Math.max(targetEnemy.width / 2, Math.min(canvasWidth - targetEnemy.width / 2, enemyPredictedXCalc)); } } aimX = predictedTargetX; desiredTargetX = aimX - effectiveShipWidth / 2; if (targetEnemy.state === 'in_grid' || targetEnemy.state === 'preparing_capture') { desiredTargetX = Math.max(AI_EDGE_BUFFER, Math.min(canvasWidth - effectiveShipWidth - AI_EDGE_BUFFER, desiredTargetX)); } else { const halfBiasWidth = (canvasWidth * 0.6) / 2; const minBiasX = AI_CENTER_TARGET_X_VISUAL - halfBiasWidth; const maxBiasX = AI_CENTER_TARGET_X_VISUAL + halfBiasWidth - effectiveShipWidth; desiredTargetX = Math.max(minBiasX, Math.min(maxBiasX, desiredTargetX)); desiredTargetX = Math.max(AI_EDGE_BUFFER, Math.min(canvasWidth - effectiveShipWidth - AI_EDGE_BUFFER, desiredTargetX)); } let shotBlockedByEdge = false; let horizontalDiff = Math.abs(shipCenterX - aimX); let alignmentThreshold = (targetEnemy.state === 'in_grid' || targetEnemy.state === 'preparing_capture') ? effectiveShipWidth * GRID_SHOOT_ALIGNMENT_FACTOR : effectiveShipWidth * FINAL_SHOOT_ALIGNMENT_THRESHOLD; const shipNearLeftEdge = ship.x < AI_EDGE_BUFFER * AI_EDGE_SHOOT_BUFFER_FACTOR; const shipNearRightEdge = ship.x > canvasWidth - effectiveShipWidth - AI_EDGE_SHOOT_BUFFER_FACTOR; const targetPastCenterRight = aimX > canvasWidth * AI_EDGE_SHOOT_TARGET_THRESHOLD_FACTOR; const targetPastCenterLeft = aimX < canvasWidth * (1.0 - AI_EDGE_SHOOT_TARGET_THRESHOLD_FACTOR); if ((shipNearLeftEdge && targetPastCenterRight) || (shipNearRightEdge && targetPastCenterLeft)) { shotBlockedByEdge = true; } if (!shotBlockedByEdge && horizontalDiff < alignmentThreshold) { let shotBlockedByEnemy = false; if (targetEnemy.state !== 'in_grid' && targetEnemy.state !== 'preparing_capture') { for (const otherEnemy of enemies) { if (!otherEnemy || otherEnemy === targetEnemy) continue; if (isWaitingForCaptureButNotMoving && otherEnemy.id === capturingBossId) continue; if (otherEnemy.y < shipTopY && otherEnemy.y + otherEnemy.height > targetEnemy.y) { const otherLeft = otherEnemy.x - AI_SHOT_CLEARANCE_BUFFER; const otherRight = otherEnemy.x + otherEnemy.width + AI_SHOT_CLEARANCE_BUFFER; if (aimX > otherLeft && aimX < otherRight) { shotBlockedByEnemy = true; break; } } } } if (!shotBlockedByEnemy) { if (!isWaitingForCaptureButNotMoving || targetEnemy.id !== capturingBossId) { shouldTryShoot = true; } } } } else { const wiggleOffset = Math.sin(now / AI_WIGGLE_PERIOD * 2 * Math.PI) * AI_WIGGLE_AMPLITUDE; desiredTargetX = targetCenterShipX + wiggleOffset; desiredTargetX = Math.max(AI_EDGE_BUFFER, Math.min(canvasWidth - effectiveShipWidth - AI_EDGE_BUFFER, desiredTargetX)); } } }
             }
         }
         ship.targetX = desiredTargetX;
         if (shouldTryShoot && !isDodgingThreat && !isMovingToCapture) { let isReadyToShoot = true; if (!isChallengingStage) { isReadyToShoot = (now >= aiCanShootTime); } if (isReadyToShoot && (now - aiLastShotTime >= AI_SHOOT_COOLDOWN)) { if (firePlayerBullet(true)) { aiLastShotTime = now; } } }
     } catch (e) { console.error("Error in aiControl:", e, e.stack); if (ship) ship.targetX = ship.x; aiNeedsStabilization = true; smoothedShipX = undefined; }
 }

// --- EINDE deel 5      van 8 dit codeblok ---
// --- END OF FILE game_logic.js ---









// --- START OF FILE game_logic.js ---
// --- DEEL 6      van 8 dit code blok    --- (<<< REVISE: Use Web Audio API >>>)
// <<< GEWIJZIGD: playSound/stopSound aanroepen gebruiken nu identifiers. >>>

// Contains: Enemy Attack Selection & Capture Trigger

/**
 * Selecteert een vijand (of groep) uit de grid om aan te vallen.
 * Selecteert GEEN capture dives meer.
 */
function findAndDetachEnemy() {
    // <<< Functie inhoud ongewijzigd tov vorige versie (geen capture selectie hier) >>>
    try {
        if (!isFullGridWave && isShipCaptured) { const bossWithShip = enemies.find(e => e && e.type === ENEMY3_TYPE && e.hasCapturedShip && e.state === 'in_grid'); if (bossWithShip) { console.log(`[findAndDetachEnemy - PRIORITY] Ship captured. Selecting Boss ${bossWithShip.id} for MUST DIVE (Normal attack).`); bossWithShip.justReturned = true; bossWithShip.attackType = 'normal'; const attackGroupIds = new Set([bossWithShip.id]); resetJustReturnedFlags(attackGroupIds); return [bossWithShip]; } }
        if (isEntrancePhaseActive) { return null; }
        let availableGridEnemies = enemies.filter(e => e && e.state === 'in_grid' && !e.justReturned); if (availableGridEnemies.length === 0) { availableGridEnemies = enemies.filter(e => e && e.state === 'in_grid'); if (availableGridEnemies.length === 0) { return null; } } if (availableGridEnemies.length === 0) { return null; }
        availableGridEnemies.sort((a, b) => (b.gridRow || 0) - (a.gridRow || 0)); const isForcedAttackScenario = availableGridEnemies.length <= 3; let attackGroup = []; const selectedAttackType = 'normal';
        if (gridJustCompleted) { gridJustCompleted = false; }
        let groupSelected = false;
        if (level > 1 && !isForcedAttackScenario && availableGridEnemies.length >= 3) { const bossesForTriple = availableGridEnemies.filter(e => e.type === ENEMY3_TYPE && !e.hasCapturedShip); for (const boss of bossesForTriple) { const escortLeft = availableGridEnemies.find(e => e.type === ENEMY2_TYPE && e.gridRow === boss.gridRow && e.gridCol === boss.gridCol - 1); const escortRight = availableGridEnemies.find(e => e.type === ENEMY2_TYPE && e.gridRow === boss.gridRow && e.gridCol === boss.gridCol + 1); if (escortLeft && escortRight) { attackGroup = [boss, escortLeft, escortRight]; groupSelected = true; break; } } }
        if (!groupSelected && !isForcedAttackScenario) { const availableBees = availableGridEnemies.filter(e => e.type === ENEMY1_TYPE); const beeGroupAttackChance = scaleValue(level, BASE_BEE_GROUP_ATTACK_PROBABILITY, MAX_BEE_GROUP_ATTACK_PROBABILITY) * 1.2; if (availableBees.length >= 2 && Math.random() < beeGroupAttackChance) { const beeTripleChance = scaleValue(level, BASE_BEE_TRIPLE_ATTACK_PROBABILITY, MAX_BEE_TRIPLE_ATTACK_PROBABILITY) * 1.1; const targetGroupSize = (availableBees.length >= 3 && Math.random() < beeTripleChance) ? 3 : 2; let foundCoordinatedGroup = false; availableBees.sort(() => Math.random() - 0.5); for (let i = 0; i < availableBees.length; i++) { const leaderBee = availableBees[i]; let potentialGroup = [leaderBee]; const neighbors = availableBees.filter(b => b.id !== leaderBee.id && b.gridRow === leaderBee.gridRow); neighbors.sort((a, b) => Math.abs(a.gridCol - leaderBee.gridCol) - Math.abs(b.gridCol - leaderBee.gridCol)); for(let j = 0; j < neighbors.length && potentialGroup.length < targetGroupSize; j++){ potentialGroup.push(neighbors[j]); } if (potentialGroup.length === targetGroupSize) { attackGroup = potentialGroup; groupSelected = true; foundCoordinatedGroup = true; break; } } if (!foundCoordinatedGroup && availableBees.length >= targetGroupSize) { attackGroup = availableBees.slice(0, targetGroupSize); groupSelected = true; } } }
        if (!groupSelected && !isForcedAttackScenario) { const availableButterflies = availableGridEnemies.filter(e => e.type === ENEMY2_TYPE); const butterflyGroupAttackChance = 0.2; if (availableButterflies.length >= 2 && Math.random() < butterflyGroupAttackChance) { const targetGroupSize = 2; let foundCoordinatedGroup = false; availableButterflies.sort(() => Math.random() - 0.5); for (let i = 0; i < availableButterflies.length; i++) { const leader = availableButterflies[i]; let potentialGroup = [leader]; const neighbors = availableButterflies.filter(b => b.id !== leader.id && b.gridRow === leader.gridRow); neighbors.sort((a, b) => Math.abs(a.gridCol - leader.gridCol) - Math.abs(b.gridCol - leader.gridCol)); for(let j = 0; j < neighbors.length && potentialGroup.length < targetGroupSize; j++){ potentialGroup.push(neighbors[j]); } if (potentialGroup.length === targetGroupSize) { attackGroup = potentialGroup; groupSelected = true; foundCoordinatedGroup = true; break; } } if (!foundCoordinatedGroup && availableButterflies.length >= targetGroupSize) { attackGroup = availableButterflies.slice(0, targetGroupSize); groupSelected = true; } } }
        if (!groupSelected && availableGridEnemies.length > 0) { const chosenEnemy = availableGridEnemies[0]; attackGroup.push(chosenEnemy); if (availableGridEnemies.length > 1 && !isForcedAttackScenario && Math.random() < 0.2) { const partnerLeft = availableGridEnemies.find(e => e.id !== chosenEnemy.id && e.gridRow === chosenEnemy.gridRow && e.gridCol === chosenEnemy.gridCol - 1); const partnerRight = availableGridEnemies.find(e => e.id !== chosenEnemy.id && e.gridRow === chosenEnemy.gridRow && e.gridCol === chosenEnemy.gridCol + 1); const potentialPartner = partnerLeft || partnerRight; if (potentialPartner) { const bothAreBosses = chosenEnemy.type === ENEMY3_TYPE && potentialPartner.type === ENEMY3_TYPE; if (!bothAreBosses) { attackGroup.push(potentialPartner); } } } groupSelected = true; }
        if (attackGroup.length > 0) { attackGroup = attackGroup.filter(e => e); if (attackGroup.length === 0) { return null; } attackGroup.forEach(enemy => { if (enemy) { enemy.justReturned = true; enemy.attackType = selectedAttackType; } }); const attackGroupIds = new Set(attackGroup.map(e => e.id)); resetJustReturnedFlags(attackGroupIds); return attackGroup; }
        return null;
    } catch (e) { console.error("Error in findAndDetachEnemy:", e); return null; }
}


/**
 * Start direct een capture dive als aan voorwaarden voldaan is.
 * <<< GEWIJZIGD: Checkt nu of playerLives > 1. >>>
 * <<< GEWIJZIGD: Logs verwijderd. >>>
 * <<< GEWIJZIGD: Gebruikt playSound() met identifier. >>>
 */
function triggerImmediateCaptureDive() {
    try {
        // <<< NIEUWE CHECK: Geen capture op laatste leven >>>
        if (playerLives <= 1 || isChallengingStage || isShipCaptured || isDualShipActive || captureAttemptMadeThisLevel) {
            return; // Capture niet mogelijk/gewenst of speler heeft te weinig levens
        }

        const potentialCapturingBosses = enemies.filter(e =>
            e && e.state === 'in_grid' && e.type === ENEMY3_TYPE && !e.hasCapturedShip
        );

        if (potentialCapturingBosses.length > 0) {
            const chosenBoss = potentialCapturingBosses[Math.floor(Math.random() * potentialCapturingBosses.length)];
            const now = Date.now();
            captureAttemptMadeThisLevel = true;
            chosenBoss.justReturned = true;
            const attackGroupIds = new Set([chosenBoss.id]);
            resetJustReturnedFlags(attackGroupIds);
            const diveSide = Math.random() < 0.5 ? 'left' : 'right';
            const targetX = diveSide === 'left'
                ? gameCanvas.width * CAPTURE_DIVE_SIDE_MARGIN_FACTOR
                : gameCanvas.width * (1 - CAPTURE_DIVE_SIDE_MARGIN_FACTOR) - BOSS_WIDTH;
            const targetY = gameCanvas.height * CAPTURE_DIVE_BOTTOM_HOVER_Y_FACTOR;
            chosenBoss.state = 'preparing_capture';
            chosenBoss.targetX = targetX;
            chosenBoss.targetY = targetY;
            chosenBoss.diveStartTime = now;
            playSound(bossGalagaDiveSound); // <<< Gebruik identifier >>>
            const leaderId = chosenBoss.id;
            chosenBoss.capturePrepareTimeout = setTimeout(() => {
                const currentEnemy = enemies.find(e => e?.id === leaderId);
                if (currentEnemy && currentEnemy.state === 'preparing_capture') {
                    currentEnemy.state = 'diving_to_capture_position';
                }
                if(currentEnemy) currentEnemy.capturePrepareTimeout = null;
                const timeoutIndex = enemySpawnTimeouts.findIndex(tId => tId === chosenBoss.capturePrepareTimeout);
                if (timeoutIndex > -1) enemySpawnTimeouts.splice(timeoutIndex, 1);
            }, 300); // Korte delay voordat duik echt start
            enemySpawnTimeouts.push(chosenBoss.capturePrepareTimeout);
        }
    } catch (e) {
        console.error("Error in triggerImmediateCaptureDive:", e);
    }
}


/**
 * Resets justReturned flag for other grid enemies. (Nu met Set<string> of null)
 * <<< GEWIJZIGD: Parameter type aangepast in commentaar en logica >>>
 * @param {Set<string>|string|null} excludedIds - ID(s) to exclude. Set for multiple, string for single, null for none.
 */
function resetJustReturnedFlags(excludedIds) {
    // <<< Functie ongewijzigd >>>
    enemies.forEach(e => {
        let exclude = false;
        if (excludedIds instanceof Set) {
            exclude = excludedIds.has(e.id);
        } else if (typeof excludedIds === 'string') {
            exclude = (e.id === excludedIds);
        }
        // Reset flag if enemy exists, is in grid, has justReturned=true, AND is NOT excluded
        if (e && e.state === 'in_grid' && e.justReturned && !exclude) {
            e.justReturned = false;
        }
    });
}

// --- EINDE deel 6      van 8 dit codeblok ---
// --- END OF FILE game_logic.js ---









// --- START OF FILE game_logic.js ---
// --- DEEL 7      van 8 dit code blok    --- (<<< REVISE: Correct Horizontal Gap for Paired Flight >>>)
// <<< GEWIJZIGD: Debug logs verwijderd uit 'following_entrance_path' en 'following_bezier_path'. >>>
// <<< GEWIJZIGD: Leniente off-screen check voor CS paden behouden. >>>
// <<< GEWIJZIGD: 'capturing' case stopt nu expliciet captureSound wanneer beam niet meer actief is of state verandert. >>>
// <<< GEWIJZIGD: Horizontale offset voor paren in 'following_entrance_path' houdt nu rekening met pad richting (links/rechts). >>>

// Contains: Floating Score Update, Explosion Update, Entity Movement/Collision, Player Turn Switch, Grid Firing

/** Verwijdert verlopen floating score teksten. */
function updateFloatingScores() { /* ... ongewijzigd ... */ if (isPaused) return; try { const now = Date.now(); floatingScores = floatingScores.filter(fs => (now - fs.creationTime < FLOATING_SCORE_DURATION + FLOATING_SCORE_APPEAR_DELAY)); } catch (e) { console.error("Error updating floating scores:", e); floatingScores = []; } }

/** Update de positie en alpha van alle actieve explosie deeltjes. */
function updateExplosions() { /* ... ongewijzigd ... */ if (isPaused) return; try { const now = Date.now(); for (let i = explosions.length - 1; i >= 0; i--) { const explosion = explosions[i]; const elapsedTime = now - explosion.creationTime; if (elapsedTime > explosion.duration) { explosions.splice(i, 1); continue; } explosion.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.alpha = Math.max(0, 1.0 - (elapsedTime / explosion.duration) * EXPLOSION_FADE_SPEED); }); } } catch (e) { console.error("Error updating explosions:", e); explosions = []; } }


// --- Functie moveEntities: Update posities en states van alle entiteiten ---
function moveEntities() {
    if (isPaused) return;
    try {
        // Ship Movement (Manual & AI controlled by targetX)
        if (ship && isInGameState && playerLives > 0 && gameOverSequenceStartTime === 0 && !isShowingPlayerGameOverMessage && !isWaitingForRespawn) { /* ... Ship movement logic ... */ let effectiveShipWidth = ship.width; if (isDualShipActive) { effectiveShipWidth += DUAL_SHIP_OFFSET_X; } let targetX = ship.x; if (isManualControl) { let moveLeftActive = false; let moveRightActive = false; if (currentPlayer === 1 || !isTwoPlayerMode) { moveLeftActive = leftPressed; moveRightActive = rightPressed; } else { moveLeftActive = p2LeftPressed; moveRightActive = p2RightPressed; } if (moveLeftActive && ship.x > 0) { targetX = ship.x - ship.speed; } else if (moveRightActive && ship.x < gameCanvas.width - effectiveShipWidth) { targetX = ship.x + ship.speed; } ship.x = Math.max(0, Math.min(gameCanvas.width - effectiveShipWidth, targetX)); ship.targetX = ship.x; } else { if (typeof smoothedShipX !== 'undefined') { const AI_MOVEMENT_DEADZONE_MOVE = 0.1; const AI_POSITION_MOVE_SPEED_FACTOR_MOVE = 1.2; smoothedShipX += (ship.targetX - smoothedShipX) * AI_SMOOTHING_FACTOR_MOVE; const deltaX = smoothedShipX - ship.x; const maxSpeed = ship.speed * AI_POSITION_MOVE_SPEED_FACTOR_MOVE; let actualMoveX = 0; if (Math.abs(deltaX) > AI_MOVEMENT_DEADZONE_MOVE) { const currentMoveFraction = isChallengingStage ? CS_AI_MOVE_FRACTION : NORMAL_MOVE_FRACTION; actualMoveX = deltaX * currentMoveFraction; actualMoveX = Math.max(-maxSpeed, Math.min(maxSpeed, actualMoveX)); if (Math.abs(actualMoveX) > Math.abs(deltaX)) { actualMoveX = deltaX; } ship.x += actualMoveX; ship.x = Math.max(0, Math.min(gameCanvas.width - effectiveShipWidth, ship.x)); } } else { ship.x = Math.max(0, Math.min(gameCanvas.width - effectiveShipWidth, ship.targetX)); } } }

        const now = Date.now();

        // Move Player Bullets
        for (let i = bullets.length - 1; i >= 0; i--) { /* ... unchanged ... */ const b = bullets[i]; if (b) { b.y -= b.speed; if (b.y + PLAYER_BULLET_HEIGHT < 0) { bullets.splice(i, 1); } } else { bullets.splice(i, 1); } }
        // Move Enemy Bullets
        for (let i = enemyBullets.length - 1; i >= 0; i--) { /* ... unchanged ... */ const eb = enemyBullets[i]; if (!eb) { enemyBullets.splice(i, 1); continue; } eb.x += eb.vx; eb.y += eb.vy; if (eb.y > gameCanvas.height || eb.y < -ENEMY_BULLET_HEIGHT || eb.x < -ENEMY_BULLET_WIDTH || eb.x > gameCanvas.width) { enemyBullets.splice(i, 1); } }
        // Move Falling Ships
        for (let i = fallingShips.length - 1; i >= 0; i--) { /* ... unchanged ... */ const fs = fallingShips[i]; if (!fs) { fallingShips.splice(i, 1); continue; } fs.y += FALLING_SHIP_SPEED; const elapsedFallingTime = now - fs.creationTime; if (typeof fs.tintProgress === 'number') { fs.tintProgress = Math.max(0, 1.0 - (elapsedFallingTime / FALLING_SHIP_FADE_DURATION_MS)); } else { fs.tintProgress = 0; } if (typeof fs.rotation === 'number') { const rotationProgress = Math.min(1.0, elapsedFallingTime / FALLING_SHIP_ROTATION_DURATION_MS); fs.rotation = rotationProgress * 2 * (2 * Math.PI); } else { fs.rotation = 0; } if (ship && !isDualShipActive && !isShipCaptured && !isWaitingForRespawn && fs.y + fs.height >= gameCanvas.height - AUTO_DOCK_THRESHOLD) { fallingShips.splice(i, 1); isDualShipActive = true; if (currentPlayer === 1) { player1IsDualShipActive = true; } else { player2IsDualShipActive = true; } playSound(dualShipSound); continue; } if (fs.y > gameCanvas.height + fs.height) { fallingShips.splice(i, 1); } }

        // --- Grid Movement Logic --- Start
        let gridHorizontalShift = 0; const gridEnemiesPresent = enemies.some(e => e?.state === 'in_grid');
        const gridShouldBeMoving = !isChallengingStage && !isWaveTransitioning && gridEnemiesPresent && !isShowingPlayerGameOverMessage;
        if (gridShouldBeMoving) { /* ... grid movement logic unchanged ... */ if (!isGridSoundPlaying) { playSound(gridBackgroundSound, true); } const gridEnemiesList = enemies.filter(e => e?.state === 'in_grid'); if (gridEnemiesList.length > 0) { let minX = gameCanvas.width, maxX = 0; gridEnemiesList.forEach(enemy => { if (enemy) { minX = Math.min(minX, enemy.x); maxX = Math.max(maxX, enemy.x + enemy.width); } }); const leftBoundary = gameCanvas.width * GRID_HORIZONTAL_MARGIN_PERCENT; const rightBoundary = gameCanvas.width * (1 - GRID_HORIZONTAL_MARGIN_PERCENT); if (gridMoveDirection === 1 && maxX >= rightBoundary) { gridMoveDirection = -1; } else if (gridMoveDirection === -1 && minX <= leftBoundary) { gridMoveDirection = 1; } const effectiveGridMoveSpeed = scaleValue(level, BASE_GRID_MOVE_SPEED, MAX_GRID_MOVE_SPEED); gridHorizontalShift = effectiveGridMoveSpeed * gridMoveDirection; currentGridOffsetX += gridHorizontalShift; enemies.forEach(e => { if (e && (e.state === 'returning' || e.state === 'in_grid' || e.state === 'moving_to_grid')) { try { const enemyWidthForGrid = (e.type === ENEMY3_TYPE) ? BOSS_WIDTH : ((e.type === ENEMY1_TYPE) ? ENEMY1_WIDTH : ENEMY_WIDTH); const { x: newTargetX, y: newTargetY } = getCurrentGridSlotPosition(e.gridRow, e.gridCol, enemyWidthForGrid); e.targetGridX = newTargetX; e.targetGridY = newTargetY; } catch (gridPosError) { console.error(`Error updating target grid pos for enemy ${e?.id} (state: ${e?.state}) during shift:`, gridPosError); } } }); } } else { if (isGridSoundPlaying && !isChallengingStage) { stopSound(gridBackgroundSound); isGridSoundPlaying = false; } gridHorizontalShift = 0; } // ensure grid sound stops if not CS
        // --- Grid Movement Logic --- End


        // --- Enemy State Machine & Movement ---
        for (let i = enemies.length - 1; i >= 0; i--) {
            let enemy = enemies[i]; if (!enemy) { continue; }
            const enemyId = enemy.id;
             if (enemy.capturePrepareTimeout && enemy.state !== 'preparing_capture') { /* ... unchanged ... */ clearTimeout(enemy.capturePrepareTimeout); const timeoutIndex = enemySpawnTimeouts.indexOf(enemy.capturePrepareTimeout); if (timeoutIndex > -1) enemySpawnTimeouts.splice(timeoutIndex, 1); enemy.capturePrepareTimeout = null; }
            const currentEnemyWidthCorrected = (enemy.type === ENEMY3_TYPE) ? BOSS_WIDTH : ((enemy.type === ENEMY1_TYPE) ? ENEMY1_WIDTH : ENEMY_WIDTH);
            const currentEnemyHeightCorrected = (enemy.type === ENEMY3_TYPE) ? BOSS_HEIGHT : ((enemy.type === ENEMY1_TYPE) ? ENEMY1_HEIGHT : ENEMY_HEIGHT);

            switch (enemy.state) {
                 case 'following_bezier_path': {
                    // <<< Debug logging verwijderd >>>
                    if (isEntrancePhaseActive && !isChallengingStage) break;
                    const pathSegmentsCS = challengingStagePaths[enemy.entrancePathId];
                    if (!pathSegmentsCS || pathSegmentsCS.length === 0) { console.error(`CS Enemy ${enemyId} following invalid path ${enemy.entrancePathId}! Removing.`); enemies.splice(i, 1); continue; }
                    if (enemy.pathSegmentIndex >= pathSegmentsCS.length) { console.warn(`CS Enemy ${enemyId} path index ${enemy.pathSegmentIndex} out of bounds! Removing.`); enemies.splice(i, 1); continue; }
                    const currentSegmentCS = pathSegmentsCS[enemy.pathSegmentIndex];
                    if (!currentSegmentCS?.p0) { console.error(`CS Enemy ${enemyId} has invalid segment ${enemy.pathSegmentIndex}! Removing.`); enemies.splice(i, 1); continue; }

                    const pathSpeedFactorCS = enemy.pathSpeedMultiplier || 1.0;
                    const tIncrementCS = CS_ENTRANCE_PATH_SPEED * pathSpeedFactorCS;
                    enemy.pathT += tIncrementCS;

                    let pathXCS, pathYCS;
                    const oldXCS = enemy.x; const oldYCS = enemy.y;

                    if (enemy.pathT >= 1.0) {
                        pathXCS = calculateBezierPoint(1.0, currentSegmentCS.p0.x, currentSegmentCS.p1.x, currentSegmentCS.p2.x, currentSegmentCS.p3.x);
                        pathYCS = calculateBezierPoint(1.0, currentSegmentCS.p0.y, currentSegmentCS.p1.y, currentSegmentCS.p2.y, currentSegmentCS.p3.y);
                        enemy.pathT = 0;
                        enemy.pathSegmentIndex++;
                        if (enemy.pathSegmentIndex >= pathSegmentsCS.length) {
                            enemies.splice(i, 1);
                            continue;
                        }
                    } else {
                        pathXCS = calculateBezierPoint(enemy.pathT, currentSegmentCS.p0.x, currentSegmentCS.p1.x, currentSegmentCS.p2.x, currentSegmentCS.p3.x);
                        pathYCS = calculateBezierPoint(enemy.pathT, currentSegmentCS.p0.y, currentSegmentCS.p1.y, currentSegmentCS.p2.y, currentSegmentCS.p3.y);
                    }

                    enemy.velocityX = pathXCS - oldXCS;
                    enemy.velocityY = pathYCS - oldYCS;
                    enemy.x = pathXCS;
                    enemy.y = pathYCS;

                    const offScreenMargin = Math.max(currentEnemyWidthCorrected, currentEnemyHeightCorrected) * 2.5;
                    let isOffScreen = enemy.y > gameCanvas.height + offScreenMargin ||
                                        enemy.y < -offScreenMargin ||
                                        enemy.x < -offScreenMargin ||
                                        enemy.x > gameCanvas.width + offScreenMargin;

                    if (isOffScreen && enemy.pathSegmentIndex > 0) { // Alleen verwijderen na het eerste segment
                         enemies.splice(i, 1);
                         continue;
                    }
                    break;
                 } // End following_bezier_path case
                 case 'following_entrance_path': {
                    if (isChallengingStage) break;
                    const pathSegmentsNormal = normalWaveEntrancePaths[enemy.entrancePathId];
                    if (!pathSegmentsNormal || pathSegmentsNormal.length === 0) { console.error(`Enemy ${enemyId} following invalid path ${enemy.entrancePathId}! Moving to grid.`); enemy.state = 'moving_to_grid'; break; }
                    if (enemy.pathSegmentIndex >= pathSegmentsNormal.length) { enemy.state = 'moving_to_grid'; break; }
                    const currentSegmentNormal = pathSegmentsNormal[enemy.pathSegmentIndex];
                    if (!currentSegmentNormal?.p0) { console.error(`Enemy ${enemyId} has invalid segment ${enemy.pathSegmentIndex}! Moving to grid.`); enemy.state = 'moving_to_grid'; break; }

                    let pathSpeedMultiplier = 1.0;
                    if (enemy.entrancePathId === 'boss_loop_left' || enemy.entrancePathId === 'boss_loop_right') {
                        pathSpeedMultiplier = BOSS_LOOP_ENTRANCE_PATH_SPEED / NORMAL_ENTRANCE_PATH_SPEED;
                    }
                    const tIncrementNormal = NORMAL_ENTRANCE_PATH_SPEED * pathSpeedMultiplier;
                    enemy.pathT += tIncrementNormal;

                    let pathXNormal, pathYNormal;
                    const oldXNormal = enemy.x; const oldYNormal = enemy.y;

                    if (enemy.pathT >= 1.0) {
                        pathXNormal = calculateBezierPoint(1.0, currentSegmentNormal.p0.x, currentSegmentNormal.p1.x, currentSegmentNormal.p2.x, currentSegmentNormal.p3.x);
                        pathYNormal = calculateBezierPoint(1.0, currentSegmentNormal.p0.y, currentSegmentNormal.p1.y, currentSegmentNormal.p2.y, currentSegmentNormal.p3.y);
                        enemy.pathT = 0;
                        enemy.pathSegmentIndex++;
                        if (enemy.pathSegmentIndex >= pathSegmentsNormal.length) {
                            enemy.state = 'moving_to_grid';
                            enemy.x = pathXNormal;
                            enemy.y = pathYNormal;
                        }
                    } else {
                        pathXNormal = calculateBezierPoint(enemy.pathT, currentSegmentNormal.p0.x, currentSegmentNormal.p1.x, currentSegmentNormal.p2.x, currentSegmentNormal.p3.x);
                        pathYNormal = calculateBezierPoint(enemy.pathT, currentSegmentNormal.p0.y, currentSegmentNormal.p1.y, currentSegmentNormal.p2.y, currentSegmentNormal.p3.y);
                    }

                    if (enemy.state === 'following_entrance_path') {
                        let finalX = pathXNormal;
                        // <<< GEWIJZIGD: Logica voor horizontale offset van paren >>>
                        // currentWavePatternIndex === 1 is voor 'entrance_flight_2' waves
                        // Squadron index 2 en 3 zijn de 'boss_loop_left' en 'boss_loop_right'
                        const isPairedFlightSquadron = currentWavePatternIndex === 1 && (enemy.squadronId === 2 || enemy.squadronId === 3);
                        const isSecondInPair = typeof enemy.squadronEnemyIndex === 'number' && enemy.squadronEnemyIndex % 2 !== 0;

                        if (isPairedFlightSquadron && isSecondInPair) {
                            // Bepaal de richting van de offset gebaseerd op de padnaam
                            let offsetDirection = 1; // Standaard naar rechts (voor 'boss_loop_right')
                            if (enemy.entrancePathId && enemy.entrancePathId.toLowerCase().includes('left')) {
                                offsetDirection = -1; // Naar links voor 'boss_loop_left'
                            }
                            // De ENTRANCE_PAIR_HORIZONTAL_GAP is de *extra* ruimte TUSSEN de schepen.
                            // De totale offset van het padmiddelpunt voor de tweede vijand is
                            // de helft van zijn eigen breedte + de helft van de gap.
                            // Echter, de ENTRANCE_PAIR_PATH_T_OFFSET is 0, dus ze volgen in principe hetzelfde pad.
                            // We voegen hier een laterale verschuiving toe.
                            // De `pathXNormal` is het punt op het centrale pad. De tweede vijand wordt ernaast geplaatst.
                            const lateralShift = (currentEnemyWidthCorrected / 2) + (ENTRANCE_PAIR_HORIZONTAL_GAP / 2);
                            finalX = pathXNormal + (lateralShift * offsetDirection);

                            // Om het nog duidelijker te maken, zou je de *eerste* vijand van het paar de ene kant op kunnen schuiven
                            // en de *tweede* de andere kant op, vanuit het gezamenlijke padpunt `pathXNormal`.
                            // Maar voor nu houden we het bij het verschuiven van alleen de tweede.
                        }
                        // <<< EINDE GEWIJZIGD >>>

                        enemy.velocityX = finalX - oldXNormal;
                        enemy.velocityY = pathYNormal - oldYNormal;
                        enemy.x = finalX;
                        enemy.y = pathYNormal;
                    }
                    break;
                }
                 case 'moving_to_grid': { /* ... moving to grid logic unchanged ... */ if (enemy.targetGridX == null || enemy.targetGridY == null) { console.warn(`Enemy ${enemyId} in moving_to_grid state without target. Recalculating.`); try { const { x: finalTargetX, y: finalTargetY } = getCurrentGridSlotPosition(enemy.gridRow, enemy.gridCol, currentEnemyWidthCorrected); enemy.targetGridX = finalTargetX; enemy.targetGridY = finalTargetY; } catch(err){ console.error(`Error getting grid pos for ${enemyId} in moving_to_grid`, err); enemy.state = 'in_grid'; enemy.x = gameCanvas.width/2; enemy.y = ENEMY_TOP_MARGIN; break;} } const moveTargetX = enemy.targetGridX; const moveTargetY = enemy.targetGridY; const dxMove = moveTargetX - enemy.x; const dyMove = moveTargetY - enemy.y; const distMove = Math.sqrt(dxMove * dxMove + dyMove * dyMove); const moveSpeed = ENTRANCE_SPEED * 1.2; const arrivalThreshold = moveSpeed * 0.5; if (distMove > arrivalThreshold) { enemy.velocityX = (dxMove / distMove) * moveSpeed; enemy.velocityY = (dyMove / distMove) * moveSpeed; enemy.x += enemy.velocityX; enemy.y += enemy.velocityY; } else { enemy.x = moveTargetX; enemy.y = moveTargetY; enemy.velocityX = 0; enemy.velocityY = 0; const previousState = enemy.state; enemy.state = 'in_grid'; enemy.justReturned = false; if (!isGridSoundPlaying && !isChallengingStage) { playSound(gridBackgroundSound, true); } if (GRID_BREATH_ENABLED && !isGridBreathingActive && !isChallengingStage) { isGridBreathingActive = true; gridBreathStartTime = now; currentGridBreathFactor = 0; } if (!firstEnemyLanded && !isFullGridWave && !isChallengingStage) { lastGridFireCheckTime = Date.now(); firstEnemyLanded = true; } if (previousState === 'moving_to_grid' && !isChallengingStage && !isFullGridWave && enemy.squadronId !== undefined) { const squadId = enemy.squadronId; const squadStatus = squadronCompletionStatus[squadId]; if (squadStatus && !squadStatus.hasFiredPostLanding) { const allLanded = enemies.every(e => { if (e && e.squadronId === squadId) { return e.state === 'in_grid' || !enemies.some(aliveE => aliveE.id === e.id); } return true; }); if (allLanded) { squadStatus.hasFiredPostLanding = true; const eligibleShooters = enemies.filter(e => e && e.squadronId === squadId && e.state === 'in_grid' && (e.type === ENEMY2_TYPE || e.type === ENEMY3_TYPE) && !(e.type === ENEMY3_TYPE && e.hasCapturedShip)); if (eligibleShooters.length > 0) { const shooter = eligibleShooters[Math.floor(Math.random() * eligibleShooters.length)]; const shooterId = shooter.id; const fireDelay = 200 + Math.random() * 400; const postLandingFireTimeout = setTimeout(() => { try { const tIdx = enemySpawnTimeouts.indexOf(postLandingFireTimeout); if(tIdx > -1) enemySpawnTimeouts.splice(tIdx, 1); if (isPaused || !isInGameState || playerLives <= 0 || isChallengingStage || isWaveTransitioning || isShipCaptured) return; const currentShooter = enemies.find(e => e && e.id === shooterId); if (currentShooter && currentShooter.state === 'in_grid') { if (createBulletSimple(currentShooter)) { playSound(enemyShootSound); currentShooter.lastFiredTime = Date.now(); } } } catch (fireError) { console.error(`Error during post-landing fire for ${shooterId}:`, fireError); } }, fireDelay); enemySpawnTimeouts.push(postLandingFireTimeout); } } } } } break; }
                 case 'in_grid': { /* ... in grid logic unchanged ... */ try { const enemyWidthForGrid = (enemy.type === ENEMY3_TYPE) ? BOSS_WIDTH : ((enemy.type === ENEMY1_TYPE) ? ENEMY1_WIDTH : ENEMY_WIDTH); const { x: currentTargetX, y: currentTargetY } = getCurrentGridSlotPosition(enemy.gridRow, enemy.gridCol, enemyWidthForGrid); if (typeof currentTargetX === 'number' && !isNaN(currentTargetX)) { enemy.x = currentTargetX; } if (typeof currentTargetY === 'number' && !isNaN(currentTargetY)) { enemy.y = currentTargetY; } enemy.targetGridX = currentTargetX; enemy.targetGridY = currentTargetY; } catch(gridPosError) { console.error(`Error getting grid pos within 'in_grid' for ${enemy.id}:`, gridPosError); } enemy.velocityX = gridShouldBeMoving ? gridHorizontalShift : 0; enemy.velocityY = 0; if (enemy.type === ENEMY3_TYPE && enemy.hasCapturedShip && enemy.capturedShipDimensions) { enemy.capturedShipX = enemy.x + CAPTURED_SHIP_OFFSET_X; enemy.capturedShipY = enemy.y + CAPTURED_SHIP_OFFSET_Y; } break; }
                 case 'preparing_attack': { /* ... prepare attack logic unchanged ... */ enemy.velocityX = 0; enemy.velocityY = 0; break; }
                 case 'preparing_capture': { /* ... prepare capture logic unchanged ... */ enemy.velocityX = 0; enemy.velocityY = 0; break; }
                 case 'diving_to_capture_position': { /* ... dive to capture logic unchanged ... */ if (isShipCaptured) { enemy.state = 'returning'; try { const { x: tgtX, y: tgtY } = getCurrentGridSlotPosition(enemy.gridRow, enemy.gridCol, currentEnemyWidthCorrected); enemy.targetGridX = tgtX; enemy.targetGridY = tgtY; } catch (e) { console.error(`Error getting grid pos for returning boss ${enemy.id}:`, e); enemy.targetGridX = gameCanvas.width / 2; enemy.targetGridY = ENEMY_TOP_MARGIN; } break; } const targetXCapture = enemy.targetX; const targetYCapture = enemy.targetY; if (targetXCapture == null || targetYCapture == null) { console.error(`Boss ${enemy.id} diving to capture without targetX/Y! Aborting.`); enemy.state = 'returning'; try { const { x: tgtX, y: tgtY } = getCurrentGridSlotPosition(enemy.gridRow, enemy.gridCol, currentEnemyWidthCorrected); enemy.targetGridX = tgtX; enemy.targetGridY = tgtY; } catch (e) { console.error(`Error getting grid pos for returning boss ${enemy.id}:`, e); enemy.targetGridX = gameCanvas.width / 2; enemy.targetGridY = ENEMY_TOP_MARGIN; } break; } const dxCaptureDive = targetXCapture - enemy.x; const dyCaptureDive = targetYCapture - enemy.y; const distCaptureDive = Math.sqrt(dxCaptureDive * dxCaptureDive + dyCaptureDive * dyCaptureDive); const captureDiveSpeed = BOSS_CAPTURE_DIVE_SPEED_FACTOR * BASE_ENEMY_ATTACK_SPEED; const arrivalThresholdCapture = captureDiveSpeed * 0.6; if (distCaptureDive > arrivalThresholdCapture) { enemy.velocityX = (dxCaptureDive / distCaptureDive) * captureDiveSpeed; enemy.velocityY = (dyCaptureDive / distCaptureDive) * captureDiveSpeed; enemy.x += enemy.velocityX; enemy.y += enemy.velocityY; } else { enemy.x = targetXCapture; enemy.y = targetYCapture; enemy.velocityX = 0; enemy.velocityY = 0; enemy.state = 'capturing'; enemy.captureStartTime = now; capturingBossId = enemy.id; captureBeamActive = true; captureBeamSource = { x: enemy.x + currentEnemyWidthCorrected / 2, y: enemy.y + currentEnemyHeightCorrected }; captureBeamTargetY = enemy.y; captureBeamProgress = 0; playSound(captureSound); } break; }
                 case 'capturing': { /* ... capturing logic unchanged, including stopSound(captureSound) ... */ enemy.velocityX = 0; enemy.velocityY = 0; if (isShipCaptured && enemy.id !== capturedBossIdWithMessage) { captureBeamActive = false; if(capturingBossId === enemy.id) capturingBossId = null; enemy.state = 'returning'; stopSound(captureSound); try { const { x: tgtX, y: tgtY } = getCurrentGridSlotPosition(enemy.gridRow, enemy.gridCol, currentEnemyWidthCorrected); enemy.targetGridX = tgtX; enemy.targetGridY = tgtY; } catch (e) { console.error(`Error getting grid pos for returning boss ${enemy.id}:`, e); enemy.targetGridX = gameCanvas.width / 2; enemy.targetGridY = ENEMY_TOP_MARGIN; } break; } const elapsedCaptureTime = now - enemy.captureStartTime; const halfAnimationTime = CAPTURE_BEAM_ANIMATION_DURATION_MS / 2; const totalBeamStayTime = CAPTURE_BEAM_DURATION_MS; if (elapsedCaptureTime < halfAnimationTime) { captureBeamProgress = elapsedCaptureTime / halfAnimationTime; } else if (elapsedCaptureTime < totalBeamStayTime - halfAnimationTime) { captureBeamProgress = 1.0; } else if (elapsedCaptureTime < totalBeamStayTime) { captureBeamProgress = 1.0 - ((elapsedCaptureTime - (totalBeamStayTime - halfAnimationTime)) / halfAnimationTime); } else { captureBeamProgress = 0; captureBeamActive = false; capturingBossId = null; stopSound(captureSound); enemy.state = 'attacking'; enemy.attackPathSegments = generateAttackPath(enemy); enemy.attackPathSegmentIndex = 0; enemy.attackPathT = 0; enemy.speed = BASE_ENEMY_ATTACK_SPEED * ENEMY3_ATTACK_SPEED_FACTOR; enemy.lastFiredTime = 0; enemy.canFireThisDive = true; enemy.attackFormationOffsetX = 0; enemy.attackGroupId = null; break; } captureBeamProgress = Math.max(0, Math.min(1, captureBeamProgress)); if (ship && captureBeamActive && captureBeamProgress >= 0.95 && !isShipCaptured && !isInvincible) { const beamTopWidth = BOSS_WIDTH * CAPTURE_BEAM_WIDTH_TOP_FACTOR; const beamBottomWidth = SHIP_WIDTH * CAPTURE_BEAM_WIDTH_BOTTOM_FACTOR; const beamCenterX = enemy.x + currentEnemyWidthCorrected / 2; const beamVisualTopY = enemy.y + currentEnemyHeightCorrected; const beamVisualBottomY = gameCanvas.height - LIFE_ICON_MARGIN_BOTTOM - LIFE_ICON_SIZE - 10; const boxWidth = Math.max(beamTopWidth, beamBottomWidth); const boxX = beamCenterX - boxWidth / 2; const boxY = beamVisualTopY; const boxHeight = beamVisualBottomY - beamVisualTopY; if (boxHeight > 0) { const beamBoundingBox = { x: boxX, y: boxY, width: boxWidth, height: boxHeight }; const shipRect = { x: ship.x, y: ship.y, width: ship.width, height: ship.height }; if (checkCollision(shipRect, beamBoundingBox)) { isShipCaptured = true; enemy.capturedShipDimensions = { width: ship.width, height: ship.height }; enemy.hasCapturedShip = true; stopSound(captureSound); enemy.state = 'showing_capture_message'; enemy.targetGridX = null; enemy.targetGridY = null; enemy.initialCaptureAnimationY = ship.y; enemy.captureAnimationRotation = 0; isShowingCaptureMessage = true; captureMessageStartTime = now; capturedBossIdWithMessage = enemy.id; playSound(shipCapturedSound); const playerWhoDied = currentPlayer; playerLives--; csCurrentChainHits = 0; csCurrentChainScore = 0; csLastHitTime = 0; csLastChainHitPosition = null; normalWaveCurrentChainHits = 0; normalWaveCurrentChainScore = 0; normalWaveLastHitTime = 0; normalWaveLastChainHitPosition = null; leftPressed = false; rightPressed = false; shootPressed = false; p2LeftPressed = false; p2RightPressed = false; p2ShootPressed = false; p1JustFiredSingle = false; p2JustFiredSingle = false; p1FireInputWasDown = false; p2FireInputWasDown = false; if (playerLives <= 0) { if (playerWhoDied === 1) player1Lives = 0; if (playerWhoDied === 2) player2Lives = 0; if (isTwoPlayerMode) { isShowingPlayerGameOverMessage = true; playerGameOverMessageStartTime = now; playerWhoIsGameOver = playerWhoDied; const nextPlayer = (playerWhoDied === 1) ? 2 : 1; const nextPlayerLives = (nextPlayer === 1) ? player1Lives : player2Lives; if (nextPlayerLives > 0) { nextActionAfterPlayerGameOver = 'switch_player'; } else { nextActionAfterPlayerGameOver = 'show_results'; } bullets = []; enemyBullets = []; explosions = []; fallingShips = []; isDualShipActive = false; if(playerWhoDied === 1) player1IsDualShipActive = false; else player2IsDualShipActive = false; playSound(gameOverSound); } else { triggerFinalGameOverSequence(); } break; } else { if (isTwoPlayerMode) { if (playerWhoDied === 1) player1Lives = playerLives; else player2Lives = playerLives; } if (ship && gameCanvas) { ship.y = gameCanvas.height - SHIP_HEIGHT - SHIP_BOTTOM_MARGIN; if (!isManualControl) { aiNeedsStabilization = true; } } if (!isManualControl || isTwoPlayerMode) { forceCenterShipNextReset = true; } isShipCaptured = false; isInvincible = true; invincibilityEndTime = now + INVINCIBILITY_DURATION_MS; } } } else { console.warn("Beam collision box has invalid height:", boxHeight); } } break; }
                 case 'showing_capture_message': { /* ... showing capture message logic unchanged ... */ enemy.velocityX = 0; enemy.velocityY = 0; if (enemy.hasCapturedShip && enemy.capturedShipDimensions && typeof enemy.initialCaptureAnimationY === 'number') { const elapsedMessageTime = now - captureMessageStartTime; const animationProgress = Math.min(1.0, elapsedMessageTime / CAPTURE_MESSAGE_DURATION); const finalCapturedShipY = enemy.y + CAPTURED_SHIP_OFFSET_Y; const startY = enemy.initialCaptureAnimationY; enemy.capturedShipY = startY + (finalCapturedShipY - startY) * animationProgress; enemy.capturedShipX = enemy.x + CAPTURED_SHIP_OFFSET_X; } else { enemy.capturedShipX = enemy.x + CAPTURED_SHIP_OFFSET_X; enemy.capturedShipY = enemy.y + CAPTURED_SHIP_OFFSET_Y; } break; }
                 case 'attacking': { /* ... attacking logic unchanged ... */ if (isEntrancePhaseActive) break; const attackSegments = enemy.attackPathSegments; const attackPathSpeedFactor = 3.8; if (!attackSegments || attackSegments.length === 0) { console.error(`Enemy ${enemyId} attacking without path! Returning.`); enemy.state = 'returning'; try { const { x: tgtX, y: tgtY } = getCurrentGridSlotPosition(enemy.gridRow, enemy.gridCol, currentEnemyWidthCorrected); enemy.targetGridX = tgtX; enemy.targetGridY = tgtY; } catch (err) { console.error(`Error getting grid pos for returning enemy ${enemyId} (no attack path):`, err); enemy.targetGridX = gameCanvas.width / 2; enemy.targetGridY = ENEMY_TOP_MARGIN; } break; } if (enemy.attackPathSegmentIndex >= attackSegments.length) { console.warn(`Enemy ${enemyId} attacking, index ${enemy.attackPathSegmentIndex} out of bounds (${attackSegments.length})! Returning.`); enemy.state = 'returning'; try { const { x: tgtX, y: tgtY } = getCurrentGridSlotPosition(enemy.gridRow, enemy.gridCol, currentEnemyWidthCorrected); enemy.targetGridX = tgtX; enemy.targetGridY = tgtY; } catch (err) { console.error(`Error getting grid pos for returning enemy ${enemyId} (invalid attack index):`, err); enemy.targetGridX = gameCanvas.width / 2; enemy.targetGridY = ENEMY_TOP_MARGIN; } break; } const attackSegment = attackSegments[enemy.attackPathSegmentIndex]; if (!attackSegment || !attackSegment.p0 || !attackSegment.p1 || !attackSegment.p2 || !attackSegment.p3) { console.error(`Enemy ${enemyId} attacking, invalid segment ${enemy.attackPathSegmentIndex}! Returning.`); enemy.state = 'returning'; try { const { x: tgtX, y: tgtY } = getCurrentGridSlotPosition(enemy.gridRow, enemy.gridCol, currentEnemyWidthCorrected); enemy.targetGridX = tgtX; enemy.targetGridY = tgtY; } catch (err) { console.error(`Error getting grid pos for returning enemy ${enemyId} (invalid attack segment):`, err); enemy.targetGridX = gameCanvas.width / 2; enemy.targetGridY = ENEMY_TOP_MARGIN; } break; } const tIncrement = (enemy.speed / 1000) * attackPathSpeedFactor; enemy.attackPathT += tIncrement; let pathX, pathY; const oldFinalX = enemy.x; const oldFinalY = enemy.y; if (enemy.attackPathT >= 1.0) { try { pathX = calculateBezierPoint(1.0, attackSegment.p0.x, attackSegment.p1.x, attackSegment.p2.x, attackSegment.p3.x); pathY = calculateBezierPoint(1.0, attackSegment.p0.y, attackSegment.p1.y, attackSegment.p2.y, attackSegment.p3.y); } catch(bezierError) { console.error(`Error calculating FINAL bezier point for attack ${enemy.id}:`, bezierError); pathX = enemy.x; pathY = enemy.y; enemy.state = 'returning'; try { const { x: tgtX, y: tgtY } = getCurrentGridSlotPosition(enemy.gridRow, enemy.gridCol, currentEnemyWidthCorrected); enemy.targetGridX = tgtX; enemy.targetGridY = tgtY; } catch(err){ console.error(`Error getting grid pos after FINAL bezier error for ${enemy.id}:`, err); enemy.targetGridX = gameCanvas.width/2; enemy.targetGridY = ENEMY_TOP_MARGIN; } break; } enemy.attackPathT = 0; enemy.attackPathSegmentIndex++; if (enemy.attackPathSegmentIndex >= attackSegments.length) { enemy.state = 'returning'; enemy.lastFiredTime = 0; enemy.attackFormationOffsetX = 0; enemy.attackGroupId = null; try { const { x: tgtX, y: tgtY } = getCurrentGridSlotPosition(enemy.gridRow, enemy.gridCol, currentEnemyWidthCorrected); enemy.targetGridX = tgtX; enemy.targetGridY = tgtY; } catch(err){ console.error(`Error getting grid pos for returning enemy ${enemyId} after attack:`, err); enemy.targetGridX = gameCanvas.width / 2; enemy.targetGridY = ENEMY_TOP_MARGIN; } } else { const nextAttackSegment = attackSegments[enemy.attackPathSegmentIndex]; if (!nextAttackSegment?.p0) { console.error(`Enemy ${enemyId} attacking, invalid NEXT segment ${enemy.attackPathSegmentIndex}! Returning.`); pathX = enemy.x; pathY = enemy.y; enemy.state = 'returning'; try { const { x: tgtX, y: tgtY } = getCurrentGridSlotPosition(enemy.gridRow, enemy.gridCol, currentEnemyWidthCorrected); enemy.targetGridX = tgtX; enemy.targetGridY = tgtY; } catch(err){ console.error(`Error getting grid pos after invalid NEXT attack segment for ${enemy.id}:`, err); enemy.targetGridX = gameCanvas.width/2; enemy.targetGridY = ENEMY_TOP_MARGIN; } break; } } } else { try { pathX = calculateBezierPoint(enemy.attackPathT, attackSegment.p0.x, attackSegment.p1.x, attackSegment.p2.x, attackSegment.p3.x); pathY = calculateBezierPoint(enemy.attackPathT, attackSegment.p0.y, attackSegment.p1.y, attackSegment.p2.y, attackSegment.p3.y); } catch (bezierError) { console.error(`Error calculating bezier point during attack for ${enemy.id}:`, bezierError); pathX = enemy.x; pathY = enemy.y; enemy.state = 'returning'; try { const { x: tgtX, y: tgtY } = getCurrentGridSlotPosition(enemy.gridRow, enemy.gridCol, currentEnemyWidthCorrected); enemy.targetGridX = tgtX; enemy.targetGridY = tgtY; } catch(err){ console.error(`Error getting grid pos after bezier error for ${enemy.id}:`, err); enemy.targetGridX = gameCanvas.width/2; enemy.targetGridY = ENEMY_TOP_MARGIN; } break; } } if (enemy && enemy.state === 'attacking') { const formationOffset = enemy.attackFormationOffsetX || 0; const finalX = pathX + formationOffset; const finalY = pathY; enemy.velocityX = finalX - oldFinalX; enemy.velocityY = finalY - oldFinalY; enemy.x = finalX; enemy.y = finalY; if (enemy.y > gameCanvas.height + currentEnemyHeightCorrected * 1.5) { enemy.state = 'returning'; enemy.attackPathSegmentIndex = 0; enemy.attackPathT = 0; enemy.lastFiredTime = 0; enemy.attackFormationOffsetX = 0; enemy.attackGroupId = null; enemy.y = -currentEnemyHeightCorrected * (1.1 + Math.random() * 0.4); enemy.x = Math.random() * (gameCanvas.width - currentEnemyWidthCorrected); enemy.velocityX = 0; enemy.velocityY = 0; try { const { x: tgtX, y: tgtY } = getCurrentGridSlotPosition(enemy.gridRow, enemy.gridCol, currentEnemyWidthCorrected); enemy.targetGridX = tgtX; enemy.targetGridY = tgtY; } catch (err) { console.error(`Error getting grid pos for returning enemy ${enemyId} off screen:`, err); enemy.targetGridX = gameCanvas.width/2; enemy.targetGridY = ENEMY_TOP_MARGIN; } } } break; }
                 case 'returning': { /* ... returning logic unchanged ... */ if (isEntrancePhaseActive) break; if (enemy.targetGridX == null || enemy.targetGridY == null) { console.warn(`Enemy ${enemyId} returning without target coords. Recalculating.`); try { const { x: finalTargetX, y: finalTargetY } = getCurrentGridSlotPosition(enemy.gridRow, enemy.gridCol, currentEnemyWidthCorrected); enemy.targetGridX = finalTargetX; enemy.targetGridY = finalTargetY; } catch(err){ console.error(`Error getting grid pos for ${enemyId} in returning`, err); enemy.state = 'in_grid'; enemy.x = gameCanvas.width/2; enemy.y = ENEMY_TOP_MARGIN; break; } } const targetReturnX = enemy.targetGridX; const targetReturnY = enemy.targetGridY; const dxReturn = targetReturnX - enemy.x; const dyReturn = targetReturnY - enemy.y; const distReturn = Math.sqrt(dxReturn * dxReturn + dyReturn * dyReturn); const scaledReturnSpeedFactor = scaleValue(level, BASE_RETURN_SPEED_FACTOR, MAX_RETURN_SPEED_FACTOR); const returnSpeed = BASE_RETURN_SPEED * scaledReturnSpeedFactor; const returnArrivalThreshold = returnSpeed * 0.5; if (distReturn > returnArrivalThreshold) { enemy.velocityX = (dxReturn / distReturn) * returnSpeed; enemy.velocityY = (dyReturn / distReturn) * returnSpeed; enemy.x += enemy.velocityX; enemy.y += enemy.velocityY; } else { enemy.x = targetReturnX; enemy.y = targetReturnY; enemy.velocityX = 0; enemy.velocityY = 0; enemy.state = 'in_grid'; enemy.justReturned = true; enemy.attackFormationOffsetX = 0; enemy.attackGroupId = null; if (enemy.hasOwnProperty('returnLogDone')) { delete enemy.returnLogDone; } if (!isGridSoundPlaying && !isChallengingStage) { isGridSoundPlaying = true; playSound(gridBackgroundSound); } } break; }
            } // End Switch

             // --- Player Bullet vs Enemy Collision ---
             if (enemy && !isShowingPlayerGameOverMessage && !(isShipCaptured && enemy.state === 'capturing')) { /* ... unchanged ... */ const bulletRect = { x: 0, y: 0, width: PLAYER_BULLET_WIDTH, height: PLAYER_BULLET_HEIGHT }; const enemyRectCollisionCheck = { x: enemy.x, y: enemy.y, width: currentEnemyWidthCorrected, height: currentEnemyHeightCorrected }; for (let j = bullets.length - 1; j >= 0; j--) { const b = bullets[j]; if (!b) continue; bulletRect.x = b.x; bulletRect.y = b.y; if (checkCollision(bulletRect, enemyRectCollisionCheck)) { const hitResult = handleEnemyHit(enemy); bullets.splice(j, 1); if (hitResult.destroyed) { enemies.splice(i, 1); enemy = null; break; } } } }

             // <<< Enemy vs Player Ship Collision >>>
             if (enemy && ship && !isShipCaptured && !isWaitingForRespawn && !isShowingPlayerGameOverMessage && !isInvincible) { /* ... unchanged ... */ const collisionCausingStates = ['attacking', 'following_entrance_path', 'following_bezier_path', 'diving_to_capture_position']; if (collisionCausingStates.includes(enemy.state)) { const enemyRect = { x: enemy.x, y: enemy.y, width: currentEnemyWidthCorrected, height: currentEnemyHeightCorrected }; const shipRect = { x: ship.x, y: ship.y, width: ship.width, height: ship.height }; const dualShipRect = isDualShipActive ? { x: ship.x + DUAL_SHIP_OFFSET_X, y: ship.y, width: ship.width, height: ship.height } : null; let collisionOccurred = false; let hitDualShip = false; if (checkCollision(enemyRect, shipRect)) { collisionOccurred = true; hitDualShip = false; } else if (dualShipRect && checkCollision(enemyRect, dualShipRect)) { collisionOccurred = true; hitDualShip = true; } if (collisionOccurred) { createExplosion(enemy.x + currentEnemyWidthCorrected / 2, enemy.y + currentEnemyHeightCorrected / 2); playSound(lostLifeSound); enemies.splice(i, 1); enemy = null; if (isDualShipActive) { isDualShipActive = false; if (currentPlayer === 1) player1IsDualShipActive = false; else player2IsDualShipActive = false; if (hitDualShip) { createExplosion(dualShipRect.x + ship.width / 2, dualShipRect.y + ship.height / 2); } else { createExplosion(shipRect.x + ship.width / 2, shipRect.y + ship.height / 2); } isInvincible = true; invincibilityEndTime = now + INVINCIBILITY_DURATION_MS; } else { playerLives--; csCurrentChainHits = 0; csCurrentChainScore = 0; csLastHitTime = 0; csLastChainHitPosition = null; normalWaveCurrentChainHits = 0; normalWaveCurrentChainScore = 0; normalWaveLastHitTime = 0; normalWaveLastChainHitPosition = null; leftPressed = false; rightPressed = false; shootPressed = false; p2LeftPressed = false; p2RightPressed = false; p2ShootPressed = false; p1JustFiredSingle = false; p2JustFiredSingle = false; p1FireInputWasDown = false; p2FireInputWasDown = false; fallingShips = []; isInvincible = true; invincibilityEndTime = now + INVINCIBILITY_DURATION_MS; if (ship && gameCanvas) { ship.y = gameCanvas.height - SHIP_HEIGHT - SHIP_BOTTOM_MARGIN; if (!isManualControl) { aiNeedsStabilization = true; } } else { console.error("Cannot reposition ship Y - ship or canvas not ready."); } if (playerLives <= 0) { const playerWhoDied = currentPlayer; if (playerWhoDied === 1) player1Lives = 0; if (playerWhoDied === 2) player2Lives = 0; if (isTwoPlayerMode) { isShowingPlayerGameOverMessage = true; playerGameOverMessageStartTime = now; playerWhoIsGameOver = playerWhoDied; const nextPlayer = (playerWhoDied === 1) ? 2 : 1; const nextPlayerLives = (nextPlayer === 1) ? player1Lives : player2Lives; if (nextPlayerLives > 0) { nextActionAfterPlayerGameOver = 'switch_player'; } else { nextActionAfterPlayerGameOver = 'show_results'; } bullets = []; enemyBullets = []; explosions = []; playSound(gameOverSound); } else { triggerFinalGameOverSequence(); } break; } else { if (isTwoPlayerMode) { if (currentPlayer === 1) player1Lives = playerLives; else player2Lives = playerLives; } break; } } continue; } } }

        } // End Enemy Loop

        // <<< Enemy Bullet vs Player Ship Collision >>>
        if (ship && !isShowingPlayerGameOverMessage && !isShipCaptured && !isWaitingForRespawn && !isInvincible) { /* ... unchanged ... */ const shipRect = { x: ship.x, y: ship.y, width: ship.width, height: ship.height }; const dualShipRect = isDualShipActive ? { x: ship.x + DUAL_SHIP_OFFSET_X, y: ship.y, width: ship.width, height: ship.height } : null; for (let i = enemyBullets.length - 1; i >= 0; i--) { const eb = enemyBullets[i]; if (!eb) { enemyBullets.splice(i, 1); continue; } const bulletRect = { x: eb.x, y: eb.y, width: eb.width, height: eb.height }; let collisionOccurred = checkCollision(shipRect, bulletRect); let hitShipIndex = 0; if (!collisionOccurred && dualShipRect && checkCollision(dualShipRect, bulletRect)) { collisionOccurred = true; hitShipIndex = 1; } if (collisionOccurred) { enemyBullets.splice(i, 1); if (isDualShipActive) { isDualShipActive = false; if (currentPlayer === 1) player1IsDualShipActive = false; else player2IsDualShipActive = false; if (hitShipIndex === 1) { createExplosion(dualShipRect.x + ship.width / 2, dualShipRect.y + ship.height / 2); } else { createExplosion(shipRect.x + ship.width / 2, shipRect.y + ship.height / 2); } playSound(lostLifeSound); isInvincible = true; invincibilityEndTime = now + INVINCIBILITY_DURATION_MS; } else { playerLives--; playSound(lostLifeSound); createExplosion(ship.x + ship.width / 2, ship.y + ship.height / 2); csCurrentChainHits = 0; csCurrentChainScore = 0; csLastHitTime = 0; csLastChainHitPosition = null; normalWaveCurrentChainHits = 0; normalWaveCurrentChainScore = 0; normalWaveLastHitTime = 0; normalWaveLastChainHitPosition = null; leftPressed = false; rightPressed = false; shootPressed = false; p2LeftPressed = false; p2RightPressed = false; p2ShootPressed = false; p1JustFiredSingle = false; p2JustFiredSingle = false; p1FireInputWasDown = false; p2FireInputWasDown = false; fallingShips = []; isInvincible = true; invincibilityEndTime = now + INVINCIBILITY_DURATION_MS; if (ship && gameCanvas) { ship.y = gameCanvas.height - SHIP_HEIGHT - SHIP_BOTTOM_MARGIN; if (!isManualControl) { aiNeedsStabilization = true; } } else { console.error("Cannot reposition ship Y - ship or canvas not ready."); } if (playerLives <= 0) { const playerWhoDied = currentPlayer; if (playerWhoDied === 1) player1Lives = 0; if (playerWhoDied === 2) player2Lives = 0; if (isTwoPlayerMode) { isShowingPlayerGameOverMessage = true; playerGameOverMessageStartTime = now; playerWhoIsGameOver = playerWhoDied; const nextPlayer = (playerWhoDied === 1) ? 2 : 1; const nextPlayerLives = (nextPlayer === 1) ? player1Lives : player2Lives; if (nextPlayerLives > 0) { nextActionAfterPlayerGameOver = 'switch_player'; } else { nextActionAfterPlayerGameOver = 'show_results'; } bullets = []; enemyBullets = []; explosions = []; playSound(gameOverSound); } else { triggerFinalGameOverSequence(); } break; } else { if (isTwoPlayerMode) { if (currentPlayer === 1) player1Lives = playerLives; else player2Lives = playerLives; } break; } } } } }

        // Falling Ship vs Player Collision
         if (ship && !isShipCaptured && !isWaitingForRespawn && !isDualShipActive && fallingShips.length > 0 && !isInvincible) { /* ... unchanged ... */ const shipRect = { x: ship.x, y: ship.y, width: ship.width, height: ship.height }; for (let i = fallingShips.length - 1; i >= 0; i--) { const fs = fallingShips[i]; if (!fs) continue; const fallingRect = { x: fs.x, y: fs.y, width: fs.width, height: fs.height }; if (checkCollision(shipRect, fallingRect)) { fallingShips.splice(i, 1); isDualShipActive = true; if (currentPlayer === 1) player1IsDualShipActive = true; else player2IsDualShipActive = true; playSound(dualShipSound); break; } } }
         updateHitSparks();
    } catch (e) { /* ... Error handling unchanged ... */ console.error("FATAL Error in moveEntities:", e, e.stack); isGridSoundPlaying = false; stopSound(gridBackgroundSound); isEntrancePhaseActive = false; stopSound(entranceSound); isShowingPlayerGameOverMessage = false; playerGameOverMessageStartTime = 0; playerWhoIsGameOver = 0; nextActionAfterPlayerGameOver = ''; isShipCaptured = false; captureBeamActive = false; capturingBossId = null; stopSound(captureSound); stopSound(shipCapturedSound); isWaitingForRespawn = false; fallingShips = []; isDualShipActive = false; player1IsDualShipActive = false; player2IsDualShipActive = false; isInvincible = false; invincibilityEndTime = 0; hitSparks = []; if(typeof showMenuState === 'function') showMenuState(); if (mainLoopId) cancelAnimationFrame(mainLoopId); mainLoopId = null; alert("Critical error during entity movement/collision. Returning to menu."); }
} // <<< Einde moveEntities >>>

/**
 * Switches the current player in a 2-player game.
 */
function switchPlayerTurn() { /* ... unchanged ... */ if (!isTwoPlayerMode) return false; stopSound(hiScoreSound); highScore = Math.max(highScore, score); if (currentPlayer === 1) { player1Score = score; player1IsDualShipActive = isDualShipActive; } else { player2Score = score; player2IsDualShipActive = isDualShipActive; } const nextPlayer = (currentPlayer === 1) ? 2 : 1; const nextPlayerLives = (nextPlayer === 1) ? player1Lives : player2Lives; if (nextPlayerLives <= 0) { const currentSpelersLives = (currentPlayer === 1) ? player1Lives : player2Lives; if (currentSpelersLives <= 0) { triggerFinalGameOverSequence(); return false; } else { forceCenterShipNextReset = false; return false; } } currentPlayer = nextPlayer; score = (currentPlayer === 1) ? player1Score : player2Score; playerLives = (currentPlayer === 1) ? player1Lives : player2Lives; isDualShipActive = (currentPlayer === 1) ? player1IsDualShipActive : player2IsDualShipActive; forceCenterShipNextReset = true; scoreEarnedThisCS = 0; csCurrentChainHits = 0; csCurrentChainScore = 0; csLastHitTime = 0; csLastChainHitPosition = null; normalWaveCurrentChainHits = 0; normalWaveCurrentChainScore = 0; normalWaveLastHitTime = 0; normalWaveLastChainHitPosition = null; leftPressed = false; rightPressed = false; shootPressed = false; p2LeftPressed = false; p2RightPressed = false; p2ShootPressed = false; keyboardP1LeftDown = false; keyboardP1RightDown = false; keyboardP1ShootDown = false; keyboardP2LeftDown = false; keyboardP2RightDown = false; keyboardP2ShootDown = false; p1JustFiredSingle = false; p2JustFiredSingle = false; p1FireInputWasDown = false; p2FireInputWasDown = false; isShipCaptured = false; captureBeamActive = false; capturingBossId = null; isWaitingForRespawn = false; respawnTime = 0; isInvincible = false; invincibilityEndTime = 0; fallingShips = []; hitSparks = []; showExtraLifeMessage = false; extraLifeMessageStartTime = 0; return true; }


/**
 * Triggers firing from grid enemies based on level and timing.
 */
function triggerGridFiring() { /* ... unchanged ... */ if (isPaused || !isInGameState || playerLives <= 0 || isChallengingStage || isWaveTransitioning || isShipCaptured) { return; } const gridEnemies = enemies.filter(e => e && e.state === 'in_grid'); if (gridEnemies.length === 0) { return; } const now = Date.now(); const effectiveFireInterval = scaleValue(level, BASE_GRID_FIRE_INTERVAL, MIN_GRID_FIRE_INTERVAL); if (now - lastGridFireCheckTime < effectiveFireInterval) { return; } lastGridFireCheckTime = now; const fireProbability = scaleValue(level, BASE_GRID_FIRE_PROBABILITY, MAX_GRID_FIRE_PROBABILITY); const maxFiringEnemies = Math.round(scaleValue(level, BASE_GRID_MAX_FIRING_ENEMIES, MAX_GRID_MAX_FIRING_ENEMIES)); let firingCount = 0; gridEnemies.sort(() => Math.random() - 0.5); for (const enemy of gridEnemies) { if (firingCount >= maxFiringEnemies) { break; } if (enemy.type === ENEMY2_TYPE || enemy.type === ENEMY3_TYPE) { if (enemy.type === ENEMY3_TYPE && enemy.hasCapturedShip) { continue; } if (Math.random() < fireProbability) { if (createBulletSimple(enemy)) { playSound(enemyShootSound); enemy.lastFiredTime = now; firingCount++; } } } } }

// --- EINDE deel 7      van 8 dit codeblok ---
// --- END OF FILE game_logic.js ---









// --- START OF FILE game_logic.js ---
// --- DEEL 8      van 8 dit code blok    --- (<<< REVISE: Cleanup Logs, Trigger Capture Dive >>>)
// <<< GEWIJZIGD: Diverse logs uit runSingleGameUpdate en checkAndAwardExtraLife verwijderd. >>>
// <<< GEWIJZIGD: Aanroep van triggerImmediateCaptureDive toegevoegd na einde entrance phase. >>>
// <<< GEWIJZIGD: Expliciete stopSound(resultsMusicSound) toegevoegd aan begin triggerFinalGameOverSequence. >>>

/**
 * Hoofd game loop functie - voert één update cyclus uit.
 * <<< GEWIJZIGD: Roept nu `triggerImmediateCaptureDive` aan wanneer de entrance phase eindigt. >>>
 * <<< GEWIJZIGD: Diverse logs verwijderd. >>>
*/
function runSingleGameUpdate(timestamp) {
    try { // <<< Hoofd TRY blok START >>>
        const now = Date.now();

        // --- Altijd uitvoeren: Gamepad Exit Check ---
        // Checks for 'Back' button press on controllers to exit to menu
        if (isManualControl && connectedGamepadIndex !== null && playerLives > 0 && gameOverSequenceStartTime === 0 && !isPaused && !isShipCaptured) {
            const gamepads = navigator.getGamepads();
            if (gamepads?.[connectedGamepadIndex]) {
                 const gamepad = gamepads[connectedGamepadIndex];
                 const p1Input = processSingleController(gamepad, previousButtonStates); // Process P1 input
                 previousButtonStates = p1Input.newButtonStates; // Update state for next frame
                 if (p1Input.back) { // Check if 'Back' (e.g., Touchpad on PS5) was pressed
                     stopGameAndShowMenu(); // Exit game
                     return; // Stop further processing this frame
                 }
            } else { // Controller disconnected? Reset state.
                 if(previousButtonStates.length > 0) previousButtonStates = [];
            }
        } else if (connectedGamepadIndex === null) { // Ensure state is reset if no controller connected
            if(previousButtonStates.length > 0) previousButtonStates = [];
        }
        // Reset P2 state if no P2 controller
        if (connectedGamepadIndexP2 === null) {
            if(previousGameButtonStatesP2.length > 0) previousGameButtonStatesP2 = [];
        }


        // --- Pauze Check ---
        if (isPaused) {
            renderGame(); // Only render if paused
            return; // Skip game logic updates
        }


        // --- Player X Game Over Message Handling ---
        if (isShowingPlayerGameOverMessage && isTwoPlayerMode) {
            // If message duration is over
            if (now - playerGameOverMessageStartTime >= PLAYER_GAME_OVER_MESSAGE_DURATION) {
                isShowingPlayerGameOverMessage = false; // Hide message
                // Perform the determined next action
                if (nextActionAfterPlayerGameOver === 'switch_player') {
                    if (switchPlayerTurn()) { // Attempt to switch player
                        // Determine the level for the next wave (might increment if P2 just finished)
                        let levelForNextWaveReset = level;
                        // If P2 died, and P1 just completed this level, P1 starts the *next* level
                        if (playerWhoIsGameOver === 2 && currentPlayer === 1 && player1CompletedLevel === level) {
                           level++; // Advance level
                           player1CompletedLevel = -1; // Reset completion flag
                           levelForNextWaveReset = level;
                           // console.log(`Player 2 Game Over, Player 1 completed Level ${level-1}. Starting Level ${level}.`);
                        }

                        // Update max level reached for the player starting the turn
                        if (currentPlayer === 1) { player1MaxLevelReached = Math.max(player1MaxLevelReached, level); }
                        else { player2MaxLevelReached = Math.max(player2MaxLevelReached, level); }

                        resetWave(); // Reset for the next player/wave
                    } else { // switchPlayerTurn returned false (e.g., both players now out of lives)
                        // console.warn("[Player GO Delay End] Switch failed unexpectedly (likely both players out). Triggering final GO.");
                        triggerFinalGameOverSequence(); // Go to final results
                    }
                } else if (nextActionAfterPlayerGameOver === 'show_results') {
                    triggerFinalGameOverSequence(); // Both players out, show results
                } else { // Invalid action?
                    console.error("[Player GO Delay End] Invalid next action:", nextActionAfterPlayerGameOver);
                    triggerFinalGameOverSequence(); // Default to results
                }
                renderGame(); // Render the state after the action
                return; // Stop processing this frame
            } else { // Message still showing
                renderGame();
                return; // Wait for message to finish
            }
        } // --- End Player X Game Over Message ---


        // --- Capture Message Handling ---
        if (isShowingCaptureMessage) {
            const boss = enemies.find(e => e.id === capturedBossIdWithMessage); // Find the boss showing the message
            if (boss && boss.state === 'showing_capture_message') {
                // Animate the captured ship's rotation while message is shown
                const elapsedMessageTime = now - captureMessageStartTime;
                const animationProgress = Math.min(1.0, elapsedMessageTime / CAPTURE_MESSAGE_DURATION);
                boss.captureAnimationRotation = animationProgress * 2 * (2 * Math.PI); // Two full spins
            } else if (boss) { // If boss state changed unexpectedly, reset rotation
                 boss.captureAnimationRotation = 0;
            }

            // If message duration is over
            if (now - captureMessageStartTime >= CAPTURE_MESSAGE_DURATION) {
                isShowingCaptureMessage = false; // Hide message
                stopSound(shipCapturedSound); // Stop sound effect
                captureBeamActive = false; // Ensure beam is off
                capturingBossId = null; // Clear global capture boss ID

                if (boss && boss.state === 'showing_capture_message') {
                    // Transition boss to returning state
                    boss.state = 'returning';
                    boss.captureAnimationRotation = 0; // Reset animation rotation
                    try { // Set target grid position for return
                        const bossWidth = (boss.type === ENEMY3_TYPE) ? BOSS_WIDTH : ENEMY_WIDTH; // Use correct width
                        const { x: tgtX, y: tgtY } = getCurrentGridSlotPosition(boss.gridRow, boss.gridCol, bossWidth);
                        boss.targetGridX = tgtX; boss.targetGridY = tgtY;
                    } catch (e) { console.error(`[Capture Message End] Error getting grid pos for returning boss ${boss.id}:`, e); boss.targetGridX = gameCanvas.width / 2; boss.targetGridY = ENEMY_TOP_MARGIN; } // Fallback
                } else if (boss) {
                    console.warn(`[Capture Message End] Boss ${capturedBossIdWithMessage} state changed unexpectedly. Resetting rotation.`);
                    boss.captureAnimationRotation = 0; // Reset rotation anyway
                } else {
                    console.warn(`[Capture Message End] Could not find Boss ${capturedBossIdWithMessage} to reset state/rotation.`);
                }
                capturedBossIdWithMessage = null; // Clear the ID tracker for the message
            }

            // Continue moving/updating other entities while message is shown
            if (isInGameState && !isShowingPlayerGameOverMessage && gameOverSequenceStartTime === 0) {
                 moveEntities();
                 updateExplosions();
                 updateFloatingScores();
            }
            renderGame(); // Render the frame
            return; // Stop processing this frame until message is done or duration ends
        } // --- End Capture Message Handling ---


        // --- Player Input & AI Control ---
        // Process input/AI only if game is active and not blocked by messages/sequences
        if (!isShowingPlayerGameOverMessage && gameOverSequenceStartTime === 0 && !isShipCaptured && !isShowingCaptureMessage) {
            if (!isManualControl && isInGameState && playerLives > 0 ) { aiControl(); } // AI controls ship
            if (isInGameState && isManualControl && playerLives > 0) { handlePlayerInput(); } // Player controls ship
        }


        // --- Entity Updates (Movement, Explosions, Scores) ---
        // Run these updates if game is in a playable state
        if (isInGameState && !isShowingPlayerGameOverMessage && gameOverSequenceStartTime === 0 && !isShowingCaptureMessage) {
            moveEntities(); // Handles movement for ship, bullets, enemies, falling ships, and collisions
            updateExplosions(); // Updates explosion particle animations
            updateFloatingScores(); // Removes expired floating score text
        }


        // --- Invincibility Timer Check ---
        if (isInvincible && now >= invincibilityEndTime) {
            isInvincible = false; // Turn off invincibility
            invincibilityEndTime = 0;
            // console.log("Player invincibility ended.");
        }


        // --- Challenging Stage Post-Completion Message Handling ---
        if (isCsCompletionDelayActive && !isShowingPlayerGameOverMessage && gameOverSequenceStartTime === 0) {
            // Wait for initial delay before showing first message
            if (now - csCompletionDelayStartTime >= CS_COMPLETION_MESSAGE_DELAY) {
                 isCsCompletionDelayActive = false; // End the initial delay phase
                 if (csCompletionResultIsPerfect) { // Perfect score?
                     playSound(csPerfectSound);
                     showCsHitsMessage = true; // Show "XX HITS" message first
                     csHitsMessageStartTime = now;
                 } else { // Not perfect?
                     playSound(csClearSound);
                     showCSClearMessage = true; // Show "CHALLENGING STAGE" message
                     csClearMessageStartTime = now;
                 }
                 renderGame(); // Render the first message appearing
                 return; // Wait for message sequence to play out
            } else { // Still in initial delay
                 renderGame();
                 return; // Keep waiting
            }
        } // --- End CS Completion Delay ---


        // --- General Message Timeout Handling ---
        // Checks durations for various messages (CS results, Extra Life, Ready)
        let messageTimeoutCompleted = false; // Flag if a message sequence *finished* this frame
        let shouldExitEarly = false; // Flag if *any* message is *currently* active

        if (!isShowingPlayerGameOverMessage && gameOverSequenceStartTime === 0) {
            // Check CS Perfect sequence
            if (showCsHitsMessage) { /* ... unchanged ... */ if (Date.now() - csHitsMessageStartTime > CS_HITS_MESSAGE_DURATION) { showCsHitsMessage = false; showPerfectMessage = true; perfectMessageStartTime = now; } shouldExitEarly = true; }
            else if (showPerfectMessage) { /* ... unchanged ... */ if (Date.now() - perfectMessageStartTime > CS_PERFECT_MESSAGE_DURATION) { showPerfectMessage = false; showCsBonusScoreMessage = true; csBonusScoreMessageStartTime = now; } shouldExitEarly = true; }
            else if (showCsBonusScoreMessage) { /* ... unchanged ... */ if (Date.now() - csBonusScoreMessageStartTime > CS_BONUS_MESSAGE_DURATION) { showCsBonusScoreMessage = false; messageTimeoutCompleted = true; } shouldExitEarly = true; }
            // Check CS Clear sequence (not perfect)
            else if (showCSClearMessage) { /* ... unchanged ... */ if (Date.now() - csClearMessageStartTime >= CS_CLEAR_HITS_DELAY && !showCsHitsForClearMessage) { showCsHitsForClearMessage = true; } if (Date.now() - csClearMessageStartTime >= CS_CLEAR_SCORE_DELAY && !showCsScoreForClearMessage) { showCsScoreForClearMessage = true; } if (Date.now() - csClearMessageStartTime >= CS_CLEAR_DELAY) { showCSClearMessage = false; showCsHitsForClearMessage = false; showCsScoreForClearMessage = false; messageTimeoutCompleted = true; } shouldExitEarly = true; }
            // Check Extra Life message
            else if (showExtraLifeMessage) { /* ... unchanged ... */ if (Date.now() - extraLifeMessageStartTime > EXTRA_LIFE_MESSAGE_DURATION) { showExtraLifeMessage = false; messageTimeoutCompleted = true; } shouldExitEarly = true; }
            // Check "READY" message (als die nog relevant is)
            // else if (showReadyMessage) { /* ... */ }
        }

        // If any message is currently active, just render and wait for it to finish
        if (shouldExitEarly) {
            renderGame();
            return;
        }
        // If a message sequence *just completed* this frame, proceed to potential wave transition logic below
        // otherwise, continue with normal game logic.

        // --- Intro Sequence Handling ---
        if (isShowingIntro && !isShowingPlayerGameOverMessage && gameOverSequenceStartTime === 0) {
            let introTextFinished = false; // Flag to track if the text part is done
            const elapsedIntroTime = now - introDisplayStartTime; // Time since current step started
            const playerIntroDuration = 3000; // Duration for "PLAYER X" message
            const defaultStepDuration = INTRO_DURATION_PER_STEP; // Duration for other steps

            // Play appropriate intro sounds ONCE per step where needed
            if (introStep === 1) { // Player message or Level 1 start
                if (isTwoPlayerMode && !playerIntroSoundPlayed) { playSound(levelUpSound); playerIntroSoundPlayed = true; }
                if (level === 1 && currentPlayer === 1 && !playerIntroSoundPlayed) { playSound(startSound); playerIntroSoundPlayed = true; }
            } else if (introStep === 2) { // "STAGE X" (non-CS, non-L1)
                if (!isTwoPlayerMode && level > 1 && !isChallengingStage && !stageIntroSoundPlayed) { playSound(levelUpSound); stageIntroSoundPlayed = true; }
            } else if (introStep === 3) { // "CHALLENGING STAGE"
                if (!csIntroSoundPlayed) { playSound(entranceSound); csIntroSoundPlayed = true; }
            }

            // Determine when to move to the next intro step or finish
            if (introStep === 1) {
                let durationForStep1 = isTwoPlayerMode ? playerIntroDuration : defaultStepDuration;
                if (level === 1 && !isTwoPlayerMode) durationForStep1 = defaultStepDuration;

                if (elapsedIntroTime >= durationForStep1) {
                    if (isChallengingStage) { introStep = 3; }
                    else { introStep = 2; }
                    introDisplayStartTime = now;
                }
            } else if (introStep === 2) { // "STAGE X"
                 const durationForStep2 = defaultStepDuration;
                 if (elapsedIntroTime >= durationForStep2) { introTextFinished = true; }
            } else if (introStep === 3) { // "CHALLENGING STAGE"
                 if (elapsedIntroTime >= defaultStepDuration) { introTextFinished = true; }
            }

            // If intro text display is finished
            if (introTextFinished) {
                isShowingIntro = false; introStep = 0;
                if (!isChallengingStage) { aiCanShootTime = Date.now() + 3000; }
                else { aiCanShootTime = 0; }

                if (isChallengingStage) {
                     startChallengingStageSequence();
                } else {
                    currentWaveDefinition = generateWaveDefinition(level);
                    if (currentWaveDefinition && currentWaveDefinition.length > 0) {
                         if (isFullGridWave) { startFullGridWave(); }
                         else { scheduleEntranceFlightWave(); }
                    } else {
                         console.warn(`Wave ${level} definition failed. Transitioning immediately.`);
                         isEntrancePhaseActive = false; stopSound(entranceSound);
                         isWaveTransitioning = true; readyForNextWaveReset = true;
                         const failDelay = 100;
                         setTimeout(() => {
                             if ((isInGameState || (!isInGameState && playerLives > 0)) && typeof resetWave === 'function') {
                                 if(playerLives > 0) { resetWave(); }
                                 else { triggerFinalGameOverSequence(); }
                             }
                         }, failDelay);
                    }
                }
            }
            renderGame();
            return;
        } // --- End Intro Handling ---


        // --- Core Gameplay Logic (Runs after Intro/Messages) ---
        if (gameJustStarted) { gameJustStarted = false; }

        if (!isShowingPlayerGameOverMessage && gameOverSequenceStartTime === 0) {

            // --- Grid Breathing Effect ---
             if (GRID_BREATH_ENABLED && isInGameState && !isChallengingStage && !isWaveTransitioning && playerLives > 0 ) {
                 const gridEnemiesExist = enemies.some(e => e?.state === 'in_grid');
                 if (gridEnemiesExist && isGridBreathingActive) { /* ... update factor ... */ const elapsedBreathTime = now - gridBreathStartTime; const effectiveGridBreathCycleMs = scaleValue(level, BASE_GRID_BREATH_CYCLE_MS, MIN_GRID_BREATH_CYCLE_MS); const cycleTime = elapsedBreathTime % effectiveGridBreathCycleMs; currentGridBreathFactor = (Math.sin((cycleTime / effectiveGridBreathCycleMs) * Math.PI * 2 - Math.PI / 2) + 1) / 2; }
                 else if (!gridEnemiesExist && isGridBreathingActive) { /* ... stop breathing ... */ isGridBreathingActive = false; gridBreathStartTime = 0; currentGridBreathFactor = 0; }
                 else if (gridEnemiesExist && !isGridBreathingActive) { /* ... start breathing ... */ isGridBreathingActive = true; gridBreathStartTime = now; currentGridBreathFactor = 0; }
             } else { /* ... ensure stopped ... */ if (isGridBreathingActive) { isGridBreathingActive = false; gridBreathStartTime = 0; currentGridBreathFactor = 0; } } // --- End Grid Breathing ---

             // --- Entrance Phase Completion Check ---
             if (isEntrancePhaseActive) {
                 const allSpawnsProcessed = enemiesSpawnedThisWave >= totalEnemiesScheduledForWave;
                 const isAnyEnemyStillEntering = enemies.some(e => e?.state === 'following_entrance_path' || e?.state === 'moving_to_grid' || e?.state === 'following_bezier_path');
                 if (totalEnemiesScheduledForWave > 0 && allSpawnsProcessed && !isAnyEnemyStillEntering) {
                     const wasEntrancePhaseActiveBefore = isEntrancePhaseActive;
                     isEntrancePhaseActive = false;
                     if (wasEntrancePhaseActiveBefore) {
                         stopSound(entranceSound);
                         enemiesSpawnedThisWave = 0; totalEnemiesScheduledForWave = 0;
                         enemySpawnTimeouts.forEach(clearTimeout); enemySpawnTimeouts = [];
                         gridJustCompleted = true;
                         // console.log("[runSingleGameUpdate] Entrance phase ended.");
                         if (!isChallengingStage && typeof triggerImmediateCaptureDive === 'function') {
                             // console.log("[runSingleGameUpdate] Triggering immediate capture dive check after entrance phase.");
                             triggerImmediateCaptureDive();
                         }
                     }
                 }
             } // --- End Entrance Completion Check ---


            // --- Trigger Grid Firing ---
            if (!isChallengingStage && !isShowingIntro && !isPaused && !isWaveTransitioning) {
                triggerGridFiring();
            }


            // --- Active Gameplay Logic (Post-Entrance Phase) ---
            if (!isWaveTransitioning && playerLives > 0 && !isShowingIntro && !isShipCaptured && !isShowingCaptureMessage && !isEntrancePhaseActive) {

                // --- Wave Completion Check ---
                let allEnemiesGone = enemies.length === 0;
                let noFallingShips = fallingShips.length === 0;
                let waveConsideredComplete = false;

                if (isChallengingStage) { if (allEnemiesGone && !isEntrancePhaseActive) { waveConsideredComplete = true; } }
                else { if (allEnemiesGone && !isEntrancePhaseActive && noFallingShips) { waveConsideredComplete = true; } }

                // --- Handle Wave Completion ---
                if (waveConsideredComplete) {
                     if (isGridBreathingActive) { isGridBreathingActive = false; gridBreathStartTime = 0; currentGridBreathFactor = 0; }
                     if (!isManualControl && ship && gameCanvas?.width > 0) { ship.x = Math.round(gameCanvas.width / 2 - ship.width / 2); ship.targetX = ship.x; }
                     isWaveTransitioning = true;
                     if (isGridSoundPlaying) { stopSound(gridBackgroundSound); isGridSoundPlaying = false; }
                     bullets = []; enemyBullets = []; explosions = []; enemySpawnTimeouts.forEach(clearTimeout); enemySpawnTimeouts = [];
                     totalEnemiesScheduledForWave = 0; enemiesSpawnedThisWave = 0; floatingScores = [];

                     const playerWhoCompleted = currentPlayer;
                     if(isTwoPlayerMode && playerWhoCompleted === 1) { player1CompletedLevel = level; }
                     let resetDelay;

                     if (isChallengingStage) {
                         csCompletionResultIsPerfect = (challengingStageEnemiesHit >= challengingStageTotalEnemies);
                         csCurrentChainHits = 0; csCurrentChainScore = 0; csLastHitTime = 0; csLastChainHitPosition = null;
                         isCsCompletionDelayActive = true; csCompletionDelayStartTime = now;
                         if (csCompletionResultIsPerfect) {
                            const scoreBeforeBonus = score; score += 10000; highScore = Math.max(highScore, score);
                             let flagToCheck_CS = false; let setFlagFunction_CS = null;
                             if (!isManualControl) { flagToCheck_CS = player1TriggeredHighScoreSound; setFlagFunction_CS = () => { player1TriggeredHighScoreSound = true; }; }
                             else if (isTwoPlayerMode) { if (currentPlayer === 1) { flagToCheck_CS = player1TriggeredHighScoreSound; setFlagFunction_CS = () => { player1TriggeredHighScoreSound = true; }; } else { flagToCheck_CS = player2TriggeredHighScoreSound; setFlagFunction_CS = () => { player2TriggeredHighScoreSound = true; }; } }
                             else { flagToCheck_CS = player1TriggeredHighScoreSound; setFlagFunction_CS = () => { player1TriggeredHighScoreSound = true; }; }
                             if (!flagToCheck_CS && score > highScore - 10000) {
                                 if (setFlagFunction_CS) setFlagFunction_CS();
                                 playSound(hiScoreSound);
                             }
                             if (currentPlayer === 1) player1Score = score; else player2Score = score;
                             checkAndAwardExtraLife();
                             resetDelay = CS_COMPLETION_MESSAGE_DELAY + CS_HITS_MESSAGE_DURATION + CS_PERFECT_MESSAGE_DURATION + CS_BONUS_MESSAGE_DURATION;
                         } else { checkAndAwardExtraLife(); resetDelay = CS_COMPLETION_MESSAGE_DELAY + CS_CLEAR_DELAY; }
                         resetDelay += 100;
                     } else { // Normal wave completion
                          playSound(waveUpSound);
                          normalWaveCurrentChainHits = 0; normalWaveCurrentChainScore = 0; normalWaveLastHitTime = 0; normalWaveLastChainHitPosition = null;
                          resetDelay = POST_MESSAGE_RESET_DELAY;
                     }

                     // --- Schedule Next Wave Reset ---
                     setTimeout(() => {
                         let advanceLevel = false; let playerToStartNext = currentPlayer;
                         if (isTwoPlayerMode) {
                             if (currentPlayer === 1) player1Score = score; else player2Score = score;
                             const switchedOK = switchPlayerTurn();
                             if (switchedOK) { playerToStartNext = currentPlayer; if (playerWhoCompleted === 2 && player1CompletedLevel === level) { advanceLevel = true; player1CompletedLevel = -1; } else { advanceLevel = false; } }
                             else { playerToStartNext = playerWhoCompleted; advanceLevel = true; player1CompletedLevel = -1; }
                         } else { playerToStartNext = 1; advanceLevel = true; }
                         if (advanceLevel) { level++; }
                         const livesForNextWave = (playerToStartNext === 1) ? player1Lives : player2Lives;
                         if (livesForNextWave > 0) { if (playerToStartNext === 1) { player1MaxLevelReached = Math.max(player1MaxLevelReached, level); } else { player2MaxLevelReached = Math.max(player2MaxLevelReached, level); } resetWave(); }
                         else { console.error("Error: Tried to start wave for player with 0 lives. Triggering Game Over."); triggerFinalGameOverSequence(); }
                     }, resetDelay);

                    renderGame();
                    return; // Stop processing until transition completes
                } // --- End Wave Completion Handling ---


                // --- Enemy Attack Logic (Normal Attacks Only) ---
                if (!isChallengingStage) {
                     if (enemies.length > 0) {
                         let attackGroupEnemies = null;
                         const gridEnemies = enemies.filter(e => e?.state === 'in_grid');
                         const isLastFewEnemies = gridEnemies.length <= 3;
                         const levelFactor = Math.max(1, Math.min(level, LEVEL_CAP_FOR_SCALING));
                         const baseAttackInterval = 4200; const minAttackInterval = 800;
                         const levelReduction = (levelFactor - 1) * ((baseAttackInterval - minAttackInterval) / (LEVEL_CAP_FOR_SCALING -1));
                         const currentAttackInterval = Math.max(minAttackInterval, baseAttackInterval - levelReduction);
                         const effectiveMaxAttackingEnemies = Math.round(scaleValue(level, BASE_MAX_ATTACKING_ENEMIES, MAX_MAX_ATTACKING_ENEMIES));
                         const attackingEnemiesCount = enemies.filter(e => e?.state === 'attacking' || e?.state === 'preparing_attack').length;

                         if ( isLastFewEnemies || (now - lastEnemyDetachTime > currentAttackInterval && gridEnemies.length > 0 && attackingEnemiesCount < effectiveMaxAttackingEnemies) ) {
                            attackGroupEnemies = findAndDetachEnemy(); // Selects for normal attack
                             if (attackGroupEnemies && attackGroupEnemies.length > 0) {
                                 const validAttackers = attackGroupEnemies.map(e => enemies.find(es => es?.id === e.id)).filter(e => e && e.state === 'in_grid');
                                 if (validAttackers.length > 0) {
                                     const leaderEnemy = validAttackers[0];
                                     const attackType = leaderEnemy.attackType; // Should be 'normal'
                                     if (!isLastFewEnemies) { lastEnemyDetachTime = now; } // Reset timer

                                     if (attackType === 'normal') {
                                         const sharedPath = generateAttackPath(leaderEnemy);
                                         if (sharedPath && sharedPath.length > 0) {
                                             if (validAttackers.length === 3 && leaderEnemy.type === ENEMY3_TYPE && level !== 1) { playSound(tripleAttackSound); }
                                             let sortedAttackers = [...validAttackers]; const groupSize = sortedAttackers.length;
                                             if (groupSize > 1) { /* ... group sorting and offset calculation ... */ let bossInGroup = null; let nonBossAttackers = []; sortedAttackers.forEach(attacker => { if (attacker.type === ENEMY3_TYPE) bossInGroup = attacker; else nonBossAttackers.push(attacker); }); if (bossInGroup && level !== 1 && groupSize === 3 && nonBossAttackers.length === 2) { sortedAttackers = [nonBossAttackers[0], bossInGroup, nonBossAttackers[1]]; } else { sortedAttackers.sort((a, b) => (a?.gridCol ?? 0) - (b?.gridCol ?? 0)); } const MINIMAL_GAP_BETWEEN_ATTACKERS = 5; let totalFormationWidth = 0; sortedAttackers = sortedAttackers.filter(attacker => attacker && typeof attacker.width === 'number'); const currentGroupSize = sortedAttackers.length; for (let k = 0; k < currentGroupSize; k++) { totalFormationWidth += sortedAttackers[k].width; if (k < currentGroupSize - 1) totalFormationWidth += MINIMAL_GAP_BETWEEN_ATTACKERS; } const formationStartOffsetX = -totalFormationWidth / 2; let currentOffsetX = formationStartOffsetX; for (let k = 0; k < currentGroupSize; k++) { const attacker = sortedAttackers[k]; attacker.attackFormationOffsetX = currentOffsetX + attacker.width / 2; currentOffsetX += attacker.width + MINIMAL_GAP_BETWEEN_ATTACKERS; } }
                                             else { sortedAttackers.forEach(att => att.attackFormationOffsetX = 0); }
                                             const attackGroupId = `attack-${leaderEnemy.id}-${now}`; sortedAttackers.forEach(attacker => { if(attacker) attacker.attackGroupId = attackGroupId });

                                             // --- Schedule Firing for Attackers ---
                                             let shouldFire = false; let fireDelay = GROUP_FIRE_BURST_DELAY;
                                             if (leaderEnemy.type === ENEMY2_TYPE || leaderEnemy.type === ENEMY3_TYPE) { shouldFire = true; if(leaderEnemy.type === ENEMY2_TYPE && groupSize === 1) { fireDelay = SOLO_BUTTERFLY_FIRE_DELAY; } } else if (leaderEnemy.type === ENEMY1_TYPE) { shouldFire = true; }
                                             if (isLastFewEnemies && level > 1) { shouldFire = false; }
                                             if (shouldFire) { sortedAttackers.forEach(attacker => { const canAttackerFire = attacker && !(attacker.type === ENEMY3_TYPE && attacker.hasCapturedShip); if (canAttackerFire) { fireEnemyBurst(attacker.id, 'attacking', fireDelay); } }); }

                                             // --- Start Attack Movement (Staggered) ---
                                             sortedAttackers.forEach((enemyToAttack, delayIndex) => {
                                                  if (enemyToAttack && enemyToAttack.state === 'in_grid') {
                                                     enemyToAttack.state = 'preparing_attack'; enemyToAttack.justReturned = false; enemyToAttack.velocityX = 0; enemyToAttack.velocityY = 0; enemyToAttack.canFireThisDive = false;
                                                     setTimeout(() => {
                                                         if (isPaused) { return; }
                                                         const currentEnemyStateDelayed = enemies.find(e => e?.id === enemyToAttack.id);
                                                         if (currentEnemyStateDelayed && currentEnemyStateDelayed.state === 'preparing_attack') {
                                                             try {
                                                                 const effectiveBaseSpeed = scaleValue(level, BASE_ENEMY_ATTACK_SPEED, MAX_ENEMY_ATTACK_SPEED); let speedFactor = 1.0; if (currentEnemyStateDelayed.type === ENEMY1_TYPE) speedFactor = ENEMY1_DIVE_SPEED_FACTOR; else if (currentEnemyStateDelayed.type === ENEMY2_TYPE) speedFactor = ENEMY2_DIVE_SPEED_FACTOR; else if (currentEnemyStateDelayed.type === ENEMY3_TYPE) speedFactor = ENEMY3_ATTACK_SPEED_FACTOR;
                                                                 if(enemyToAttack.type === ENEMY3_TYPE) playSound(bossGalagaDiveSound); else playSound(butterflyDiveSound);
                                                                 currentEnemyStateDelayed.state = 'attacking'; currentEnemyStateDelayed.attackPathSegments = sharedPath; currentEnemyStateDelayed.attackPathSegmentIndex = 0; currentEnemyStateDelayed.attackPathT = 0; currentEnemyStateDelayed.speed = effectiveBaseSpeed * speedFactor; currentEnemyStateDelayed.lastFiredTime = 0; currentEnemyStateDelayed.canFireThisDive = true;
                                                             } catch (attackStartError) { console.error(`Error starting attack for ${enemyToAttack.id}:`, attackStartError); }
                                                         }
                                                     }, delayIndex * GROUP_DETACH_DELAY_MS); // Stagger delay
                                                 }
                                             }); // End forEach attacker start movement
                                         } else { /* ... handle path failure ... */ console.warn(`[DEBUG Attack Path Failed] Could not generate path for leader ${leaderEnemy?.id}. Skipping attack.`); attackGroupEnemies.forEach(e => { if (e) e.justReturned = false; }); }
                                     } // End NORMAL attack sequence
                                 } // End if validAttackers found
                             } // End if attack group selected
                         } // End check if time to detach
                     } // End if enemies.length > 0
                 } // End if (!isChallengingStage)


                // --- Captured Ship Firing Logic ---
                 enemies.forEach(enemy => { if (enemy && enemy.type === ENEMY3_TYPE && enemy.hasCapturedShip && enemy.state === 'attacking' && enemy.capturedShipDimensions && typeof enemy.capturedShipLastFiredTime === 'number') { if (now - enemy.capturedShipLastFiredTime > CAPTURED_SHIP_FIRE_COOLDOWN_MS) { const capturedShipCenterX = enemy.x + enemy.width / 2; const capturedShipBottomY = enemy.y + enemy.height + enemy.capturedShipDimensions.height * 0.5; const firePos = { x: capturedShipCenterX, y: capturedShipBottomY }; if (createBulletSimple(enemy, firePos)) { enemy.capturedShipLastFiredTime = now; playSound(playerShootSound); } } } });

            } // --- End Active Gameplay Logic Block (Post-Entrance) ---


        // --- Game Over / Results Screen Handling ---
        } else if (gameOverSequenceStartTime > 0) { // If Game Over sequence has started
            const elapsedTime = now - gameOverSequenceStartTime;
            const isShowingResults = elapsedTime >= GAME_OVER_DURATION; // Check if delay is over

            // If results should be shown now and aren't already
            if (isShowingResults && !isShowingResultsScreen) {
                isShowingResultsScreen = true; // Set flag
                stopSound(gameOverSound); // Stop game over sound
                playSound(resultsMusicSound, true); // Start results music
                // console.log("Showing results screen, playing results music.");
            }
            // Continue rendering the game over / results screen
        } // --- End Game Over / Results Screen ---

        // --- Final Render Call ---
        renderGame(); // Render the current state of the game

    } catch (error) { // --- Main Try-Catch Error Handler ---
         console.error("!!! CRITICAL ERROR IN runSingleGameUpdate !!!", error, error.stack);
         // Attempt to gracefully stop the game and return to menu
         isPaused = false; // Ensure not stuck paused
         if (mainLoopId) { cancelAnimationFrame(mainLoopId); mainLoopId = null; } // Stop game loop
         isInGameState = false; // Mark as not in game state
         // Reset potentially blocking flags
         isShowingPlayerGameOverMessage = false; playerGameOverMessageStartTime = 0; playerWhoIsGameOver = 0; nextActionAfterPlayerGameOver = '';
         alert("A critical error occurred in the game loop. Please refresh."); // Inform user
         stopAllGameSounds(); // Stop all sounds
         isGridSoundPlaying = false; isInvincible = false; invincibilityEndTime = 0;
         try { // Attempt to show menu state
             if(typeof showMenuState === 'function') { showMenuState(); }
         } catch (menuError) { console.error("Failed to return to menu after critical error:", menuError); }
    } // --- End Main Try-Catch ---
} // <<< Functie runSingleGameUpdate EINDE >>>


/**
 * Checks if the current score warrants an extra life and awards it based on per-player thresholds.
 * <<< GEWIJZIGD: Log bij toekennen leven verwijderd. >>>
 */
function checkAndAwardExtraLife() {
    // <<< Functie inhoud ongewijzigd >>>
    try {
        let currentThresholdsMetSet; // Which player's thresholds are we checking?
        if (!isManualControl || !isTwoPlayerMode) { // AI or Single Player uses P1's set
             currentThresholdsMetSet = player1LifeThresholdsMet;
        } else { // Two Player uses the current player's set
             currentThresholdsMetSet = (currentPlayer === 1) ? player1LifeThresholdsMet : player2LifeThresholdsMet;
        }

        let awardedLifeNow = false; // Did we award a life in this specific call?

        // Loop to handle potentially crossing multiple thresholds at once (e.g., large bonus)
        while (true) {
             let lifeAwardedThisIteration = false;
             let nextThreshold = -1; // Threshold to check in this iteration
             const thresholdsAlreadyMetCount = currentThresholdsMetSet.size;

             // Determine the next threshold based on how many have been met
             if (thresholdsAlreadyMetCount === 0) { nextThreshold = EXTRA_LIFE_THRESHOLD_1; } // First threshold
             else { nextThreshold = EXTRA_LIFE_THRESHOLD_2 + (thresholdsAlreadyMetCount - 1) * RECURRING_EXTRA_LIFE_INTERVAL; } // Subsequent thresholds

             // Check if score reached the threshold AND this threshold hasn't been met before
             if (nextThreshold !== -1 && score >= nextThreshold && !currentThresholdsMetSet.has(nextThreshold)) {
                 playerLives++; // Award life
                 currentThresholdsMetSet.add(nextThreshold); // Mark threshold as met
                 awardedLifeNow = true; // Flag that a life was awarded in this function call
                 lifeAwardedThisIteration = true; // Flag for the while loop

                 // console.log(`Player ${currentPlayer} awarded extra life at ${nextThreshold} points! Lives: ${playerLives}`);

                 // Update the actual player lives variable if in 2P mode
                 if (isTwoPlayerMode) {
                     if (currentPlayer === 1) player1Lives = playerLives;
                     else player2Lives = playerLives;
                 }
             }

             // If no life was awarded in this iteration, exit the while loop
             if (!lifeAwardedThisIteration) { break; }
        } // End while loop

        // If a life was awarded in this call AND the message isn't already showing, show it
        if (awardedLifeNow && !showExtraLifeMessage) {
             showExtraLifeMessage = true; // Trigger message display
             extraLifeMessageStartTime = Date.now(); // Start timer for message duration
             playSound(extraLifeSound); // Play sound effect
        }
    } catch (e) {
        console.error("Error checking/awarding extra life:", e);
    }
} // <<< Einde checkAndAwardExtraLife >>>


/**
 * Functie om de *definitieve* game over sequence te starten
 */
function triggerFinalGameOverSequence() {
    // <<< GEWIJZIGD: Expliciete stopSound(resultsMusicSound) toegevoegd >>>
    if (isInGameState && gameOverSequenceStartTime === 0) {
        isPaused = false; isShowingDemoText = false; isShowingIntro = false; isWaveTransitioning = false; showCsHitsMessage = false; showExtraLifeMessage = false; showPerfectMessage = false; showCSClearMessage = false; showCsHitsForClearMessage = false; showCsScoreForClearMessage = false; showReadyMessage = false; showCsBonusScoreMessage = false; isShowingPlayerGameOverMessage = false; isEntrancePhaseActive = false; isCsCompletionDelayActive = false; csCompletionDelayStartTime = 0; csCompletionResultIsPerfect = false; csIntroSoundPlayed = false;
        if (isManualControl) { saveHighScore(); }

        // Stop alle expliciet loopende geluiden
        stopSound(gridBackgroundSound);
        stopSound(menuMusicSound);
        stopSound(resultsMusicSound); // <<< TOEGEVOEGD (extra zekerheid) >>>
        // Stop andere potentieel lange geluiden
        stopSound(captureSound);
        stopSound(entranceSound);
        isGridSoundPlaying = false;

        const now = Date.now();
        if (!isTwoPlayerMode) {
            playSound(gameOverSound); // Speel Game Over SFX
            gameOverSequenceStartTime = now;
        } else {
            // Sla de "GAME OVER" tekst over in 2P, ga direct naar resultaten
            gameOverSequenceStartTime = now - GAME_OVER_DURATION; // Zodat elapsedTime direct >= GAME_OVER_DURATION is
            playSound(resultsMusicSound, true); // Start resultaten muziek direct
            isShowingResultsScreen = true; // Zet vlag direct
        }

        bullets = []; enemyBullets = []; explosions = []; fallingShips = []; isDualShipActive = false;
        previousButtonStates = []; previousGameButtonStates = []; previousGameButtonStatesP2 = [];
    }
}

/** Triggert de game over sequence (roept nu helper aan) */
function triggerGameOver() { /* ... ongewijzigd ... */ triggerFinalGameOverSequence(); }


// --- EINDE deel 8      van 8 dit codeblok ---
// --- END OF FILE game_logic.js ---