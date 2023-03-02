/*
Macro will generate two 1 use trinkets in the player's inventory.  Each will roll a predetermined value 
to the GM and then be destroyed.  Your daily portent uses are decremented on use.

You cannot summon portent dice unless you have none and your portent uses are at 2.
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/rollPortentDice.js
*/

if (!actor) {
    ui.notifications.notify('No current actor.');
    return;
}
if (!actor.items.find(i => i.name.startsWith("Portent") && i.data.type === "feat")) {
    ui.notifications.notify(`${actor.name} doesn't have the Portent ability.`);
    return;
}

let existingDice = actor.items.filter(i => i.name.startsWith("Portent") && i.data.type === "consumable");
let portent = actor.data.items.find((i) => i.name == "Portent" && i.data.type == "feat");
let currentUses = parseInt(portent.data.data.uses.value);
if (existingDice.length > 0 || currentUses < 2) {
    ui.notifications.notify(`You have already rolled portent dice today.`);
    return;
}

let dice1 = await createPortentDice(actor);
let dice2 = await createPortentDice(actor);

ChatMessage.create({ 
    speaker: { alias: actor.name }, 
    content: `Summons two mystical dice, each die has the same value on every face. The values are ${dice1} and ${dice2}.`, 
    type: CONST.CHAT_MESSAGE_TYPES.EMOTE 
});

function createPortentDice(actor) {
    let diceRoll = new Roll('1d20').evaluate({ async: false });
    let portentDice =
    {
        "name": `Portent Die (${diceRoll.total})`,
        "type": "consumable",
        "img": "icons/sundries/gaming/dice-runed-tan.webp",
        "data": {
            "description": {
                "value": "A magical dice that can change the destiny of the possessor.",
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
                "type": "bonus",
                "cost": 1,
                "condition": ""
            },
            "duration": {
                "value": null,
                "units": ""
            },
            "target": {
                "value": "self",
                "width": null,
                "units": "",
                "type": ""
            },
            "range": {
                "value": null,
                "long": null,
                "units": ""
            },
            "uses": {
                "value": 1,
                "max": "1",
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
                        `${diceRoll.total}`,
                        "midi-none"
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
                "effectActivation": false,
                "onUseMacroName": "[postDamageRoll]syncPortentDice"
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
    };
    actor.createEmbeddedDocuments('Item', [portentDice]);
    return diceRoll.total;
}