import React, { Component } from 'react'
import { gsap, TimelineMax } from 'gsap'
import Tile from './Tile'
import Cover from './Cover'
import gameManager from '../../game/gameManager'

const game = new gameManager(4)
let imageSize = 0
let tileGap = 0

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
        this.tileRef = []
        this.handleKey = this.handleKey.bind(this)
        this.handleRetry = this.handleRetry.bind(this)
    }

    componentDidMount() {
        imageSize = gsap.getProperty('.tile', 'width')
        tileGap = gsap.getProperty('.tile', 'margin-right')
        document.addEventListener('keydown', this.handleKey)
    }

    handleKey(event) {
        let result = game.listen(event)
        if (result.moved) {
            let animation = new TimelineMax({ paused: true })
            animation.eventCallback("onComplete", (result) => {
                this.props.scoreHandler(game.score)
                if (!result.isMoveable) {
                    document.removeEventListener('keydown', this.handleKey)
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
        this.props.scoreHandler(game.score)
        this.tileRef = []
    }

    async handleSubmit(self, name) {
        const response = await fetch('http://localhost:8000/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                inputSeq: self.state.inputSeq,
                tileSeq: self.state.tileSeq,
                score: game.score
            })
        })
        game.clearBoardTags()
        if(response.ok) {
            window.localStorage.setItem('name', name)
            this.setState({ success: 1 })
        } else {
            this.setState({ success: -1 })
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKey)
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
                className='grid-container'
                align='center' >
                <Cover
                    display={!this.state.moveable}
                    success={this.state.success}
                    handleRetry={this.handleRetry}
                    handleSubmit={(name) => {let self = this; this.handleSubmit(self, name)}}
                    score={game.score}
                />
                {board}
            </div>
        )
    }
}

export default Grid