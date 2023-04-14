// added to the remove event of the hunter's mark self-effect
let caster = origin.parent;
var huntersMarkItem = caster.items.getName("Hunter's Mark");
if (!huntersMarkItem) {
    return;
}
let markedActors = canvas.scene.tokens
    .filter(t => t.id != caster.id && t.actor && t.actor.effects.find(e => e.data.origin == huntersMarkItem.uuid && e.data.label == "Hunter's Mark"));
markedActors.forEach(a => {
    game.dfreds.effectInterface.removeEffect({
        effectName: "Hunter's Mark",
        uuid: a.uuid,
        origin: huntersMarkItem.uuid
    });
});