class gameBoard {
    constructor(size) {
        this.size = size
        this.board = new Array(4).fill(0).map(() => new Array(4).fill({
            rank: 0,
            isMerged: false,
            isNew: false,
        }))

        this.fillEmptyTile(2)
    }

    fillEmptyTile(number) {
        let emptyTiles = this.getRandomTile(number, this.getEmptyTile())
        if(emptyTiles[0] === undefined) {
            return
        }
        emptyTiles.forEach((index) => {
            let x = Math.floor(index / 4), y = index % 4
            this.board[x][y] = {
                rank: this.getRandomRank(),
                isMerged: false,
                isNew: true,
            }
        })
    }

    getEmptyTile() {
        let emptyTile = []
        this.board.forEach((row, i) => {
            row.forEach((tile, j) => {
                if (tile.rank === 0) {
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
        return (Math.random() < 0.9)? 1 : 2
    }

    setTile(pos, tile) {
        this.board[pos.x][pos.y] = tile
    }

    getTileRank(pos) {
        return this.board[pos.x][pos.y].rank
    }

    getTile(pos) {
        return this.board[pos.x][pos.y]
    }
}

module.exports = gameBoard