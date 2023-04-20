/*
Cast magic missile if it is not up, otherwise use a remaining dart
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/useMagicMissile.js
*/
const PRIMARY_SPELL = "Magic Missile";
const TEMP_ITEM = "Magic Dart";

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
    ui.notifications.notify(`${targetActor.name} doesn't know ${PRIMARY_SPELL}!`);
    return;
}

let targets = Array.from(game.user.targets);
if (targets.length != 1) {
    ui.notifications.notify(`You must target a single creature you wish to attack!`);
    return;
}

var tempItem = targetActor.items.getName(TEMP_ITEM);
if (!tempItem) {
    let message = await primarySpell.roll({
        createChatMessage: true
    });
    if (!message) {
        return;
    }
    let workflowId = message.getFlag("midi-qol", "workflowId");
    let workflow = MidiQOL.Workflow.getWorkflow(workflowId);
    let itemLevel = workflow?.itemLevel;
    message.update({ flavor: `Missile 1 of ${2 + itemLevel}` });
    message.render();
    return;
}


if (tempItem.data.data.uses.value == 0) {
    tempItem.delete();
    return;
}
let uses = tempItem.data.data.uses.value - 1;
let maxUses = tempItem.data.data.uses.max + 1;

let message = await tempItem.roll({
    consumeUsage: true,
    consumeQuantity: true,
    configureDialog: false,
    createChatMessage: true
});
message.update({ flavor: `Missile ${maxUses - uses} of ${maxUses}` });
message.render();