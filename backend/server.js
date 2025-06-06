const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "*", // ⚠️ safe for dev only
      methods: ["GET", "POST"]
    }
  });
  
const PORT = 3001;
const canvasWidth = 400;
const canvasHeight = 400;

let players = {};
let particles = generateParticles(100);

function generateParticles(count) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    size: 5,
    id: Math.random().toString(36).substr(2, 9),
  }));
}


io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  players[socket.id] = {
    id: socket.id,
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    size: 10,
    name: `Player-${socket.id.slice(0, 4)}`,
  };

  socket.emit('init', { id: socket.id, players, particles });

  socket.broadcast.emit('new-player', players[socket.id]);

  socket.on('move', (direction) => {
    const speed = 2;
    const player = players[socket.id];
    if (!player) return;

    switch (direction) {
      case 'up': player.y -= speed; break;
      case 'down': player.y += speed; break;
      case 'left': player.x -= speed; break;
      case 'right': player.x += speed; break;
    }

    checkParticleCollision(player);
    checkPlayerCollision(player);
    io.emit('game-state', { players, particles });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    delete players[socket.id];
    io.emit('remove-player', socket.id);
  });
});

function checkParticleCollision(player) {
  particles = particles.filter((p) => {
    const dx = p.x - player.x;
    const dy = p.y - player.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < player.size + p.size) {
      player.size += 1;
      return false;
    }
    return true;
  });
}

function checkPlayerCollision(player) {
  Object.values(players).forEach((other) => {
    if (player.id !== other.id && player.size > other.size) {
      const dx = player.x - other.x;
      const dy = player.y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < player.size + other.size) {
        player.size += other.size;
        delete players[other.id];
        io.emit('remove-player', other.id);
      }
    }
  });
}

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
