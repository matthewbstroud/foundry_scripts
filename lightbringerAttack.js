/*
Apply undead damage.
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/lightbringerAttack.js
*/
if (!["mwak"].includes(args[0].item.data.actionType)) return {};
if (args[0].hitTargets.length < 1) return {};

token = canvas.tokens.get(args[0].tokenId);
actor = token.actor;
if (!actor || !token || args[0].hitTargets.length < 1) return {};
let lightbringerLit = !(actor.effects.contents.find(e => e.data.label == 'Lightbringer')?.data.disabled ?? true);
if (!lightbringerLit) return {};

let target = canvas.tokens.get(args[0].hitTargets[0].id ?? args[0].hitTargets[0]._id);
if (!target) MidiQOL.error("Lightbringer macro failed");

let targetType = target.actor.data.data.details.type.value;
if (targetType != 'undead') return {};
let isCritical = args[0].isCritical; 
let dieCount = isCritical ? 2 : 1;
var rollData = `${dieCount}d6[radiant]`;
return { damageRoll: rollData, flavor: "Lightbringer Glows Hot" };