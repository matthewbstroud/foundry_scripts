/*
Move Hunter's Mark to a new target
Requires original target to be dead
Cast the spell if it is not already up
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/useHuntersMark.js
*/
const GM_MACRO = "moveHuntersMark_GM";
debugger;
let gmMacro = game.macros.getName(GM_MACRO);

if (!gmMacro) {
  ui.notifications.notify(`Macro ${GM_MACRO} not found!`);
  return;
}

if (canvas.tokens.controlled.length != 1) {
  ui.notifications.notify(`Please select a single actor!`);
  return;
}
let targetActor = canvas.tokens.controlled[0].actor;
if (!targetActor || targetActor.data.type == "npc") {
  ui.notifications.notify(`Please select a player!`);
  return;
}

var primarySpell = targetActor.items.getName("Hunter's Mark");
if (!primarySpell) {
  ui.notifications.notify(`${targetActor.name} doesn't know Hunter's Mark!`);
  return;
}

let targets = Array.from(game.user.targets);
if (targets.length != 1) {
  ui.notifications.notify(`You must target a single creature you wish to mark!`);
  return;
}

var tempItem = targetActor.effects.find(e => e.data.label == "Hunter's Mark" && e.data.origin == primarySpell.uuid);
if (!tempItem) {
  primarySpell.roll();
  return;
}

let targetID = targets[0].document.uuid;

let markedTargetID = targetActor.getFlag("midi-qol", "huntersMark");
if (!markedTargetID) {
  ui.notifications.notify(`You do not have a marked target!`);
  return;
}

if (targetID == markedTargetID) {
  ui.notifications.notify(`This target is already marked!`);
  return;
}

let markedTarget = await fromUuid(markedTargetID);
if (markedTarget && markedTarget.actor.data.data.attributes.hp.value > 0) {
  ui.notifications.notify(`${markedTarget.name} must be dead before you can move your mark!`);
  return;
}

await tempItem.update({
  "changes": [
    {
      "key": "flags.midi-qol.huntersMark",
      "mode": 5,
      "value": `${targetID}`,
      "priority": 20
    },
    {
      "key": "flags.dnd5e.DamageBonusMacro",
      "mode": 0,
      "value": "ItemMacro.Hunter's Mark",
      "priority": 20
    }
  ]
});

gmMacro.execute(primarySpell.uuid, markedTargetID, targetID);