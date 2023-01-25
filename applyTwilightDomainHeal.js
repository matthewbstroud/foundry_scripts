const tokens = canvas.tokens.controlled;
const CLERIC_NAME = "Braelith";

if (tokens.length > 0) {
    await tokens.forEach(UpdateTempHP);
}
else {
    ui.notifications.warn("No Tokens are selected!");
}

async function UpdateTempHP(token) {
    let current_tempHP = token.actor.data.data?.attributes?.hp?.temp;
    let cleric = game.actors.getName(CLERIC_NAME);

    // Roll Twilight Sanctuary temporary hit points
    let healRoll = new Roll('1d6 + @classes.cleric.levels', cleric.getRollData()).evaluate({ async: false });

    healRoll.toMessage({
        user: game.user._id,
        speaker: ChatMessage.getSpeaker(),
        flavor: "Twilight Sanctuary - Temp HP"
    });

    // Check if new roll is higher than old temp HP
    console.log(healRoll);
    let new_tempHP = parseInt(healRoll.total);

    if (current_tempHP > new_tempHP) {
        new_tempHP = current_tempHP;
    }

    await token.actor.update({ 'data.attributes.hp.temp': new_tempHP });

}