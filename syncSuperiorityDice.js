/*
Sync superiority dice resource.
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/syncSuperiorityDice.js
*/
let actor = args[0].actor;

if (!actor.data.flags.ddbimporter) {
    return;
}

let actorResources = actor.data.flags.ddbimporter.resources;

let diceResource = "";
if (actorResources.primary = "Superiority Dice") {
    diceResource = "primary";  
}
else if (actorResources.secondary = "Superiority Dice") {
    diceResource = "secondary";  
}
else if (actorResources.tertiary = "Superiority Dice") {
    diceResource = "tertiary";  
}

if (diceResource == "") {
    return;
}
let currentDice = actor.data.items.find((i) => i.name == "Superiority Dice").data.data.uses.value;
actor.update({[`data.resources.${diceResource}.value`]: currentDice});