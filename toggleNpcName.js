/*
make npcs known or not
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/toggleNpcName.js
*/
if (canvas.tokens.controlled.length == 0) {
    ui.notifications.notify('No selected token');
    return;
}

const CUB_SCOPE = "combat-utility-belt";
const CUB_HIDENAMES = "enableHideName";

var currentToken = canvas.tokens.controlled[0];
let strVal = "";
// maybe exit if it is a player character
if (currentToken.data.displayName == CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER) {
    currentToken.data.update({ "displayName": CONST.TOKEN_DISPLAY_MODES.HOVER });
    currentToken.actor.setFlag(CUB_SCOPE, CUB_HIDENAMES, false);
    strVal = "Hover Anyone";
    ChatMessage.create({
        content: `You will now recognize ${currentToken.name}.`,
        type: CONST.CHAT_MESSAGE_TYPES.OOC
    });
}
else if (currentToken.data.displayName == CONST.TOKEN_DISPLAY_MODES.HOVER) {
    currentToken.data.update({ "displayName": CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER });
    currentToken.actor.setFlag(CUB_SCOPE, CUB_HIDENAMES, true);
    strVal = "Hover Owner";
}

if (strVal.length > 0) {
    ChatMessage.create({
        content: `${currentToken.name} has been set to ${strVal}`,
        whisper: ChatMessage.getWhisperRecipients('GM'),
    });
}
else {
    ChatMessage.create({
        content: `Nothing changed...`,
        whisper: ChatMessage.getWhisperRecipients('GM'),
    });
}