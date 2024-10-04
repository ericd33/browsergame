import { Scene } from "phaser";
import { EventBus } from "../EventBus";

const frameData = {
    lp: {
        active: 2,
        pre: 2,
        recover: 40,
    },
};

export class Game extends Scene {
    constructor() {
        super("Game");
    }
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    // floor: any;
    floor: ReturnType<typeof this.physics.add.staticGroup>;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    lp: Phaser.Input.Keyboard.Key;
    jump: Phaser.Input.Keyboard.Key;
    playerState: string = "idle";

    preload() {
        this.load.setPath("assets");
        this.load.image("star", "star.png");
        this.load.image("background", "bg.png");
        this.load.image("logo", "logo.png");
        this.load.image("ground", "ground.png");

        this.load.spritesheet("ryu-walk", "ryu-walk.png", {
            frameWidth: 74.75,
            frameHeight: 110,
        });

        this.load.spritesheet("ryu-idle", "ryu-idle.png", {
            frameWidth: 57,
            frameHeight: 108,
        });
    }

    create() {
        this.floor = this.physics.add.staticGroup();
        this.player = this.physics.add.sprite(500, 600, "ryu-idle");
        this.physics.add.collider(this.player, this.floor);
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
            this.lp = this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.A,
            );

            this.jump = this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.SPACE,
            );
        }

        this.anims.create({
            key: "idleman",
            frames: this.anims.generateFrameNumbers("ryu-idle", {
                start: 0,
                end: 6,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "walk-left",
            frames: this.anims.generateFrameNumbers("ryu-walk", {
                start: 0,
                end: 7,
            }),
            frameRate: 10,
            repeat: 1,
        });

        this.player.setBounce(0.2);
        this.player.setScale(1);
        this.player.setCollideWorldBounds(true);

        this.player.anims.play("idleman", true);

        this.floor.create(500, 750, "ground").setScale(10, 2).refreshBody();

        EventBus.emit("current-scene-ready", this);
    }

    handleKeybinds() {
        if (this.playerState === "idle") {
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-160);
                this.player.setFlipX(true);
                this.player.anims.play("walk-left", true);
            } else if (this.cursors.right.isDown) {
                this.player.anims.play("walk-left", true);
                this.player.setFlipX(false);
                this.player.setVelocityX(160);
                // this.player.anims.play("right", true);
            } else {
                this.player.setVelocityX(0);
                // this.player.anims.play("turn");
            }

            if (this.cursors.up.isDown && this.player.body.touching.down) {
                this.player.setVelocityY(-330);
            }

            if (Phaser.Input.Keyboard.JustDown(this.jump)) {
            }

            if (Phaser.Input.Keyboard.JustDown(this.lp)) {
                const hitbox = this.physics.add.staticGroup();

                this.playerState = "attacking";
                this.player.setVelocityX(0);

                setTimeout(() => {
                    hitbox.create(this.player.x, this.player.y, "star");
                    setTimeout(() => {
                        hitbox.clear(true, true);
                        setTimeout(() => {
                            this.playerState = "idle";
                        }, frameData.lp.recover);
                    }, frameData.lp.active * 100);
                }, frameData.lp.pre * 100);
            }

            if (Phaser.Input.Keyboard.JustDown(this.lp)) {
            }
        }
    }

    update() {
        this.handleKeybinds();
    }
}
