import React from 'react'
import Grid from './Grid'
import SSHS from '../../../view/public/images/logo.png'

let indexPage = <div className='card'>
    <div className='game-container'>
        <div className='header'>
            <img className='logo' src={SSHS}></img>
            <h1 className='title'>GetSSHS</h1>
        </div>
        <div className='explanation'>Merge other high schools to reach the almighty <strong>SSHS!</strong></div>
        <Grid />
        <p className='game-info explanation'>
            <strong>HOW TO PLAY:</strong> Use arrow keys and WASD to move the tiles.
                    When two tiles with the same high school logo touch, they <strong>merge into one!</strong>
            <br />
            <strong>NOTE:</strong> The order of the high schools are not intended  to be a ranking, instead
            it's a rough south-to-north geographical path to SSHS.
                    This game is a <a href='http://sshs.hs.kr/index.do'>SSHS </a> version of the game 2048.
                </p>
        <hr />
        <p className='explanation'>
            Created by <a href='https://github.com/james0248'>Hyeonseok Jung.</a> Inspired by <a href='https://mitchgu.github.io/GetMIT/'>GetMIT</a>.
                    It's a clone of <a href="http://gabrielecirulli.com" target="_blank">2048 by Gabriele Cirulli</a> made from scratch.
                </p>
    </div>
</div>

export default indexPage