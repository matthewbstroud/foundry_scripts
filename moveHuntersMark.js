/*
Move Hunter's Mark to a new target
Requires original target to be dead
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/moveHuntersMark.js
*/
if (canvas.tokens.controlled.length != 1) {
    ui.notifications.notify(`Please select a single actor!`);
    return;
}
let targetActor = canvas.tokens.controlled[0].actor;
if (!targetActor || targetActor.data.type == "npc") {
    ui.notifications.notify(`Please select a player!`);
    return;
}

var huntersMarkItem = targetActor.items.getName("Hunter's Mark");
if (!huntersMarkItem) {
    ui.notifications.notify(`${targetActor.name} doesn't know Hunter's Mark!`);
    return;
}

var huntersMarkParentEffect = targetActor.effects.find(e => e.data.label == "Hunter's Mark" && e.data.origin == "Actor.USz1jAGCsPlW3KV1.Item.uyE2oWDqTNlBjNJD");
if (!huntersMarkParentEffect) {
    ui.notifications.notify(`${targetActor.name} doesn't have Hunter's Mark active!`);
    return;
}

var huntersMarkEffectTarget = huntersMarkParentEffect.data.changes.find(e => e.key == "flags.midi-qol.huntersMark");

let targets = Array.from(game.user.targets);
if (targets.length != 1) {
    ui.notifications.notify(`You must target the creature you wish to mark!`);
    return;
}
let targetID = targets[0].document.uuid;

let markedTargetID = targetActor.getFlag("midi-qol", "huntersMark");
if (!markedTargetID) {
    ui.notifications.notify(`You do not have a marked target!`);
    return;
}

if (targetID === markedTargetID) {
    ui.notifications.notify($`This target is already marked!`);
    return;
}

let markedTarget = await fromUuid(markedTargetID);
if (markedTarget && markedTarget.actor.data.data.attributes.hp.value > 0) {
    ui.notifications.notify(`${markedTarget.name} must be dead before you can move your mark!`);
    return;
}

huntersMarkEffectTarget.update({
    value: targetID
});

await game.dfreds.effectInterface.removeEffect({
    effectName: "Hunter's Mark",
    uuid : markedTargetID,
    origin: huntersMarkItem.uuid
});

await game.dfreds.effectInterface.addEffect({
    effectName: "Hunter's Mark", 
    uuid: targetID, 
    origin: huntersMarkItem.uuid, 
    overlay: false, 
    metadata: {}
});