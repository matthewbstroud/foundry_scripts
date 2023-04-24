/*
 * Create and share an image popout
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/v10/showTokenArt.js
 */
let actor = canvas.tokens.controlled[0]?.actor;
if (!actor) {
    ui.notifications.notify('No token selected!');
    return;
}
let ip = new ImagePopout(actor.img, { uuid: actor.uuid });
ip.render(true); // Display for self
ip.shareImage(); // Display to all other players