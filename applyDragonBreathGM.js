/*
Taken from https://github.com/chrisk123999/foundry-macros/blob/main/Spells/Dragon's%20Breath/Chris-DragonsBreath.js
Modified to work with v9
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/applyDragonBreathGM.js
*/
if (!args || args.length != 5) {
    ui.notifications.notify('Invalid paramters for applyDragnBreathGM.');
    return;
}

function getDamageIcon(damageType) {
    switch (damageType) {
        case 'acid':
            return 'icons/magic/acid/projectile-smoke-glowing.webp';
        case 'cold':
            return 'icons/magic/water/projectile-icecicles-salvo.webp';
        case 'fire':
            return 'icons/magic/fire/projectile-wave-yellow.webp';
        case 'lightning':
            return 'icons/magic/lightning/projectile-orb-blue.webp';
        case 'poison':
            return 'icons/magic/death/skull-poison-green.webp';
    }
}
let sourceUUID = args[0];
let targetTokenID = args[1];
let targetToken = canvas.tokens.get(targetTokenID);
if (!targetToken) return;
let spellLevel = args[2];
let spellDC = args[3];
let damageType = args[4];
let damageIcon = getDamageIcon(damageType);

let packName = 'world.autospells';
let pack = game.packs.get(packName);
if (!pack) return;
let packItems = await pack.getDocuments();
if (packItems.length === 0) return;
let itemData = packItems.find(item => item.name === 'Dragon Breath');
if (!itemData) return;
let itemObject = itemData.toObject();
let diceNumber = spellLevel + 1;
itemObject.data.damage.parts = [
    [
        diceNumber + 'd6[' + damageType + ']',
        damageType
    ]
];
itemObject.data.save.dc = spellDC;
let effectData = {
    'label': itemObject.name,
    'icon': damageIcon,
    'duration': {
        'seconds': 60
    },
    'origin': sourceUUID,
    'flags': {
        'effectmacro': {
            'onDelete': {
                'script': "warpgate.revert(token.document, '" + itemObject.name + "');"
            }
        },
    }
};
let updates = {
    'embedded': {
        'Item': {
            [itemObject.name]: itemObject
        },
        'ActiveEffect': {
            [itemObject.name]: effectData
        }
    }
};
let options = {
    'permanent': false,
    'name': itemObject.name,
    'description': itemObject.name
};
await warpgate.mutate(targetToken.document, updates, {}, options);