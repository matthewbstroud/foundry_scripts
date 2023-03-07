/*
Identify a single item in a player's inventory
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/identifyItem.js
*/
if (canvas.tokens.controlled.length != 1) {
    ui.notifications.notify(`Please select a single actor!`);
    return;
}
let targetActor = canvas.tokens.controlled[0].actor;
if (!targetActor || targetActor.data.type == "npc") {
    ui.notifications.notify(`Please select a player!`);
    return;
}
let unidentifiedItems = canvas.tokens.controlled[0].actor.items.filter(i => i.getFlag("world", "identified_id"));

if (!unidentifiedItems || unidentifiedItems.length == 0) {
    ui.notifications.notify(`${targetActor.name} has no unidentified items.`);
    return;
}

let itemOptions = '';
unidentifiedItems.forEach(i => {
    itemOptions += `<option value="${i.id}">${i.name}</option>`;
});


async function identifyItem(target, itemID) {
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
    actualItemData.data.identified = true;
    let message = `Item has been identified as <b>${actualItem.name}</b>.`;
    await target.createEmbeddedDocuments("Item", [actualItemData]);
    await placeHolderItem.delete();
    ChatMessage.create({ speaker: { alias: 'Gamemaster' }, content: message });
}

let unidentifiedItemsForm = `
<div style="display: block; width: 100%; margin: 10px 0px 10px 0px">
<label for="name">Select Item:</label>
<select name="item_to_identify" id="item_to_identify">
        ${itemOptions}
</select>
</div>
`;

new Dialog({
    title: `Identify Item`,
    content: `
        <form>
            ${unidentifiedItemsForm}
        </form>
    `,
    buttons: {
        yes: {
            icon: "<i class='fas fa-check'></i>",
            label: `Identify`,
            callback: (html) => {
                let id = html.find('#item_to_identify').val();
                console.log(id);
                identifyItem(targetActor, id);
            }
        },
        no: {
            icon: "<i class='fas fa-times'></i>",
            label: `Cancel`
        },
    },
    default: "yes"
}).render(true)