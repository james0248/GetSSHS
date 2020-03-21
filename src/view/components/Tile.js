import React, { Component, createRef } from 'react'
import gsap from 'gsap'

import logo_1 from '../../public/images/한국과학영재교.png'
import logo_2 from '../../public/images/광주영재교.png'
import logo_3 from '../../public/images/대구영재교.png'
import logo_4 from '../../public/images/대전영재교.png'
import logo_5 from '../../public/images/세종예술영재교.png'
import logo_6 from '../../public/images/경기영재교.png'
import logo_7 from '../../public/images/인천예술영재교.png'
import logo_8 from '../../public/images/민사고.png'
import logo_9 from '../../public/images/세종과학고.png'
import logo_10 from '../../public/images/한성과학고.png'
import logo_11 from '../../public/images/서울국제고.png'
import logo_12 from '../../public/images/서울영재교.png'

const image = [
    logo_1, logo_2, logo_3, logo_4, logo_5, logo_6, logo_7, logo_8, logo_9, logo_10, logo_11, logo_12
]

class Tile extends Component {
    constructor(props) {
        super(props)
        this.ref = createRef()
    }

    componentDidUpdate() {
        if (this.props.tile.isNew) {
            gsap.fromTo(this.ref.current, { scale: 0 }, { scale: 1, duration: 0.2 })
        }
        if (this.props.tile.isMerged) {
            gsap.fromTo(this.ref.current, { scale: 1 }, {
                scale: 1.1,
                duration: 0.08,
                yoyo: true,
                repeat: 1,
            })
        }
    }

    render() {
        if (this.props.tile.rank === 0) {
            return <div className='empty tile' ref={this.ref}></div>
        }
        return (
            <div className='tile'>
                <div className='tile-background'></div>
                <img
                    src={image[this.props.tile.rank - 1]}
                    className='grid tile'
                    ref={this.ref}
                ></img>
            </div>
        )
    }
}

export default Tile