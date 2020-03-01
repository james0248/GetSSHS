import React, { Component } from 'react'
import Tile from './Tile'
import gameManager from '../../../game/gameManager'

let game = new gameManager(4)

class Grid extends Component {
    constructor(props) {
        super(props)
        this.state = {
            board: game.board.board
        }
        this.handleKey = this.handleKey.bind(this)
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKey)
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKey)
    }

    handleKey(event) {
        if(game.listen(event)) {
            this.setState({
                board: game.board.board
            })
        }
    }

    render() {
        let board = this.state.board.map((row, x) => {
            let tileRow = row.map((tile, y) => {
                return <Tile key={4*x+y} tile={tile} class='grid-tile'/>
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