import React from 'react';

class Tile extends React.Component {
    render() {
        return (
            <img src={this.props.src}/>
        )
    }
}

export default Tile;