export class BonusItem {
    constructor(x = 0, y = 0, type = 'speed', bonusValue = 10, active=true) {
        this.x = x;
        this.y = y;
        this.type = type; // 'speed', 'slow', 'sneaky'
        this.bonusValue = bonusValue;
        this.active = active;
        this.bonusSize = 2;
    }


    static random(minX = 0, minY = 0, maxX = 600, maxY = 400, bonus = 'random') {
        const types = ['speed', 'slow', 'sneaky', 'killward', 'life'];
        const x = Math.floor(Math.random() * (maxX - minX)) + minX;
        const y = Math.floor(Math.random() * (maxY - minY)) + minY;
        const index = Math.floor(Math.random() * types.length);
        const type = bonus === 'random' ? types[index] : bonus;
        // Ensure bonus values array matches types length
        const bonusValues = [5, 5, 1, 1, 3];
        const bonusValue = bonus === 'random' ? bonusValues[index] : 5;
        return new BonusItem(x, y, type, bonusValue, true);
    }

    color(){
        if (this.type === 'speed') return '#FF0000'; // red for speed
        if (this.type === 'slow') return '#00FF00'; // green for slow
        if (this.type === 'sneaky') return '#e95aeeff'; // blue for sneaky
        if (this.type === 'killward') return '#FFFF00'; // yellow for killward
        if (this.type === 'life') return '#00FFFF'; // cyan for extra life
        return '#FFFFFF'; // white for error
    }

    render(cfgMain,ctxMain){
        const sizeCell = cfgMain.sizeCell;

        const w = sizeCell * this.bonusSize;
        const h = sizeCell * this.bonusSize;
        const left = (this.x + 2) * sizeCell;
        const top  = (this.y + 2) * sizeCell;
        if (this.active) {
            if(this.type === 'life'){
                const img = new Image();
                img.onload = () => {ctxMain.drawImage(img, left, top, w, h)};
                img.onerror = (err) => {console.error("Error loading image:", err); };
                img.onabort = () => { console.log("Image load aborted");};
                const base64String = "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAABO1BMVEX+Bgb/Bwf/Bwf/Bwf+Bgb/Bwf/BwdHcEz+Bgb/Bwf/Bwf/Bwf/Bwf+Bgb/Bwf+Bgb+Bgb/Bwf/Bwf+Bgb+Bgb/Bwf/Bwf/Bwf/Bwf/Bwf/Bwf+Bgb/Bwf+Bgb/Bwf+Bgb/Bwf/Bwf+Bgb+Bgb/Bwf+Bgb/Bwf+Bgb/Bwf/Bwf+Bgb+Bgb/Bwf/Bwf/Bwf/Bwf/Bwf/Bwf+Bgb/Bwf/Bwf/Bwf/Bwf/Bwf+Bgb+Bgb+Bgb+Bgb/Bwf+Bgb/Bwf+Bgb/Bwf+Bgb+Bgb/Bwf+Bgb/Bwf+Bgb+Bgb+Bgb/Bwf+Bgb+Bgb+Bgb+Bgb/Bwf/Bwf+Bgb/Bwf+Bgb+Bgb/Bwf/Bwf+Bgb+Bgb/Bwf/Bwf/Bwf/Bwf+Bgb/Bwf+Bgb/Bwf+Bgb/Bwf/Bwf/Bwf/Bwf+Bgb+Bgb+Bgb/Bwc27JxxAAAAaHRSTlP+l/4Y/QLyAAEDAfr5Pz/7QU+v5oT7hCdLWvQlofdnCfy+13+UzHWORusCjSHqaQcR33eCcl3EBcOP8DXIS/ERY6/l/TI8RO7Pz1Y8HUYyVtYdF0XWFwsvRO4LL4uLrgqtMwQtCQQtM35aNUwAAAHCSURBVEjHtZZnV8IwFIZvd8pGQNyAooKi4gD3ANx77z3z/3+BbaG0tKVNjsfb9Mttnrz3nCb3DUiUAX8AUg/bwV7BOkHoDd7epOzAVCkTwEqIHVHZ+CpHO0Q1G8iUplqB3CBg5QH13Yvo8yO7WlIbgzkTgIbSYAA4HPdp2c4wGACkh5AOCFlsiT6lLLnPms0KDWCksYiuAMCOStJoM9kcI3Vg2W8DML9/wtuBwLIKyCvYISYmnLIrggKsNlcwKYA5aRqrCvBMA7xK8LKGKWLtEz6ARgG+IUQHBCGEqSIEb3QKP8DVaARqHLxXaRSqXyBVaICK8uM2aEraUID1JXKFpXV1ty6SA4va9uZE0oJErn6A5kgV5honbn6BDFiY15tAIU9SUL5gtJkjv7eC/8LclyZ5L4CfbO18s6x7PeyspVWicXeFcWRtxmOMG8CM2bu3zLQviJGd2j16aqPAPiJnQ/HFnYFO1M6B0AxvB/gZn4tlDSSs5ScG3D2uu79Vob/byxS7eszr93R5u+jBnaGws0Viu8cxHYhtkvl0crpez3SS1NgPL1WF0zPym8DVMODhc5qrQ7FcLtLdNa7v/+FyQha/rbtSRDYVt4EAAAAASUVORK5CYII=";

                img.src = "data:image/png;base64," + base64String;

            }else{
                ctxMain.fillStyle = this.color();
                ctxMain.fillRect(left, top,w,h );
            }

        }
    }
    check_capture(pos){
        if (!this.active) return false;
        var x_ok = pos[0] >= this.x && pos[0] < this.x + this.bonusSize;
        var y_ok = pos[1] >= this.y && pos[1] < this.y + this.bonusSize;
        let log_text = pos + ' x_ok:' + x_ok + ' y_ok:' + y_ok + ' [' + this.x + ',' + this.y + '] ' + this.bonusSize;

        if (window.log_text !== log_text) {
            console.log(log_text);
            window.log_text = log_text;
        }


        return x_ok && y_ok;
    }

