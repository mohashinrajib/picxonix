
// The Enemy class in modern style
export class Enemy {
    constructor(x, y, type, dir) {
        this.x = x; // current x position
        this.y = y; // current y position
        this.x0 = x; // previous x position
        this.y0 = y; // previous y position
        var aDirs = [45, 135, 225, 315];
        this.dir = dir === undefined ? aDirs[Math.floor(Math.random() * 4)] : dir; // current movement direction (angle in degrees)
        this.type = Boolean(type); // (boolean) type of enemy (false - Ball, true - Warder)
    }

    // reset enemy position:
    reset(x, y) {
        this.x = x;
        this.y = y;
    }

    // update position - move by given distance:
    update(dist) {
        var ret = this._calcPath(this.x, this.y, dist, this.dir);
        this.x = ret.x;
        this.y = ret.y;
        this.dir = ret.dir;
    }

    // render current position:
    render() {
        if (this.x0 == this.x && this.y0 == this.y) {
            //console.log('render skipped')
            if (window.gs.tLastFrame) return;
        } else {
            if (this.type && window.cellset.isPosIn(this.x0, this.y0))
                window.gs.clearCellArea(this.x0, this.y0);
            else
                window.gs.fillCellArea(this.type ? window.gd.cfgMain.colorBorder : window.gd.cfgMain.colorFill, this.x0, this.y0);
            this.x0 = this.x;
            this.y0 = this.y;
        }
        //console.log('enemy:', this.x,this.y)
        window.gs.drawCellImg(this.type ? window.var_imgWarder : window.var_imgBall, this.x, this.y);
    }

    clear_render() {
        if (window.cellset.isPosIn(this.x, this.y))
            window.gs.clearCellArea(this.x, this.y);
        else
            window.gs.fillCellArea(this.type ? window.gd.cfgMain.colorBorder : window.gd.cfgMain.colorFill, this.x, this.y);
q    }

    // current position:
    pos() {
        return [this.x, this.y];
    }

    // calculate movement path:
    _calcPath(x, y, dist, dir) {
        var vec = window.var_dirset.get(dir), vecX = vec[0], vecY = vec[1];
        var posCr = window.cursor.pos();
        var xC = posCr[0], yC = posCr[1],
            vC = window.cellset.value(xC, yC), bC = !this.type ^ vC & window.CA_CLEAR;
        if (
            bC &&
            (window.gd.cfgMain.collisionAdjacent
                ? Math.abs(x - xC) <= 1 && Math.abs(y - yC) <= 1
                : x === xC && y === yC) ||
            (!this.type && this._isCollision(x, y, dir))
        ) {
            window.gs.bCollision = true;
        }

        for (var n = 0; n < dist && !window.gs.bCollision; n++) {
            var xt = x + vecX, yt = y + vecY;
            var dirB = this._calcBounce(x, y, dir, xt, yt);
            if (dirB !== false) return this._calcPath(x, y, dist - n, dirB);
            if (
                bC && (
                    window.gd.cfgMain.collisionAdjacent
                        ? Math.abs(xt - xC) <= 1 && Math.abs(yt - yC) <= 1
                        : xt === xC && yt === yC
                ) ||
                (!this.type && this._isCollision(xt, yt, dir))
            ) {
                window.gs.bCollision = true;
            }

            if (!this.type && !window.cellset.isPosIn(xt, yt)) break;
            x = xt;
            y = yt;
        }
        return { x: x, y: y, dir: dir };
    }

    // calculate bounce direction if any:
    _calcBounce(x, y, dir, xt, yt) {
        var ret = window.cellset.applyRelDirs(x, y, dir, [-45, 45]);
        var b1 = this.type ^ ret[0][3] & window.CA_CLEAR,
            b2 = this.type ^ ret[1][3] & window.CA_CLEAR;
        return b1 ^ b2 ? (b1 ? dir + 90 : dir + 270) % 360 : this.type ^ window.cellset.value(xt, yt) & window.CA_CLEAR || b1 && b2 ? (dir + 180) % 360 : false;
    }

    // checks if enemy position is in collision with the cursor trail:
    _isCollision(x, y, dir) {
        if (window.cellset.value(x, y) & window.CA_TRAIL) return true;

        if (!window.gd.cfgMain.collisionAdjacent) return false;

        // Adjacent-cell check only if enabled
        var aDirs = [-45, 45, -90, 90];
        for (var i = 0; i < 4; i++) {
            var d = (dir + aDirs[i] + 360) % 360,
                vec = window.var_dirset.get(d);
            if (window.cellset.value(x + vec[0], y + vec[1]) & window.CA_TRAIL) return true;
        }
        return false;
    }
}
