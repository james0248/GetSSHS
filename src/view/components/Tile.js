import React, { Component, createRef } from 'react'
import gsap from 'gsap'
import { image, color } from './images'

class Tile extends Component {
    constructor(props) {
        super(props)
        this.ref = createRef()
    }

    componentDidUpdate() {
        if (this.props.tile.isNew) {
            gsap.fromTo(
                this.ref.current,
                { scale: 0 },
                { scale: 1, duration: 0.2 }
            )
        }
        if (this.props.tile.isMerged) {
            gsap.fromTo(
                this.ref.current,
                { scale: 1 },
                {
                    scale: 1.1,
                    duration: 0.08,
                    yoyo: true,
                    repeat: 1,
                }
            )
        }
    }

    render() {
        let size = null,
            textColor = 'white'
        if (1 << this.props.tile.rank < 100) {
            if (1 << this.props.tile.rank < 8) {
                textColor = '#776E65'
            }
            size = '55px'
        } else if (1 << this.props.tile.rank < 1000) {
            size = '45px'
        } else {
            size = '35px'
        }

        let tile = this.props.image ? (
            <div
                className="grid"
                ref={this.ref}
                style={{
                    backgroundImage: `url(${image[this.props.tile.rank - 1]})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                }}
            ></div>
        ) : (
            <div
                className="grid"
                ref={this.ref}
                style={{
                    background: color[this.props.tile.rank - 1],
                    fontSize: size,
                    color: textColor,
                }}
            >
                {' '}
                {1 << this.props.tile.rank}{' '}
            </div>
        )
        if (this.props.tile.rank === 0) {
            tile = <div className="empty" ref={this.ref}></div>
        }
        return (
            <div className="tile">
                <div className="tile-background"></div>
                {tile}
            </div>
        )
    }
}

export default Tile
