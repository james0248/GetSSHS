import React, { Component, createRef } from 'react'
import { gsap } from 'gsap'
import Tile from './Tile'
import gameManager from '../../../game/gameManager'

let game = new gameManager(4)

class Grid extends Component {
    constructor(props) {
        super(props)
        this.state = {
            board: game.board.board,
            moveVector: [],
        }
        this.tiles = []
        this.handleKey = this.handleKey.bind(this)
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKey)
    }

    handleKey(event) {
        let result = game.listen(event)
        if(result.moved) {
            this.setState({
                board: game.board.board,
            })
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKey)
    }

    render() {
        let board = this.state.board.map((row, x) => {
            let tileRow = row.map((tile, y) => {
                this.tiles[4 * x + y] = createRef()
                return <Tile key={4 * x + y} ref={this.tiles[4 * x + y]} tile={tile} />
            })
            return (
                <div key={`grid-row-${x}`} className='grid-row'>
                    {tileRow}
                </div>
            )
        })

        return (
            <div
                tabIndex='0'
                onKeyDown={this.handleKey}
                className='grid-container'
                align='center'
            >
                {board}
            </div>
        )
    }
}

export default Grid