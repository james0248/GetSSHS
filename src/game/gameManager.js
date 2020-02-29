const gameBoard = require('./gameBoard')

const
    moveMap = {
        0: { x: -1, y: 0 },
        1: { x: 0, y: -1 },
        2: { x: 1, y: 0 },
        3: { x: 0, y: 1 },
    },
    keyMap = {
        38: 0, // Up
        87: 0, // W
        37: 1, // Left
        65: 1, // A
        40: 2, // Down
        83: 2, // S
        39: 3, // Right
        68: 3  // D
    }
class gameManager {
    constructor(size) {
        this.size = size
        this.board = new gameBoard(size)
    }

    test() {
        this.board.board.forEach((row) => {
            console.log(row.toString())
        })
        console.log()
        console.log('Right')
        this.moveTile(3)
        console.log('Down')
        this.moveTile(2)
        console.log('Left')
        this.moveTile(1)
        console.log('Down')
        this.moveTile(2)
        console.log('Up')
        this.moveTile(0)
    }

    listen(event) {
        let mapped = keyMap[event.keyCode]
        console.log('hello')
        if (mapped !== undefined) {
            this.moveTile(mapped)
            return true
        }
        return false
    }

    getDirectionVector(dir) {
        return moveMap[dir]
    }

    getMovedPosition(x, y, dir) {
        let move = this.getDirectionVector(dir)

        let nx = x + move.x, ny = y + move.y
        let thisTile = this.board.board[x][y]

        if (thisTile === 0) {
            return { x: x, y: y }
        }
        while (nx >= 0 && ny >= 0 && nx < this.size && ny < this.size) {
            let nextTile = this.board.board[nx][ny]
            if (nextTile !== 0 && nextTile !== thisTile) {
                break;
            }
            x = nx, y = ny, nx += move.x, ny += move.y
        }
        return { x: x, y: y }
    }

    moveTile(dir) {
        let di = (dir === 2) ? -1 : 1
        let dj = (dir === 3) ? -1 : 1

        for (let i = (dir === 2) ? 3 : 0; i < this.size && i >= 0; i += di) {
            for (let j = (dir === 3) ? 3 : 0; j < this.size && j >= 0; j += dj) {
                let p = this.getMovedPosition(i, j, dir)
                if (p.x === i && p.y === j) {
                    continue
                }
                if (this.board.board[p.x][p.y] === this.board.board[i][j]) {
                    this.board.board[p.x][p.y]++
                } else {
                    this.board.board[p.x][p.y] = this.board.board[i][j]
                }
                this.board.board[i][j] = 0
            }
        }
        this.board.fillEmptyTile(1)
        if (!this.isMoveAvailable()) {
            //TODO
        }
    }

    isMoveAvailable() {
        for (let dir = 0; dir < 3; dir++) {
            let di = (dir === 2) ? -1 : 1
            let dj = (dir === 3) ? -1 : 1

            for (let i = (dir === 2) ? 3 : 0; i < this.size && i >= 0; i += di) {
                for (let j = (dir === 3) ? 3 : 0; j < this.size && j >= 0; j += dj) {
                    let p = this.getMovedPosition(i, j, dir)
                    if (p.x !== i || p.y !== j) {
                        return true;
                    }
                }
            }
        }
        return false
    }
}

module.exports = gameManager