/*
end of turn automation for twilight sanctuary, requires midi-qol and event macros
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/twilightSanctuaryAura.js
*/
const GM_MACRO = "twilightSanctuaryRemoveEffectsGM";
const twilightAura = {
    removeTwilightEffects: function _removeTwilightEffects(caster) {
        gmMacro.execute(caster.id);
    }
};

let gmMacro = game.macros.getName(GM_MACRO);

if (!gmMacro) {
    ui.notifications.notify(`${GM_MACRO} not found!`);
    return;
}

let caster = origin.parent;

twilightAura.removeTwilightEffects(caster);
