// added to the remove event of the hunter's mark self-effect
let caster = origin.parent;
var huntersMarkItem = caster.items.getName("Hunter's Mark");
if (!huntersMarkItem) {
    return;
}
let GM_MACRO = "removeEffects_GM";
let gmMacro = game.macros.getName(GM_MACRO);

if (!gmMacro) {
    return;
}

let uuids = canvas.scene.tokens
    .filter(t => t.id != caster.id)
    .map(t => t.actor.effects.contents)
    .reduce((l, r) => l.concat(r)).filter(e => e.data.origin == huntersMarkItem.uuid && e.data.label == "Marked")
    .map(e => e.uuid);

gmMacro.execute(uuids);