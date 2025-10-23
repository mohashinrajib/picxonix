
export class GameDef {
    constructor() {
        console.log('Creating Game definition');
        this.sizeCell = 10;
        this.aLevels =  [
                        {"image": "pic1.png"},
                        {"image": "pic2.png"},
                        {"image": "pic3.png"}
                        ];

        this.cfgMain = {
            width: 600,
            height: 400,
            sizeCell: 10,
            colorFill: '#000000',
            colorBorder: '#00aaaa',
            colorBall: '#ffffff',
            colorBallIn: '#000000',
            colorWarder: '#000000',
            colorWarderIn: '#f80000',
            colorCursor: '#aa00aa',
            colorCursorIn: '#00aaaa',
            colorTrail: '#a800a8',
            timeoutCollision: 1000,
            callback: null,
            callbackOnFrame: false,
            collisionAdjacent: false
        };
        };
    }

export class LevelState{
    constructor(iLevel) {
        this.iLevel = iLevel;
        this.nBalls = 1;
        this.nWarders = 3;
        this.speedEnemy = 10;
        this.speedEnemyReduce = 0;
        this.ignoreCollisionBonus = false;
        this.aBalls = [];
        this.aWarders = [];
    }
}

export class GameState {
    constructor(gamedef) {
        // for system
        this.nLevels = gamedef.aLevels.length;
        this.iLevel = 0;
        this.tLevel = 0;
        this.oLevel = null;
        this.elTime = null;
        this.nTimeLevel = 0;
        this.nTimeTotal = 0;
        this.bStarted = false;
        this.bPlay = false;
        this.bConquer = false;
        this.bCollision = false;
        // runtime frame/timer fields
        this.idFrame = 0;
        this.tLastFrame = 0;
        this.tLocked = 0;
        // for player
        this.score = 0;
        this.level = 0;
        this.speedCursor = 15;
        this.speedBonus = 0;
        this.nFaults = 3;
    }
    };