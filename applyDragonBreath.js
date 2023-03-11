/*
Taken from https://github.com/chrisk123999/foundry-macros/blob/main/Spells/Dragon's%20Breath/Chris-DragonsBreath.js
Modified to work with v9
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/applyDragonBreath.js
*/
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
    'GM_MACRO': 'applyDragonBreathGM'
};

let activeGMS = game.users.filter(u => u.active && u.role == 4);
if (!activeGMS || activeGMS.length == 0) {
    ui.notifications.notify(`This cannot be used without an active GM in game!`);
    return;
}

let gmMacro = game.macros.getName(chris.GM_MACRO);

if (!gmMacro) {
    ui.notifications.notify(`${chris.GM_MACRO} not found!`);
    return;
}
if (this.targets.size != 1) return;
let targetToken = this.targets.first();
let spellLevel = args[0].spellLevel;
let spellDC = chris.getSpellDC(this.item);
let damageType = await chris.dialog('What damage type?', [['🧪 Acid', 'acid'], ['❄️ Cold', 'cold'], ['🔥 Fire', 'fire'], ['⚡ Lightning', 'lightning'], ['☠️ Poison', 'poison']]);
if (!damageType) damageType = 'fire';
gmMacro.execute(this.item.uuid, targetToken.document.id, spellLevel, spellDC, damageType);
