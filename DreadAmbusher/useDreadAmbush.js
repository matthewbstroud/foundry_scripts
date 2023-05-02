/*
apply dread ambush damage
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/useDreadAmbush.js
*/
const PRIMARY_SPELL = "Dread Ambush Damage";

if (canvas.tokens.controlled.length != 1) {
    ui.notifications.notify(`Please select a single actor!`);
    return;
}
let targetActor = canvas.tokens.controlled[0].actor;
if (!targetActor) {
    ui.notifications.notify(`Please select an actor!`);
    return;
}

var primarySpell = targetActor.items.getName(PRIMARY_SPELL);
if (!primarySpell) {
    ui.notifications.notify(`${targetActor.name} doesn't have ${PRIMARY_SPELL}!`);
    return;
}

let targets = Array.from(game.user.targets);
if (targets.length != 1) {
    ui.notifications.notify(`You must target a single creature you wish to attack!`);
    return;
}

let keys = keyboard.downKeys;
let isCritical = keys.has("ShiftLeft") || keys.has("ShiftRight");

let spell = targetActor.items.getName(PRIMARY_SPELL);
if (!spell) {
    return;
}

spell.roll({
    versatile: isCritical
});