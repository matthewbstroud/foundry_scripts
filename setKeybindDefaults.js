/*
Set player keybinds.
SyncUrl=https://raw.githubusercontent.com/matthewbstroud/foundry_scripts/main/setKeybindDefaults.js
*/
game.keybindings.set("core", "pause", [
    {
        key: "KeyP",
        modifiers: []
    }
]);
game.keybindings.set("midi-qol", "Critical", [
    {
        key: "H",
        modifiers: []
    }
]);
game.keybindings.set("midi-qol", "AdvantageRoll", [
    {
        key: "ShiftLeft",
        modifiers: []
    },
    {
        key: "ShiftRight",
        modifiers: []
    },
]);
game.keybindings.set("midi-qol", "Critical", [

]);
game.keybindings.set("midi-qol", "DisadvantageRoll", [
    {
        key: "ControlLeft",
        modifiers: []
    },
    {
        key: "ControlRight",
        modifiers: []
    },
]);
game.keybindings.set("midi-qol", "Versatile", [
    {
        key: "V",
        modifiers: []
    }, {
        key: "AltLeft",
        modifiers: []
    },
    {
        key: "AltRight",
        modifiers: []
    },
]);
game.keybindings.set("sequencer", "play-tool-hotkey-control", [
]);
game.keybindings.set("sequencer", "play-tool-hotkey-shift", [
]);
game.keybindings.set("sequencer", "select-tool-hotkey-control", [
]);
game.keybindings.set("sequencer", "select-tool-hotkey-alt", [
]);
game.keybindings.set("sequencer", "select-tool-hotkey-delete", [
]);
alert("Keybindings Imported.");