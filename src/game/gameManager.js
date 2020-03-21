const gameBoard = require('./gameBoard')

const moveMap = {
        0: { x: -1, y: 0 },
        1: { x: 0, y: -1 },
        2: { x: 1, y: 0 },
        3: { x: 0, y: 1 },
    }

class gameManager {
    constructor(size) {
        this.size = size
        this.board = new gameBoard(size)
        this.score = 0
        this.startTile = this.board.fillEmptyTile(2)
    }

    listen(key) {
        if(key === undefined) {
            return { moved: false, moveVector: null }
        }
        return this.moveTile(key)
    }

    reset() {
        this.board = new gameBoard(this.size)
        this.score = 0
        this.startTile = this.board.fillEmptyTile(2)
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
            return { moved: false, moveVector: null }
        }

        this.clearBoardTags()
        let moveVector = new Array(this.size * this.size).fill(0)
        let moveX = (dir === 2) ? -1 : 1
        let moveY = (dir === 3) ? -1 : 1
        for (let x = (dir === 2) ? 3 : 0; this.clamp(x); x += moveX) {
            for (let y = (dir === 3) ? 3 : 0; this.clamp(y); y += moveY) {
                let prev = { x: x, y: y }
                let rank = this.board.getTileRank(prev)
                let next = this.getMovedPosition(prev, dir)
                moveVector[4 * x + y] = { x: next.y - y, y: next.x - x }

                if (this.isPositionEqual(prev, next)) {
                    continue
                }
                if (this.board.getTileRank(next) === rank) {
                    this.board.setTile(next, { rank: rank + 1, isMerged: true, isNew: false })
                    this.score += (1 << (rank + 1))
                } else {
                    this.board.setTile(next, { rank: rank, isMerged: false, isNew: false })
                }
                this.board.setTile(prev, { rank: 0, isMerged: false, isNew: false })
            }
        }
        let newTile = this.board.fillEmptyTile(1)[0]

        let moveable = false
        for(let i = 0; i < 4; i++) {
            moveable = moveable || this.isMoveAvailable(i)
        }
        return {
            moved: true,
            moveVector: moveVector,
            isMoveable: moveable,
            direction: dir,
            newTile: newTile
        }
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
        if (Number.isNaN(dir) || !Number.isInteger(dir) || dir < 0 || dir > 3) {
            return false
        }
        let prevTags = this.board.board.map(row => {
            return row.map(tile => {
                return {
                    isMerged: tile.isMerged,
                    isNew: tile.isNew,
                }
            })
        })
        this.clearBoardTags()
        let moveX = (dir === 2) ? -1 : 1
        let moveY = (dir === 3) ? -1 : 1
        for (let x = (dir === 2) ? 3 : 0; this.clamp(x); x += moveX) {
            for (let y = (dir === 3) ? 3 : 0; this.clamp(y); y += moveY) {
                let prev = { x: x, y: y }
                let next = this.getMovedPosition(prev, dir)
                if (!this.isPositionEqual(prev, next)) {
                    this.restoreTags(prevTags)
                    return true
                }
            }
        }
        this.restoreTags(prevTags)
        return false
    }

    restoreTags(prevTags) {
        this.board.board = this.board.board.map((row, x) => {
            return row.map((tile, y) => {
                tile.isMerged = prevTags[x][y].isMerged
                tile.isNew = prevTags[x][y].isNew
                return tile
            })
        })
    }

    isPositionEqual(prev, next) {
        return prev.x === next.x && prev.y === next.y
    }

    clamp(num) {
        return num < this.size && 0 <= num
    }
}

module.exports = gameManager
