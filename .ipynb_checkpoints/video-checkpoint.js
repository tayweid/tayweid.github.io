        // Space Bar: Play/Pause
        if (e.keyCode == '32') {
            
            if (e.data == YT.PlayerState.PLAYING) {
                player.pauseVideo();
            } else {
                player.playVideo();
            }
            player.playVideo();
        }
        e.preventDefault();