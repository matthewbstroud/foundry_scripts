/*
 * Create and share an image popout
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/showTokenArt.js
 */
let actor = canvas.tokens.controlled[0].actor;
let ip = new ImagePopout(actor.data.img, { uuid: actor.uuid });
ip.render(true); // Display for self
ip.shareImage(); // Display to all other players