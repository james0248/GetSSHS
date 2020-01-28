class keyboardListener {
    static listen() {
        let keyMap = {
            38: 0, // Up
            87: 0, // W
            37: 1, // Left
            65: 1, // A
            40: 2, // Down
            83: 2, // S
            39: 3, // Right
            68: 3  // D
        };
        document.addEventListener('keydown', (event) => {
            let mapped = keyMap[event.keyCode];
            if(mapped !== undefined) {
                this.moveTile(mapped);
            }
        });
    }

    moveTile(keymap) {
        let x, y;
        let dx = [-1, 1, 1, 1], dy = [1, -1, 1, 1];
        if(keymap === 0) x = 3, y = 0;
        else if(keymap === 1) x = 0, y = 3;
        else x = 0, y = 0;
        while(x >= 0 && x < 4 && y >= 0 && y < 4) {

        }
    }
};