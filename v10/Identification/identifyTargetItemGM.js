/*
Identify a single item in a player's inventory, gm excecution
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/v10/Identification/identifyTargetItemGM.js
*/
if (!args || args.length != 3) {
    console.log("identifyTargetItemGM: invalid arguments. cannot proceed.");
    return;
}
let sourceActor = game.actors.get(args[0]);
let targetActor = game.actors.get(args[1]);;
let targetItemID = args[2];

if (!targetActor || targetActor.type == "npc") {
    console.log(`identifyTargetItem: This only works on players!`);
    return;
}

async function identifyItem(source, target, itemID) {
    let placeHolderItem = target.items.get(itemID);
    if (!placeHolderItem) {
        ui.notifications.notify(`Item no longer exists in player inventory!`);
        return;
    }
    let actualItemID = placeHolderItem.getFlag("world", "identified_id");
    if (!actualItemID) {
        ui.notifications.notify(`Item doesn't specify a parent!`);
        return;
    }
    let actualItem = game.items.get(actualItemID);
    if (!actualItem) {
        return;
    }
    let actualItemData = actualItem.toObject();
    actualItemData.system.identified = true;
    actualItemData.system.quantity = placeHolderItem.system.quantity;
    let message = `Item has been identified as <b>${actualItem.name}</b>.`;
    await target.createEmbeddedDocuments("Item", [actualItemData]);
    await placeHolderItem.delete();
    ChatMessage.create({ speaker: { alias: source.name }, content: message });
}

identifyItem(sourceActor, targetActor, targetItemID);
