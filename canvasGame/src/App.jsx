// src/App.js
import React from 'react';
import GameCanvas from './GameCanvas';

function App() {
  return (
    <div className="App">
      <h2 style={{ textAlign: 'center' }}>Multiplayer Game</h2>
      <GameCanvas />
    </div>
  );
}


// Absolutely! Let's build a complete multiplayer game using React for the frontend and Node.js with Socket.IO for the backend. The game will feature:

// Player Movement: Users can move a box with their name using arrow keys.

//   Multiple Players: Each player has a box of the same size.

//     Particles: Randomly placed particles on the canvas.

// Eating Particles: Players grow in size when they collide with a particle.

// Player Collision: Larger players can eliminate smaller ones upon collision.

// Winning Condition: The last remaining player wins.

export default App;
