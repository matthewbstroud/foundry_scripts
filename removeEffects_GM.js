/*
remove a list of effects from actors
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/removeEffects_GM.js
*/

let effectIDs = args[0];

for (const effectID of effectIDs) {
    const effect = await fromUuid(effectID);
    effect.delete();
}