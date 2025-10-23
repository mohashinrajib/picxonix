import { GameDef, GameState, LevelState } from './gamestate.js';
import * as pix from './picxonix.js'

$(function() {
    var elCanvas = $('#graphics');
    // Cache commonly used DOM elements
    var $playBtn = $('#play-btn');
    var $banner = $('#banner');
    var $gameStatusText = $('#game-status-text');
    var $statusProgressCurrent = $('#status-progress-current');
    pix.test_function()
    var size = window.picxonix(elCanvas[0], {
        width: 600,
        height: 500,
        callback: function(iEvent) {
            switch (iEvent) {
                case 0: // animation frame
                    return updateTime();
                case 1: // collision
                    return raiseFaults();
                case 2: // conquer
                    return raiseConquer();
                default:
            }
        },
        callbackOnFrame: true
    });
    if (!size) return;

    var w = size.width, h = size.height;
    elCanvas.css({width: w, height: h});


    window.gd = new GameDef();
    // Create global instance
    window.gs = new GameState(window.gd);

    $('#status-progress-total').html(window.gs.nLevels);
    window.gs.elTime = $('#status-time');
    preloadLevel();

    var keyHash = {37: 'left', 39: 'right', 38: 'up', 40: 'down', 32: 'stop'};
    $(document).keydown(function(e) {
        var key = e.which;

        // Enter key - Start/Next level
        if (key == 13) {
            if (!$playBtn.prop('disabled') && $playBtn.is(':visible')) {
                e.preventDefault();
                $playBtn.click();
            }
            return;
        }

        // Q key - Quit to beginning
        if (key == 81 || key == 113) { // Q or q
            if (window.gs.bStarted || window.gs.bPlay) {
                e.preventDefault();
                quitGame();
            }
            return;
        }

        // ESC key - Pause/Resume
        if (key == 27) {
            if (window.gs.bStarted) {
                window.gs.bPlay = !window.gs.bPlay;
                picxonix('play', window.gs.bPlay);
            }
            return;
        }

        if (!window.gs.bPlay || !(key in keyHash)) return;
        e.preventDefault();
        picxonix('cursorDir', keyHash[key]);
    });

    elCanvas.click(function(e) {
        if (!window.gs.bPlay) return;
    var pos0 = elCanvas.offset();
        var x = e.pageX, y = e.pageY,
            xc = x - pos0.left, yc = y - pos0.top;
        picxonix('cursorDir', [xc, yc]);
    });


    $playBtn.show().click(function(e) {
        e.preventDefault();
        newGame('button')
        startLevel();
    });


    function quitGame() {
        if (window.gs.bPlay || window.gs.bStarted) {
            picxonix('end', false);
            picxonix('quit'); // Ensure full reset of game state
        }
        window.gs.bPlay = false;
        window.gs.bStarted = false;

        //iLevel = 0; // Reset to initial state (same as page load)
       // nTimeTotal = 0;
       // show play button again
        $gameStatusText.hide();
        $playBtn.prop('disabled', false).show()
           .html('<span class="glyphicon glyphicon-repeat"></span> Play Again')
            .off('click').on('click', function(e) {
                e.preventDefault();
                newGame();
                startLevel();
            });
        preloadLevel(); // This will load the first level (index 0)
    }

    function preloadLevel() {
        if (window.gs.iLevel >= window.gs.nLevels) {
            // All levels completed - this shouldn't happen here anymore
            window.gs.oLevel = null;
            return;
        }
        window.gs.oLevel = window.gd.aLevels[window.gs.iLevel];

        var img = new Image();
        img.onload = function() {
            $playBtn.prop('disabled', false);
        };
        img.onerror = function() {
            console.error('Failed to load image:', 'pics/' + window.gs.oLevel.image);
            $playBtn.prop('disabled', false); // Enable button even if image fails
        };

        // Check if image is already cached
        img.src = 'pics/' + window.gs.oLevel.image;
        if (img.complete) {
            $playBtn.prop('disabled', false);
        } else {
            $playBtn.prop('disabled', true);
        }

        // Don't overwrite window.gs.oLevel.image - keep the original filename
    }

    function startLevel() {
        if (!window.gs.oLevel) return;
        picxonix('reset'); // Always reset before starting a new level
        console.log('Starting level startLevel fnc', window.gs.iLevel, 'with image');
    // Update button container to show game running
    $playBtn.prop('disabled', true).hide();
    $gameStatusText.show();

        if (!window.gs.bStarted)
            $('.my-panel').removeClass('hidden');


        window.gs.bStarted = true;
        window.gs.bPlay = true;
        window.gs.bConquer = false;
        window.gs.bCollision = false;

        window.gs.iLevel++;
    console.log('Incremented iLevel to', window.gs.iLevel);
    $statusProgressCurrent.html(window.gs.iLevel);

        // Create a copy of window.gs.oLevel with the full image path for picxonix
        var levelData = {
            image: 'pics/' + window.gs.oLevel.image
        };
        picxonix('level', levelData);
        window.gs.tLevel = Date.now();
        window.gs.nTimeLevel = 0;
    }


    function updateTime() {
        var n = Math.floor((Date.now() - window.gs.tLevel) / 1000);
        if (n - window.gs.nTimeLevel < 1) return;
        window.gs.nTimeLevel = n;
        function str_pad(s) {
            return Array(3 - s.length).join('0') + s;
        }
        n = window.gs.nTimeLevel + window.gs.nTimeTotal;
        var nm = String(Math.floor(n / 60)), ns = String(n % 60);
        window.gs.elTime.html(str_pad(nm)+':'+str_pad(ns));
    }

    function raiseFaults() {
        window.gs.nFaults -= 1
        $('#banner').html('Oops..');
        picxonix('statusUpdate','update')

        if (window.gs.nFaults > 0) return;

        // Stop the game properly
        window.gs.bPlay = false;
        window.gs.bStarted = false;
        picxonix('end', false);
        picxonix('reset'); // Ensure full reset before retry

        setTimeout(function() {
            preloadLevel();

            // Update button container to show Try Again button
            $('#game-status-text').hide();
            $('#play-btn').prop('disabled', false).show()
                .html('<span class="glyphicon glyphicon-play"></span> Play')
                .off('click').on('click', function(e) {
                    e.preventDefault();
                    newGame()
                    startLevel();
                });

    },1000)
}
    function newGame(origin){
        window.gs.iLevel = 0;

        console.log('=== NEW GAME ==='+origin);
        window.gs.nTimeTotal = 0;
        picxonix('setFaults', 3);

        window.ls = new LevelState(window.gs.iLevel)
        if(origin == 'congrats'){
            $('#banner').html('CONGRATULATIONS !!!');
        }else
        {
            $('#banner').html('START TO PLAY');
            picxonix('quit')
        }
        if(origin == 'button'){

            $('#game-status-text').hide();
            $('#play-btn').html('<span class="glyphicon glyphicon-play"></span> Play')
                .off('click').on('click', function(e) {
                    e.preventDefault();
                    startLevel();
                });
            preloadLevel();
        }
    }


    function raiseConquer() {
        var data = picxonix('state');
        if (!data) return false;
        window.gs.bConquer = true;
        var val = data.cleared;
        // update val on span 0 decimal place
        $('#status-points').html(val.toFixed(0)+'%');
        var new_area = val- window.stageData.cum_area
        window.gs.score+=new_area
        window.stageData.cum_area = val
        picxonix('statusUpdate','conquer');
        if (val < 75) return false;

        // Level Complete procedure
         if (window.gs.iLevel < window.gs.nLevels){
            $('#banner').html('Level Complete');
        }else{
            $('#banner').html('CONGRATULATIONS !!!');
        }
        setTimeout(function() {
            picxonix('end', true);
            window.gs.nTimeTotal += window.gs.nTimeLevel;
            handleLevelComplete();
        }, 1000);
        return true;
    }

    function enableOptions(bOn) {
        $('#answeropts > button').prop('disabled', !bOn);
    }


    function handleLevelComplete() {
        window.gs.bPlay = false;
        window.gs.bStarted = false;
        setTimeout(function() {
            if (window.gs.iLevel < window.gs.nLevels) {
                // Load next level
                preloadLevel();
                // Update button container to show Next Level button
                $('#game-status-text').hide();
                $('#play-btn').prop('disabled', false).show()
                    .html('<span class="glyphicon glyphicon-play"></span> Next Level')
                    .off('click').on('click', function(e) {
                        e.preventDefault();
                        startLevel();
                    });
            } else {


                // Update button container to show Play Again button
                $('#game-status-text').hide();
                $('#play-btn').prop('disabled', false).show()
                    .html('<span class="glyphicon glyphicon-repeat"></span> Play Again')
                    .off('click').on('click', function(e) {
                        e.preventDefault();
                        newGame('button')
                    });
            }
        }, 1500);
    }

});