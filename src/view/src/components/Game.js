import React, { Component } from 'react'
import autoBind from 'autobind'
import Grid from './Grid'
import gameManager from '../../../game/gameManager'


let game = new gameManager(4)

class Game extends Component {
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
        return (
            <div
                tabIndex='0'
                onKeyDown={this.handleKey}
            >
                <Grid board={this.state.board} />
            </div>
        )
    }
}

export default Game