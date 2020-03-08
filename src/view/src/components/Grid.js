import React, { Component, createRef } from 'react'
import { gsap, CSSPlugin } from 'gsap'
import Tile from './Tile'
import gameManager from '../../../game/gameManager'

const 
    game = new gameManager(4),
    imageSize = 100

class Grid extends Component {
    constructor(props) {
        super(props)
        this.state = {
            board: game.board.board,
            moveVector: [],
        }
        this.tileRef = []
        this.handleKey = this.handleKey.bind(this)
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKey)
    }

    handleKey(event) {
        let result = game.listen(event)
        if(result.moved) {
            this.tileRef.forEach((ref, index) => {
                gsap.to(ref.ref.current, {
                    x: result.moveVector[index].x * imageSize,
                    y: result.moveVector[index].y * imageSize,
                    duration: 0.1,
                    clearProps: "transform",
                    onComplete: (() => {
                        this.setState({
                            board: game.board.board,
                        })
                    })
                })
            })
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
                {board}
            </div>
        )
    }
}

export default Grid