/*
Macro will generate a trinket in the player's inventory that represents the darts for Magic Missile. 
The number of charges will be 3 + @spellLevel.
The damage per die will be a single roll of 1d4 + 1 (each dart will have the same damage)
Will replace a dart trinket if one already exists in the players inventory.
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/createMagicDarts.js
*/

if (!actor) {
    ui.notifications.notify('No current actor.');
    return;
}
if (!actor.items.find(i => i.name.startsWith("Magic Missile") && i.data.type === "spell")) {
    ui.notifications.notify(`${actor.name} doesn't have Magic Missile.`);
    return;
}

if (!args || args.length != 1){
    ui.notifications.notify('Macro expected to be called from Magic Missile Midi-Qol Macro (After Damage Roll).');
}

// remove any existing
await actor.items.filter(i => i.name.startsWith("Magic Dart") && i.data.type === "consumable").forEach(i => {
    i.delete();
});

let damageAmount = args[0].damageTotal;
let numberOfTargets = args[0].targets.length;
// we only need to create darts for those not rolled immediately
let numberOfDarts = 3 + (args[0].spellLevel - 1) - numberOfTargets;

if (numberOfDarts == 0) {
    return;
}

await createDarts(damageAmount, numberOfDarts);

function createDarts(damageAmount, numberOfDarts) {
    let darts =
    {
        "name": "Magic Dart",
        "type": "consumable",
        "img": "systems/dnd5e/icons/spells/fire-arrows-sky-1.jpg",
        "data": {
            "description": {
                "value": "A magic dart that always reaches the target.",
                "chat": "",
                "unidentified": ""
            },
            "source": "",
            "quantity": 1,
            "weight": 0,
            "price": 0,
            "attunement": 0,
            "equipped": false,
            "rarity": "",
            "identified": true,
            "activation": {
                "type": "none",
                "cost": 0,
                "condition": ""
            },
            "duration": {
                "value": null,
                "units": ""
            },
            "target": {
                "value": 1,
                "width": null,
                "units": "",
                "type": "creature"
            },
            "range": {
                "value": 5,
                "long": 120,
                "units": "ft"
            },
            "uses": {
                "value": numberOfDarts,
                "max": numberOfDarts,
                "per": "charges",
                "autoDestroy": true
            },
            "consume": {
                "type": "",
                "target": "",
                "amount": null
            },
            "ability": "",
            "actionType": "other",
            "attackBonus": 0,
            "chatFlavor": "",
            "critical": {
                "threshold": null,
                "damage": ""
            },
            "damage": {
                "parts": [
                    [
                        `${damageAmount}`,
                        "force"
                    ]
                ],
                "versatile": ""
            },
            "formula": "",
            "save": {
                "ability": "",
                "dc": null,
                "scaling": "spell"
            },
            "consumableType": "trinket"
        },
        "effects": [],
        "flags": {
            "midi-qol": {
                "effectActivation": false
            },
            "midiProperties": {
                "nodam": false,
                "fulldam": false,
                "halfdam": false,
                "rollOther": false,
                "critOther": false,
                "magicdam": false,
                "magiceffect": false,
                "concentration": false,
                "toggleEffect": false
            },
            "ddbimporter": {
                "ignoreIcon": true,
                "ignoreItemImport": true,
                "retainResourceConsumption": false
              }
        }
    }
    actor.createEmbeddedDocuments('Item', [darts]);
}
