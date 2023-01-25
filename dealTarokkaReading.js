function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

// CONSTANTS
const SRC_DECK_NAME = "Tarokka";
const DST_CARD_PILE_NAME = "Tarokka Reading";
const CARD_WIDTH = 200;
const CARD_HEIGHT = 300;
const CARD_DATA = [
  {
    "name": "TomeOfStrahd",
    "x": 800,
    "y": 750
  },
  {
    "name": "SymbolOfRavenkind",
    "x": 1100,
    "y": 400
  },
  {
    "name": "SunSword",
    "x": 1400,
    "y": 750
  },
  {
    "name": "StrahdEnemy",
    "x": 1100,
    "y": 1100
  },
  {
    "name": "Strahd",
    "x": 1100,
    "y": 750
  },
];

function createCard(template, card, cardBackImage) {
  let tileID = uuidv4();
  let actionID = uuidv4();
  let tileImageBackID = uuidv4();
  let tileImageFronID = uuidv4();
  let tileImageFront = card.face.img;
  let cardData = {
      "img": cardBackImage,
      "width": CARD_WIDTH,
      "height": CARD_HEIGHT,
      "x": template.x,
      "y": template.y,
      "z": 100,
      "rotation": 0,
      "alpha": 1,
      "tint": "",
      "hidden": false,
      "locked": false,
      "overhead": false,
      "occlusion": {
        "mode": 1,
        "alpha": 0
      },
      "video": {
        "loop": true,
        "autoplay": true,
        "volume": 0
      },
      "flags": {
        "dnd5e-helpers": {
          "coverLevel": 0
        },
        "betterroofs": {
          "brMode": 0,
          "manualPoly": "",
          "occlusionLinkId": "",
          "occlusionLinkSource": false
        },
        "monks-active-tiles": {
          "active": true,
          "record": false,
          "restriction": "all",
          "controlled": "gm",
          "trigger": "dblclick",
          "allowpaused": false,
          "usealpha": false,
          "pointer": false,
          "pertoken": false,
          "minrequired": 0,
          "chance": 100,
          "fileindex": 0,
          "actions": [
            {
              "action": "tileimage",
              "data": {
                "entity": "",
                "select": "next",
                "transition": "blur",
                "speed": 1,
                "loop": 1
              },
              "id": actionID
            }
          ],
          "files": [
            {
              "id": tileImageBackID,
              "name": cardBackImage,
              "selected": false
            },
            {
              "id": tileImageFronID,
              "name": tileImageFront,
              "selected": false
            }
          ]
        }
      }
    }
    canvas.scene.createEmbeddedDocuments("Tile", [cardData]);
}


// get reference to src/dst cards objects
const src_cards = game.cards.filter(cards => cards.data.name===SRC_DECK_NAME)[0];
const dst_cards = game.cards.filter(cards => cards.data.name===DST_CARD_PILE_NAME)[0];

// reset the deck if there are less than 5 cards
if (src_cards.availableCards.length < 5) {
  await dst_cards.reset();
}

// deal 5 random card and grab reference to the dealt card
await src_cards.deal([dst_cards], 5, {how: CONST.CARD_DRAW_MODES.RANDOM});
let card_back = src_cards.data.img;
////let most_recent_drawn = dst_cards.cards.contents[dst_cards.cards.size - 1];
//console.log(most_recent_drawn);

let existingCards = canvas.scene.tiles.filter((t) => t.data.flags['monks-active-tiles'].files[0].name == card_back);
for (var x=0; x < existingCards.length; x++) {
  existingCards[x].delete();
}

for (var i = dst_cards.cards.size - 5; i < dst_cards.cards.size; i++) {
  let cardIndex = dst_cards.cards.size - i - 1;
  createCard(CARD_DATA[cardIndex], dst_cards.cards.contents[[i]], card_back);
}
