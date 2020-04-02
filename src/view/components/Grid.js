import React, { Component, createRef } from 'react'
import { gsap, TimelineMax } from 'gsap'
import Tile from './Tile'
import Cover from './Cover'
import GameManager from '../../game/game-manager'

const game = new GameManager(4)
const keyMap = {
    38: 0, // Up
    87: 0, // W
    37: 1, // Left
    65: 1, // A
    40: 2, // Down
    83: 2, // S
    39: 3, // Right
    68: 3, // D
}

let imageSize = 0
let tileGap = 0
let touchStartClientX = 0
let touchStartClientY = 0

class Grid extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isCheating: false,
            scoreHistory: [],
            score: game.score,
            boardHistory: [],
            board: game.board.board,
            moveable: true,
            inputSeq: '',
            tileSeq: [game.startTile[0], game.startTile[1]],
            success: 0,
            image: true,
        }
        this.gridRef = createRef()
        this.tileRef = []
        this.handleMove = this.handleMove.bind(this)
        this.handleUndo = this.handleUndo.bind(this)
        this.handleRetry = this.handleRetry.bind(this)
        this.handleStateExport = this.handleStateExport.bind(this)
        this.handleStateRestoration = this.handleStateRestoration.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleKey = this.handleKey.bind(this)
        this.handleTouchEnd = this.handleTouchEnd.bind(this)
    }

    componentDidMount() {
        imageSize = gsap.getProperty('.tile', 'width')
        tileGap = gsap.getProperty('.tile', 'margin-right')
        document.addEventListener('keydown', this.handleKey)
        this.gridRef.current.addEventListener(
            'touchstart',
            this.handleTouchStart
        )
        this.gridRef.current.addEventListener('touchmove', this.handleTouchMove)
        this.gridRef.current.addEventListener('touchend', this.handleTouchEnd)
    }

    handleTouchStart(event) {
        if (event.touches.length > 1) return
        touchStartClientX = event.touches[0].clientX
        touchStartClientY = event.touches[0].clientY
        event.preventDefault()
    }

    handleTouchMove(_event) {}

    handleTouchEnd(event) {
        if (event.touches.length > 0) return
        let dx = event.changedTouches[0].clientX - touchStartClientX
        let absDx = Math.abs(dx)
        let dy = event.changedTouches[0].clientY - touchStartClientY
        let absDy = Math.abs(dy)
        if (Math.max(absDx, absDy) > 40) {
            // (right : left) : (down : up)
            let move = absDx > absDy ? (dx > 0 ? 3 : 1) : dy > 0 ? 2 : 0
            if (this.state.moveable) {
                this.handleMove(move)
            }
        }
    }

    handleKey(event) {
        let mapped = keyMap[event.keyCode]
        if (mapped !== undefined) {
            if (this.state.moveable) {
                this.handleMove(mapped)
            }
            event.preventDefault()
        }
    }

    handleMove(mapped) {
        let result = game.listen(mapped)
        if (result.moved) {
            let animation = new TimelineMax({ paused: true })
            animation.eventCallback(
                'onComplete',
                (result) => {
                    this.props.scoreHandler(game.score)
                    this.setState((prevState) => {
                        return {
                            scoreHistory: [
                                ...prevState.scoreHistory,
                                prevState.score,
                            ],
                            score: game.score,
                            boardHistory: [
                                ...prevState.scoreHistory,
                                prevState.board,
                            ],
                            board: game.board.board,
                            moveable: result.isMoveable,
                            inputSeq:
                                prevState.inputSeq +
                                result.direction.toString(),
                            tileSeq: [...prevState.tileSeq, result.newTile],
                        }
                    })
                },
                [result]
            )
            this.tileRef.forEach((ref, index) => {
                let dx = result.moveVector[index].x * (imageSize + tileGap)
                let dy = result.moveVector[index].y * (imageSize + tileGap)
                if (dx !== 0 || dy !== 0) {
                    animation.to(
                        ref.ref.current,
                        {
                            x: dx,
                            y: dy,
                            duration: 0.1,
                            clearProps: 'transform',
                        },
                        0
                    )
                }
            })
            animation.play()
        }
    }

    handleUndo() {
        this.setState((prevState) => {
            let scoreHistory = prevState.scoreHistory.slice(0, -1)
            let score = prevState.scoreHistory.slice(-1)[0]
            let boardHistory = prevState.boardHistory.slice(0, -1)
            let board = prevState.boardHistory.slice(-1)[0]
            if (!board) {
                return {}
            }
            let inputSeq = prevState.inputSeq.slice(0, -1)
            let tileSeq = prevState.tileSeq.slice(0, -1)
            game.score = score
            game.board.board = board
            return {
                scoreHistory,
                score,
                boardHistory,
                board,
                inputSeq,
                tileSeq,
                moveable: true,
            }
        })
    }

    handleRetry() {
        game.reset()
        this.setState({
            isCheating: false,
            scoreHistory: [],
            score: game.score,
            boardHistory: [],
            board: game.board.board,
            moveable: true,
            inputSeq: '',
            tileSeq: [game.startTile[0], game.startTile[1]],
            success: 0,
        })
        document.addEventListener('keydown', this.handleKey)
        this.gridRef.current.addEventListener(
            'touchstart',
            this.handleTouchStart
        )
        this.gridRef.current.addEventListener('touchmove', (e) => {
            e.preventDefault()
        })
        this.gridRef.current.addEventListener('touchend', this.handleTouchEnd)
        this.props.scoreHandler(game.score)
        this.tileRef = []
    }

    async handleStateExport() {
        await navigator.clipboard.writeText(JSON.stringify(this.state))
    }

    handleStateRestoration() {
        let state = JSON.parse(prompt('Input state: '))
        if (!state || !state.score || !state.board) {
            return
        }
        this.setState(state)
        game.score = state.score
        game.board.board = state.board
    }

    async handleSubmit(name) {
        const response = await fetch(
            'https://getsshs-backend.herokuapp.com/check',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    inputSeq: this.state.inputSeq,
                    tileSeq: this.state.tileSeq,
                    score: game.score,
                }),
            }
        )
        game.clearBoardTags()
        if (response.ok) {
            window.localStorage.setItem('name', name)
            this.setState({ success: 1 })
        } else {
            this.setState({ success: -1 })
            if (response.status === 406) {
                alert('이벤트 기간이 아닙니다')
            } else if (response.status === 400) {
                alert(
                    '점수 집계 중 문제가 발생하였습니다. 관리자에게 스크린샷과 함께 제보하세요'
                )
            }
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKey)
        this.gridRef.current.removeEventListener(
            'touchstart',
            this.handleTouchStart
        )
        this.gridRef.current.removeEventListener('touchmove', (e) => {
            e.preventDefault()
        })
        this.gridRef.current.removeEventListener(
            'touchend',
            this.handleTouchEnd
        )
    }

    render() {
        let board = this.state.board.map((row, x) => {
            let tileRow = row.map((tile, y) => {
                return (
                    <Tile
                        key={4 * x + y}
                        ref={(tile) => {
                            this.tileRef[4 * x + y] = tile
                        }}
                        tile={tile}
                        image={this.state.image}
                    />
                )
            })
            return (
                <div key={`grid-row-${x}`} className="grid-row">
                    {tileRow}
                </div>
            )
        })

        return (
            <div>
                <input
                    id="image"
                    type="checkbox"
                    checked={this.state.image}
                    onChange={() => {
                        this.setState((prevState) => {
                            return { image: !prevState.image }
                        })
                    }}
                />
                <label htmlFor="image">Play with School Icons</label>
                <input
                    id="cheating"
                    type="checkbox"
                    checked={this.state.isCheating}
                    onChange={() => {
                        this.setState({ isCheating: true })
                    }}
                />
                <label htmlFor="cheating">
                    Cheat (Warning: you can't turn this off once you turn it on)
                </label>
                {this.state.isCheating && (
                    <>
                        <button onClick={this.handleUndo}>Undo</button>
                        <button onClick={this.handleStateExport}>
                            Export State To Clipboard
                        </button>
                        <button onClick={this.handleStateRestoration}>
                            Restore State
                        </button>
                    </>
                )}
                <div
                    ref={this.gridRef}
                    className="grid-container"
                    align="center"
                >
                    <Cover
                        display={!this.state.moveable}
                        success={this.state.success}
                        handleRetry={this.handleRetry}
                        handleSubmit={(name) => {
                            this.handleSubmit(name)
                        }}
                        score={game.score}
                    />
                    {board}
                </div>
            </div>
        )
    }
}

export default Grid
