import React from 'react'
import rorschach from '../assets/Rorschach.mp4'
import styled from 'styled-components'

const Video = styled.video`
height: 100vh;
width: 100vw;
position: absolute;
top: 0;
left: 50%;
pointer-events: none;
transform: translate(-50%);
mix-blend-mode: difference;
filter: grayscale(100%);
object-fit: cover;
z-index: 1;
`

export const BackgroundVideo = () => {

  return (
    <Video autoPlay muted loop>
      <source src={rorschach} type="video/mp4" />
    </Video>
  )
}