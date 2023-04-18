/*
Use or cast spiritual weapon
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/useAuraOfVitality.js
*/
const GM_HEAL = "gmHealPlayer";
const AURA_OF_VITALITY = "Aura of Vitality (F)";
const AURA_OF_VITALITY_SELF = "Aura of Vitality - Self (F)";
if (canvas.tokens.controlled.length != 1) {
    ui.notifications.notify(`Please select a single actor!`);
    return;
}
let targetActor = canvas.tokens.controlled[0].actor;
if (!targetActor || targetActor.data.type == "npc") {
    ui.notifications.notify(`Please select a player!`);
    return;
}

var auraOfVitalityItem = targetActor.items.getName(AURA_OF_VITALITY);
if (!auraOfVitalityItem) {
    ui.notifications.notify(`${targetActor.name} doesn't know Hunter's Mark!`);
    return;
}

var auraOfVitalitySelfAura = targetActor.effects.find(e => e.data.label == AURA_OF_VITALITY_SELF && e.data.origin == auraOfVitalityItem.uuid);
if (!auraOfVitalitySelfAura) {
    auraOfVitalityItem.roll();
    return;
}

let targets = Array.from(game.user.targets);
if (targets.length != 1) {
    ui.notifications.notify(`You must target a single creature you wish to heal!`);
    return;
}

let targetID = targets[0].document.uuid;

let target = await fromUuid(targetID);

let targetEffect = target.actor.effects.find(e => e.data.label == AURA_OF_VITALITY && e.data.origin == auraOfVitalityItem.uuid);
if (!targetEffect) {
    ui.notifications.notify(`${target.name} is not in range of your aura!`);
    return;
}

var healPlayerMacro = game.macros.getName(GM_HEAL);

// Roll Twilight Sanctuary temporary hit points
let healRoll = new Roll('2d6[healing]', targetActor.getRollData()).evaluate({ async: false });
    
healRoll.toMessage({
    user: game.user._id,
    speaker: ChatMessage.getSpeaker(),
    flavor: `Aura of Vitality Heal`
});

healPlayerMacro.execute(target?.actor?.id, parseInt(healRoll.total));