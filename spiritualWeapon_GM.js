//SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/spiritualWeapon_GM.js
if (!args){
    return;
}
let gameMaster = game.users.getName("Gamemaster");
let userID = args[0];
let actorID = args[1];
let tokenID = args[2];
let level = args[3];
let x = args[4];
let y = args[5];
let user = game.users.get(userID);
const actorD = game.actors.get(actorID);
const tokenD = canvas.tokens.get(tokenID);
let summonType = "Spiritual Weapon";
const summonerDc = actorD.data.data.attributes.spelldc;
const summonerAttack = summonerDc - 8;
const summonerMod = getProperty(tokenD.actor, `data.data.abilities.${getProperty(tokenD.actor, 'data.data.attributes.spellcasting')}.mod`);
let damageScale = '';
let lightColor='';

let weapon = 'Mace';
let color = 'Blue';
let lowerColor = color[0].toLowerCase() + color.substring(1);

switch (color) {
    
  case 'Blue':
    lightColor = '#0000FF';
    break;
  case 'Green':
    lightColor = '#00FF00';
    break;
  case 'Orange':
    lightColor = '#ffd333';
    break;
  case 'Purple':
    lightColor = '#800080';
    break;
  case 'Red':
    lightColor = '#FF0000';
    break;
}

let spiritualWeapon = `modules/JB2A_DnD5e/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Mace01_01_Spectral_Blue_200x200.webm`;

    
if ((level-3) > 0){
    damageScale = `+ ${Math.floor((level-2)/2)}d8[upcast]`;
}

let updates = {
    token : {
        'alpha':0,
        'name':`${summonType} of ${actorD.name}`,
        'img': spiritualWeapon,
        'lightColor': lightColor
    },
    actor: {
        'name': `${summonType} of ${actorD.name}`,
        'permission': {
            default: 0,
            [`${gameMaster.id}`]: 3,
            [`${userID}`]: 3
        }
    },
    embedded: { Item: {
        "Attack":{
            'data.attackBonus': `- @mod - @prof + ${summonerAttack}`,
            'data.damage.parts': [[`1d8 ${damageScale} + ${summonerMod}`, 'force']],
            'flags.autoanimations.animName': weapon,
            'flags.autoanimations.color': lowerColor
        }
    }}
}

async function myEffectFunction(template, update) {
//prep summoning area
let effect = 'modules/JB2A_DnD5e/Library/1st_Level/Bless/Bless_01_Regular_Yellow_Intro_400x400.webm';

//modules/JB2A_DnD5e/Library/1st_Level/Bless/Bless_01_Regular_Yellow_Thumb.webp
new Sequence()
    .effect()
        .file(effect)
        .atLocation(template)
        .center()
        .scale(1.5)
        .belowTokens()
    .play()
}

async function postEffects(template, token) {
//bring in our minion
new Sequence()
    .animation()
        .on(token)
            .fadeIn(500)
    .play()
}

const callbacks = {
    pre: async (template, update) => {
        myEffectFunction(template,update);
        await warpgate.wait(1750);
    },
    post: async (template, token) => {
    postEffects(template,token);
    await warpgate.wait(500);
    }
};

const options = {controllingActor: actor};
warpgate.spawnAt({ x, y}, summonType, updates, callbacks, options);