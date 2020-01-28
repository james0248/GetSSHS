const Tile = require('./tile');

class grid {
    grid(size) {
        this.size = size;
        this.board = [];
    }

    init() {
        for(let i = 0; i < this.size; i++) {
            for(let j = 0; j < this.size; j++) {
                this.board[i][j] = new Tile(0, i, j);
            }
        }
        let emptySlot = this.getEmptySlots();
        let initTiles = randomPick(2, emptySlot);
        for(slot in initTiles) {
            this.board[Math.floor(slot/4)][slot%4].rank = 1;
        }
    }

    getEmptySlots() {
        emptySlot= [];
        for(let i = 0; i < this.size; i++) {
            for(let j = 0; j < this.size; j++) {
                if(this.board[i][j].rank === 0) emptySlot.push(4 * i + j);
            }
        }
        return emptySlot;
    }

    randomPick(number, slot) {
        if(slot.length < number) return -1;
        let cnt = 0, picked = new Set();
        while(cnt != number) {
            let randInt = Math.floor(Math.random() * slot.length);
            if(!picked.has(randInt)) {
                picked.add(randInt);
                cnt++;
            }
        }
        return picked;
    }
}