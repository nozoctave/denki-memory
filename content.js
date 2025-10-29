(function() {
    'use strict';

    // === GLOBALE DATENBANKEN ===
    // Speichert: [Karten-Element] -> "Gereinigter Definitionstext"
    const cardDefinitionMap = new Map();
    // Speichert: "Begriff (vom Titel)" -> "Korrekte Definition"
    const allChapterDefinitions = new Map();
    
    let currentPermanentObserver = null;

    // === HILFSFUNKTIONEN ===
    
    function log(message) {
        console.log(`[TU Memory Helfer] ${message}`);
    }

    // Flexibler Regex, um "Klicken zum..." zu entfernen
    const clickPattern = /Klicken zum (Auswählen|Ansehen)/gi;

    /**
     * Reinigt einen Text, um ihn vergleichbar zu machen.
     * Entfernt "Klicken"-Text, Zeilenumbrüche und doppelte Leerzeichen.
     */
    function normalizeText(text) {
        if (!text) return "";
        let newText = text;
        
        // 1. "Klicken"-Text entfernen
        newText = newText.replace(clickPattern, "");
        // 2. Alle Zeilenumbrüche, Tabs usw. durch ein Leerzeichen ersetzen
        newText = newText.replace(/[\r\n\t]+/g, " ");
        // 3. Mehrfache Leerzeichen durch ein einziges ersetzen
        newText = newText.replace(/\s{2,}/g, " ");
        // 4. Leerzeichen am Anfang/Ende entfernen
        newText = newText.trim();
        
        return newText;
    }

    // Die 'decodeBase64'-Funktion wird NICHT MEHR BENÖTIGT.

    async function fetchData(url) {
        log(`API-Anfrage an: ${url}`);
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`API-Fehler: ${response.status}`);
            return await response.json();
        } catch (error) {
            log(`Netzwerk- oder Fetch-Fehler: ${error.message}`);
            throw error;
        }
    }

    //
    // ******** HIER IST DIE GROSSE ÄNDERUNG (Version 8.0) ********
    //
    /**
     * Holt ALLE Begriffe und Definitionen mit einer EINZIGEN API-Anfrage.
     */
    async function fetchAllDefinitions(chapterId, statusElement) {
        try {
            // 1. Nur EINE Anfrage an die neue API-Struktur
            const allTerms = await fetchData(`https://memory.iguw.tuwien.ac.at/api/concepts/?chapter_id=${chapterId}`);
            
            // 2. Daten verarbeiten (keine weiteren Anfragen nötig)
            for (const termData of allTerms) {
                if (termData.term && termData.definition) {
                    // 3. Definitionen normalisieren und in unserer Datenbank speichern
                    const normalizedDefinition = normalizeText(termData.definition);
                    allChapterDefinitions.set(termData.term, normalizedDefinition);
                }
            }
            
            log(`Alle ${allChapterDefinitions.size} Definitionen wurden im Hintergrund geladen.`);
            
        } catch (e) {
            log(`Schwerer Fehler beim Laden der Kapitel-Definitionen: ${e}`);
            statusElement.innerText = "Fehler: API-Daten konnten nicht geladen werden.";
        }
    }

    /**
     * PHASE 1: Startet die einmalige Lernphase.
     * (Diese Funktion bleibt gleich, sie lernt das Spielfeld.)
     */
    function startLearningPhase(gameGrid, totalCards, statusElement) {
        return new Promise((resolve) => {
            log(`Lernphase gestartet. Bitte hovere über alle ${totalCards} Karten...`);
            
            const learningObserver = new MutationObserver(() => {
                const cardWrappers = Array.from(gameGrid.children);

                for (const wrapper of cardWrappers) {
                    const cardElement = wrapper.querySelector('.rounded-xl');
                    if (!cardElement || cardDefinitionMap.has(cardElement)) {
                        continue;
                    }

                    const revealedText = cardElement.innerText;

                    // Prüfen, ob der Text eine Definition ist
                    if (clickPattern.test(revealedText)) {
                        
                        // Karten-Text normalisieren
                        const normalizedText = normalizeText(revealedText);
                        
                        if (normalizedText.length > 5) {
                            cardDefinitionMap.set(cardElement, normalizedText);
                            log(`Karte gelernt (${cardDefinitionMap.size}/${totalCards}): "${normalizedText.substring(0, 30)}..."`);
                            statusElement.innerText = `Lernphase: ${cardDefinitionMap.size} / ${totalCards} Karten gesehen.`;
                        }
                        
                        if (cardDefinitionMap.size === totalCards) {
                            log("--- LERNPHASE ABGESCHLOSSEN ---");
                            learningObserver.disconnect();
                            resolve(); 
                        }
                    }
                }
            });

            learningObserver.observe(gameGrid, { 
                childList: true, 
                subtree: true,
                characterData: true 
            });
        });
    }

    /**
     * Stellt sicher, dass die markierte Karte markiert bleibt.
     * (Diese Funktion bleibt gleich)
     */
    function startPermanentObserver(cardElement) {
        if (currentPermanentObserver) currentPermanentObserver.disconnect();

        currentPermanentObserver = new MutationObserver(() => {
            if (!cardElement.classList.contains('permanent-highlight')) {
                cardElement.classList.add('permanent-highlight');
                log("Highlight wiederhergestellt.");
            }
        });
        currentPermanentObserver.observe(cardElement, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
    }

    /**
     * PHASE 2: Löst die aktuelle Runde (und alle folgenden).
     * (Diese Funktion bleibt gleich)
     */
    function solveCurrentRound(statusElement) {
        log("Starte Lösungsversuch...");
        const currentTerm = document.querySelector('h2.font-bold').innerText.trim();
        
        const correctDefinition = allChapterDefinitions.get(currentTerm);

        if (!correctDefinition) {
            log(`Fehler: Konnte geladene Definition für "${currentTerm}" nicht finden.`);
            return;
        }
        
        log(`Suche Karte mit (normalisiertem) Text: "${correctDefinition.substring(0, 30)}..."`);
        let foundCard = null;

        for (const [cardElement, cardText] of cardDefinitionMap.entries()) {
            cardElement.classList.remove('permanent-highlight');
            
            if (cardText === correctDefinition) {
                foundCard = cardElement;
            }
        }

        if (foundCard) {
            log("!!! LÖSUNG GEFUNDEN UND MARKIERT !!!");
            statusElement.innerText = `Lösung für "${currentTerm}" markiert!`;
            foundCard.classList.add('permanent-highlight');
            startPermanentObserver(foundCard);
            setTimeout(() => statusElement.classList.add('hidden'), 2000);
        } else {
            log("Fehler: Karte nicht in Datenbank gefunden. Normalisierung fehlgeschlagen?");
            statusElement.innerText = "Fehler: Karte nicht gefunden.";
        }
    }

    /**
     * Startet den Beobachter für den Titel (H2).
     * (Diese Funktion bleibt gleich)
     */
    function startTitleObserver(titleElement, statusElement) {
        let currentTitle = titleElement.innerText;
        const titleObserver = new MutationObserver(() => {
            if (titleElement.innerText !== currentTitle) {
                log("Titel hat sich geändert! Starte automatische Lösung...");
                currentTitle = titleElement.innerText;
                statusElement.classList.remove('hidden');
        
                setTimeout(() => solveCurrentRound(statusElement), 50); 
            }
        });
        titleObserver.observe(titleElement, { childList: true, characterData: true, subtree: true });
        log("Titel-Beobachter ist jetzt aktiv. Jede Runde wird automatisch gelöst.");
    }


    /**
     * HAUPT-INITIALISIERUNG
     * (Diese Funktion bleibt gleich)
     */
    async function initializeHelper() {
        log('Content-Skript wird geladen... (Version 8.0)');
        
        const statusElement = document.createElement('div');
        statusElement.className = 'helper-status';
        statusElement.innerText = 'Helfer wartet auf Spielstart...';
        document.body.appendChild(statusElement);

        let targetTermElement, gameGrid;
        while (!gameGrid || !targetTermElement) {
            targetTermElement = document.querySelector('h2.font-bold');
            gameGrid = document.querySelector('div[class*="grid-cols-"]');
            if (!gameGrid || !targetTermElement) await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        const chapterIdMatch = window.location.pathname.match(/\/game\/(\d+)/);
        if (!chapterIdMatch) {
            log("Fehler: Kapitel-ID nicht gefunden."); return;
        }
        
        const chapterId = chapterIdMatch[1];
        const totalCardsToLearn = gameGrid.children.length; 

        // 1. Alle Definitionen für das Kapitel im Hintergrund laden (NEUE FUNKTION)
        statusElement.innerText = "Lade alle Definitionen im Hintergrund...";
        await fetchAllDefinitions(chapterId, statusElement);

        // 2. Einmalige Lernphase starten (wartet auf Hovers)
        statusElement.innerText = `Lernphase: 0 / ${totalCardsToLearn} Definitionen gesehen.`;
        await startLearningPhase(gameGrid, totalCardsToLearn, statusElement);

        // 3. Lernphase ist beendet. Lösungs-Modus starten.
        statusElement.innerText = "Lernphase abgeschlossen. Starte Lösungs-Modus.";
        
        // 4. Titel-Beobachter starten
        startTitleObserver(targetTermElement, statusElement);
        
        // 5. Die erste Runde sofort lösen
        solveCurrentRound(statusElement);
    }

    // Skript starten
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initializeHelper);
    } else {
        initializeHelper();
    }

})();
