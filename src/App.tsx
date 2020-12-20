import React, { useCallback, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const canvas = useRef<HTMLCanvasElement>(null);

  const [, updateState] = React.useState(null);
  const forceUpdate = React.useCallback(() => updateState(null), []);

  // run once
  useEffect(() => {
    // 15 fps
    setInterval(() => { game() }, 1000/15);

    if (canvas.current) {
      canvas.current.focus();
    }
  }, []);

  // velocity
  let xVelocity = 0;
  let yVelocity = 0;

  // position
  let xPlayerPos = 10;
  let yPlayerPos = 10;

  // apple - target
  let xApplePos = 15;
  let yApplePos = 15;

  // config
  let gridSize = 20; // 1 tile height, width
  let tileCount = 20; // tiles in line

  // trail
  let trail: Array<{ x: number, y: number }> = [];
  let tail = 5;

  const game = useCallback(() => {
    if (!canvas.current) {
      return;
    }

    const ctx = canvas.current.getContext('2d');

    if (!ctx) {
      return;
    }

    xPlayerPos += xVelocity;
    yPlayerPos += yVelocity;

    // left edge
    if (xPlayerPos < 0) {
      xPlayerPos = tileCount - 1;
    }

    // right edge
    if (xPlayerPos > tileCount - 1) {
      xPlayerPos = 0;
    }

    // top edge
    if (yPlayerPos < 0) {
      yPlayerPos = tileCount - 1;
    }

    // bottom edge
    if (yPlayerPos > tileCount - 1) {
      yPlayerPos = 0;
    }

    // backgrounds
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvas.current.width, canvas.current.height);

    // snake
    ctx.fillStyle = 'lime';
    for (let i=0; i < trail.length; i++) {
      ctx.fillRect(trail[i].x * gridSize, trail[i].y * gridSize, gridSize - 2, gridSize - 2);

      // died - eaten yourself
      if (trail[i].x === xPlayerPos && trail[i].y === yPlayerPos) {
        tail = 5;
      }
    }

    console.log('trail >', trail);

    trail.push({ x: xPlayerPos, y: yPlayerPos });
    while (trail.length > tail) {
      trail.shift();
    }

    if (xApplePos === xPlayerPos && yApplePos === yPlayerPos) {
      tail++;
      xApplePos = Math.floor(Math.random() * tileCount);
      yApplePos = Math.floor(Math.random() * tileCount);
    }


    // apple
    ctx.fillStyle = 'red';
    ctx.fillRect(xApplePos * gridSize, yApplePos * gridSize, gridSize - 2, gridSize - 2);

    forceUpdate();
  }, [canvas]);

  const keyPush = useCallback((event: any) => {
    switch (event.keyCode) {
      // left
      case 37:
        xVelocity = -1;
        yVelocity = 0;
        break;
      // down
      case 38:
        xVelocity = 0;
        yVelocity = -1;
        break;
      // right
      case 39:
        xVelocity = 1;
        yVelocity = 0;
        break;
      // top
      case 40:
        xVelocity = 0;
        yVelocity = 1;
        break;
    }
  }, [])

  return (
    <div className="App">
      <canvas
        id={'gc'}
        height={400}
        width={400}
        ref={canvas}
        onKeyDown={keyPush}
        tabIndex={0}
      >

      </canvas>
    </div>
  );
}

export default App;
