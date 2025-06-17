// FILE: battle_log_transformer.js
'use strict';

// Version 2.0: Stripped-down version for Aang vs. Azula
// - Removed all unnecessary imports and switch cases for unused characters/events.

import { characters } from './data_characters.js';
import { phaseTemplates } from './data_narrative_phases.js';
import { ESCALATION_STATES } from './engine_escalation.js';

/**
 * Determines the visual impact level for an animation based on the move's effectiveness.
 * @param {string} effectivenessLabel - The effectiveness of the move (e.g., 'Critical').
 * @param {string} moveType - The type of the move (e.g., 'Finisher').
 * @returns {string} The impact level ('low', 'medium', 'high', 'critical').
 */
function determineImpactLevel(effectivenessLabel, moveType) {
    const label = (effectivenessLabel || '').toLowerCase();
    switch (label) {
        case 'critical': return 'critical';
        case 'strong': return 'high';
        case 'normal': return (moveType === 'Finisher') ? 'high' : 'medium';
        case 'weak': return 'low';
        default: return 'low';
    }
}

/**
 * Transforms a structured log of battle events into a queue for the animated text engine.
 * @param {Array<object>} structuredLogEvents - The raw event log from the battle simulation.
 * @returns {Array<object>} A queue of simplified objects for the animation engine.
 */
export function transformEventsToAnimationQueue(structuredLogEvents) {
    const animationQueue = [];
    if (!structuredLogEvents || !Array.isArray(structuredLogEvents)) {
        return animationQueue;
    }

    let lastEventWasKOAction = false;

    structuredLogEvents.forEach(event => {
        if (!event || !event.type) return;

        // Prevent conclusion from appearing twice if it follows a KO
        if (lastEventWasKOAction && event.type === 'conclusion_event') return;

        lastEventWasKOAction = (event.type === 'final_blow_event' || (event.type === 'curbstomp_event' && event.isMajorEvent && !event.isEscape));

        let textContent = event.text || '';
        let animationEvent = {
            text: textContent,
            pauseAfter: event.pauseAfter || 500 // Default pause
        };

        switch (event.type) {
            case 'phase_header_event':
                animationEvent.text = `${event.phaseName || 'New Phase'} ${event.phaseEmoji || '⚔️'}`;
                animationEvent.isPhaseHeader = true;
                animationEvent.pauseAfter = 1200;
                break;
            case 'dialogue_event':
            case 'internal_thought_event':
                animationEvent.actorId = event.actorId;
                animationEvent.characterName = event.characterName;
                animationEvent.isDialogue = true;
                animationEvent.dialogueType = event.dialogueType;
                animationEvent.pauseAfter = textContent.length > 50 ? 1000 : 600;
                break;
            case 'move_action_event':
                animationEvent.isMoveAction = true;
                animationEvent.impactLevel = determineImpactLevel(event.effectiveness, event.moveType);
                animationEvent.moveData = { name: event.moveName, type: event.moveType, effectiveness: event.effectiveness };
                animationEvent.pauseAfter = 1000;
                break;
            case 'escalation_change_event':
                animationEvent.isStatusEvent = true;
                animationEvent.impactLevel = 'high';
                animationEvent.pauseAfter = 1300;
                break;
            case 'curbstomp_event':
            case 'final_blow_event':
            case 'conclusion_event':
                animationEvent.impactLevel = 'critical';
                animationEvent.isMajorEvent = true;
                animationEvent.pauseAfter = 2500;
                break;
            case 'stalemate_result_event':
                animationEvent.impactLevel = 'high';
                animationEvent.isMajorEvent = true;
                animationEvent.pauseAfter = 2000;
                break;
            default:
                // For any other simple narrative events
                animationEvent.impactLevel = 'low';
                break;
        }

        animationQueue.push(animationEvent);
    });

    return animationQueue;
}


/**
 * Transforms a structured log of battle events into a single HTML string for display.
 * @param {Array<object>} structuredLogEvents - The raw event log from the battle simulation.
 * @returns {string} A single string of HTML representing the complete battle log.
 */
export function transformEventsToHtmlLog(structuredLogEvents) {
    if (!structuredLogEvents || !Array.isArray(structuredLogEvents)) {
        return "<p>Error: Battle log data is corrupted or unavailable.</p>";
    }

    let htmlLog = "";
    let isPhaseDivOpen = false;

    const appendToLog = (content) => {
        if (isPhaseDivOpen) {
            // Insert before the closing '</div>' tag of the current phase
            const closingTagIndex = htmlLog.lastIndexOf('</div>');
            if (closingTagIndex !== -1) {
                htmlLog = htmlLog.substring(0, closingTagIndex) + content + '</div>';
            } else {
                htmlLog += content; // Fallback
            }
        } else {
            htmlLog += content;
        }
    };

    structuredLogEvents.forEach(event => {
        if (!event || !event.type) return;

        let currentTurnNumber = (event.turn !== undefined) ? event.turn : null; // Use event.turn consistently
        let turnNumberHtml = currentTurnNumber !== null ? `<div class="log-turn-number">Turn ${currentTurnNumber}</div>` : '';

        if (event.type === 'phase_header_event') {
            if (isPhaseDivOpen) htmlLog += `</div>`; // Close previous phase
            const phaseHeaderHtml = event.html_content.replace('{phaseKey}', event.phaseKey || 'unknown');
            htmlLog += phaseHeaderHtml;
            isPhaseDivOpen = true;
        } else {
            let eventHtml = event.html_content || `<p class="log-generic">${event.text || 'Unknown event.'}</p>`;

            switch (event.type) {
                case 'turn_marker':
                    // Turn marker already handled by currentTurnNumber above, but if it has html_content, use it.
                    if (event.html_content) { appendToLog(event.html_content); }
                    break;
                case 'move_action_event':
                    // Direct append, as html_content is already formatted
                    appendToLog(turnNumberHtml + eventHtml);
                    break;
                case 'collateral_damage_event': // Now used for specific environmental impacts
                case 'environmental_impact_event': // Alias for clarity
                    appendToLog(turnNumberHtml + eventHtml);
                    break;
                case 'environmental_summary_event':
                    appendToLog(turnNumberHtml + eventHtml);
                    break;
                case 'dialogue_event':
                case 'internal_thought_event':
                case 'stun_event':
                case 'energy_recovery_event':
                case 'manipulation_narration_event':
                case 'action_failure_event':
                case 'escalation_change_event':
                case 'curbstomp_event':
                case 'final_blow_event':
                case 'stalemate_result_event':
                case 'conclusion_event':
                    appendToLog(turnNumberHtml + eventHtml);
                    break;
                case 'dice_roll':
                    appendToLog(`<div class="log-roll">🎲 [${event.rollType}] ${event.actorId ? `(${event.actorId}) ` : ''}rolled ${event.result.toFixed(2)} ${event.threshold ? `vs ${event.threshold.toFixed(2)}` : ''} → <strong>${event.outcome}</strong></div>`);
                    break;
                default:
                    // Fallback for any unhandled event types
                    appendToLog(turnNumberHtml + eventHtml);
                    console.warn(`Unhandled event type in transformEventsToHtmlLog: ${event.type}`, event);
                    break;
            }
        }
    });

    if (isPhaseDivOpen) {
        htmlLog += `</div>`; // Ensure the last phase div is always closed
    }

    return htmlLog || "<p>The battle unfolds...</p>";
}