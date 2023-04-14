// onUse macro
if (args[0].hitTargets.length === 0) return;
if (args[0].tag === "OnUse") {
    const targetUuid = args[0].hitTargets[0].uuid;
    const tokenOrActor = await fromUuid(args[0].actorUuid);
    const caster = tokenOrActor.actor ? tokenOrActor.actor : tokenOrActor;

    if (!caster || !targetUuid) {
        ui.notifications.warn("Hunter's Mark: no token/target selected");
        console.error("Hunter's Mark: no token/target selected");
        return;
    }

    const effectData = {
        changes: [
            {
                key: "flags.midi-qol.huntersMark",
                mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
                value: targetUuid,
                priority: 20,
            }, // who is marked
            {
                key: "flags.dnd5e.DamageBonusMacro",
                mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
                value: `ItemMacro.${args[0].item.name}`,
                priority: 20,
            }, // macro to apply the damage
        ],
        origin: args[0].itemUuid,
        disabled: false,
        duration: args[0].item.effects[0].duration,
        icon: args[0].item.img,
        label: args[0].item.name,
        "flags": {
            "effectmacro": {
                "onDelete": {
                    "script": "let caster = origin.parent;\nvar huntersMarkItem = caster.items.getName(\"Hunter's Mark\");\nif (!huntersMarkItem) {\n    return;\n}\nlet markedActors = canvas.scene.tokens\n    .filter(t => t.id != caster.id && t.actor && t.actor.effects.find(e => e.data.origin == huntersMarkItem.uuid && e.data.label == \"Hunter's Mark\"));\nmarkedActors.forEach(a => {\n    game.dfreds.effectInterface.removeEffect({\n        effectName: \"Hunter's Mark\",\n        uuid: a.uuid,\n        origin: huntersMarkItem.uuid\n    });\n});"
                }
            }
        }
    };
    effectData.duration.startTime = game.time.worldTime;
    await caster.createEmbeddedDocuments("ActiveEffect", [effectData]);
} else if (args[0].tag === "DamageBonus") {
    // only weapon attacks
    if (!["mwak", "rwak"].includes(args[0].item.data.actionType)) return {};
    const targetUuid = args[0].hitTargets[0].uuid;
    // only on the marked target
    if (targetUuid !== args[0].actor.document.getFlag("midi-qol", "huntersMark")) return {};
    const damageType = args[0].item.data.damage.parts[0][1];
    const diceMult = args[0].isCritical ? 2 : 1;
    return { damageRoll: `${diceMult}d6[${damageType}]`, flavor: "Hunters Mark Damage" };
}