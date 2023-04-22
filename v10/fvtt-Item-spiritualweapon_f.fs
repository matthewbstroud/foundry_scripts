{
  "type": "spell",
  "system": {
    "description": {
      "value": "<p>You create a floating, spectral weapon within range that lasts for the duration or until you cast this spell again. When you cast the spell, you can make a melee spell attack against a creature within 5 feet of the weapon. On a hit, the target takes force damage equal to 1d8 + your spellcasting ability modifier.</p>\n<p>As a bonus action on your turn, you can move the weapon up to 20 feet and repeat the attack against a creature within 5 feet of it.</p>\n<p>The weapon can take whatever form you choose. Clerics of deities who are associated with a particular weapon (as St. Cuthbert is known for his mace and Thor for his hammer) make this spell's effect resemble that weapon.</p>\n<p><strong>At Higher Levels.</strong> When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for every two slot levels above 2nd.</p>",
      "chat": "",
      "unidentified": ""
    },
    "source": "Basic Rules, Player's Handbook pg 278",
    "activation": {
      "type": "bonus",
      "cost": 1,
      "condition": ""
    },
    "duration": {
      "value": "1",
      "units": "minute"
    },
    "target": {
      "value": null,
      "width": null,
      "units": "",
      "type": ""
    },
    "range": {
      "value": 60,
      "long": null,
      "units": "ft"
    },
    "uses": {
      "value": null,
      "max": "",
      "per": "",
      "recovery": ""
    },
    "consume": {
      "type": "",
      "target": "",
      "amount": null
    },
    "ability": "",
    "actionType": "other",
    "attackBonus": "",
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
    "school": "evo",
    "components": {
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
      "mode": "level",
      "formula": "floor((@item.level - 1)/2)d8"
    }
  },
  "name": "Spiritual Weapon (F)",
  "flags": {
    "ddbimporter": {
      "id": 138787,
      "definitionId": 2263,
      "entityTypeId": 435869154,
      "dndbeyond": {
        "lookup": "classSpell",
        "class": "Cleric",
        "level": 5,
        "characterClassId": 114648103,
        "spellLevel": 2,
        "ability": "wis",
        "mod": 4,
        "dc": 15,
        "cantripBoost": false,
        "overrideDC": false,
        "id": 138787,
        "entityTypeId": 435869154,
        "healingBoost": 0,
        "usesSpellSlot": true
      },
      "originalName": "Spiritual Weapon",
      "sources": [
        {
          "sourceId": 1,
          "pageNumber": null,
          "sourceType": 2
        },
        {
          "sourceId": 2,
          "pageNumber": 278,
          "sourceType": 1
        }
      ],
      "tags": [
        "Damage"
      ],
      "version": "3.4.17",
      "effectsApplied": true,
      "importId": "8DPcDRD31AqyJXSh"
    },
    "midiProperties": {
      "magicdam": true,
      "magiceffect": true,
      "nodam": false,
      "fulldam": false,
      "halfdam": false,
      "autoFailFriendly": false,
      "autoSaveFriendly": false,
      "rollOther": false,
      "critOther": false,
      "offHandWeapon": false,
      "concentration": false,
      "toggleEffect": false,
      "ignoreTotalCover": false
    },
    "spell-class-filter-for-5e": {
      "parentClass": "cleric"
    },
    "itemacro": {
      "macro": {
        "data": {
          "name": "Spiritual Weapon",
          "type": "script",
          "scope": "global",
          "command": "const lastArg = args[args.length - 1];\nconst castItemName = \"Summoned Spiritual Weapon\";\nconst tokenOrActor = await fromUuid(lastArg.actorUuid);\nconst targetActor = tokenOrActor.actor ? tokenOrActor.actor : tokenOrActor;\n\n\nasync function deleteTemplates(actorId) {\n  let removeTemplates = canvas.templates.placeables.filter(\n    (i) => i.data.flags?.SpiritualWeaponRange?.ActorId === actorId\n  );\n  await canvas.scene.deleteEmbeddedDocuments(\"MeasuredTemplate\", removeTemplates.map((t) => t.id));\n}\n\n/**\n * Create Spiritual Weapon item in inventory\n */\nif (args[0] === \"on\") {\n  const tokenFromUuid = await fromUuid(lastArg.tokenUuid);\n  const targetToken = tokenFromUuid.data || token;\n  const DAEItem = lastArg.efData.flags.dae.itemData;\n  const damage = Math.floor(Math.floor(args[1] / 2));\n  // draw range template\n  await canvas.scene.createEmbeddedDocuments(\"MeasuredTemplate\", [\n    {\n      t: \"circle\",\n      user: game.userId,\n      x: targetToken.x + (canvas.grid.size / 2),\n      y: targetToken.y + (canvas.grid.size / 2),\n      direction: 0,\n      distance: 60,\n      borderColor: \"#FF0000\",\n      flags: {\n        SpiritualWeaponRange: {\n          ActorId: targetActor.id,\n        },\n      },\n    },\n  ]);\n\n  const templateData = {\n    t: \"rect\",\n    user: game.user.id,\n    distance: 7,\n    direction: 45,\n    x: 0,\n    y: 0,\n    flags: {\n      SpiritualWeapon: {\n        ActorId: targetActor.id,\n      },\n    },\n    fillColor: game.user.color,\n    texture: DAEItem.img,\n  };\n  Hooks.once(\"createMeasuredTemplate\", () => deleteTemplates(targetActor.id));\n  const doc = new CONFIG.MeasuredTemplate.documentClass(templateData, { parent: canvas.scene });\n  let template = new game.dnd5e.canvas.AbilityTemplate(doc);\n  template.actorSheet = targetActor.sheet;\n  template.drawPreview();\n\n  const castItem = targetActor.items.find((i) => i.name === castItemName && i.type === \"weapon\");\n  if (!castItem) {\n    const weaponData = {\n      name: castItemName,\n      type: \"weapon\",\n      system: {\n        quantity: 1,\n        activation: { type: \"bonus\", cost: 1, condition: \"\", },\n        target: { value: 1, type: \"creature\", },\n        // we choose 60ft here in case the midi-check range is on\n        range: { value: 60, long: null, units: \"ft\", },\n        ability: DAEItem.system.ability,\n        attackBonus: DAEItem.system.attackBonus,\n        actionType: \"msak\",\n        chatFlavor: \"\",\n        critical: null,\n        damage: { parts: [[`${damage}d8+@mod`, \"force\"]], versatile: \"\" },\n        weaponType: \"simpleM\",\n        proficient: true,\n        equipped: true,\n      },\n      flags: { SpiritualWeapon: targetActor.id },\n      img: DAEItem.img,\n    };\n\n    await targetActor.createEmbeddedDocuments(\"Item\", [weaponData]);\n    ui.notifications.notify(\"Weapon created in your inventory\");\n  }\n}\n\n// Delete Spiritual Weapon\nif (args[0] === \"off\") {\n  let swords = targetActor.items.filter((i) => i.flags?.SpiritualWeapon === targetActor.id);\n  if (swords.length > 0) await targetActor.deleteEmbeddedDocuments(\"Item\", swords.map((s) => s.id));\n  const templates = canvas.templates.placeables.filter((i) => i.data.flags?.SpiritualWeapon?.ActorId === targetActor.id);\n  if (templates.length > 0) await canvas.scene.deleteEmbeddedDocuments(\"MeasuredTemplate\", templates.map((t) => t.id));\n}\n"
        },
        "options": {},
        "apps": {},
        "compendium": null,
        "name": "Spiritual Weapon (F)",
        "type": "script",
        "scope": "global",
        "command": "//SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/v10/spiritualWeapon.js\n//provided by siliconsaint for honeybadger's warpgate v1.5.0\n//https://github.com/trioderegion/warpgate\n\n\nconst GM_MACRO = \"spiritualWeapon_GM\";\n\nlet gmMacro = game.macros.getName(GM_MACRO);\n\nif (!gmMacro) {\n    ui.notifications.notify(GM_MACRO);\n    return;\n}\n\nlet spiritualWeapon = `modules/JB2A_DnD5e/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Mace01_01_Spectral_Blue_200x200.webm`;\nlet crosshairConfig = {\n    icon: spiritualWeapon,\n    label: \"Place Weapon\"\n};\n\nlet crosshairData = await warpgate.crosshairs.show(crosshairConfig);\n\n\ngmMacro.execute(game.user.id, args[0].actor._id, args[0].tokenId, args[0].spellLevel, crosshairData.x, crosshairData.y);",
        "author": "6yhz13iFYYklKtgA",
        "_id": null,
        "img": "icons/svg/dice-target.svg",
        "folder": null,
        "sort": 0,
        "ownership": {
          "default": 0
        },
        "flags": {},
        "_stats": {
          "systemId": null,
          "systemVersion": null,
          "coreVersion": null,
          "createdTime": null,
          "modifiedTime": null,
          "lastModifiedBy": null
        }
      }
    },
    "midi-qol": {
      "forceCEOff": true,
      "effectActivation": false,
      "onUseMacroName": "[postActiveEffects]ItemMacro"
    },
    "core": {
      "sourceId": "Actor.asd4WPupilrDVJZT.Item.4eoQIAA8Zm8VU8Vj"
    },
    "exportSource": {
      "world": "lost_mines_template",
      "system": "dnd5e",
      "coreVersion": "10.291",
      "systemVersion": "2.1.5"
    }
  },
  "effects": [
    {
      "label": "Spiritual Weapon",
      "changes": [],
      "duration": {
        "startTime": null,
        "seconds": 60,
        "combat": null,
        "rounds": null,
        "turns": null,
        "startRound": null,
        "startTurn": null
      },
      "tint": null,
      "transfer": false,
      "disabled": false,
      "flags": {
        "dae": {
          "transfer": false,
          "stackable": "none",
          "selfTarget": true,
          "selfTargetAlways": true,
          "durationExpression": "",
          "macroRepeat": "none",
          "specialDuration": []
        },
        "ddbimporter": {
          "disabled": false
        },
        "midi-qol": {
          "forceCEOff": true
        },
        "dfreds-convenient-effects": {
          "description": ""
        },
        "core": {
          "statusId": ""
        },
        "ActiveAuras": {
          "isAura": false,
          "aura": "None",
          "radius": "undefined",
          "alignment": "",
          "type": "",
          "ignoreSelf": false,
          "height": false,
          "hidden": false,
          "displayTemp": false,
          "hostile": false,
          "onlyOnce": false
        },
        "effectmacro": {
          "onDelete": {
            "script": "const GM_MACRO = \"removeToken_GM\";\nlet gmMacro = game.macros.getName(GM_MACRO);\n\nif (!gmMacro) {\n    ui.notifications.notify(`${GM_MACRO} not found!`);\n    return;\n}\n\nlet weaponToken = canvas.scene.tokens.getName(`Spiritual Weapon of ${actor.name}`);\n\nif (!weaponToken) {\n    return;\n}\n\ngmMacro.execute(weaponToken.id);"
          }
        }
      },
      "icon": "modules/JB2A_DnD5e/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Mace01_01_Spectral_Blue_Thumb.webp",
      "_id": "PW6SQKTsTSLsnnQX",
      "origin": null
    }
  ],
  "img": "modules/JB2A_DnD5e/Library/2nd_Level/Spiritual_Weapon/SpiritualWeapon_Mace01_01_Spectral_Blue_Thumb.webp",
  "_stats": {
    "systemId": "dnd5e",
    "systemVersion": "2.1.5",
    "coreVersion": "10.291",
    "createdTime": 1682167256810,
    "modifiedTime": 1682173329819,
    "lastModifiedBy": "6yhz13iFYYklKtgA"
  }
}