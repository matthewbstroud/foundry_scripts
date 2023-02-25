/*
Sync portent resource.
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/syncPortentDice.js
*/

let actor = args[0].actor;

if (!actor.data.flags.ddbimporter) {
    return;
}

let actorResources = actor.data.flags.ddbimporter.resources;

let diceResource = "";
if (actorResources.primary = "Portent") {
    diceResource = "primary";  
}
else if (actorResources.secondary = "Portent") {
    diceResource = "secondary";  
}
else if (actorResources.tertiary = "Portent") {
    diceResource = "tertiary";  
}

if (diceResource == "") {
    return;
}
let portent = actor.data.items.find((i) => i.name == "Portent" && i.data.type == "feat");
let currentUses = parseInt(portent.data.data.uses.value) - 1;
if (currentUses < 0) {
    return;
}
portent.update({ "data.uses.value": currentUses});
actor.update({ [`data.resources.${diceResource}.value`]: currentUses });