/*
Move Hunter's Mark to a new target
Requires original target to be dead
Cast the spell if it is not already up
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/moveHuntersMark_GM.js
*/
let primarySpellID = args[0];
let oldTargetUuid = args[1];
let targetID = args[2];

let markedTarget = await fromUuid(oldTargetUuid);

let priorEffect = markedTarget?.actor?.effects?.find(e => e.data.label == "Marked" && e.data.origin == primarySpellID);
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
  "origin": primarySpellID,
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