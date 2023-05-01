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
        duration: {
            startTime: null,
            seconds: 3600
        },
        icon: args[0].item.img,
        label: args[0].item.name,
        "flags": {
            dae: {
                selfTarget: false,
                stackable: "none",
                durationExpression: "",
                macroRepeat: "none",
                specialDuration: [],
                transfer: false
            },
            "effectmacro": {
                "onDelete": {
                    "script": "// added to the remove event of the hunter's mark self-effect\nlet caster = origin.parent;\nvar huntersMarkItem = caster.items.getName(\"Hunter's Mark\");\nif (!huntersMarkItem) {\n    return;\n}\nlet GM_MACRO = \"removeEffects_GM\";\nlet gmMacro = game.macros.getName(GM_MACRO);\n\nif (!gmMacro) {\n    return;\n}\n\nlet uuids = canvas.scene.tokens\n    .filter(t => t.id != caster.id)\n    .map(t => t.actor.effects.contents)\n    .reduce((l, r) => l.concat(r)).filter(e => e.data.origin == huntersMarkItem.uuid && e.data.label == \"Marked\")\n    .map(e => e.uuid);\n\ngmMacro.execute(uuids);"
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
    let currentTargetUuid = args[0].actor?.document?.getFlag("midi-qol", "huntersMark") ?? args[0]?.actor.getFlag("midi-qol", "huntersMark");
    if (targetUuid !== currentTargetUuid) return {};
    const damageType = args[0].item.data.damage.parts[0][1];
    const diceMult = args[0].isCritical ? 2 : 1;
    return { damageRoll: `${diceMult}d6[${damageType}]`, flavor: "Hunters Mark Damage" };
}