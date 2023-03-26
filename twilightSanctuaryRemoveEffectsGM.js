/*
gm has to strip effects
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/twilightSanctuaryRemoveEffectsGM.js
*/

const twilight = {
    removeTwilightEffects: function _removeTwilightEffects(caster) {
        let twilightEffects = [];
        canvas.scene.tokens
            .filter(t => t.actor && t.actor.data.type == 'character').forEach(t => {
                let removeEffects = t.actor.effects.contents.filter(e => e.data.origin?.startsWith(`Actor.${caster.id}`) && e.data.label.match(/(twilight sanctuary|tsaura)/gi));
                twilightEffects = twilightEffects.concat(removeEffects);
            });
        twilightEffects.forEach(e => e.delete());
    }
};

if (!args || args.length != 1){
    return;
}
let caster = game.actors.get(args[0]);
if (!caster){
    return;
}
twilight.removeTwilightEffects(caster);
