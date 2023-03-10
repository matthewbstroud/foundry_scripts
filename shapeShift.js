/*
Create alternate tokens for special characters.
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/shapeShift.js
*/

const shape_shifters = {
    "Emil Toranesc": {
        "primary": {
            "img": "/modules/curse_of_strahd/Tokens/NPC/Emil_Token.webp",
            "scale": 1.0
        },
        "secondary": {
            "img": "/modules/curse_of_strahd/Tokens/NPC/Werewolf_Token.webp",
            "scale": 1.7
        }
    },
    "Door Mimic": {
        "primary": {
            "img": "/modules/curse_of_strahd/Tokens/NPC/Mimic_Door_Token2.webp",
            "scale": 1.1
        },
        "secondary": {
            "img": "/systems/dnd5e/tokens/monstrosity/Mimic.webp",
            "scale": 1.0
        }
    }
} 

if (canvas.tokens.controlled.length == 0) {
    ui.notifications.notify('No selected token');
    return;
}

var currentToken = canvas.tokens.controlled[0];
shapeShift(currentToken);

function shapeShift(targetToken) {
    let shifter = shape_shifters[targetToken.actor.name];
    if (!shifter) {
        return;
    }
    let imagePaths = targetToken.document.data.img.split("/");
    let image = imagePaths[imagePaths.length - 1];
    if (shifter.primary.img.endsWith(image)){
        targetToken.document.update(shifter.secondary);
    }
    else {
        targetToken.document.update(shifter.primary);
    }
}

