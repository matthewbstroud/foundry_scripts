/*
fast roll thieves tools
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/useThievesTools.js
*/

if (canvas.tokens.controlled.length != 1) {
    ui.notifications.info("You must have a single token selected!");
    return;
}
let currentActor = canvas.tokens.controlled[0].actor;
let thievesTools = currentActor.items.find((i) => i.data.name == "Thieves' Tools");

if (!thievesTools) {
    ui.notifications.error(`${currentActor.name} doesn't have Thieves' Tools!`);
    return;
}
thievesTools.rollToolCheck({ "fastForward": true });