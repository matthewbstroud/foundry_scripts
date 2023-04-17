{
  "name": "Spiritual Weapon (F)",
  "type": "spell",
  "img": "modules/JB2A_DnD5e/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Mace01_01_Spectral_Blue_Thumb.webp",
  "data": {
    "description": {
      "value": "<p>You create a floating, spectral weapon within range that lasts for the duration or until you cast this spell again. When you cast the spell, you can make a melee spell attack against a creature within 5 feet of the weapon. On a hit, the target takes force damage equal to 1d8 + your spellcasting ability modifier.</p>\n<p>As a bonus action on your turn, you can move the weapon up to 20 feet and repeat the attack against a creature within 5 feet of it.</p>",
      "chat": "",
      "unidentified": ""
    },
    "source": "",
    "activation": {
      "type": "bonus",
      "cost": 1,
      "condition": ""
    },
    "duration": {
      "value": 1,
      "units": "minute"
    },
    "target": {
      "value": null,
      "width": null,
      "units": "",
      "type": "self"
    },
    "range": {
      "value": null,
      "long": null,
      "units": ""
    },
    "uses": {
      "value": null,
      "max": "",
      "per": ""
    },
    "consume": {
      "type": "",
      "target": "",
      "amount": null
    },
    "ability": "",
    "actionType": "other",
    "attackBonus": "0",
    "chatFlavor": "",
    "critical": {
      "threshold": null,
      "damage": ""
    },
    "damage": {
      "parts": [],
      "versatile": ""
    },
    "formula": "",
    "save": {
      "ability": "",
      "dc": null,
      "scaling": "spell"
    },
    "level": 2,
    "school": "abj",
    "components": {
      "value": "",
      "vocal": true,
      "somatic": true,
      "material": false,
      "ritual": false,
      "concentration": false
    },
    "materials": {
      "value": "",
      "consumed": false,
      "cost": 0,
      "supply": 0
    },
    "preparation": {
      "mode": "prepared",
      "prepared": true
    },
    "scaling": {
      "mode": "none",
      "formula": ""
    },
    "attunement": null
  },
  "effects": [
    {
      "_id": "wo11smmpj0hbs6m5",
      "changes": [],
      "disabled": false,
      "duration": {
        "startTime": null,
        "seconds": 60
      },
      "icon": "modules/JB2A_DnD5e/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Mace01_01_Spectral_Blue_Thumb.webp",
      "label": "Spiritual Weapon (F)",
      "transfer": false,
      "flags": {
        "effectmacro": {
          "onDelete": {
            "script": "const GM_MACRO = \"removeToken_GM\";\nlet gmMacro = game.macros.getName(GM_MACRO);\n\nif (!gmMacro) {\n    ui.notifications.notify(`${GM_MACRO} not found!`);\n    return;\n}\n\nlet weaponToken = canvas.scene.tokens.getName(`Spiritual Weapon of ${actor.name}`);\n\nif (!weaponToken) {\n    return;\n}\n\ngmMacro.execute(weaponToken.id);"
          },
          "data": {
            "lastUpdated": "onDelete"
          }
        },
        "dae": {
          "selfTarget": false,
          "stackable": "none",
          "durationExpression": "",
          "macroRepeat": "none",
          "specialDuration": [],
          "transfer": false
        },
        "core": {
          "statusId": ""
        },
        "dnd5e-helpers": {
          "rest-effect": "Ignore"
        },
        "ActiveAuras": {
          "isAura": false,
          "aura": "None",
          "radius": null,
          "alignment": "",
          "type": "",
          "ignoreSelf": false,
          "height": false,
          "hidden": false,
          "displayTemp": false,
          "hostile": false,
          "onlyOnce": false
        }
      },
      "tint": null
    }
  ],
  "flags": {
    "itemacro": {
      "macro": {
        "_id": null,
        "name": "Spiritual Weapon (F)",
        "type": "script",
        "author": "6yhz13iFYYklKtgA",
        "img": "icons/svg/dice-target.svg",
        "scope": "global",
        "command": "//SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/spiritualWeapon.js\n//provided by siliconsaint for honeybadger's warpgate v1.5.0\n//https://github.com/trioderegion/warpgate\n\n\nconst GM_MACRO = \"spiritualWeapon_GM\";\n\nlet gmMacro = game.macros.getName(GM_MACRO);\n\nif (!gmMacro) {\n    ui.notifications.notify(GM_MACRO);\n    return;\n}\n\nlet spiritualWeapon = `modules/JB2A_DnD5e/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Mace01_01_Spectral_Blue_200x200.webm`;\nlet crosshairConfig = {\n    icon: spiritualWeapon,\n    label: \"Place Weapon\"\n};\n\nlet crosshairData = await warpgate.crosshairs.show(crosshairConfig);\n\ngmMacro.execute(game.user.id, args[0].actor._id, args[0].tokenId, args[0].spellLevel, crosshairData.x, crosshairData.y);",
        "folder": null,
        "sort": 0,
        "permission": {
          "default": 0
        },
        "flags": {}
      }
    },
    "midi-qol": {
      "fumbleThreshold": null,
      "effectActivation": false,
      "onUseMacroName": "[postActiveEffects]ItemMacro"
    },
    "midiProperties": {
      "nodam": false,
      "fulldam": false,
      "halfdam": false,
      "rollOther": false,
      "critOther": false,
      "magicdam": false,
      "magiceffect": false,
      "concentration": false,
      "toggleEffect": false
    },
    "core": {
      "sourceId": "Item.vly4SwYIaP7L4yLi"
    },
    "ddbimporter": {
      "ignoreIcon": false,
      "ignoreItemImport": true,
      "retainResourceConsumption": true
    },
    "exportSource": {
      "world": "lost-mines-phandelver",
      "system": "dnd5e",
      "coreVersion": "9.280",
      "systemVersion": "1.6.3"
    }
  }
}