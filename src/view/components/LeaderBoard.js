import React, { Component } from 'react'

class LeaderBoard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ranking: [],
            loading: true,
        }
        this.updateRanking = this.updateRanking.bind(this)
    }

    componentDidMount() {
        this.updateRanking(this)
    }

    async updateRanking() {
        const response = (
            await (
                await fetch('https://getsshs-backend.herokuapp.com/ranking')
            ).json()
        ).map((info, index) => {
            return (
                <tr key={index} className="ranking-row">
                    <th>{'#' + (index + 1).toString()}</th>
                    <th>{info.name}</th>
                    <th>{info.score}</th>
                </tr>
            )
        })
        this.setState({ ranking: response })
    }

    render() {
        return (
            <div className="leaderBoard">
                <div className="ranking-header">
                    <h2>LeaderBoard</h2>
                    <div
                        onClick={this.updateRanking}
                        onTouchEnd={this.updateRanking}
                        className="button"
                        id="refresh"
                    >
                        Refresh
                    </div>
                </div>
                <hr></hr>
                <table>
                    <tbody>
                        <tr className="ranking-row">
                            <th>등수</th>
                            <th>이름</th>
                            <th>점수</th>
                        </tr>
                        {this.state.ranking}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default LeaderBoard
