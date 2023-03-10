/*
Taken from https://github.com/chrisk123999/foundry-macros/blob/main/Spells/Dragon's%20Breath/Chris-DragonsBreath.js
Modified to work with v9
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/applyDragonBreath.js
*/

debugger;
let chris = {
    'dialog': async function _dialog(title, options) {
        let buttons = options.map(([label, value]) => ({ label, value }));
        let selected = await warpgate.buttonDialog(
            {
                buttons,
                title,
            },
            'column'
        );
        return selected;
    },
    'getSpellDC': function _getSpellDC(item) {
        let spellDC;
        let scaling = item.data.data.save.scaling;
        if (scaling === 'spell') {
            spellDC = item.actor.data.data.attributes.spelldc;
        } else {
            spellDC = item.actor.data.data.abilities[scaling].dc;
        }
        return spellDC;
    },
    'getDamageIcon': function _getDamageIcon(damageType) {
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
};
if (this.targets.size != 1) return;
let targetToken = this.targets.first();
let spellLevel = args[0].spellLevel;
let spellDC = chris.getSpellDC(this.item);
let damageType = await chris.dialog('What damage type?', [['🧪 Acid', 'acid'], ['❄️ Cold', 'cold'], ['🔥 Fire', 'fire'], ['⚡ Lightning', 'lightning'], ['☠️ Poison', 'poison']]);
if (!damageType) damageType = 'fire';
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
    'icon': chris.getDamageIcon(damageType),
    'duration': {
        'seconds': 60
    },
    'origin': this.item.uuid,
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