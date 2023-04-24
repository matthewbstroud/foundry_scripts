/*
Identify a single item in a player's inventory
Intended to be the Item Macro for the identify spell
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/v10/Identification/identifyTargetItem.js
*/
const MACRO_IDENTIFY_TARGET_ITEM_GM = "identifyTargetItemGM";
if (!args || args.length == 0) {
    console.log("identifyTargetItem: no arguments. cannot proceed.");
    return;
}

let targets = args[0].targets;

if (!targets || targets.length == 0) {
    console.log("identifyTargetItem: no targets selected. cannot proceed.");
    return;
}

let targetActor = targets[0].actor;

if (!targetActor || targetActor.type == "npc") {
    console.log(`identifyTargetItem: This only works on players!`);
    return;
}

let gmMacro = game.macros.getName(MACRO_IDENTIFY_TARGET_ITEM_GM);

if (!gmMacro) {
    ui.notifications.notify(`${MACRO_IDENTIFY_TARGET_ITEM_GM} not found!`);
    return;
}

let unidentifiedItems = targetActor.items.filter(i => i.getFlag("world", "identified_id"));

if (!unidentifiedItems || unidentifiedItems.length == 0) {
    ui.notifications.notify(`${targetActor.name} has no unidentified items.`);
    return;
}

let itemOptions = '';
unidentifiedItems.forEach(i => {
    itemOptions += `<option value="${i.id}">${i.name}</option>`;
});

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
                gmMacro.execute(actor.id, targetActor.id, id);
            }
        },
        no: {
            icon: "<i class='fas fa-times'></i>",
            label: `Cancel`
        },
    },
    default: "yes"
}).render(true)