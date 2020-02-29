class gameBoard {
    constructor(size) {
        this.size = size
        this.board = new Array(4).fill(0).map(() => new Array(4).fill(0))

        this.fillEmptyTile(2)
    }

    fillEmptyTile(number) {
        this.getRandomTile(number, this.getEmptyTile())
            .forEach((index) => {
                let x = Math.floor(index / 4), y = index % 4
                this.board[x][y] = this.getRandomRank()
            })
    }

    getEmptyTile() {
        let emptyTile = []
        this.board.forEach((row, i) => {
            row.forEach((tile, j) => {
                if (tile === 0) {
                    emptyTile.push(4 * i + j)
                }
            })
        })
        return emptyTile
    }

    getRandomTile(number, emptyTile) {
        let tiles = []
        while (tiles.length < number) {
            let rand = Math.floor(Math.random() * emptyTile.length)
            if (!tiles.includes(rand)) {
                tiles.push(rand)
            }
        }
        return tiles.map(index => { return emptyTile[index] })
    }

    getRandomRank() {
        return Math.floor(Math.random() * 2) + 1
    }
}

module.exports = gameBoard