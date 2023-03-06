/*
Create a placeholder item to give a user until they can identify it
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/createUnidentifiedItem.js
*/
let items = Object.values(ui.windows).filter(w => (w.object instanceof Item));

if (!items || items.length == 0 || items.length > 1) {
    ui.notifications.notify(`Must only have one item sheet open!`);
    return;
}

let item = items[0].object;


function createUnidentifiedItem(item, name, description) {
    let newItem = {
        "name": `${name}`,
        "type": item.data.type,
        "img": item.data.img,
        "data": {
            "description": {
                "value": description,
                "chat": "",
                "unidentified": "Wondrous item"
            },
            "quantity": 1,
            "weight": item.data.data.weight,
            "attunement": 0,
            "equipped": false,
            "identified": false
        }, 
        "flags": {
            "world": {
                "identified_id": item.id
            }
        }
    };
    Item.create(newItem);
}

let currencyTotals = `
<b>Source Item: ${item.name}</b><br />
<div style="display: block; width: 100%; margin: 10px 0px 10px 0px">
<label for="name">Name:</label>
<input id="name" name="description" value="${item.name}"/><br/>
<label for="description">Description:</label>
<textarea id="description" name="description" rows="10" cols="50">${item.data.data.description.value}</textarea>
</div>
`;

new Dialog({
    title: `Create Unidentified Item`,
    content: `
        <form>
            ${currencyTotals}
        </form>
    `,
    buttons: {
        yes: {
            icon: "<i class='fas fa-check'></i>",
            label: `Create`,
            callback: (html) => {
                let name = html.find('#name').val();
                let desc = html.find('#description').val();
                createUnidentifiedItem(item, name, desc);
            }
        },
        no: {
            icon: "<i class='fas fa-times'></i>",
            label: `Cancel`
        },
    },
    default: "yes"
}).render(true)