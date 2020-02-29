import React, { Component } from 'react'
import Tile from './Tile'

class Grid extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let board = this.props.board.map(row => {
            let tileRow = row.map(tile => {
                return <Tile rank={tile}/>
            })
            return (
                <div className='grid-row'>
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