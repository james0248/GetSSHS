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

    listen(event) {
        let mapped = keyMap[event.keyCode]
        if (mapped !== undefined) {
            return this.moveTile(mapped)
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

        if (thisTile.rank === 0) {
            return { x: x, y: y }
        }
        while (nx >= 0 && ny >= 0 && nx < this.size && ny < this.size) {
            let nextTile = this.board.board[nx][ny]
            if ((nextTile.rank !== 0 && nextTile.rank !== thisTile.rank) || nextTile.isMerged) {
                break
            }
            if (nextTile.rank === thisTile.rank && !nextTile.isMerged) {
                return { x: nx, y: ny }
            }
            x = nx, y = ny, nx += move.x, ny += move.y
        }
        return { x: x, y: y }
    }

    moveTile(dir) {
        if (!this.isMoveAvailable(dir)) {
            return false
        }

        let di = (dir === 2) ? -1 : 1
        let dj = (dir === 3) ? -1 : 1

        for (let i = (dir === 2) ? 3 : 0; i < this.size && i >= 0; i += di) {
            for (let j = (dir === 3) ? 3 : 0; j < this.size && j >= 0; j += dj) {
                let p = this.getMovedPosition(i, j, dir)
                if (p.x === i && p.y === j) {
                    continue
                }
                if (this.board.board[p.x][p.y].rank === this.board.board[i][j].rank) {
                    this.board.board[p.x][p.y].rank++
                    this.board.board[p.x][p.y].isMerged = true
                } else {
                    this.board.board[p.x][p.y] = this.board.board[i][j]
                }
                this.board.board[i][j] = { rank: 0, isMerged: false }
            }
        }

        this.board.fillEmptyTile(1)

        for (i = 0; i < 4; i++) {
            //
        }
        return true
    }

    clearBoardTags() {
        this.board.board = this.board.board.map(row => {
            return row.map(tile => {
                tile.isMerged = false
                tile.isNew = false
                return tile
            })
        })
    }

    isMoveAvailable(dir) {
        this.clearBoardTags()
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
        return false
    }
}

module.exports = gameManager