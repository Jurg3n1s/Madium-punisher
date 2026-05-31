import { findByProps, findByDisplayName } from "@vendetta/metro";
import { React } from "@vendetta/metro/common";
import { after } from "@vendetta/patcher";

const RULES = [
    { pattern: /\bn+i+g+g+e+r+\b/i, punishment: "🔨 Ban — N-word with hard R." },
    { pattern: /\bn+i+g+g+[ae]+\b/i, punishment: "⚠️ Warn + 🔇 Mute 1 day — N-word without hard R." },
    { pattern: /\b(pedo|pedophil|child.?porn|loli.?sex|shota.?sex)\b/i, punishment: "🔨 Immediate Ban (No Appeal) — Pedophilic content." },
    { pattern: /\b(dox(x)?ing?|doxx)\b/i, punishment: "🔨 Instant Ban (No Appeal) — Doxxing threat/joke." },
    { pattern: /\b(nsfl|gore|snuff|rape.?threat)\b/i, punishment: "🔨 Immediate Ban (No Appeal) — NSFL/gore." },
    { pattern: /discord\.gg\/\S+/i, punishment: "🔨 Instant Ban — Discord server advertisement." },
    { pattern: /\b(synapse|krnl|fluxus|script-ware|sentinel|evon|delta executor)\b/i, punishment: "⚠️ Warn + 🔇 Mute 1 day — Advertising another executor." },
    { pattern: /\b(racist|racism|sexist|homophob|transphob|antisemit)\b/i, punishment: "🔇 Mute 1 day + ⚠️ Warn — Discrimination." },
    { pattern: /(.)\1{9,}/, punishment: "⚠️ Warn + 🔇 Mute 1 day — Flood/spam." },
    { pattern: /[\u0300-\u036f\u200b\u200c\u200d\uFEFF]/, punishment: "⚠️ Warn — Automod bypass. (Mute 3-6h if repeated.)" },
    { pattern: /\b(hardcore|hentai|xxx|explicit.?sex|graphic.?sex)\b/i, punishment: "⚠️ Warn + 🔇 Mute 1 day — Heavy NSFW. (May escalate to ban.)" },
    { pattern: /\b(lewd|semi.?nude|thirst.?trap)\b/i, punishment: "⚠️ Warn + 🔇 Mute 12h — Medium NSFW." },
    { pattern: /\b(suggestive|risqu[eé])\b/i, punishment: "⚠️ Warn + 🔇 Mute 1h — Light suggestive content." },
    { pattern: /\b(dm.?me|hmu.?in.?dms?|slide.?into.?dms?)\b/i, punishment: "⚠️ Warn — DM leading. (Mute 1 day if done twice.)" },
];

function getPunishment(content: string): string | null {
    for (const rule of RULES) {
        if (rule.pattern.test(content)) return rule.punishment;
    }
    return null;
}

const { View, Text } = findByProps("Text") ?? require("react-native");

function PunishmentBanner({ punishment }: { punishment: string }) {
    return React.createElement(
        View,
        { style: { backgroundColor: "#2b1a1a", borderLeftColor: "#ff4444", borderLeftWidth: 3, paddingVertical: 4, paddingHorizontal: 8, marginTop: 3, borderRadius: 4 } },
        React.createElement(Text, { style: { color: "#ffcc44", fontSize: 12 } }, `📋 Suggested: ${punishment}`)
    );
}

let unpatch: (() => void) | undefined;

export default {
    onLoad() {
        const MessageComponent = findByDisplayName("Message") ?? findByProps("renderCozy", "renderCompact");
        if (!MessageComponent) return;

        unpatch = after("render", MessageComponent.prototype ?? MessageComponent, ([props]: any, res: any) => {
            const content = props?.message?.content ?? res?.props?.message?.content;
            const punishment = getPunishment(content);
            if (!punishment || !res?.props) return res;

            const banner = React.createElement(PunishmentBanner, { key: "staff-helper", punishment });
            if (Array.isArray(res.props.children)) {
                res.props.children.push(banner);
            } else {
                res.props.children = [res.props.children, banner];
            }
            return res;
        });
    },
    onUnload() {
        unpatch?.();
    },
};