    applyBonus(cfgMain,ctxMain) {
        this.active = false;
        // hide bonus by filling with default color
        ctxMain.fillStyle = cfgMain.colorFill;
        ctxMain.fillRect((this.x + 2) * cfgMain.sizeCell, (this.y + 2) * cfgMain.sizeCell,
            this.bonusSize * cfgMain.sizeCell, this.bonusSize * cfgMain.sizeCell);
        console.log('------ bonus captured----------')
        var bonus_text = 'none'
        // Guard access to global state objects
        const gs = (typeof window !== 'undefined' && window.gs) ? window.gs : null;
        const ls = (typeof window !== 'undefined' && window.ls) ? window.ls : null;

        if (this.type === 'speed') {
            if (gs) gs.speedBonus += this.bonusValue;
            bonus_text = 'Bonus - Speed Up';
        } else if (this.type === 'slow') {
            // speed 25% less
            if (ls) ls.speedEnemyReduce += (ls.speedEnemy - ls.speedEnemyReduce) * 0.3;
            bonus_text = 'Bonus - Enemy Slow';
        } else if (this.type === 'sneaky') {
            if (ls) ls.ignoreCollisionBonus = true;
            bonus_text = 'Bonus - Sneaky';
        } else if (this.type === 'killward') {
            if (ls) {
                ls.nWarders = Math.max(0, (ls.nWarders || 0) - 1);
                // remove last item from ls.aWarders if present
                if (Array.isArray(ls.aWarders) && ls.aWarders.length > 0) {
                    const last = ls.aWarders.pop();
                    if (last && typeof last.clear_render === 'function') last.clear_render();
                }
            }
            bonus_text = 'Bonus - Kill Warder';
        } else if (this.type === 'life') {
            if (gs) gs.nFaults = (gs.nFaults || 0) + 1;
            bonus_text = 'Bonus - Extra Life';
        }
        $('#banner').html(bonus_text);
        // return to banner after 2 sec
        setTimeout(() => {
            if($('#banner').html() === bonus_text)
                {
                    $('#banner').html('Keep going ...');
                }
        }, 2000);
    }
}
