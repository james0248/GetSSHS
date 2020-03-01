import React, { Component } from 'react'
import Tile from './Tile'

class Grid extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let board = this.props.board.map((row, x) => {
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
            <div>
                {board}
            </div>
        )
    }
}

export default Grid