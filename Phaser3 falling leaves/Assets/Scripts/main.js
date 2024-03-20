class Main extends Phaser.Scene
{
    TreeImage;
    leaf;
    leafCount = 0;
    
    preload() {
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBar.setDepth(1);
        progressBox.setDepth(1);
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 30, 320, 50);
var loadingText = this.make.text({
    x: width / 2,
    y: height / 2 - 50,
    text: 'Loading...',
    style: {
        font: '20px monospace',
        fill: '#ffffff'
    }
});
loadingText.setOrigin(0.5, 0.5);
var percentText = this.make.text({
    x: width / 2,
    y: height / 2 - 5,
    text: '0%',
    style: {
        font: 'bold 18px monospace',
        fill: '#ffffff'

    }
});
percentText.setDepth(1);
percentText.setOrigin(0.5, 0.5);
var assetText = this.make.text({
    x: width / 2,
    y: height / 2 + 50,
    text: '',
    style: {
        font: '18px monospace',
        fill: '#ffffff'
    }
});
assetText.setOrigin(0.5, 0.5);

        this.load.on('progress', function (value) {
            console.log(value);
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 160, height / 2 - 30, 320 * value, 50); // Center the progress bar
        });
        this.load.on('fileprogress', function (file) {
            console.log(file.src);
            assetText.setText('Loading asset: ' + file.key);
        });
        this.load.on('complete', function () {
            console.log('complete');
            progressBar.destroy();
            loadingText.destroy();
            assetText.destroy();
            percentText.destroy();
            progressBox.destroy();
        });
        this.load.image('tree', 'Assets/Images/Tree.png')
        for (let i = 0; i < 500; i++) {
            this.load.image('leaf' + i, 'Assets/Images/Leaf.png')
        }
        this.load.image('leaf', 'Assets/Images/Leaf.png')
        this.load.image('leafpile1', 'Assets/Images/Leafpile1.png')
        this.load.image('leafpile2', 'Assets/Images/Leafpile2.png')
        this.load.image('leafpile3', 'Assets/Images/Leafpile3.png')
        this.load.image('leafpile4', 'Assets/Images/Leafpile4.png')
        this.load.video('background', 'Assets/Videos/Background.mp4', 'loadeddata', false, true);
        this.leafPile1Spawned = false;
        this.leafPile2Spawned = false;
        this.leafPile3Spawned = false;
        this.leafPile4Spawned = false;
        this.leafPile5Spawned = false;
        this.leafPile6Spawned = false;
        this.leafPile7Spawned = false;
        this.leafPile8Spawned = false;

    }

    create () {
        
        // tree
        let tree = this.TreeImage = this.add.image(this.sys.game.config.width/2.0, 500, 'tree')
        tree.setScale(3)
        tree.setDepth(1)

        // background
        let background = this.add.video(this.sys.game.config.width/2.0, this.sys.game.config.height/2.0, 'background')
        background.setDepth(0)
        background.setLoop(true)
        background.displayWidth = this.sys.game.config.width
        background.displayHeight = this.sys.game.config.height / 3
        background.play(true)


        let groundX = this.sys.game.config.width / 2
        let groundY = this.sys.game.config.height*1.15
        let ground=this.physics.add.staticImage(groundX, groundY)
        ground.displayWidth = this.sys.game.config.width
        ground.setImmovable(true)

        this.input.on('pointerdown', function (pointer) {
            console.log("Leaf Count: " + this.leafCount)
            let segmentWidth = (tree.width * 2) / 5; // Increase the width of the segments
            for (let i = 0; i < 5; i++) {
                this.leafCount++;
                this.cameras.main.shake(100, 0.01);
                let segmentStart = (tree.x - tree.width * 2 / 2) + segmentWidth * i; // Start of the segment
                let segmentEnd = segmentStart + segmentWidth; // End of the segment
                let randomX = Math.random() * (segmentEnd - segmentStart) + segmentStart; // Random x-coordinate within the segment
                let leaf = this.physics.add.sprite(randomX, 400, "leaf");
                leaf.setDepth(2)
                leaf.setCollideWorldBounds(true)
                leaf.angle = Math.random() * 90 - 45;
                this.tweens.add({
                    targets: leaf,
                    angle: leaf.angle + -100,
                    duration: 1000,
                    repeat: 0,
                });
                leaf.setGravityY(800)
                leaf.setBounce(0.01)
                leaf.setScale(Math.random() * 0.3 + 0.1) 
                this.physics.add.collider(leaf, ground)
            }
           
        }, this);

        this.time.addEvent({
            //delay: Math.random() * 4000 + 1000
            delay: 3500,
            loop: true,
            callback: () => {
                let segmentWidth = (tree.width * 2) / 5; // Increase the width of the segments
                let i = Math.floor(Math.random() * 5);
                let segmentStart = (tree.x - tree.width * 2 / 2) + segmentWidth * i;
                let segmentEnd = segmentStart + segmentWidth; // End of the segment
                let randomX = Math.random() * (segmentEnd - segmentStart) + segmentStart; // Random x-coordinate within the segment
                let leaf = this.physics.add.sprite(randomX, 400, "leaf");
                leaf.setDepth(2)
                this.cameras.main.startFollow(leaf);
                this.cameras.main.zoomTo(1.5, 1000);
                this.leafCount++;
                console.log("Leaf Count: " + this.leafCount);
                leaf.angle = Math.random() * 90 - 45;
                this.tweens.add({
                    targets: leaf,
                    angle: leaf.angle + -100,
                    duration: 1000,
                    repeat: 0,
                });
                leaf.setCollideWorldBounds(true)
                leaf.setGravityY(800)
                leaf.setBounce(0.01)
                leaf.setScale(Math.random() * 0.3 + 0.1) 
                this.physics.add.collider(leaf, ground)
            },
        });
    }

    update () {
        if (this.cameras.main.zoom == 1.5) {
            this.cameras.main.zoomTo(1, 2000);
            this.cameras.main.pan(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 2500);
        }
        if(this.leafCount > 31 && !this.leafPile1Spawned){
            console.log("Leafpile1")
            let leafpile1 = this.add.image(this.sys.game.config.width/2.0, 710, 'leafpile1')
            leafpile1.setDepth(3)
            leafpile1.setScale(1.5)
            this.leafPile1Spawned = true;
        }
        if(this.leafCount > 51 && !this.leafPile2Spawned){
            console.log("Leafpile2")
            let leafpile2 = this.add.image(this.sys.game.config.width/2.0, 710, 'leafpile2')
            leafpile2.setDepth(3)
            leafpile2.setScale(1.5)
            this.leafPile2Spawned = true;
        }
        if(this.leafCount > 71 && !this.leafPile3Spawned){
            console.log("Leafpile3")
            let leafpile3 = this.add.image(this.sys.game.config.width/2.0, 710, 'leafpile3')
            leafpile3.setDepth(3)
            leafpile3.setScale(1.5)
            this.leafPile3Spawned = true;
        }
        if(this.leafCount > 91 && !this.leafPile4Spawned){
            console.log("Leafpile4")
            let leafpile4 = this.add.image(this.sys.game.config.width/2.0, 710, 'leafpile4')
            leafpile4.setDepth(3)
            leafpile4.setScale(1.5)
            this.leafPile4Spawned = true;
        }
        if(this.leafCount > 111 && !this.leafPile5Spawned){
            console.log("Leafpile5")
            let leafpile5 = this.add.image(this.sys.game.config.width/1.5, 710, 'leafpile1')
            leafpile5.setDepth(3)
            leafpile5.setScale(1.5)
            this.leafPile5Spawned = true;
        }
        if(this.leafCount > 131 && !this.leafPile6Spawned){
            console.log("Leafpile6")
            let leafpile6 = this.add.image(this.sys.game.config.width/2.9, 710, 'leafpile1')
            leafpile6.setDepth(3)
            leafpile6.setScale(1.5)
            this.leafPile6Spawned = true;
        }
        if(this.leafCount > 161 && !this.leafPile7Spawned){
            console.log("Leafpile7")
            let leafpile7 = this.add.image(this.sys.game.config.width/1.5, 710, 'leafpile2')
            leafpile7.setDepth(3)
            leafpile7.setScale(1.5)
            this.leafPile7Spawned = true;
        }
        if(this.leafCount > 191 && !this.leafPile8Spawned){
            console.log("Leafpile8")
            let leafpile8 = this.add.image(this.sys.game.config.width/2.9, 710, 'leafpile2')
            leafpile8.setDepth(3)
            leafpile8.setScale(1.5)
            this.leafPile8Spawned = true;
        }

    
    }

    
}
const config = {
    type: Phaser.AUTO,
    parent: 'phaser-game',
    width: window.innerWidth,
    height: window.innerHeight,
    scene: Main,
    physics: {
        default: 'arcade',
        // arcade:{debug:true}
    }
};


const game = new Phaser.Game(config)