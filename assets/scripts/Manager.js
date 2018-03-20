SceneGame.Manager = function (game) {
    this.game;
    this.add;
    this.camera;
    this.cache;
    this.input;
    this.load;
    this.sound;
    this.stage;
    this.time;
    this.tweens;
    this.state;
    this.world;
    this.rnd;
};

SceneGame.Manager.prototype = {

    create: function () {
        var manager = this;
        manager.gameRound = 0;
        manager.sceneTime = 10;
        manager.scenesJSON = manager.cache.getJSON('scenes');
        manager.givenScore = 0;
        manager.sawCall = false;
        manager.CreateKeys();
        manager.CreateVariables();
        for (var i = 0; i < manager.scenesJSON.Scenes.length; i++) {
            if (manager.scenesJSON.Scenes[i].time == 'morning') {
                manager.preloadedSets.push(manager.scenesJSON.Scenes[i].name);
            } else if (manager.scenesJSON.Scenes[i].time == 'start') {
                manager.currentScene = manager.scenesJSON.Scenes[i];
                manager.FindKeys();
            } else {
                manager.unloadedSets.push(manager.scenesJSON.Scenes[i].name);
            }
        }
        manager.TempSoundManager();
        if (!this.game.device.firefox) {
            manager.baseSound.loopFull();
        }

        manager.FirstCreateKeys();
        manager.CreatePausedStuff();
        manager.InitCreateHands();
    },

    CreatePausedStuff: function () {
        var manager = this;
        manager.paused = manager.add.sprite(manager.world.centerX, 200, 'paused');
        manager.paused.anchor.setTo(0.5, 0.5);
        manager.paused.visible = false;
        manager.game.onBlur.add(function () {
            manager.paused.visible = true;
            manager.world.bringToTop(manager.paused);
        }, this);
        manager.game.onFocus.add(function () {
            manager.paused.visible = false;
        }, this);
    },

    CreateVariables: function () {
        var manager = this;
        manager.letCheck = true;
        manager.runEnd = false;
        manager.preloadedSets = [];
        manager.unloadedSets = [];
        manager.currentSet = [];
        manager.CantSleepRnd = [];
        manager.currentSetTracking = [];
        manager.typehandimation = [];
        manager.handimation = [];
        manager.letter = [];
        manager.deleteTime = 0;
        manager.seenThis = 0;
        manager.hasLetters = false;
        manager.pressedSpace = false;
        manager.rndSprite = [];
        manager.rndSheet = [];
        manager.playEnding = true;
        manager.ChangeEachHandsX = [410, 440, 550, 590, 550, 500];
        manager.ChangeEachHandsY = [870, 785, 785, 860, 900, 870];
    },

    CreateChangeEach: function () {
        var manager = this;
        manager.baseSound = manager.add.audio('phonevibrate');
        manager.baseSound.play();
        manager.PlaceHands(0, 430, 910, 120);
        manager.ChangeEach();
    },

    CreateDelete: function () {
        var manager = this;
        manager.blueScreen = manager.add.sprite(0, 0, 'bluescreen');
        manager.deleteKeys = [];
        manager.deleteKeys.push(manager.add.sprite(560, 600, 'allkeys', 'longkeybg'));
        manager.deleteKeys.push(manager.add.sprite(560, 600, 'allkeys', 'longkeyunpressed'));
        manager.deleteKeys.push(manager.add.sprite(560, 600, 'allkeys', 'delete'));

        for (var i = 0; i <= 2; i++) {
            manager.deleteKeys[i].scale.setTo(0.5, 0.5);
            manager.deleteKeys[i].anchor.setTo(0.5, 0.5);
        }

        manager.Delete();
    },

    CreateExcel: function () {
        var manager = this;
        manager.excelKeys = [];

        manager.excelKeys.push(manager.add.sprite(500, 600, 'allkeys', 'keybackground'));
        manager.excelKeys.push(manager.add.sprite(500, 600, 'allkeys', 'keyunpressed'));

        manager.excelKeys.push(manager.add.sprite(600, 600, 'allkeys', 'keybackground'));
        manager.excelKeys.push(manager.add.sprite(600, 600, 'allkeys', 'keyunpressed'));

        manager.excelKeys.push(manager.add.sprite(560, 600, 'allkeys', 'longkeybg'));
        manager.excelKeys.push(manager.add.sprite(560, 600, 'allkeys', 'longkeyunpressed'));

        manager.excelKeys.push(manager.add.sprite(500, 600, 'allkeys', 'ctrl'));
        manager.excelKeys.push(manager.add.sprite(600, 600, 'allkeys', 'vee'));
        manager.excelKeys.push(manager.add.sprite(560, 600, 'allkeys', 'tab'));

        for (var i = 0; i <= 8; i++) {
            manager.excelKeys[i].scale.setTo(0.5, 0.5);
            manager.excelKeys[i].anchor.setTo(0.5, 0.5);
        }

        manager.Excel();

    },

    CreateCantSleep: function () {
        var manager = this;
        manager.PlaceHands(0, 560, 860, 170);
        manager.sleepArray = ['es', 'el', 'ee', 'ee', 'pee'];
        manager.thinkArray = ['tee', 'ache', 'eye', 'en', 'kay'];
        manager.cantSleepArray = [0, 1, 2, 3, 4];
        Phaser.ArrayUtils.shuffle(manager.cantSleepArray);
        for (var i = 0; i < 5; i++) {
            manager.EnableSmallBackgrounds(i, 550 + (100 * i), 600);
            manager.letter[i] = manager.add.sprite(550 + (100 * i), 600, 'allkeys', manager.sleepArray[i]);
            manager.letter[i].scale.setTo(0.5, 0.5);
            manager.letter[i].anchor.setTo(0.5, 0.5);

            var num = i;

        }
        manager.LidCreate(-550, 400, 501);
        for (var i = 0; i < 5; i++) {
            manager.KeySetsToTop(manager.smallKeyBackgrounds[i], manager.smallKeyUnPressed[i], manager.letter[i]);
            manager.world.bringToTop(manager.hands[0]);
        }
        manager.CantSleep();
    },

    ChangeCantSleepLetters: function () {
        var manager = this;
        var num = manager.cantSleepArray.pop();
        manager.letter[num].destroy();
        manager.letter[num] = manager.add.sprite(550 + (100 * num), 600, 'allkeys', manager.thinkArray[num]);

        manager.letter[num].scale.setTo(0.5, 0.5);
        manager.letter[num].anchor.setTo(0.5, 0.5);

        manager.world.bringToTop(manager.hands[0]);
    },

    CreatePill: function () {
        var manager = this;
        manager.pillLetters = [];
        if (!this.game.device.windows) {
            manager.EnableSmallBackgrounds(0, 480, 550);
            manager.EnableSmallBackgrounds(1, 600, 550);
            manager.pillLetters.push(manager.add.sprite(480, 550, 'allkeys', 'function'))
            manager.pillLetters[0].anchor.setTo(0.5, 0.5);
            manager.pillLetters.push(manager.add.sprite(600, 550, 'allkeys', 'f9'))
            manager.pillLetters[1].anchor.setTo(0.5, 0.5);
            manager.PlaceHands(0, 730, 770, 150);
            manager.PlaceHands(1, 370, 770, 30);
            manager.hands[1].scale.y = -1;
        } else {
            manager.keySet.shift();
            manager.EnableSmallBackgrounds(0, manager.world.centerX, 550);
            manager.smallKeyBackgrounds[0].anchor.setTo(0.5, 0.5);
            manager.smallKeyUnPressed[0].anchor.setTo(0.5, 0.5);
            manager.pillLetters.push(manager.add.sprite(manager.world.centerX, 550, 'allkeys', 'ctrl'))
            manager.pillLetters[0].scale.setTo(0.5, 0.5);
            manager.pillLetters[0].anchor.setTo(0.5, 0.5);
            manager.PlaceHands(0, 730, 770, 150);

        }

    },

    CreateSleep: function () {
        var manager = this;
    },

    CreateButton: function () {
        var manager = this;
        manager.nextY = 0;
        manager.nextX = 0;
        manager.buttonLettersLetters = ['five', 'six', 'tee', 'why', 'gee', 'ache', 'bee', 'en'];
        manager.buttonLetters = [];
        manager.PlaceHands(0, 510, 780, 160);
        for (var i = 0; i < manager.keySet.length; i++) {
            if (i % 2 == 0) {
                manager.nextY += 1;
                manager.nextX = 0;
            } else {
                manager.nextX = 1;
            }
            manager.EnableSmallBackgrounds(i, 440 + (200 * manager.nextX), 470 + (80 * manager.nextY));
            manager.buttonLetters.push(manager.add.sprite(440 + (200 * manager.nextX), 471 + (80 * manager.nextY), 'allkeys', manager.buttonLettersLetters[i]));
            manager.buttonLetters[i].scale.setTo(0.5, 0.5);
            manager.buttonLetters[i].anchor.setTo(0.5, 0.5);
        }
    },

    CreateBigO: function () {
        var manager = this;
        manager.EnableSmallBackgrounds(0, 540, 640);
        manager.orgasmKey = manager.add.sprite(540, 640, 'allkeys', 'oh');
        manager.orgasmKey.anchor.setTo(0.5, 0.5);
        manager.orgasmKey.scale.setTo(0.5, 0.5);

        manager.PlaceHands(0, 730, 800, 120);
    },

    CreateSpace: function () {
        var manager = this;
        manager.spaceKeyBG = manager.add.sprite(440, 600, 'spacebar', 'bg');
        manager.spaceKeyBG.scale.setTo(0.5, 0.5);
        manager.spaceKey = manager.add.sprite(450, 600, 'spacebar', 'unpressed');
        manager.spaceKey.scale.setTo(0.5, 0.5);
        manager.spaceWord = manager.add.sprite(800, 625, 'spacebar', 'space');
        manager.outWord = manager.add.sprite(800, 625, 'spacebar', 'out');
        manager.outWord.alpha = 0;
        manager.PlaceHands(0, 680, 800, 120);

        manager.SpaceOut();
    },

    ResetKeyboard: function () {
        var manager = this;
        manager.em.reset();
        manager.tee.reset();
        manager.why.reset();
        manager.gee.reset();
        manager.ach.reset();
        manager.bee.reset();
        manager.en.reset();
        manager.em.reset();
        manager.aye.reset();
        manager.kay.reset();
        manager.cee.reset();
        manager.vee.reset();
        manager.oh.reset();
        manager.pee.reset();
        manager.control.reset();
        manager.space.reset();
        manager.efNine.reset();
        manager.keyOne.reset();
        manager.keyTwo.reset();
        manager.keyThree.reset();
        manager.keyFour.reset();
        manager.keyFive.reset();
        manager.keySix.reset();
        manager.keySeven.reset();
        manager.keyEight.reset();
        manager.keyNine.reset();
        manager.keyZero.reset();
        manager.shift.reset();
        manager.tab.reset();
        manager.enterKey.reset();
        manager.deleteKey.reset();
        manager.cursors.up.reset();
        manager.cursors.down.reset();
        manager.cursors.left.reset();
        manager.cursors.right.reset();
    },

    RemoveEverything: function () {
        var manager = this;
        manager.ResetKeyboard();
        manager.tweens.removeAll();
        manager.keysPressed = [];
        manager.DisappearAllKeys();
        if (manager.currentSound != null) {
            manager.currentSound.stop();
        }
        if (manager.callSound != null) {
            manager.callSound.destroy();
        }
        if (manager.endNumber != null) {
            manager.endNumber.destroy();
            manager.endLogo.destroy();
        }
        if (manager.currentScene.name == "shave") {
            manager.singing.destroy();
        }
        if (manager.currentScene.name == "computertypeemail") {
            manager.typehands[0].visible = false;
            manager.typehands[1].visible = false;
        }
        if (manager.currentScene.name == "walk") {
            manager.spaceKey.visible = false;
            manager.spaceKeyBG.visible = false;
            manager.spaceWord.visible = false;
            manager.outWord.visible = false;
        }
        if (manager.loanEmail != null) {
            manager.loanEmail.destroy();
        }
        if (manager.secondRoomTone != null) {
            manager.secondRoomTone.stop();
            manager.secondRoomTone.destroy();
            manager.secondRoomTone = null;
        }
        if (manager.openSound != null) {
            manager.openSound.destroy();
            manager.openSound = null;
        }
        if (manager.closeSound != null) {
            manager.closeSound.destroy();
            manager.closeSound = null;
        }
        if (manager.stophands != null) {
            manager.stophands.destroy();
        }
        if (manager.lastBG != null) {
            manager.lastBG.destroy();
        }
        if (manager.pauseButt != null) {
            manager.pauseButt.destroy();
        }
        if (manager.lilblack != null) {
            manager.lilblack.destroy();
        }
        if (manager.finalOne != null) {
            manager.finalOne.destroy();
        }
        for (var i = 0; i < manager.currentSet.length; i++) {
            manager.currentSet[i].destroy();
        }
        for (var i = 0; i < manager.hands.length; i++) {
            manager.hands[i].angle = 0;
            manager.hands[i].alpha = 1;
            manager.hands[i].scale.y = 1;
            manager.hands[i].visible = false;
        }
        if (manager.blueScreen != null) {
            manager.blueScreen.destroy();
        }
        if (manager.breathing != null) {
            manager.breathing.destroy();
        }
        if (manager.CantSleepRnd[0] != null) {
            for (var i = 0; i < manager.CantSleepRnd.length; i++) {
                manager.CantSleepRnd[i].destroy();
            }
        }
        if (manager.call != null) {
            manager.call.destroy();
        }
        if (!manager.playMusic) {
            manager.sound.stopAll();
        }
        if (manager.baseSound != null) {
            manager.baseSound.destroy();
        }
        if (manager.roomTone != null) {
            manager.roomTone.destroy;
        }
        if (manager.eventSound != null) {
            manager.eventSound.destroy();
        }

        if (manager.underPic != null) {
            manager.underPic.destroy();
        }
        if (manager.insidePic != null) {
            manager.insidePic.destroy();
            manager.insidePic = null;
        }
        if (manager.cursor != null) {
            manager.cursor.destroy();
        }
        if (manager.screen != null) {
            manager.screen.destroy();
        }
        if (manager.text0 != null) {
            manager.text0.destroy();
        }
        if (manager.text1 != null) {
            manager.text1.destroy();
        }
        if (manager.text2 != null) {
            manager.text2.destroy();
        }
        if (manager.upperPic != null) {
            manager.upperPic.destroy();
        }
        if (manager.stripMeds != null) {
            manager.stripMeds.destroy();
        }

        if (manager.oneClick != null) {
            manager.oneClick.destroy();
            manager.twoClick.destroy();
            manager.threeClick.destroy();
        }

        if (manager.roomTone != null) {
            manager.roomTone.stop();
            manager.roomTone.destroy();
        }

        if (manager.excelText != null) {
            for (var i = 0; i < manager.excelText.length; i++) {
                manager.excelText[i].destroy();
            }
        }

        manager.bLid.destroy();
        manager.tLid.destroy();
        manager.hasLetters = false;

        manager.time.events.removeAll();
    },

    CreateKeys: function () {
        var manager = this;
        manager.cursors = manager.input.keyboard.createCursorKeys();
        manager.em = manager.input.keyboard.addKey(Phaser.Keyboard.M);
        manager.tee = manager.input.keyboard.addKey(Phaser.Keyboard.T);
        manager.why = manager.input.keyboard.addKey(Phaser.Keyboard.Y);
        manager.gee = manager.input.keyboard.addKey(Phaser.Keyboard.G);
        manager.ach = manager.input.keyboard.addKey(Phaser.Keyboard.H);
        manager.bee = manager.input.keyboard.addKey(Phaser.Keyboard.B);
        manager.en = manager.input.keyboard.addKey(Phaser.Keyboard.N);
        manager.em = manager.input.keyboard.addKey(Phaser.Keyboard.M);
        manager.aye = manager.input.keyboard.addKey(Phaser.Keyboard.I);
        manager.kay = manager.input.keyboard.addKey(Phaser.Keyboard.K);
        manager.cee = manager.input.keyboard.addKey(Phaser.Keyboard.C);
        manager.vee = manager.input.keyboard.addKey(Phaser.Keyboard.V);
        manager.oh = manager.input.keyboard.addKey(Phaser.Keyboard.O);
        manager.pee = manager.input.keyboard.addKey(Phaser.Keyboard.P);
        manager.control = manager.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
        manager.efNine = manager.input.keyboard.addKey(Phaser.Keyboard.F9);
        manager.keyOne = manager.input.keyboard.addKey(Phaser.Keyboard.ONE);
        manager.keyTwo = manager.input.keyboard.addKey(Phaser.Keyboard.TWO);
        manager.keyThree = manager.input.keyboard.addKey(Phaser.Keyboard.THREE);
        manager.keyFour = manager.input.keyboard.addKey(Phaser.Keyboard.FOUR);
        manager.keyFive = manager.input.keyboard.addKey(Phaser.Keyboard.FIVE);
        manager.keySix = manager.input.keyboard.addKey(Phaser.Keyboard.SIX);
        manager.keySeven = manager.input.keyboard.addKey(Phaser.Keyboard.SEVEN);
        manager.keyEight = manager.input.keyboard.addKey(Phaser.Keyboard.EIGHT);
        manager.keyNine = manager.input.keyboard.addKey(Phaser.Keyboard.NINE);
        manager.keyZero = manager.input.keyboard.addKey(Phaser.Keyboard.ZERO);
        manager.shift = manager.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        manager.tab = manager.input.keyboard.addKey(Phaser.Keyboard.TAB);
        manager.enterKey = manager.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        if (!this.game.device.windows) {
            manager.deleteKey = manager.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
        } else {
            manager.deleteKey = manager.input.keyboard.addKey(Phaser.Keyboard.DELETE);
        }
        manager.space = manager.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },

    FirstCreateKeys: function () {
        var manager = this;
        manager.smallKeyBackgrounds = [];
        manager.smallKeyPressed = [];
        manager.smallKeyUnPressed = [];
        manager.arrows = [];
        for (var i = 0; i <= 8; i++) {
            manager.smallKeyBackgrounds.push(manager.add.sprite(-100, -100, 'allkeys', 'keybackground'));
            manager.smallKeyBackgrounds[i].scale.setTo(0.5, 0.5);
            manager.smallKeyBackgrounds[i].anchor.setTo(0.5, 0.5);
            manager.smallKeyUnPressed.push(manager.add.sprite(-100, -100, 'allkeys', 'keyunpressed'));
            manager.smallKeyUnPressed[i].scale.setTo(0.5, 0.5);
            manager.smallKeyUnPressed[i].anchor.setTo(0.5, 0.5);
        }
        for (var i = 0; i < 4; i++) {
            manager.arrows.push(manager.add.sprite(-100, -100, 'allkeys', i));
            manager.arrows[i].anchor.setTo(0.5, 0.5);
            manager.arrows[i].scale.setTo(0.8, 0.8);
        }
        manager.longKeyBackground = manager.add.sprite(-100, -100, 'allkeys', 'longkeybg');
        manager.longKeyUnpressed = manager.add.sprite(-100, -100, 'allkeys', 'longkeyunpressed');
    },

    DisappearAllKeys: function () {
        var manager = this;
        for (var i = 0; i <= 8; i++) {
            manager.smallKeyBackgrounds[i].visible = false;
            manager.smallKeyUnPressed[i].visible = false;
        }
        for (var i = 0; i < 4; i++) {
            manager.arrows[i].visible = false;
        }
        if (manager.currentScene.name == "button") {
            for (var i = 0; i < 8; i++) {
                manager.buttonLetters[i].visible = false;
            }
        }
        if (manager.currentScene.name == "pill") {
            for (var i = 0; i < manager.pillLetters.length; i++) {
                manager.pillLetters[i].visible = false;
            }
        }
        if (manager.currentScene.name == "computertypeexcel") {
            for (var i = 0; i <= 8; i++) {
                manager.excelKeys[i].visible = false;
            }
        }
        if (manager.currentScene.name == "computertypeloan") {
            for (var i = 0; i < 3; i++) {
                manager.deleteKeys[i].visible = false;
            }
        }
        if (manager.currentScene.name == "cantsleep") {
            for (var i = 0; i < manager.letter.length; i++) {
                manager.letter[i].visible = false;
            }
        }
        if (manager.currentScene.name == "bigo") {
            manager.orgasmKey.visible = false;
        }
        manager.longKeyBackground.visible = false;
        manager.longKeyUnpressed.visible = false;
    },

    CreateKeyBGS: function () {
        var manager = this;
        if (!manager.currentScene.specialSet) {
            manager.arrowsPosX = [650, 560, 650, 740];
            manager.arrowsPosY = [600, 700, 700, 700];
            for (var i = 0; i < 4; i++) {
                manager.EnableSmallBackgrounds(i, manager.arrowsPosX[i], manager.arrowsPosY[i]);

                manager.smallKeyUnPressed[i].frame = 42;

                manager.arrows[i].visible = true;
                manager.arrows[i].position.x = manager.arrowsPosX[i];
                manager.arrows[i].position.y = manager.arrowsPosY[i];
                manager.CreateYellowBG(manager.currentScene.keySet[i], i);
            }
            manager.cursors.up.onDown.add(function () {
                manager.topLidDown = true;
            });
            manager.cursors.up.onUp.add(function () {
                manager.topLidDown = false;
            });
            manager.cursors.down.onDown.add(function () {
                manager.bottomLidDown = true;
            });
            manager.cursors.down.onUp.add(function () {
                manager.bottomLidDown = false;
            });
        } else {
            manager.CreateSpecialSets();
        }
    },

    CreateSpecialSets: function () {
        var manager = this;
        switch (manager.currentScene.name) {
            case "button":
                manager.CreateButton();
                break;
            case "pill":
                manager.CreatePill();
                break;
            case "bigo":
                manager.CreateBigO();
                break;
            case "cantsleep":
                manager.CreateCantSleep();
                break;
            case "sleep":
                manager.CreateSleep();
                break;
            case "computertypeexcel":
                manager.CreateExcel();
                break;
            case "computertypeloan":
                manager.CreateDelete();
                break;
            default:
                break;
        }
    },

    InitCreateHands: function () {
        var manager = this;
        manager.hands = [];
        manager.black = manager.add.sprite(0, 500, 'black');
        manager.world.sendToBack(manager.black);
        for (var i = 0; i < 4; i++) {
            manager.hands.push(manager.add.sprite(-100, -100, "fingers", "14"));
            manager.hands[i].anchor.setTo(0.5, 0.5);
            manager.handimation.push(manager.hands[i].animations.add("twitch"));
            manager.hands[i].visible = false;
        }
        manager.PhotoLoader();
    },

    SetSpriteData: function (num) {
        var manager = this;
        manager.world.sendToBack(manager.black);
    },

    CreateAllSpritesETC: function (num, posX, posY, handX, handY, handRot) {
        var manager = this;
        manager.PlaceHands(num, handX, handY, handRot);
        if (manager.currentScene.hands == 1) {
            for (var i = 1; i < manager.hands.length; i++) {
                manager.hands[i].visible = false;
            }
        }
    },

    PlaceHands: function (num, posX, posY, rot) {
        var manager = this;
        manager.hands[num].visible = true;
        manager.hands[num].position.x = posX;
        manager.hands[num].position.y = posY;
        manager.handimation[num].play(manager.rnd.integerInRange(6, 8), true);
        manager.hands[num].angle = rot;
    },

    FindKeys: function () {
        var manager = this;
        var getKeys = [];
        for (var i = 0; i < manager.currentScene.keySet.length; i++) {
            var tempVar = eval(manager.currentScene.keySet[i]);
            getKeys.push(tempVar);
        }
        manager.keySet = getKeys;
    },

    WaitPlease: function () {
        var manager = this;
        if (manager.song != null) {
            manager.song.destroy();
            manager.playMusic = false;
            manager.song = null;
        }
    },


    GuessPlease: function () {
        var manager = this;
        manager.world.sendToBack(manager.black);
        manager.typehands = [];
        for (var i = 0; i < 2; i++) {
            manager.typehands.push(manager.add.sprite(300, 750, "typefingers", "8"));
            manager.typehands[i].anchor.setTo(0.5, 0.5);
            manager.typehands[i].scale.y = -1;
            manager.typehandimation.push(manager.typehands[i].animations.add("move"));
        }
        manager.typehands[0].rotation = 45;
        manager.typehands[1].rotation = -45;
        manager.typehands[1].position.x = 800;
        manager.typehandimation[0].play(6, true);
        manager.typehandimation[1].play(8, true);

        manager.typehands[1].scale.x = -1;
        manager.typehands.frame = 3;
    },

    PhotoLoader: function () {
        var manager = this;
        manager.sceneSpeed = manager.currentScene.speed;
        if (manager.unloadedSets.length != 0) {
            var nextSet = manager.unloadedSets.pop();
            manager.preloadedSets.push(nextSet);
            if (manager.gameRound == 0) {

                for (var i = 0; i < manager.scenesJSON.Scenes.length; i++) {
                    if (manager.scenesJSON.Scenes[i].name == nextSet) {
                        var sheetNum = manager.scenesJSON.Scenes[i].sheets;
                        for (var j = 0; j < sheetNum; j++) {
                            if (manager.scenesJSON.Scenes[i].name.includes("computerframe")) {
                                this.load.atlasJSONArray(manager.scenesJSON.Scenes[i].name + "-" + j, "assets/textures/" + manager.scenesJSON.Scenes[i].name + "-" + j + ".png", "assets/textures/" + manager.scenesJSON.Scenes[i].name + "-" + j + ".json");
                            } else {
                                this.load.atlasJSONArray(manager.scenesJSON.Scenes[i].name + "-" + j, "assets/textures/" + manager.scenesJSON.Scenes[i].name + "-" + j + ".png", 'assets/textures/Universal.json');
                            }
                            for (var k = 0; k < this.scenesJSON.Scenes[i].sound.length; k++) {
                                this.load.audio(this.scenesJSON.Scenes[i].sound[k], "assets/sound/" + this.scenesJSON.Scenes[i].sound[k] + ".mp3", "assets/sound/" + this.scenesJSON.Scenes[i].sound[k] + ".ogg");
                            }
                        }
                    }
                }
                manager.load.start();
            }
        }
        manager.PhotoCreate();
    },

    RoomToneStart: function () {
        var manager = this;
        if (manager.currentScene.tone != null) {
            manager.roomTone = manager.add.audio(manager.currentScene.tone);
            manager.roomTone.volume = .1;
            manager.roomTone.play();
            manager.roomTone.loopFull();
        }
    },

    PhotoCreate: function () {
        var manager = this;
        manager.givenScore = false;
        var newSheet = manager.currentScene.name + "-" + "0";
        var spriteNumber = 0;
        if (manager.cache.getImage(newSheet).height < 1950) {
            spriteNumber += 1;
        }
        if (manager.cache.getImage(newSheet).height < 1450) {
            spriteNumber += 1;
        }
        if (manager.cache.getImage(newSheet).height < 950) {
            spriteNumber += 1;
        }
        manager.currentSet.push(manager.add.sprite(0, 0, manager.currentScene.name + "-" + "0", spriteNumber));
        manager.currentSetTracking.push(manager.currentScene.name + "-" + "0" + spriteNumber);
        manager.keysPressed = [];
        for (var i = 0; i < manager.keySet.length; i++) {
            manager.keysPressed[i] = false;
        }
        manager.upInt = 0;
        manager.sheetNum = 0;
        manager.spriteNum = 0;
        manager.allKeys = false;
        manager.gameReady = true;
        manager.KeyCheckSwitch(manager.currentScene.pattern);
        if (manager.currentScene.name != "sleep" && manager.currentScene.name != "wakeup") {
            if (manager.currentScene.name != "ending") {
                manager.time.events.add(Phaser.Timer.SECOND * manager.sceneTime, manager.NextScene, this);
            }
        }
        if (manager.currentScene.name == "wakeup") {
            manager.MorningScenes();
        }
        if (manager.currentScene.name == "shave") {
            manager.singing.volume = .12;
        }
    },



    NextScene: function () {
        var manager = this;
        manager.pressingButt = false;
        manager.RemoveEverything();
        if (manager.currentScene.name == 'ending') {
            manager.breathing.pause();
        } else {
            manager.breathing = manager.game.add.audio('breathing');
            manager.breathing.play();
            manager.breathing.volume = .3;
            manager.breathing.loopFull();
            manager.breathing._sound.playbackRate.value = 1;
        }
        manager.currentSetTracking.length = 0;
        manager.currentSetTracking = [];
        manager.currentSet.length = 0;
        manager.currentSet = [];
        manager.letCheck = false;
        manager.world.sendToBack(manager.black);

        if (manager.currentScene.name == "sleep") {
            if (manager.seenThis >= 50) {
                manager.playEnding = true;
            }
            if (!manager.playEnding) {
                manager.runEnd = true;
            } else {
                manager.sawCall = true;
                manager.runEnd = false;
                manager.playEnding = false;
            }
        } else if (manager.currentScene.name == "ending") {
            manager.runEnd = true;
        }
        if (manager.preloadedSets.length > 0) {
            manager.preSet = manager.preloadedSets.shift();
            for (var i = 0; i < this.scenesJSON.Scenes.length; i++) {
                if (this.scenesJSON.Scenes[i].name == manager.preSet) {
                    manager.currentScene = manager.scenesJSON.Scenes[i];
                    manager.RoomToneStart();
                    break;
                }
            }
        }
        if (manager.currentScene.playBlank) {
            manager.BlankSpace();
        } else {
            manager.RunNextScene();
        }
    },

    RunNextScene: function () {
        var manager = this;
        manager.letCheck = true;
        if (!manager.runEnd) {
            for (var i = 0; i < this.scenesJSON.Scenes.length; i++) {
                if (this.scenesJSON.Scenes[i].name == manager.preSet) {
                    manager.switchSound = null;
                    manager.currentSound = null;
                    manager.TempSoundManager();
                    manager.FindKeys();
                    manager.PhotoLoader();
                    if (manager.currentScene.name == "subway") {
                        manager.music.stop();
                        manager.music.destroy();
                    }
                    break;
                }
            }
        } else {
            var manager = this;
            manager.tweens.removeAll();
            manager.black.destroy();
            manager.sceneTime -= 1;
            manager.topLidDown = false;
            manager.bottomLidDown = false;
            manager.scenesJSON = manager.cache.getJSON('scenes');
            manager.CreateKeys();
            manager.CreateVariables();
            manager.smallKeyUnPressed[1].alpha = 1;
            manager.smallKeyBackgrounds[1].alpha = 1;
            manager.smallKeyUnPressed[1].visible = true;
            manager.smallKeyBackgrounds[1].visible = true;
            manager.smallKeyUnPressed[0].alpha = 1;
            manager.smallKeyBackgrounds[0].alpha = 1;
            manager.smallKeyUnPressed[0].visible = true;
            manager.smallKeyBackgrounds[0].visible = true;
            manager.world.sendToBack(manager.tLid);
            manager.world.sendToBack(manager.bLid);
            manager.gameRound = 1;
            for (var i = 0; i < manager.scenesJSON.Scenes.length; i++) {
                if (manager.scenesJSON.Scenes[i].time == 'morning') {
                    manager.preloadedSets.push(manager.scenesJSON.Scenes[i].name);
                } else if (manager.scenesJSON.Scenes[i].time == 'start') {
                    manager.currentScene = manager.scenesJSON.Scenes[i];
                    manager.FindKeys();
                } else {
                    manager.unloadedSets.push(manager.scenesJSON.Scenes[i].name);
                }
            }
            manager.TempSoundManager();
            if (!this.game.device.firefox) {
                manager.baseSound.loopFull();
            }

            manager.CreatePausedStuff();
            manager.InitCreateHands();
        }
    },

    TopLidDownThings: function () {
        var manager = this;
        manager.startTween = true;
        manager.tLidTween.pause();
        manager.bLidTween.pause();

        manager.world.bringToTop(manager.tLid);
        manager.world.bringToTop(manager.bLid);
        manager.world.bringToTop(manager.black);

        for (var i = 0; i < 4; i++) {
            manager.KeySetsToTop(manager.smallKeyBackgrounds[i], manager.smallKeyUnPressed[i], manager.arrows[i]);
        }
        for (var i = 0; i < manager.hands.length; i++) {
            manager.world.bringToTop(manager.hands[i]);
        }
        manager.tLid.position.y -= 1;
        if (manager.tLid.position.y <= -600) {
            manager.NextScene();
            manager.gameReady = false;
        }
        manager.bLid.position.y += 1;

    },

    PatternThreeThings: function () {
        var manager = this;
        manager.playOpen = false;
        manager.playClose = false;
        if (!manager.goDown && manager.upInt >= manager.currentScene.switchInt) {
            manager.goDown = true;
            manager.MoveHand(1);
        }
        if (manager.goDown && manager.upInt <= 0) {
            manager.goDown = false;
            manager.MoveHand(0);
        }
        if (manager.keysPressed[0]) {
            if (manager.upInt <= manager.currentScene.switchInt) {
                manager.IncreaseInt();

            }
            if (manager.upInt == 30) {
                if (manager.currentScene.soundType == 11) {
                    manager.openSound.play();
                    manager.roomTone.pause();
                    manager.secondRoomTone.play();
                    manager.secondRoomTone.loopFull();
                }
            }
        } else {
            manager.pressingButt = false;
        }
        if (manager.keysPressed[1]) {
            if (manager.upInt >= 0) {
                manager.DecreaseInt();
            }
            if (manager.upInt == 30) {
                if (manager.currentScene.soundType == 11) {
                    manager.closeSound.play();
                    manager.secondRoomTone.pause();
                    manager.roomTone.play();
                }
            }
            if (manager.currentScene.soundType == 12) {
                if (manager.upInt == manager.currentScene.soundFrame) {
                    manager.eventSound.play();
                }
            }
        }
    },

    PatternTenThings: function () {
        var manager = this;
        if (manager.upInt >= manager.currentScene.switchInt[0] && manager.upInt <= manager.currentScene.switchInt[1]) {
            manager.MoveHand(1);
        }
        if (manager.upInt >= manager.currentScene.switchInt[1]) {
            manager.MoveHand(2);
        }
        if (manager.upInt == 120) {
            manager.song.play();
            manager.singing.play();
            manager.playMusic = true;
            manager.musicHasPlayed = true;
            manager.singing.volume = 0;
            manager.song.volume = .04;
        }
        if (manager.keysPressed[0] && manager.upInt <= manager.currentScene.switchInt[0]) {

            manager.IncreaseInt();
        } else if (manager.keysPressed[1]) {
            if (manager.upInt > manager.currentScene.switchInt[0] && manager.upInt <= manager.currentScene.switchInt[1]) {

                manager.IncreaseInt();

            }
        } else if (manager.keysPressed[2]) {
            if (manager.upInt > manager.currentScene.switchInt[1]) {

                manager.IncreaseInt();

            }
        }
    },

    PatternThirteenThings: function () {
        var manager = this;
        if (manager.upInt >= manager.tempSwitchPoints[0]) {
            for (var i = 0; i < manager.keysPressed.length; i++) {
                manager.keysPressed[i] = false;
            }
            manager.IncreaseInt();

            manager.hands[0].position.x = 640;
            manager.tempSwitchPoints.shift();
            manager.letPress = false;
            manager.shiftPress = true;
        }
    },

    update: function () {
        var manager = this;
        if (manager.letCheck && manager.gameReady) {
            if (manager.keysPressed.length > 0) {
                if (manager.keysPressed.every(manager.AreTrue)) {
                    manager.allKeys = true;
                } else {
                    manager.allKeys = false;
                }
            }

            if (manager.allKeys) {
                if (manager.currentScene.name != "wakeup") {
                    if (manager.currentScene.soundType == 3) {
                        if (manager.upInt == manager.currentScene.soundFrame) {
                            manager.eventSound.play();
                        }
                    }
                    manager.IncreaseInt();

                } else {
                    if (manager.tLid.position.y <= -200) {
                        manager.IncreaseInt();


                    }
                }
                if (manager.currentScene.pattern != 5 && manager.currentScene.name != "wakeup") {

                }
            } else {
                manager.pressingButt = false;
            }
        }
        if (manager.letCheck && manager.currentScene.updateCheck) {
            manager.UpdateCheck();
        }
        if (manager.eventSoundTime) {
            if (manager.upInt == manager.currentScene.soundFrame) {
                manager.eventSound.play();
                manager.eventSoundTime = false;
            }
        }
    },

    UpdateCheck: function () {
        var manager = this;
        if (manager.currentScene.name == "wakeup") {
            if (manager.topLidDown && manager.bottomLidDown) {
                manager.TopLidDownThings();
            }
            manager.EyelidTweens();
        }
        if (manager.currentScene.pattern == 2) {
            if (manager.upInt >= 0) {
                manager.upInt--;
            }
        }
        if (manager.currentScene.pattern == 3) {
            manager.PatternThreeThings();
        }
        if (manager.currentScene.pattern == 10) {
            manager.PatternTenThings();
        }
        if (manager.currentScene.decrease) {
            if (manager.upInt > 0) {
                if (!manager.keysPressed.every(manager.AreTrue)) {
                    manager.DecreaseInt();
                }
            }
        }
        if (manager.currentScene.pattern == 5 || manager.currentScene.pattern == 22) {
            manager.gameReady = true;
            manager.NoInput();
        }
        if (manager.currentScene.pattern == 23) {
            manager.PatternThirteenThings();
        }
        if (manager.currentScene.pattern == 20) {
            if (manager.pressedSpace) {
                manager.IncreaseInt();
                manager.upperPic.scale.x += .001;
                manager.upperPic.scale.y += .001;
                if (manager.insidePic.alpha > 0.01) {
                    manager.insidePic.alpha -= .01;
                    manager.hands[0].alpha -= .01;
                } else if (manager.insidePic.alpha <= 0) {
                    manager.insidePic.alpha = 0;
                    manager.hands[0].alpha = 0;
                }
                if (manager.spaceKey.alpha >= 0.01) {
                    manager.spaceKey.alpha -= .01;
                    manager.spaceKeyBG.alpha -= .01;
                    manager.spaceWord.alpha -= .01;
                    manager.outWord.alpha += .01;
                }
                manager.world.bringToTop(manager.insidePic);
                manager.world.bringToTop(manager.upperPic);
                manager.KeySetsToTop(manager.spaceKeyBG, manager.spaceKey, manager.spaceWord);
                manager.world.bringToTop(manager.outWord);
                manager.world.bringToTop(manager.hands[0]);
            } else {
                manager.pressingButt = false;
            }
        }

    },

    KeySetsToTop: function (keyBG, key, keyLetter) {
        var manager = this;
        manager.world.bringToTop(keyBG);
        manager.world.bringToTop(key);
        manager.world.bringToTop(keyLetter);
    },

    SleepThings: function () {
        var manager = this;
        if (manager.onePress && manager.zeroPress) {
            manager.moveNum = manager.add.tween(manager.endNumber).to({
                x: 565
            }, 1000, Phaser.Easing.Linear.None, true);
            manager.onePress = false;
        }
    },

    TempSoundManager: function () {
        var manager = this;
        manager.eventSoundTime = false;
        switch (manager.currentScene.soundType) {
            case 0:
                manager.baseSound = manager.add.audio(manager.currentScene.sound[0]);
                manager.baseSound.play();
                manager.currentSound = manager.baseSound;
                break;
            case 1:
                manager.eventSound = manager.add.audio(manager.currentScene.sound[0]);
                manager.eventSoundTime = true;
                manager.currentSound = manager.eventSound;
                break;
            case 3:
                manager.eventSound = manager.add.audio(manager.currentScene.sound[0]);
                break;
            case 6:
                manager.baseSound = manager.add.audio(manager.currentScene.sound[0]);
                manager.baseSound.play();
                manager.inputSound = manager.add.audio(manager.currentScene.sound[1]);
                break;
            case 8:
                manager.inputSound = [];
                manager.postInputSound = [];
                for (var i = 0; i < 4; i++) {
                    manager.inputSound[i] = manager.add.audio(manager.currentScene.sound[i]);
                }
                for (var i = 4; i < 9; i++) {
                    manager.postInputSound[i] = manager.add.audio(manager.currentScene.sound[i]);
                    manager.postInputSound[i].volume = .5;
                }
                break;
            case 9:
                manager.inputSound = [];
                for (var i = 0; i <= manager.currentScene.sound.length; i++) {
                    manager.inputSound[i] = manager.add.audio(manager.currentScene.sound[i]);
                }
                break;
            case 10:
                manager.eventSound = manager.add.audio(manager.currentScene.sound[0]);
                manager.preSound = manager.add.audio(manager.currentScene.sound[1]);
                break;
            case 11:
                manager.secondRoomTone = manager.add.audio(manager.currentScene.sound[0]);
                manager.openSound = manager.add.audio(manager.currentScene.sound[1]);
                manager.closeSound = manager.add.audio(manager.currentScene.sound[2]);
                break;
            case 12:
                manager.inputSound = [];
                for (var i = 0; i < manager.currentScene.sound.length - 1; i++) {
                    manager.inputSound[i] = manager.add.audio(manager.currentScene.sound[i]);
                }
                manager.eventSound = manager.add.audio(manager.currentScene.sound[3]);
                break;
            case 13:
                manager.inputSound = manager.add.audio(manager.currentScene.sound[0]);
                break;
        }
        if (manager.currentScene.name == "subwayseats") {
            if (!this.game.device.firefox) {
                manager.baseSound.loopFull();
            }
        }
    },

    MorningCreate: function () {
        var manager = this;
        manager.LidCreate(-150, 50, 501);
        manager.world.bringToTop(manager.black);
        for (var i = 0; i < 4; i++) {
            manager.KeySetsToTop(manager.smallKeyBackgrounds[i], manager.smallKeyUnPressed[i], manager.arrows[i]);
        }
        for (var i = 0; i < manager.hands.length; i++) {
            manager.world.bringToTop(manager.hands[i]);
        }
    },

    LidCreate: function (tY, bY, blY) {
        var manager = this;
        manager.tLid = manager.add.sprite(0, tY, "toplid");
        manager.bLid = manager.add.sprite(0, bY, "lowerlid");
    },

    MorningTweens: function () {
        var manager = this;
        manager.tLidTween = manager.add.tween(manager.tLid).to({
            y: manager.tLid.position.y - 20
        }, 3000, Phaser.Easing.Back.Out, true);
        manager.tLidTween.repeat(1000, 1000);
        manager.bLidTween = manager.add.tween(manager.bLid).to({
            y: manager.bLid.position.y + 20
        }, 3000, Phaser.Easing.Back.Out, true);
        manager.bLidTween.repeat(1000, 1000);
        manager.tLidTween.yoyo(true, 1000);
        manager.bLidTween.yoyo(true, 1000);
    },

    MorningScenes: function () {
        var manager = this;
        manager.MorningCreate();
        manager.MorningTweens();
        manager.cursors.up.onDown.add(function () {
            manager.topLidDown = true;
        });
        manager.cursors.up.onUp.add(function () {
            manager.topLidDown = false;
        });
        manager.cursors.down.onDown.add(function () {
            manager.bottomLidDown = true;
        });
        manager.cursors.down.onUp.add(function () {
            manager.bottomLidDown = false;
        });
    },

    EyelidTweens: function () {
        var manager = this;
        if (!manager.topLidDown) {
            if (manager.tLid.position.y < -120 && manager.startTween) {
                if (manager.tLid.position.y > -180) {
                    manager.tLidReTween = manager.add.tween(manager.tLid).to({
                        y: -100
                    }, 500, Phaser.Easing.Back.Out, true);
                    manager.bLidReTween = manager.add.tween(manager.bLid).to({
                        y: 0
                    }, 500, Phaser.Easing.Back.Out, true);
                    manager.tLidReTween.onComplete.add(function () {
                        manager.tLidTween.resume();
                        manager.bLidTween.resume();
                        manager.startTween = false;
                    });
                } else {
                    manager.tLidTween = manager.add.tween(manager.tLid).to({
                        y: manager.tLid.position.y - 20
                    }, 1000, Phaser.Easing.Back.Out, true);
                    manager.bLidTween = manager.add.tween(manager.bLid).to({
                        y: manager.bLid.position.y + 20
                    }, 1000, Phaser.Easing.Back.Out, true);
                    manager.startTween = false;
                }
            }
        }
    },

    KeyCheckSwitch: function (pattern) {
        var manager = this;
        var allDone = false;
        manager.SetSpriteData();
        manager.CreateKeyBGS();
        switch (pattern) {
            case 14:
                manager.nextInt = 0;
                manager.CreateChangeEach();
                allDone = true;
                break;
            case 15:
            case 16:
            case 19:
                allDone = true;
                break;
            case 17:
                manager.SocMeds();
                break;
            case 20:
                manager.CreateSpace();
                allDone = true;
                break;
            case 23:
                manager.tempSwitchPoints = [];
                for (var i = 0; i < manager.currentScene.switchPoints.length; i++) {
                    manager.tempSwitchPoints[i] = manager.currentScene.switchPoints[i];
                }
                manager.HoldAndSwitch();
                allDone = true;
                break;
        }
        if (!allDone && !manager.currentScene.specialSet) {
            for (var i = 0; i < manager.currentScene.keySet.length; i++) {
                manager.CreateYellowBG(manager.currentScene.keySet[i], i);
            }

        }
        for (var i = 0; i < manager.hands.length; i++) {
            manager.world.bringToTop(manager.hands[i]);
        }
        switch (manager.currentScene.pattern) {
            case 0:
                if (manager.currentScene.name == "wakeup") {
                    manager.add.tween(manager.hands[0]).from({
                        y: 1500
                    }, manager.rnd.integerInRange(1000, 2000), Phaser.Easing.Linear.None, true);
                    manager.add.tween(manager.hands[1]).from({
                        y: 1500
                    }, manager.rnd.integerInRange(1000, 2000), Phaser.Easing.Linear.None, true);
                }
                manager.HoldKeys();
                break;
            case 1:
                manager.SequentialKeys();
                break;
            case 2:
                manager.TapKeys();
                break;
            case 3:
                manager.SwitchKeys();
                break;
            case 4:
                manager.GuessPlease();
                manager.AnyKey();
                break;
            case 5:
                manager.WaitPlease();
                break;
            case 6:
                manager.EndCreate();
                break;
            case 8:
                manager.TapDifferent();
                break;
            case 9:
                manager.ManyKeyInt = 0;
                manager.ManyKeySequence();
                break;
            case 10:
                manager.RecordSwitch();
                manager.song = manager.add.audio('fullsong');
                manager.singing = manager.add.audio('singing');
                break;
            case 11:
                manager.Swipe();
            case 22:
                manager.song = manager.add.audio('fullsong');
                manager.singing = manager.add.audio('singing');
                manager.TapKeys();
                break;
            case 24:
                manager.DoubleSequence();
                break;
        }
        manager.world.sendToBack(manager.black);
        if (manager.currentScene.pattern == 11) {
            manager.world.sendToBack(manager.stripMeds);
            manager.world.sendToBack(manager.lastBG);
        }

    },

    CreateYellowBG: function (keyName, num) {
        var manager = this;
        for (var i = 0; i < 4; i++) {
            manager.smallKeyUnPressed[i].alpha = 1;
            manager.smallKeyBackgrounds[i].alpha = 1;
            manager.world.bringToTop(manager.arrows[i]);
            manager.arrows[i].visible = true;
            manager.arrows[i].alpha = 1;
        }
        switch (keyName) {
            case "manager.cursors.up":
                manager.CreateAllSpritesETC(num, 625, 590, 760, 815, 150);
                break;
            case "manager.cursors.down":
                manager.CreateAllSpritesETC(num, 625, 670, 550, 915, 30);
                if (manager.hands[num] != null) {
                    manager.hands[num].scale.y = -1;
                }
                break;
            case "manager.cursors.right":
                if (manager.hands[num] != null) {
                    manager.hands[num].scale.y = 1;
                }
                manager.CreateAllSpritesETC(num, 700, 670, 920, 900, 130);
                break;
            case "manager.cursors.left":
                manager.CreateAllSpritesETC(num, 540, 720, 540, 950, 0);
                if (manager.hands[num] != null) {
                    manager.hands[num].scale.y = -1;
                }
                break;
        }
        manager.SetSpriteData(num);
    },

    EnableSmallBackgrounds: function (keyNum, xPressed, yPressed) {
        var manager = this;
        manager.smallKeyBackgrounds[keyNum].position.x = xPressed;
        manager.smallKeyBackgrounds[keyNum].position.y = yPressed;
        manager.smallKeyUnPressed[keyNum].position.x = xPressed;
        manager.smallKeyUnPressed[keyNum].position.y = yPressed;
        manager.smallKeyBackgrounds[keyNum].visible = true;
        manager.smallKeyUnPressed[keyNum].visible = true;
    },

    EndCreate: function () {
        var manager = this;
        manager.number = 0;
        manager.endRounds = 1;
        manager.endLogo = manager.add.sprite(540, 605, 'logo');
        manager.LidCreate(-550, 400, 501);
        manager.world.sendToBack(manager.black);
        manager.EnableSmallBackgrounds(0, 540, 640);
        manager.endNumber = manager.add.sprite(518, 602, 'allkeys', 'one');
        manager.world.bringToTop(manager.hands[0]);
        manager.world.bringToTop(manager.endLogo);
        manager.endLogo.alpha = 0;
        manager.PlaceHands(0, 530, 890, 180);
        manager.call = manager.add.sprite(0, 0, 'call');
        manager.call.visible = false;
        manager.EndBringToTop();
        manager.score = 14;
        manager.EndGame(0);

    },

    EndBringToTop: function () {
        var manager = this;
        manager.world.bringToTop(manager.tLid);
        manager.world.bringToTop(manager.bLid);
        manager.KeySetsToTop(manager.smallKeyBackgrounds[0], manager.smallKeyUnPressed[0], manager.endNumber);
        if (manager.endRounds > 9) {
            manager.world.bringToTop(manager.finalOne);
        }
        manager.world.bringToTop(manager.hands[0]);
        manager.world.bringToTop(manager.endLogo);
        manager.world.bringToTop(manager.call);
    },

    EndGame: function (number) {
        var manager = this;
        manager.firstPressed = false;
        manager.keySet[number].onDown.add(function () {
            if (manager.endRounds > 9) {
                if (manager.nextPressed) {
                    manager.time.events.add(Phaser.Timer.SECOND / 10, manager.EndIncreaseInt, this);
                    manager.time.events.add(Phaser.Timer.SECOND / 10, manager.FadeTenthBackIn, this);
                }
                manager.firstPressed = true;
            } else {
                manager.EndBringToTop();
                manager.AlphaTweens(manager.endNumber, 0, 200);
                if ((manager.tLid.position.y + 50) < 50) {
                    manager.YTweens(manager.tLid, '+50', 1000);
                }
                if ((manager.bLid.position.y - 50) > 50) {
                    manager.YTweens(manager.bLid, '-50', 1000);
                }
                manager.time.events.add(Phaser.Timer.SECOND / 10, manager.EndIncreaseInt, this);
            }
        }, this);
    },

    AlphaTweens: function (sprite, alphaNum, time) {
        var manager = this;
        manager.add.tween(sprite).to({
            alpha: alphaNum
        }, time, Phaser.Easing.Linear.None, true);
    },

    FromAlphaTweens: function (sprite, alphaNum, time) {
        var manager = this;
        manager.add.tween(sprite).from({
            alpha: alphaNum
        }, time, Phaser.Easing.Linear.None, true);
    },

    YTweens: function (sprite, yNum, time) {
        var manager = this;
        manager.endTopTween = manager.add.tween(sprite).to({
            y: yNum
        }, time, Phaser.Easing.Linear.None, true);
    },

    EndIncreaseInt: function () {
        var manager = this;
        manager.IncreaseInt();
        manager.EndBringToTop();
        manager.keySet[manager.number].reset();
        manager.number += 1;
        manager.AlphaTweens(manager.endNumber, 1, 200);
        manager.endNumber.frame += 1;
        if (manager.number < 9) {
            manager.YTweens(manager.hands[0], 1500, 30000)
            manager.EndGame(manager.number);
        } else {
            manager.FinalLetterCreate();
            manager.keyOne.onDown.add(function () {
                manager.YTweens(manager.tLid, 0, 1000);
                manager.moveNum = manager.add.tween(manager.finalOne).to({
                    x: 535
                }, 1500, Phaser.Easing.Linear.None, true);
                manager.AlphaTweens(manager.smallKeyUnPressed[1], 0, 200);
                manager.AlphaTweens(manager.smallKeyBackgrounds[1], 0, 200);

                manager.onePress = true;
                if (manager.zeroPress) {
                    manager.AlphaTweens(manager.endNumber, 0, 2000);
                    manager.AlphaTweens(manager.finalOne, 0, 2000);
                    manager.AlphaTweens(manager.endLogo, 1, 200);
                    manager.time.events.add(Phaser.Timer.SECOND * 3, manager.EndCall, this);
                    manager.time.events.add(Phaser.Timer.SECOND * 5, manager.NextScene, this);
                }
            }, this);
            manager.keyZero.onDown.add(function () {
                manager.YTweens(manager.bLid, 0, 1000);
                manager.moveNum = manager.add.tween(manager.endNumber).to({
                    x: 545
                }, 1500, Phaser.Easing.Linear.None, true);
                manager.AlphaTweens(manager.smallKeyUnPressed[0], 0, 200);
                manager.AlphaTweens(manager.smallKeyBackgrounds[0], 0, 200);
                manager.zeroPress = true;
                if (manager.onePress) {
                    manager.AlphaTweens(manager.endNumber, 0, 2000);
                    manager.AlphaTweens(manager.finalOne, 0, 2000);
                    manager.AlphaTweens(manager.endLogo, 1, 200);
                    manager.time.events.add(Phaser.Timer.SECOND * 3, manager.EndCall, this);
                    manager.time.events.add(Phaser.Timer.SECOND * 5, manager.NextScene, this);
                }
            }, this);
        }
    },

    EndCall: function () {
        var manager = this;
        console.log("screamin");
        manager.smallKeyBackgrounds[0].visible = false;
        manager.hands[0].visible = false;
        manager.smallKeyBackgrounds[1].visible = false;
        manager.smallKeyUnPressed[0].visible = false;
        manager.smallKeyUnPressed[1].visible = false;
        manager.finalOne.visible = false;
        manager.endNumber.visible = false;
        manager.endLogo.visible = false;
        manager.call.visible = true;
        manager.world.bringToTop(manager.call);
        manager.callSound = manager.add.audio('phonering');
        manager.callSound.play();
    },

    FadeTenthBackIn: function () {
        var manager = this;
        manager.AlphaTweens(manager.finalOne, 1, 200);
    },

    FinalLetterCreate: function () {
        var manager = this;
        manager.EnableSmallBackgrounds(1, 450, 640);
        manager.finalOne = manager.add.sprite(428, 602, 'allkeys', 'one');
        manager.KeySetsToTop(manager.smallKeyBackgrounds[1], manager.smallKeyUnPressed[1], manager.finalOne);

    },

    Swipe: function () {
        var manager = this;
        manager.gameReady = false;
        manager.lastBG = manager.add.sprite(0, 0, 'lastbg');
        manager.stripMeds = manager.add.sprite(520, 200, 'socmeds');
        manager.stripMeds.transformCallback = function (wt, pt) {
            wt.b = 0.02;
            wt.c = 0.1;
        }

        manager.world.sendToBack(manager.black);
        manager.world.sendToBack(manager.stripMeds);

        manager.world.sendToBack(manager.lastBG);

        manager.keySet[0].onDown.add(function () {
            manager.world.sendToBack(manager.stripMeds);
            manager.world.sendToBack(manager.lastBG);

            manager.stripMeds.x--;
            manager.stripMeds.y -= 10;
            manager.SwapKeySprite(0);
        }, this);
        manager.keySet[0].onUp.add(function () {
            manager.UnSwapKeySprite(0);
        })

    },

    DoubleSequence: function () {
        var manager = this;
        if (manager.currentScene.soundType == 8) {
            manager.breathing.volume = 2.2;
        }
        manager.keySet[0].onDown.add(function () {
            if (!manager.keysPressed[0] && manager.gameReady) {
                manager.SwapKeySprite(0);
                manager.IncreaseInt();
                manager.MoveHand(1);
            }
            if (manager.currentScene.soundType == 8) {
                if (manager.breathing._sound.playbackRate.value < 3) {
                    manager.breathing._sound.playbackRate.value += 0.02
                }
                var theSound = manager.rnd.integerInRange(0, 3)
                manager.inputSound[theSound].play();
            }
            if (manager.currentScene.soundType == 3) {
                if (manager.upInt == manager.currentScene.soundFrame) {
                    manager.eventSound.fadeIn(200);
                }
            }
            manager.keysPressed[0] = true;
        });
        manager.keySet[0].onUp.add(function () {
            manager.UnSwapKeySprite(0);

            if (manager.currentScene.soundType == 3) {
                manager.eventSound.pause();
            }
            if (manager.currentScene.soundType == 8) {
                if (manager.breathing._sound.playbackRate.value > 1) {
                    manager.breathing._sound.playbackRate.value -= 0.1;
                }
            }
        })
        manager.keySet[1].onDown.add(function () {
            if (manager.keysPressed[0] && manager.gameReady) {
                manager.SwapKeySprite(1);

                manager.IncreaseInt();



                if (manager.currentScene.soundType == 8) {
                    if (manager.breathing._sound.playbackRate.value < 3) {
                        manager.breathing._sound.playbackRate.value += 0.02
                    }
                    var theSound = manager.rnd.integerInRange(0, 3)
                    manager.inputSound[theSound].play();
                }
                manager.keysPressed[1] = true;
                manager.StillSequentialKeyFinish(0);
            }
        });
        manager.keySet[1].onUp.add(function () {
            manager.UnSwapKeySprite(1);

            if (manager.currentScene.soundType == 3) {
                manager.eventSound.pause();
            }
            if (manager.currentScene.soundType == 8) {
                if (manager.breathing._sound.playbackRate.value > 1) {
                    manager.breathing._sound.playbackRate.value -= 0.1;
                }
            }
        })



        manager.keySet[2].onDown.add(function () {
            if (!manager.keysPressed[2] && manager.gameReady) {
                manager.SwapKeySprite(2);

                manager.IncreaseInt();


                manager.MoveHand(2);
            }
            if (manager.currentScene.soundType == 8) {
                if (manager.breathing._sound.playbackRate.value < 3) {
                    manager.breathing._sound.playbackRate.value += 0.02
                }
                var theSound = manager.rnd.integerInRange(0, 3)
                manager.inputSound[theSound].play();
            }
            manager.keysPressed[2] = true;
        });
        manager.keySet[2].onUp.add(function () {
            manager.UnSwapKeySprite(2);

            if (manager.currentScene.soundType == 8) {
                if (manager.breathing._sound.playbackRate.value > 1) {
                    manager.breathing._sound.playbackRate.value -= 0.1;
                }
            }
        })


        manager.keySet[3].onDown.add(function () {
            if (manager.keysPressed[2] && manager.gameReady) {
                manager.SwapKeySprite(3);

                manager.IncreaseInt();


                manager.MoveHand(3);


                if (manager.currentScene.soundType == 8) {
                    if (manager.breathing._sound.playbackRate.value < 3) {
                        manager.breathing._sound.playbackRate.value += 0.02
                    }
                    var theSound = manager.rnd.integerInRange(0, 3)
                    manager.inputSound[theSound].play();

                }
                manager.AlsoSequentialKeyFinish(2);

            }
        });
        manager.keySet[3].onUp.add(function () {
            manager.UnSwapKeySprite(3);

            if (manager.currentScene.soundType == 8) {
                if (manager.breathing._sound.playbackRate.value > 1) {
                    manager.breathing._sound.playbackRate.value -= 0.1;
                }
            }
        })
    },

    SocMeds: function () {
        var manager = this;
        manager.PlaceHands(0, 780, 850, 45);
        manager.screen = manager.add.sprite(150, 0, "socialmedia-0", 0);
        manager.world.sendToBack(manager.screen);

        var upPos = 780;
        var downPos = 880;
        manager.oneClick = manager.add.audio('oneClick');
        manager.twoClick = manager.add.audio('twoClick');
        manager.threeClick = manager.add.audio('threeClick');
        manager.keySet[0].onDown.add(function () {
            manager.oneClick.play();
            if (manager.screen.frame < 8 && manager.screen.frame >= 0) {

                manager.screen.frame += 1;
            } else if (manager.screen.frame == 8) {
                manager.hands[0].position.y = upPos;
            }
        });
        manager.keySet[1].onDown.add(function () {
            manager.oneClick.play();
            if (manager.screen.frame <= 8 && manager.screen.frame > 0) {

                manager.screen.frame -= 1;
            } else if (manager.screen.frame == 0) {
                manager.hands[0].position.y = downPos;
            }
        });
        manager.world.bringToTop(manager.screen);
        manager.world.bringToTop(manager.currentSet[0]);
    },

    SpaceOut: function () {
        var manager = this;
        manager.gameReady = false;
        manager.insidePic = manager.add.sprite(manager.world.centerX, 0, manager.currentScene.insidePicSheet, manager.currentScene.insidePicSprite);
        manager.upperPic = manager.add.sprite(manager.world.centerX, 0, 'computertypeexcel-0', 0);
        manager.upperPic.anchor.setTo(0.5, 0.5);
        manager.upperPic.position.x = manager.world.centerX;
        manager.upperPic.position.y = manager.upperPic.height / 2;
        manager.insidePic.position.y = manager.insidePic.height / 2;
        manager.insidePic.anchor.setTo(0.5, 0.5);
        manager.insidePic.alpha = 1;
        manager.hasPasted = false;
        manager.world.sendToBack(manager.insidePic);
        for (var i = 0; i < manager.currentSet.length; i++) {
            manager.world.sendToBack(manager.currentSet[i]);
        }
        manager.currentSound = manager.add.audio(manager.currentScene.sound);
        manager.keySet[0].onDown.add(function () {
            manager.pressedSpace = true;
            manager.SwapKeySprite(0);

            manager.currentSound.play();
        });
        manager.keySet[0].onUp.add(function () {
            manager.UnSwapKeySprite(0);
            manager.pressedSpace = false;
            manager.currentSound.stop();
        })
        manager.world.bringToTop(manager.currentSet[0]);
        manager.world.bringToTop(manager.insidePic);
        manager.world.bringToTop(manager.upperPic);

    },

    Excel: function () {
        var manager = this;
        manager.gameReady = false;
        manager.insidePic = manager.add.sprite(0, 0, manager.currentScene.insidePicSheet, manager.currentScene.insidePicSprite);
        manager.insidePic.alpha = 1;
        manager.insidePic.visible = true;
        manager.hasPasted = false;
        manager.cursor = manager.add.sprite(433, 46, "compmaterials", "excelcursor");
        manager.excelText = [];
        manager.PlaceHands(0, 400, 850, 20);
        manager.hands[0].scale.y = -1;
        manager.PlaceHands(1, 800, 750, 120);
        manager.oneClick = manager.add.audio('oneClick');
        manager.twoClick = manager.add.audio('twoClick');
        manager.threeClick = manager.add.audio('threeClick');
        manager.excelKeys[4].visible = false;
        manager.excelKeys[5].visible = false;
        manager.excelKeys[8].visible = false;
        var cell = 0;

        manager.control.onDown.add(function () {
            manager.IncreaseInt();

            manager.SwapKeySprite(1);
            manager.keysPressed[0] = true;
            manager.oneClick.play();
        });
        manager.control.onUp.add(function () {
            manager.UnSwapKeySprite(1);
            manager.keysPressed[0] = false;
        });
        manager.vee.onDown.add(function () {
            manager.IncreaseInt();

            manager.SwapKeySprite(0);
            manager.twoClick.play();
            if (manager.keysPressed[0] && !manager.hasPasted) {

                manager.hands[0].visible = false;
                manager.excelText[cell] = manager.add.text(manager.cursor.position.x + 5, manager.cursor.position.y + 2, "100", {
                    font: "10px Arial",
                    fill: '#000000',
                });

                manager.excelKeys[0].visible = false;
                manager.excelKeys[1].visible = false;
                manager.excelKeys[2].visible = false;
                manager.excelKeys[3].visible = false;
                manager.excelKeys[4].visible = true;
                manager.excelKeys[5].visible = true;
                manager.excelKeys[6].visible = false;
                manager.excelKeys[7].visible = false;
                manager.excelKeys[8].visible = true;


                manager.keysPressed[1] = true;
                manager.hasPasted = true;
            }
        });
        manager.vee.onUp.add(function () {
            manager.UnSwapKeySprite(0);

        })
        manager.tab.onDown.add(function () {
            manager.IncreaseInt();

            manager.SwapKeySprite(2);
            if (manager.keysPressed[1]) {

                manager.threeClick.play();
                manager.hands[0].visible = true;
                manager.keysPressed[1] = false;
                manager.excelKeys[0].visible = true;
                manager.excelKeys[1].visible = true;
                manager.excelKeys[2].visible = true;
                manager.excelKeys[3].visible = true;
                manager.excelKeys[4].visible = false;
                manager.excelKeys[5].visible = false;
                manager.excelKeys[6].visible = true;
                manager.excelKeys[7].visible = true;
                manager.excelKeys[8].visible = false;

                manager.cursor.position.x += 40;
                cell += 1;
                if (cell % 9 == 0) {
                    manager.cursor.position.y += 10;
                    manager.cursor.position.x = 433;
                }
                manager.hasPasted = false;
            }
        });
        manager.tab.onUp.add(function () {
            manager.UnSwapKeySprite(2);
        })

        manager.world.bringToTop(manager.insidePic);
        manager.world.bringToTop(manager.excelText);
        manager.world.bringToTop(manager.cursor);
        manager.world.bringToTop(manager.currentSet[0]);
    },

    HoldAndSwitch: function () {
        var manager = this;
        manager.thisSceneSound = [];
        for (var i = 0; i < manager.currentScene.sound.length; i++) {
            manager.thisSceneSound[i] = manager.currentScene.sound[i];
        }
        manager.letPress = true;
        manager.shiftPress = false;
        manager.playEventSOund = false;
        manager.keySet[0].onDown.add(function () {
            if (manager.letPress) {
                manager.SwapKeySprite(0);
                if (!manager.playEventSOund) {
                    manager.inputSound.play();
                    manager.playEventSOund = true;
                } else {
                    manager.inputSound.resume();
                }
                for (var i = 0; i < manager.keysPressed.length; i++) {
                    manager.keysPressed[i] = true;
                }
            }
        });
        manager.keySet[0].onUp.add(function () {
            manager.UnSwapKeySprite(0);
            for (var i = 0; i < manager.keysPressed.length; i++) {
                manager.inputSound.pause();
                manager.keysPressed[i] = false;
            }
            manager.pressingButt = false;
        });
        manager.keySet[1].onDown.add(function () {
            if (manager.shiftPress) {
                manager.playEventSOund = false;
                manager.thisSceneSound.shift();
                manager.IncreaseInt();


                manager.keySet.shift();
                manager.hands[0].position.x = 550;
                manager.letPress = true;
                manager.shiftPress = false;
            }
        });
    },

    BlankSpace: function () {
        var manager = this;
        manager.time.events.add(Phaser.Timer.SECOND, manager.RunNextScene, this);
    },

    ChangeEach: function () {
        var manager = this;
        manager.gameReady = false;

        if (manager.nextInt >= 6) {
            manager.keySet[manager.nextInt].onDown.add(function () {
                manager.SwapKeySprite(manager.nextInt);
                manager.keysPressed[manager.nextInt] = true;
                manager.gameReady = true;
            })
            manager.keySet[manager.nextInt].onUp.add(function () {
                manager.UnSwapKeySprite(manager.nextInt);
            })

        } else {
            manager.keySet[manager.nextInt].onDown.add(function () {
                manager.SwapKeySprite(manager.nextInt);
                manager.ResetKeyboard();
                manager.IncreaseInt();


                manager.keysPressed[manager.nextInt] = true;
                manager.PlaceHands(0, manager.ChangeEachHandsX[manager.nextInt], manager.ChangeEachHandsY[manager.nextInt], 120);
                manager.nextInt += 1;
                if (manager.nextInt >= 6) {
                    manager.CreateAllSpritesETC(1, 630, 665, 800, 820, 45);
                }

                manager.ChangeEach();
            });
            manager.keySet[manager.nextInt].onUp.add(function () {
                manager.UnSwapKeySprite(manager.nextInt);
            })
        }

    },

    CantSleep: function () {
        var manager = this;
        manager.gameReady = false;
        manager.blanketNum = 0;
        manager.blanketSheet = 0;
        manager.blanket = [];
        manager.input.keyboard.onDownCallback = function () {
            if (manager.currentScene.name == "cantsleep") {
                manager.hands[0].position.x += 100;
                if (manager.hands[0].position.x >= 900) {
                    manager.hands[0].position.x = 560;
                }
                if (manager.upInt >= 8) {
                    if (manager.upInt > 30) {
                        manager.world.bringToTop(manager.currentSet[0]);

                        if ((manager.tLid.position.y + 50) < 50) {
                            manager.YTweens(manager.tLid, '-500', 1000);
                        }
                        if ((manager.bLid.position.y - 50) > 50) {
                            manager.YTweens(manager.bLid, '+500', 1000);
                        }
                    } else if (manager.upInt == 69) {
                        manager.world.bringToTop(manager.currentSet[0]);

                        if ((manager.tLid.position.y + 50) < 50) {
                            manager.YTweens(manager.tLid, '-500', 1000);
                        }
                        if ((manager.bLid.position.y - 50) > 50) {
                            manager.YTweens(manager.bLid, '+500', 1000);
                        }
                    } else if (manager.upInt < 50) {
                        manager.IncreaseInt();
                        manager.world.bringToTop(manager.tLid);
                        manager.world.bringToTop(manager.bLid);
                        for (var i = 0; i < 5; i++) {
                            manager.KeySetsToTop(manager.smallKeyBackgrounds[i], manager.smallKeyUnPressed[i], manager.letter[i]);
                        }
                        manager.world.bringToTop(manager.hands[0]);
                        if ((manager.tLid.position.y + 50) < 50) {
                            manager.YTweens(manager.tLid, '+40', 1000);
                        }
                        if ((manager.bLid.position.y - 50) > 50) {
                            manager.YTweens(manager.bLid, '-40', 1000);
                        }


                    }
                    if (manager.upInt % 2 == 0) {
                        if (manager.sleepArray[0] != null) {
                            manager.ChangeCantSleepLetters();
                        }
                    }
                } else {
                    manager.IncreaseInt();
                    manager.world.bringToTop(manager.tLid);
                    manager.world.bringToTop(manager.bLid);
                    for (var i = 0; i < 5; i++) {
                        manager.KeySetsToTop(manager.smallKeyBackgrounds[i], manager.smallKeyUnPressed[i], manager.letter[i]);
                    }
                    manager.world.bringToTop(manager.hands[0]);
                    if ((manager.tLid.position.y + 50) < 50) {
                        manager.YTweens(manager.tLid, '+40', 1000);
                    }
                    if ((manager.bLid.position.y - 50) > 50) {
                        manager.YTweens(manager.bLid, '-40', 1000);
                    }


                }
            }
        }
    },

    BlanketOver: function () {
        var manager = this;
        if (manager.blanketNum < 4) {
            manager.blanket.push(manager.add.sprite(0, 0, 'blanketover-' + manager.blanketSheet, 'blanketover' + manager.blanketSheet + manager.blanketNum));
            manager.blanketNum += 1;
            if (manager.blanketNum == 4 && manager.blanketSheet == 0) {
                manager.blanketNum = 0;
                manager.blanketSheet = 1;
            }
        }
    },

    ManyKeySequence: function () {
        var manager = this;
        manager.keysPressed[0] = false;
        manager.keySet[manager.ManyKeyInt].reset();
        manager.keySet[manager.ManyKeyInt + 1].reset();
        manager.keySet[manager.ManyKeyInt].onDown.add(function () {
            manager.SwapKeySprite(manager.ManyKeyInt);
            manager.IncreaseInt();


            var theSound = manager.rnd.integerInRange(0, 2)
            manager.inputSound[theSound].play();
            manager.keysPressed[0] = true;

            manager.hands[0].position.x += 170;

            manager.keySet[manager.ManyKeyInt].reset();
        });
        manager.keySet[manager.ManyKeyInt].onUp.add(function () {
            manager.UnSwapKeySprite(manager.ManyKeyInt);
        })
        var nextKey = manager.ManyKeyInt + 1;
        manager.keySet[nextKey].onDown.add(function () {
            if (manager.keysPressed[0]) {
                manager.SwapKeySprite(nextKey);
                manager.hands[0].position.x -= 170;
                manager.hands[0].position.y += 80;
                manager.ButtonMoveKeys(manager.ManyKeyInt, nextKey);
                manager.IncreaseInt();
                manager.keySet[manager.ManyKeyInt].reset();
                manager.keySet[manager.ManyKeyInt + 1].reset();
                manager.ManyKeyInt += 2;
                if (manager.ManyKeyInt >= manager.keySet.length) {
                    manager.time.events.add(Phaser.Timer.SECOND * 3, function () {
                        manager.NextScene();
                    });
                    manager.gameReady = false;
                } else {
                    manager.ManyKeySequence();
                }
            }
        });
        manager.keySet[nextKey].onUp.add(function () {
            manager.UnSwapKeySprite(nextKey);

        })
    },

    ButtonMoveKeys: function (key1, key2) {
        var manager = this;
        manager.add.tween(manager.smallKeyBackgrounds[key1]).to({
            x: 520,
        }, 1000, Phaser.Easing.Linear.None, true);
        manager.add.tween(manager.smallKeyUnPressed[key1]).to({
            x: 520,
        }, 1000, Phaser.Easing.Linear.None, true);
        manager.add.tween(manager.buttonLetters[key1]).to({
            x: 520,
        }, 1000, Phaser.Easing.Linear.None, true);
        manager.add.tween(manager.smallKeyBackgrounds[key2]).to({
            x: 600,
        }, 1000, Phaser.Easing.Linear.None, true);
        manager.add.tween(manager.smallKeyUnPressed[key2]).to({
            x: 600,
        }, 1000, Phaser.Easing.Linear.None, true);
        manager.add.tween(manager.buttonLetters[key2]).to({
            x: 600,
        }, 1000, Phaser.Easing.Linear.None, true);
    },

    HoldKeys: function () {
        var manager = this;
        manager.inputHasPlayed = false;
        manager.keySet[0].onDown.add(function () {
            manager.SwapKeySprite(0);
            if (manager.currentScene.name == "pill") {
                if (!this.game.device.windows) {
                    manager.keysPressed[0] = true;
                    manager.keysPressed[1] = true;
                } else {
                    manager.keysPressed[0] = true;
                    manager.keysPressed[1] = true;
                }
            } else {
                manager.keysPressed[0] = true;
            }
            if (manager.currentScene.soundType == 6) {
                if (!manager.inputHasPlayed) {
                    manager.inputSound.play();
                    manager.inputHasPlayed = true;
                } else {
                    manager.inputSound.resume();
                }
            }
            if (manager.currentScene.soundType == 8) {
                var theSound = manager.rnd.integerInRange(0, 3)
                manager.inputSound[theSound].play();
            }

            if (manager.currentScene.soundType == 13) {
                manager.inputSound.play();
            }
        });
        manager.keySet[0].onUp.add(function () {
            manager.UnSwapKeySprite(0);
            if (manager.currentScene.name == "pill") {
                if (!this.game.device.windows) {
                    manager.keysPressed[0] = false;
                    manager.keysPressed[1] = false;

                } else {
                    manager.keysPressed[0] = false;
                    manager.keysPressed[1] = false;
                }
            }
            manager.keysPressed[0] = false;

        });



        if (manager.keySet[1] != null) {
            manager.keySet[1].onDown.add(function () {
                manager.SwapKeySprite(1);
                manager.keysPressed[1] = true;
            });
            manager.keySet[1].onUp.add(function () {
                manager.UnSwapKeySprite(1);
                manager.keysPressed[1] = false;
            });
        }
        if (manager.keySet[2] != null) {
            manager.keySet[2].onDown.add(function () {
                manager.SwapKeySprite(2);
                manager.keysPressed[2] = true;
            });
            manager.keySet[2].onUp.add(function () {
                manager.UnSwapKeySprite(2);
                manager.keysPressed[2] = false;
            });
        }
        if (manager.keySet[3] != null) {
            manager.keySet[3].onDown.add(function () {
                manager.SwapKeySprite(3);
                manager.keysPressed[3] = true;
            });
            manager.keySet[3].onUp.add(function () {
                manager.UnSwapKeySprite(3);
                manager.keysPressed[3] = false;
            });
        }
    },


    Delete: function () {
        var manager = this;
        manager.PlaceHands(0, 500, 880, 180);
        manager.gameReady = false;
        manager.oneClick = manager.add.audio('oneClick');
        manager.twoClick = manager.add.audio('twoClick');
        manager.threeClick = manager.add.audio('threeClick');
        manager.underPic = manager.add.sprite(0, 0, "compmaterials", "desktopbackground");
        manager.insidePic = manager.add.sprite(0, 0, manager.currentScene.insidePicSheet, manager.currentScene.insidePicSprite);
        manager.loanEmailText = "Hello borrower,\nYour latest student loan bill\nis available on your account page!\n\nCheck it out!🤑\n";
        manager.loanEmail = manager.add.text(525, 85, manager.loanEmailText, {
            font: "10px Arial",
            fill: '#000000',
        });
        manager.world.sendToBack(manager.insidePic);
        manager.world.sendToBack(manager.underPic);
        manager.world.sendToBack(manager.blueScreen);
        manager.deleteKey.onDown.add(function () {
            manager.IncreaseInt();

            manager.SwapKeySprite(0);
            manager.deleteTime += 1;
            manager.loanEmail.text = "";
            if (manager.deleteTime >= 15) {
                manager.world.sendToBack(manager.insidePic);
                manager.world.sendToBack(manager.underPic);
            }
            manager.threeClick.play();
            manager.world.sendToBack(manager.insidePic);

        });
        manager.deleteKey.onUp.add(function () {
            manager.UnSwapKeySprite(0);
        })
        manager.world.bringToTop(manager.blueScreen);
        manager.world.bringToTop(manager.underPic);
        manager.world.bringToTop(manager.insidePic);
        manager.world.bringToTop(manager.currentSet[0]);
        manager.world.bringToTop(manager.loanEmail);
    },

    AreTrue: function (element, index, array) {
        return element == true;
    },

    SequentialKeys: function () {
        var manager = this;
        if (manager.currentScene.soundType == 8) {
            manager.breathing.volume = 2.2;
        }
        manager.keySet[0].onDown.add(function () {
            if (!manager.keysPressed[0]) {
                manager.SwapKeySprite(0);
                manager.IncreaseInt();

                manager.MoveHand(1);
            }
            if (manager.currentScene.soundType == 8) {
                manager.breathing._sound.playbackRate.value = 1.5;
                var theSound = manager.rnd.integerInRange(1, 3)
                manager.inputSound[theSound].play();

            }
            if (manager.currentScene.soundType == 3) {
                if (manager.upInt == manager.currentScene.soundFrame) {
                    manager.eventSound.fadeIn(200);
                }
            }
            manager.keysPressed[0] = true;
        });
        manager.keySet[0].onUp.add(function () {
            manager.UnSwapKeySprite(0);

            if (manager.currentScene.soundType == 3) {
                manager.eventSound.pause();
            }
            if (manager.currentScene.soundType == 8) {
                manager.breathing._sound.playbackRate.value = 1.0;
            }
        })
        manager.keySet[1].onDown.add(function () {
            if (manager.keysPressed[0]) {
                if (!manager.keysPressed[1]) {
                    manager.SwapKeySprite(1);

                    manager.IncreaseInt();

                }
                if (manager.currentScene.soundType == 8) {
                    manager.breathing._sound.playbackRate.value = 1.5;
                    var theSound = manager.rnd.integerInRange(1, 3)
                    manager.inputSound[theSound].play();

                }
                if (manager.currentScene.soundType == 3) {
                    manager.eventSound.resume();

                }
                manager.keysPressed[1] = true;
                if (manager.keySet.length == 2) {
                    manager.SequentialKeyFinish(0);
                } else {
                    manager.MoveHand(2);
                }
            }
        });
        manager.keySet[1].onUp.add(function () {
            manager.UnSwapKeySprite(1);

            if (manager.currentScene.soundType == 3) {
                manager.eventSound.pause();
            }
            if (manager.currentScene.soundType == 8) {
                manager.breathing._sound.playbackRate.value = 1.0;
            }
        })
        if (manager.keySet.length >= 3) {
            manager.keySet[2].onDown.add(function () {
                if (manager.keysPressed[1]) {
                    if (!manager.keysPressed[2]) {
                        manager.SwapKeySprite(2);
                        manager.IncreaseInt();

                        manager.keysPressed[2] = true;
                    }
                    if (manager.keySet.length == 3) {
                        manager.SequentialKeyFinish(0);
                    } else {
                        manager.MoveHand(3);
                    }
                }
                if (manager.currentScene.soundType == 3) {
                    manager.eventSound.resume();

                }
            });
            manager.keySet[2].onUp.add(function () {
                manager.UnSwapKeySprite(2);
                if (manager.currentScene.soundType == 3) {
                    manager.eventSound.pause();

                }
            })
        }
        if (manager.keySet.length >= 4) {
            manager.keySet[3].onDown.add(function () {
                if (manager.keysPressed[2]) {
                    if (!manager.keysPressed[3]) {
                        manager.SwapKeySprite(3);
                        manager.IncreaseInt();
                        manager.SequentialKeyFinish(0);
                        manager.keysPressed[2] = false;
                    }
                }
                if (manager.currentScene.soundType == 3) {
                    manager.eventSound.resume();

                }
            });
            manager.keySet[3].onUp.add(function () {
                manager.UnSwapKeySprite(3);

            })
        }
    },

    SequentialKeyFinish: function (num) {
        var manager = this;
        manager.MoveHand(num);
        manager.SetKeysPressedFalse();
    },

    StillSequentialKeyFinish: function (num) {
        var manager = this;
        manager.MoveHand(num);
        manager.keysPressed[0] = false;
        manager.keysPressed[1] = false;
    },

    AlsoSequentialKeyFinish: function (num) {
        var manager = this;
        manager.MoveHand(num + 1);
        manager.keysPressed[2] = false
        manager.keysPressed[3] = false
    },

    MoveHand: function (key) {
        var manager = this;
        switch (manager.keySet[key]) {
            case manager.cursors.left:
                manager.NewHandPos(450, 920, 30);
                if (manager.hands[0] != null) {
                    manager.hands[0].scale.y = -1;
                }
                break;
            case manager.cursors.right:
                manager.NewHandPos(920, 900, 130);
                if (manager.hands[0] != null) {
                    manager.hands[0].scale.y = 1;
                }
                break;
            case manager.cursors.up:
                manager.NewHandPos(760, 815, 150);
                if (manager.hands[0] != null) {
                    manager.hands[0].scale.y = 1;
                }
                break;
            case manager.cursors.down:
                manager.NewHandPos(550, 915, 30);
                if (manager.hands[0] != null) {
                    manager.hands[0].scale.y = -1;
                }
                break;
            case manager.oh:
                manager.AlsoNewHandPos(880, 810, 90);
                break;
            case manager.pee:
                manager.AlsoNewHandPos(860, 810, 60);
                break;
        }
    },

    NewHandPos: function (posX, posY, rot) {
        var manager = this;
        manager.hands[0].position.x = posX;
        manager.hands[0].position.y = posY;
        manager.hands[0].angle = rot;
    },

    AlsoNewHandPos: function (posX, posY, rot) {
        var manager = this;
        manager.hands[2].position.x = posX;
        manager.hands[2].position.y = posY;
        manager.hands[2].angle = rot;
    },


    SetKeysPressedFalse: function () {
        var manager = this;

        for (var i = 0; i < manager.keysPressed.length; i++) {
            manager.keysPressed[i] = false;
        }
    },

    RecordSwitch: function () {
        var manager = this;
        manager.playMusic = false;
        manager.musicHasPlayed = false;
        manager.keySet[0].onDown.add(function () {

            manager.SwapKeySprite(0);
            manager.keysPressed[0] = true;
        });
        manager.keySet[0].onUp.add(function () {

            manager.UnSwapKeySprite(0);
            manager.keysPressed[0] = false;
        });
        manager.keySet[1].onDown.add(function () {

            manager.SwapKeySprite(1);
            manager.keysPressed[1] = true;
        });
        manager.keySet[1].onUp.add(function () {
            manager.UnSwapKeySprite(1);

            manager.keysPressed[1] = false;
        });
        manager.keySet[2].onDown.add(function () {
            manager.SwapKeySprite(2);
            manager.keysPressed[2] = true;
        });
        manager.keySet[2].onUp.add(function () {
            manager.UnSwapKeySprite(2);

            manager.keysPressed[2] = false;
        });
    },

    SwitchKeys: function () {
        var manager = this;
        if (manager.currentScene.name == "iron") {
            manager.eventSound.play();
        }
        manager.randoSound = 0;
        manager.keySet[0].onDown.add(function () {
            if (manager.currentScene.soundType == 12) {
                manager.randoSound = manager.rnd.integerInRange(0, 2)
                manager.inputSound[manager.randoSound].play();
            }
            manager.SwapKeySprite(0);
            manager.keysPressed[0] = true;
        });
        manager.keySet[0].onUp.add(function () {
            if (manager.currentScene.soundType == 12) {
                manager.inputSound[manager.randoSound].pause();
            }
            manager.UnSwapKeySprite(0);
            manager.keysPressed[0] = false;
        });
        manager.keySet[1].onDown.add(function () {
            if (manager.currentScene.soundType == 12) {
                manager.randoSound = manager.rnd.integerInRange(0, 2)
                manager.inputSound[manager.randoSound].play();
            }
            manager.SwapKeySprite(1);
            manager.keysPressed[1] = true;
        });
        manager.keySet[1].onUp.add(function () {
            manager.UnSwapKeySprite(1);
            if (manager.currentScene.soundType == 12) {
                manager.inputSound[manager.randoSound].pause();
            }
            manager.keysPressed[1] = false;
        });
    },

    SwapKeySprite: function (key) {
        var manager = this;
        switch (manager.keySet[key]) {
            case manager.cursors.left:
                manager.smallKeyUnPressed[1].frame = 41;
                break;
            case manager.cursors.right:
                manager.smallKeyUnPressed[3].frame = 41;
                break;
            case manager.cursors.up:
                manager.smallKeyUnPressed[0].frame = 41;
                break;
            case manager.cursors.down:
                manager.smallKeyUnPressed[2].frame = 41;
                break;
            case manager.oh:
                manager.smallKeyUnPressed[0].frame = 41;
                break;
            case manager.tab:
                manager.excelKeys[5].frame = 44;
                break;
            case manager.control:
                if (manager.currentScene.name != 'pill') {
                    manager.excelKeys[1].frame = 41;
                } else {
                    manager.smallKeyUnPressed[0].frame = 41
                }
                break;
            case manager.vee:
                manager.excelKeys[3].frame = 41;
                break;
            case manager.deleteKey:
                manager.deleteKeys[1].frame = 44;
                break;
            case manager.efNine:
                manager.smallKeyUnPressed[0].frame = 41;
                manager.smallKeyUnPressed[1].frame = 41;
                break;
            case manager.space:
                manager.spaceKey.frame = 0;
                break;
        }
    },

    UnSwapKeySprite: function (key) {
        var manager = this;
        switch (manager.keySet[key]) {
            case manager.cursors.left:
                manager.smallKeyUnPressed[1].frame = 42;
                break;
            case manager.cursors.right:
                manager.smallKeyUnPressed[3].frame = 42;
                break;
            case manager.cursors.up:
                manager.smallKeyUnPressed[0].frame = 42;
                break;
            case manager.cursors.down:
                manager.smallKeyUnPressed[2].frame = 42;
                break;
            case manager.oh:
                manager.smallKeyUnPressed[0].frame = 42;
                break;
            case manager.tab:
                manager.excelKeys[5].frame = 45;
                break;
            case manager.control:
                if (manager.currentScene.name != 'pill') {
                    manager.excelKeys[1].frame = 42;
                } else {
                    manager.smallKeyUnPressed[0].frame = 42
                }
                break;
            case manager.vee:
                manager.excelKeys[3].frame = 42;
                break;
            case manager.deleteKey:
                manager.deleteKeys[1].frame = 45;
                break;
            case manager.efNine:
                manager.smallKeyUnPressed[0].frame = 42;
                manager.smallKeyUnPressed[1].frame = 42;
                break;
            case manager.space:
                manager.spaceKey.frame = 3;
                break;
        }
    },

    RestartCheck: function () {
        var manager = this;
        manager.seenThis++;
        console.log(manager.seenThis);
        if (!manager.givenScore && manager.currentScene.name != "sleep") {
            manager.score += 1;
        }
        manager.givenScore = true;
        if (manager.currentScene.restart) {
            if (manager.currentScene.name == "jogging") {
                manager.ResetKeyboard();
                manager.time.events.removeAll();
                if (manager.currentScene.name == "recordplay") {
                    manager.time.events.add(Phaser.Timer.SECOND * 3, manager.NextScene, this);
                } else if (manager.currentScene.name != "wakeup") {
                    manager.time.events.add(Phaser.Timer.SECOND, manager.NextScene, this);
                }
                manager.hands[0].visible = false;
                manager.hands[2].visible = false;
                manager.hands[3].visible = false;
                manager.hands[1].visible = false;
            } else {
                if (manager.currentScene.name == "recordplay") {
                    manager.sheetNum = 8;
                } else {
                    manager.sheetNum = 0;
                }
                manager.spriteNum = 0;
            }
        } else {
            if (manager.currentScene.name != "ending") {
                if (!manager.currentScene.decrease && manager.currentScene.name != "sleep") {
                    manager.time.events.removeAll();
                    if (manager.currentScene.name == "recordplay") {
                        manager.time.events.add(Phaser.Timer.SECOND * 3, manager.NextScene, this);
                    } else if (manager.currentScene.name != "wakeup") {
                        manager.time.events.add(Phaser.Timer.SECOND, manager.NextScene, this);
                    }
                    manager.gameReady = false;
                    manager.tweens.removeAll();
                    manager.ResetKeyboard();
                }
            } else {
                manager.AlphaTweens(manager.currentSet[manager.currentSet.length - 1], 0, 2000);
                manager.time.events.add(Phaser.Timer.SECOND * 4, manager.NextScene, this);
            }
        }
    },

    TapKeys: function () {
        var manager = this;
        manager.world.sendToBack(manager.black);
        manager.gameReady = false;
        if (manager.currentScene.name == "bigo") {
            manager.breathing.volume = 1.8;
        } else if (manager.currentScene.name == "situp") {
            manager.sitRepeat = manager.time.events.repeat(Phaser.Timer.SECOND / 2, 15, manager.SitUpAnim, this);
        }
        manager.keySet[0].onDown.add(function () {
            manager.SwapKeySprite(0);
            if (manager.currentScene.name == "bigo" || manager.currentScene.name == "situp") {
                if (manager.breathing._sound.playbackRate.value < 3) {
                    manager.breathing._sound.playbackRate.value += 0.02
                }
            }
            manager.keysPressed[0] = true;
            manager.IncreaseInt();
            if (manager.sheetNum == 1 && manager.spriteNum == 0) {
                if (manager.currentScene.soundType == 13) {
                    manager.inputSound.play();
                }
            }
        });
        manager.keySet[0].onUp.add(function () {
            manager.UnSwapKeySprite(0);
            if (manager.breathing._sound.playbackRate.value > 1) {
                manager.breathing._sound.playbackRate.value -= 0.02
            }
            manager.keysPressed[0] = false;
        });
    },

    SitUpAnim: function () {
        var manager = this;
        manager.time.events.add(Phaser.Timer.SECOND / 3, manager.SitUpAnimBack, this);
        manager.hands[0].position.x = 800;
    },

    SitUpAnimBack: function () {
        var manager = this;
        manager.hands[0].position.x = 760;
    },

    AnyKey: function () {
        var manager = this;
        manager.gameReady = false;
        manager.underPic = manager.add.sprite(0, 0, "compmaterials", "desktopbackground");
        manager.insidePic = manager.add.sprite(0, 0, manager.currentScene.insidePicSheet, manager.currentScene.insidePicSprite);
        manager.address = 'Sam11221.geemail.com';
        manager.subject = 'dinner?';
        manager.emailText = "Hey Sam,\nHope all's well with you.\nIt's been a while since we've hung out, so\n I was wondering if you'd like to go out for dinner\nsometime. Totally understand if you can't, though!\nHope to hear from you.";
        manager.text0 = manager.add.text(520, 50, manager.address, {
            font: "9px Arial",
            fill: '#000000',
        });
        manager.text1 = manager.add.text(520, 65, manager.subject, {
            font: "9px Arial",
            fill: '#000000',
        });
        manager.text2 = manager.add.text(520, 80, "", {
            font: "12px Arial",
            fill: '#000000',
        });
        manager.email = [];
        manager.emailDisplay = "";
        manager.email = manager.emailText.split("");
        manager.world.sendToBack(manager.text0);
        manager.world.sendToBack(manager.text1);
        manager.world.sendToBack(manager.text2);
        manager.world.sendToBack(manager.insidePic);
        manager.world.sendToBack(manager.underPic);
        manager.clicks = [];
        manager.clicks[0] = manager.add.audio("click2");
        manager.clicks[1] = manager.add.audio("click3");
        manager.clicks[2] = manager.add.audio("click4");
        manager.clicks[3] = manager.add.audio("click1");
        manager.input.keyboard.onDownCallback = function () {
            if (manager.currentScene.name == "computertypeemail") {
                manager.IncreaseInt();


                manager.clicks[manager.rnd.integerInRange(0, 3)].play();
                var nextChar = manager.email.shift();
                manager.emailDisplay += nextChar;
                if (nextChar != null) {
                    manager.text2.text = manager.emailDisplay;
                } else {
                    manager.enterKey.onDown.add(function () {
                        manager.text0.text = "";
                        manager.text1.text = "";
                        manager.text2.text = "";
                        manager.insidePic.visible = false;

                    });
                }
            }
        };
        manager.world.bringToTop(manager.underPic);
        manager.world.bringToTop(manager.insidePic);
        manager.world.bringToTop(manager.text0);
        manager.world.bringToTop(manager.text1);
        manager.world.bringToTop(manager.text2);
        manager.world.bringToTop(manager.upperPic);
        manager.world.bringToTop(manager.currentSet[0]);
    },

    NoInput: function () {
        var manager = this;
        manager.upInt += 1;
        manager.decreasing = false;
        if (manager.gameReady) {
            if (manager.upInt != 0) {
                if (manager.upInt % manager.sceneSpeed == 0) {
                    if (manager.spriteNum >= 3) {
                        manager.sheetNum += 1;
                        manager.spriteNum = 0;
                        if (manager.sheetNum >= manager.currentScene.sheets) {
                            manager.gameReady = false;
                            if (manager.currentScene.restart) {
                                manager.RestartCheck();
                            } else {
                                manager.time.events.add(Phaser.Timer.SECOND, manager.NextScene, this);
                                manager.gameReady = false;
                            }
                        } else {
                            manager.CreateOrReFindPic(manager.currentScene.name);
                        }
                    } else {
                        if (manager.sheetNum <= manager.currentScene.sheets) {
                            manager.spriteNum += 1;
                            manager.CreateOrReFindPic(manager.currentScene.name);
                        }
                    }
                    for (var i = 0; i < manager.hands.length; i++) {
                        manager.world.bringToTop(manager.hands[i]);
                    }
                }
            }
        }

    },


    CreateOrReFindPic: function (sheetName) {
        var manager = this;
        if (manager.currentScene.name == "wakeup" && manager.sawCall) {
            console.log('did here');
            var newSheet = 'finalwakeup' + '-' + manager.sheetNum;
            sheetName = 'finalwakeup';
        } else {
            var newSheet = sheetName + "-" + manager.sheetNum;
        }
        if (manager.sheetNum != manager.currentScene.sheets) {

            if (manager.cache.getImage(newSheet).height < 1950) {
                if (!manager.decreasing) {
                    if (manager.spriteNum == 0) {
                        manager.spriteNum = 1;
                    }
                }
            }
            if (manager.cache.getImage(newSheet).height < 1450) {
                if (!manager.decreasing) {
                    if (manager.spriteNum == 1) {
                        manager.spriteNum = 2;
                    }
                }
            }
            if (manager.cache.getImage(newSheet).height < 950) {
                if (!manager.decreasing) {
                    if (manager.spriteNum == 2) {
                        manager.spriteNum = 3;
                    }
                }
            }

            for (var i = 0; i < manager.currentSet.length; i++) {
                manager.currentSet[i].visible = false;
            }
            if (manager.currentSetTracking.includes(sheetName + manager.sheetNum + manager.spriteNum)) {
                manager.world.bringToTop(manager.currentSet[manager.currentSetTracking.indexOf(sheetName + manager.sheetNum + manager.spriteNum)]);
                manager.currentSet[manager.currentSetTracking.indexOf(sheetName + manager.sheetNum + manager.spriteNum)].visible = true;
            } else {
                if (manager.currentScene.name == "ending") {
                    manager.currentSet.push(manager.add.sprite(0, 0, sheetName + "-" + manager.sheetNum, manager.spriteNum));
                    manager.currentSetTracking.push(sheetName + manager.sheetNum + manager.spriteNum);
                    manager.rndSheet.push(sheetName + "-" + manager.sheetNum);
                    manager.currentSet[manager.currentSet.length - 2].visible = true;
                    manager.world.bringToTop(manager.currentSet[manager.currentSet.length - 2]);
                    manager.AlphaTweens(manager.currentSet[manager.currentSet.length - 2], 0, 300);
                } else {
                    manager.currentSet.push(manager.add.sprite(0, 0, sheetName + "-" + manager.sheetNum, manager.spriteNum));
                    manager.currentSetTracking.push(sheetName + manager.sheetNum + manager.spriteNum);
                    manager.rndSheet.push(sheetName + "-" + manager.sheetNum);
                }
            }
        } else {
            manager.RestartCheck();
        }
    },

    DecreaseInt: function () {
        var manager = this;
        manager.decreasing = true;
        manager.upInt -= 1;
        if (manager.sheetNum == 0) {
            if (manager.spriteNum == 3) {
                manager.upInt = 0;
            }
        }
        if (manager.upInt >= 0) {
            if (manager.upInt % manager.currentScene.speed == 0) {
                manager.spriteNum -= 1;

                if (manager.spriteNum <= -1) {
                    manager.spriteNum = 3;
                    manager.sheetNum -= 1;
                    if (manager.sheetNum < 0) {
                        manager.sheetNum = 0;
                    }
                }

                manager.CreateOrReFindPic(manager.currentScene.name);

                for (var i = 0; i < manager.hands.length; i++) {
                    manager.world.bringToTop(manager.hands[i]);
                }
            }
        }
        if (manager.currentScene.soundType == 1) {
            if (manager.upInt < manager.currentScene.soundFrame) {
                manager.eventSoundTime = true;
            }
        }
        if (manager.upInt == 0) {
            manager.gameReady = true;
        }
    },

    IncreaseInt: function () {
        var manager = this;
        manager.decreasing = false;

        if (manager.currentScene.pattern == 2) {
            manager.upInt += 10;
        } else {
            manager.upInt += 1;
        }
        if (manager.currentScene.pattern == 19) {
            var beRand = manager.rnd.integerInRange(0, 1);
            if (beRand == 1) {
                var nextSet = manager.rnd.integerInRange(0, manager.rndSheet.length);
                manager.CantSleepRnd.push(manager.add.sprite(0, 0, manager.rndSheet[nextSet], 0));
                return;
            }
        }
        if (manager.currentScene.name != "computerframe") {
            if (manager.upInt != 0) {
                if (manager.upInt % manager.sceneSpeed == 0) {
                    if (manager.spriteNum >= 3) {
                        manager.sheetNum += 1;
                        manager.spriteNum = 0;
                        if (manager.sheetNum >= manager.currentScene.sheets) {
                            manager.gameReady = false;
                            manager.RestartCheck();
                        } else {
                            manager.CreateOrReFindPic(manager.currentScene.name);
                        }
                    } else {
                        if (manager.sheetNum <= manager.currentScene.sheets) {
                            manager.spriteNum += 1;
                            manager.CreateOrReFindPic(manager.currentScene.name);
                        }
                    }
                    for (var i = 0; i < manager.hands.length; i++) {
                        manager.world.bringToTop(manager.hands[i]);
                    }

                }
            }
        }
        if (manager.currentScene.name == "treez") {
            manager.world.bringToTop(manager.black);

        }

    },


};
