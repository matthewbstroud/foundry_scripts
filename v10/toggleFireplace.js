/*
toggle fireplace on an off
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/v10/toggleFireplace.js
*/
if (!args || args.length != 1) {
    ui.notifications.notify('Invalid arguments');
}

function toggleFireplace(fp) {
    let light = canvas.scene.lights.find(l => l.getFlag("world", "fireplace") == fp);
    let sound = canvas.scene.sounds.find(l => l.getFlag("world", "fireplace") == fp);
    if (light && sound) {
        let newState = !light.data.hidden;
        light.update({ hidden: newState });
        sound.update({ hidden: newState });
        var message = "";
        if (newState) {
            message = "The fire goes out.";
        }
        else {
            message = "The fire bursts to life.";
        }
        ChatMessage.create({ content: message });
    }
    else {
        ui.notifications.notify(`Fireplace ${fp} does not exist in this scene.`);
    }
}


let fireplace = args[0];

toggleFireplace(fireplace);