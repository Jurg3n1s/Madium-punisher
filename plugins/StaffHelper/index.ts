import { findByProps } from "@vendetta/metro";
import { FluxDispatcher } from "@vendetta/metro/common";

const RULES = [
    { pattern: /\bn+i+g+g+e+r+\b/i, punishment: "Ban — N-word with hard R." },
    { pattern: /\bn+i+g+g+[ae]+\b/i, punishment: "Warn + Mute 1 day — N-word without hard R." },
    { pattern: /\b(pedo|pedophil|child.?porn|loli.?sex|shota.?sex)\b/i, punishment: "Immediate Ban (No Appeal) — Pedophilic content." },
    { pattern: /\b(dox(x)?ing?|doxx)\b/i, punishment: "Instant Ban (No Appeal) — Doxxing." },
    { pattern: /\b(nsfl|gore|snuff|rape.?threat)\b/i, punishment: "Immediate Ban (No Appeal) — NSFL/gore." },
    { pattern: /discord\.gg\/\S+/i, punishment: "Instant Ban — Discord server ad." },
    { pattern: /\b(synapse|krnl|fluxus|script-ware|sentinel|evon|delta executor)\b/i, punishment: "Warn + Mute 1 day — Executor ad." },
    { pattern: /\b(racist|racism|sexist|homophob|transphob|antisemit)\b/i, punishment: "Mute 1 day + Warn — Discrimination." },
    { pattern: /(.)\1{9,}/, punishment: "Warn + Mute 1 day — Flood/spam." },
    { pattern: /[\u0300-\u036f\u200b\u200c\u200d\uFEFF]/, punishment: "Warn — Automod bypass." },
    { pattern: /\b(hardcore|hentai|xxx|explicit.?sex|graphic.?sex)\b/i, punishment: "Warn + Mute 1 day — Heavy NSFW." },
    { pattern: /\b(lewd|semi.?nude|thirst.?trap)\b/i, punishment: "Warn + Mute 12h — Medium NSFW." },
    { pattern: /\b(suggestive|risqu[eé])\b/i, punishment: "Warn + Mute 1h — Light NSFW." },
    { pattern: /\b(dm.?me|hmu.?in.?dms?|slide.?into.?dms?)\b/i, punishment: "Warn — DM leading." },
];

function getPunishment(content: string): string | null {
    for (const rule of RULES) {
        if (rule.pattern.test(content)) return rule.punishment;
    }
    return null;
}

const Toasts = findByProps("open", "close");

function onMessage({ message }: any) {
    if (!message?.content) return;
    const punishment = getPunishment(message.content);
    if (!punishment) return;
    Toasts?.open({
        content: `📋 ${punishment}`,
        source: { uri: "https://cdn.discordapp.com/emojis/1085943916673175562.webp" },
    });
}

export default {
    onLoad() {
        FluxDispatcher.subscribe("MESSAGE_CREATE", onMessage);
    },
    onUnload() {
        FluxDispatcher.unsubscribe("MESSAGE_CREATE", onMessage);
    },
};
