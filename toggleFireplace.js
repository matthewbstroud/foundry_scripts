const fireplaces =
{
    "ravenloft_2ndfloor_study":
    {
        light_color: "#cd8736",
        sound_position: {
            x: 4880,
            y: 3360
        }
    }
};

function toggleFireplace(fp) {
    canvas.scene.lights.filter(l => l.data.config.color == fp.light_color).forEach(l => {
        l.update({ hidden: !l.data.hidden });
    });
    let sound = canvas.scene.sounds.find(s => s.data.x === fp.sound_position.x && s.data.y === fp.sound_position.y);
    
    if (sound) {
        let newState = !sound.data.hidden;
        sound.update({ hidden: newState })
        var message = "";
        if (newState) {
            message = "The fire goes out.";
        }
        else {
            message = "The fire bursts to life.";
        }
        ChatMessage.create({ content: message });
    }


    
}

if (!args || args.length != 1) {
    ui.notifications.notify('Invalid arguments');
}

let fireplace = fireplaces[args[0]];

if (!fireplace) {
    ui.notifications.notify(`Cannot locate fireplace data for '${fireplace}'.`);
}

toggleFireplace(fireplace);