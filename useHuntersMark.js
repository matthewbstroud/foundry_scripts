/*
Move Hunter's Mark to a new target
Requires original target to be dead
Cast the spell if it is not already up
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/useHuntersMark.js
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

var huntersMarkEffectTarget = tempItem.data.changes.find(e => e.key == "flags.midi-qol.huntersMark");

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

huntersMarkEffectTarget.update({
    value: targetID
});

let priorEffect = markedTarget?.actor?.effects?.find(e => e.data.label == "Marked" && e.data.origin == primarySpell.uuid);
if (priorEffect) {
    await priorEffect.delete();
}

let effectData = {
    "changes": [
      {
        "key": "StatusEffectLabel",
        "mode": 0,
        "value": "Marked",
        "priority": "20"
      }
    ],
    "origin": primarySpell.uuid,
    "disabled": false,
    "duration": {
      "startTime": null,
      "seconds": 3600
    },
    "icon": "systems/dnd5e/icons/skills/green_01.jpg",
    "label": "Hunter's Mark",
    "transfer": false,
    "flags": {
      "dae": {
        "selfTarget": false,
        "stackable": "none",
        "durationExpression": "",
        "macroRepeat": "none",
        "specialDuration": [],
        "transfer": false
      },
      "core": {
        "statusId": ""
      },
      "dnd5e-helpers": {
        "rest-effect": "Ignore"
      },
      "ActiveAuras": {
        "isAura": false,
        "aura": "None",
        "radius": null,
        "alignment": "",
        "type": "",
        "ignoreSelf": false,
        "height": false,
        "hidden": false,
        "displayTemp": false,
        "hostile": false,
        "onlyOnce": false
      }
    },
    "tint": null,
    "selectedKey": "StatusEffectLabel"
  };
  let target = await fromUuid(targetID);
  await target.actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
