import React, { Component, createRef } from 'react'
import { gsap, TimelineMax } from 'gsap'
import Tile from './Tile'
import Cover from './Cover'
import gameManager from '../../game/gameManager'

const
    game = new gameManager(4),
    keyMap = {
        38: 0, // Up
        87: 0, // W
        37: 1, // Left
        65: 1, // A
        40: 2, // Down
        83: 2, // S
        39: 3, // Right
        68: 3  // D
    };

let imageSize = 0
let tileGap = 0
let touchStartClientX = 0
let touchStartClientY = 0

class Grid extends Component {
    constructor(props) {
        super(props)
        this.state = {
            board: game.board.board,
            moveable: true,
            inputSeq: '',
            tileSeq: [game.startTile[0], game.startTile[1]],
            success: 0,
        }
        this.gridRef = createRef()
        this.tileRef = []
        this.handleMove = this.handleMove.bind(this)
        this.handleRetry = this.handleRetry.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleKey = this.handleKey.bind(this)
        this.handleTouchEnd = this.handleTouchEnd.bind(this)
    }

    componentDidMount() {
        imageSize = gsap.getProperty('.tile', 'width')
        tileGap = gsap.getProperty('.tile', 'margin-right')
        document.addEventListener('keydown', this.handleKey)
        this.gridRef.current.addEventListener('touchstart', this.handleTouchStart)
        this.gridRef.current.addEventListener('touchmove', (e) => { e.preventDefault() })
        this.gridRef.current.addEventListener('touchend', this.handleTouchEnd)
    }

    handleTouchStart(event) {
        if (event.touches.length > 1) return;
        touchStartClientX = event.touches[0].clientX;
        touchStartClientY = event.touches[0].clientY;
        event.preventDefault();
    }

    handleTouchEnd(event) {
        if (event.touches.length > 0) return;
        let dx = event.changedTouches[0].clientX - touchStartClientX;
        let absDx = Math.abs(dx);
        let dy = event.changedTouches[0].clientY - touchStartClientY;
        let absDy = Math.abs(dy);
        if (Math.max(absDx, absDy) > 40) {
            // (right : left) : (down : up)
            let move = absDx > absDy ? (dx > 0 ? 3 : 1) : (dy > 0 ? 2 : 0)
            this.handleMove(move)
        }
    }

    handleKey(event) {
        let mapped = keyMap[event.keyCode]
        this.handleMove(mapped)
        event.preventDefault();
    }

    handleMove(mapped) {
        let result = game.listen(mapped)
        if (result.moved) {
            let animation = new TimelineMax({ paused: true })
            animation.eventCallback("onComplete", (result) => {
                this.props.scoreHandler(game.score)
                if (!result.isMoveable) {
                    document.removeEventListener('keydown', this.handleKey)
                    this.gridRef.current.removeEventListener('touchstart', this.handleTouchStart)
                    this.gridRef.current.removeEventListener('touchmove', (e) => { e.preventDefault() })
                    this.gridRef.current.removeEventListener('touchend', this.handleTouchEnd)
                }
                this.setState((prevState) => {
                    prevState.tileSeq.push(result.newTile)
                    return {
                        board: game.board.board,
                        moveable: result.isMoveable,
                        inputSeq: prevState.inputSeq + result.direction.toString(),
                        tileSeq: prevState.tileSeq
                    }
                })
            }, [result])
            this.tileRef.forEach((ref, index) => {
                let dx = result.moveVector[index].x * (imageSize + tileGap)
                let dy = result.moveVector[index].y * (imageSize + tileGap)
                if (dx !== 0 || dy !== 0) {
                    animation.to(ref.ref.current, {
                        x: dx,
                        y: dy,
                        duration: 0.1,
                        clearProps: "transform",
                    }, 0)
                }
            })
            animation.play()
        }
    }

    handleRetry() {
        game.reset()
        this.setState({
            board: game.board.board,
            moveable: true,
            inputSeq: '',
            tileSeq: [game.startTile[0], game.startTile[1]],
            success: 0,
        })
        document.addEventListener('keydown', this.handleKey)
        this.gridRef.current.addEventListener('touchstart', this.handleTouchStart)
        this.gridRef.current.addEventListener('touchmove', (e) => { e.preventDefault() })
        this.gridRef.current.addEventListener('touchend', this.handleTouchEnd)
        this.props.scoreHandler(game.score)
        this.tileRef = []
    }

    async handleSubmit(name) {
        const response = await fetch('https://getsshs-backend.herokuapp.com/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                inputSeq: this.state.inputSeq,
                tileSeq: this.state.tileSeq,
                score: game.score
            })
        })
        game.clearBoardTags()
        if (response.ok) {
            window.localStorage.setItem('name', name)
            this.setState({ success: 1 })
        } else {
            this.setState({ success: -1 })
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKey)
        this.gridRef.current.removeEventListener('touchstart', this.handleTouchStart)
        this.gridRef.current.removeEventListener('touchmove', (e) => { e.preventDefault() })
        this.gridRef.current.removeEventListener('touchend', this.handleTouchEnd)
    }

    render() {
        let board = this.state.board.map((row, x) => {
            let tileRow = row.map((tile, y) => {
                return <Tile
                    key={4 * x + y}
                    ref={(tile) => { this.tileRef[4 * x + y] = tile }}
                    tile={tile} />
            })
            return (
                <div key={`grid-row-${x}`} className='grid-row'>
                    {tileRow}
                </div>
            )
        })

        return (
            <div
                ref={this.gridRef}
                className='grid-container'
                align='center' >
                <Cover
                    display={!this.state.moveable}
                    success={this.state.success}
                    handleRetry={this.handleRetry}
                    handleSubmit={(name) => { this.handleSubmit(name) }}
                    score={game.score}
                />
                {board}
            </div>
        )
    }
}

export default Grid
