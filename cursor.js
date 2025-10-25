// The cursor implemented as a class
export class Cursor {
    constructor() {
        this.x = 0; // current x coordinate
        this.y = 0; // current y coordinate
        this.x0 = 0; // previous x coordinate
        this.y0 = 0; // previous y coordinate
        this.dir = false; // current movement direction (angle in degrees)
        this.onTrail = false; // current state (true - trial)
        this.onTrail0 = false; // previous state
    }

    // reset the cursor position:
    reset(x, y, bUnlock) {
        var bPre = bUnlock && window.cellset.value(this.x, this.y) & window.CA_CLEAR;
        this.x0 = bPre? this.x : x;
        this.y0 = bPre? this.y : y;
        this.x = x;
        this.y = y;
        this.dir = this.onTrail = this.onTrail0 = false;
    }

    // update current position - move by given distance:
    update(dist) {
        if (this.dir === false) return;
        var x = this.x, y = this.y;
        var vec = window.var_dirset.get(this.dir), vecX = vec[0], vecY = vec[1];
        var bEnd =  false;
        for (var n = 0; n < dist; n++) {
            if (window.cellset.index(x + vecX, y + vecY) < 0) {
                this.dir = false; break;
            }
            x += vecX; y += vecY;
            if (window.cellset.value(x, y) & window.CA_TRAIL) {
                window.gs.bCollision = true; break;
            }
            var b = window.cellset.value(x, y) & window.CA_CLEAR;
            if (this.onTrail && b) {
                bEnd = true; break;
            }
            this.onTrail = !b;
            if (this.onTrail) window.cellset.add2Trail(x, y, this.dir);
        }
        this.x = x;
        this.y = y;
        console.log('Cursor',this.x, this.y)
        if (!bEnd) return;
        if (window.cellset.getPreTrailCell() == window.cellset.index(x,y))
            window.gs.bCollision = true;
        else {
            this.dir = this.onTrail = false;
            window.gs.bConquer = true;
        }
    }

    // render current position:
    render() {
        if (this.x0 == this.x && this.y0 == this.y) {
            if (window.gs.tLastFrame) return;
        }
        else {
            if (this.onTrail0) {
                var rect = window.cellset.lastTrailLine();
                // window.gs.fillCellArea.apply(null, [window.gd.cfgMain.colorTrail].concat(rect));
                window.gs.fillCellArea(window.gd.cfgMain.colorTrail,...rect);
            }
            else {
                if (window.cellset.isPosIn(this.x0, this.y0)){
                    window.gs.clearCellArea(this.x0, this.y0);

                }else{
                     window.gs.fillCellArea(window.gd.cfgMain.colorBorder, this.x0, this.y0);
                }

            }
            this.x0 = this.x; this.y0 = this.y;
        }
        this.onTrail0 = this.onTrail;
        window.gs.drawCellImg(window.var_imgCursor, this.x, this.y);
    }

    // get current position:
    pos() {
        return [this.x, this.y];
    }

    // get current movement direction:
    getDir() {
        return this.dir;
    }

    // set/change movement direction:
    setDir(dir) {
        if (dir === this.dir) return;
        if (this.onTrail && this.dir !== false && dir !== false && Math.abs(dir - this.dir) == 180)
            return;
        this.dir = dir;
    }
}



