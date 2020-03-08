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
        return { moved: false, moveVector: null }
    }

    getDirectionVector(dir) {
        return moveMap[dir]
    }

    getMovedPosition(prev, dir) {
        let move = this.getDirectionVector(dir)
        let { x, y } = prev
        let next = { x: x + move.x, y: y + move.y }
        let thisTile = this.board.getTile(prev)

        if (thisTile.rank === 0) {
            return prev
        }

        while (this.clamp(next.x) && this.clamp(next.y)) {
            let nextTile = this.board.getTile(next)
            if ((nextTile.rank !== 0 && nextTile.rank !== thisTile.rank) || nextTile.isMerged) {
                break
            }
            if (nextTile.rank === thisTile.rank && !nextTile.isMerged) {
                return next
            }
            prev = next
            next = { x: next.x + move.x, y: next.y + move.y }
        }
        return prev
    }

    moveTile(dir) {
        if (!this.isMoveAvailable(dir)) {
            return {moved: false, moveVector: null}
        }

        let moveVector = new Array(this.size * this.size).fill(0)
        let moveX = (dir === 2) ? -1 : 1
        let moveY = (dir === 3) ? -1 : 1
        for (let x = (dir === 2) ? 3 : 0; this.clamp(x); x += moveX) {
            for (let y = (dir === 3) ? 3 : 0; this.clamp(y); y += moveY) {
                let prev = { x: x, y: y }
                let rank = this.board.getTileRank(prev)
                let next = this.getMovedPosition(prev, dir)
                moveVector[4*x+y] = { x: next.y - y, y: next.x - x }

                if (this.isPositionEqual(prev, next)) {
                    continue
                }
                if (this.board.getTileRank(next) === rank) {
                    this.board.setTile(next, { rank: rank + 1, isMerged: true , isNew: false })
                } else {
                    this.board.setTile(next, { rank: rank, isMerged: false, isNew: false })
                }
                this.board.setTile(prev, { rank: 0, isMerged: false, isNew: false })
            }
        }
        this.board.fillEmptyTile(1)

        for (i = 0; i < 4; i++) {
            //
        }
        return { moved: true, moveVector: moveVector }
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
        let moveX = (dir === 2) ? -1 : 1
        let moveY = (dir === 3) ? -1 : 1
        for (let x = (dir === 2) ? 3 : 0; this.clamp(x); x += moveX) {
            for (let y = (dir === 3) ? 3 : 0; this.clamp(y); y += moveY) {
                let prev = { x: x, y: y }
                let next = this.getMovedPosition(prev, dir)
                if (!this.isPositionEqual(prev, next)) {
                    return true
                }
            }
        }
        return false
    }

    isPositionEqual(prev, next) {
        return prev.x === next.x && prev.y === next.y
    }

    clamp(num) {
        return num < this.size && 0 <= num
    }
}

module.exports = gameManager