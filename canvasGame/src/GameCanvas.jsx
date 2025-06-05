// // src/GameCanvas.js
// import React, { useRef, useEffect, useState } from 'react';
// import socket from './socket';

// const canvasWidth = 1000;
// const canvasHeight = 1000;

// function GameCanvas() {
//     const canvasRef = useRef(null);
//     const [players, setPlayers] = useState({});
//     const [particles, setParticles] = useState([]);
//     const [myId, setMyId] = useState(null);

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext('2d');

//         socket.on('init', ({ id, players, particles }) => {
//             setMyId(id);
//             setPlayers(players);
//             setParticles(particles);
//         });

//         socket.on('new-player', (player) => {
//             setPlayers(prev => ({ ...prev, [player.id]: player }));
//         });

//         socket.on('remove-player', (id) => {
//             setPlayers(prev => {
//                 const newState = { ...prev };
//                 delete newState[id];
//                 return newState;
//             });
//         });

//         const handleKeyDown = (e) => {
//             if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
//                 const direction = e.key.replace('Arrow', '').toLowerCase();
//                 socket.emit('move', direction);
//             }
//         };

//         window.addEventListener('keydown', handleKeyDown);

//         const render = () => {
//             ctx.clearRect(0, 0, canvasWidth, canvasHeight);

//             // Draw particles
//             particles.forEach(p => {
//                 ctx.fillStyle = "green";
//                 ctx.beginPath();
//                 ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
//                 ctx.fill();
//             });

//             // Draw players
//             Object.values(players).forEach(p => {
//                 ctx.fillStyle = p.id === myId ? "blue" : "red";
//                 ctx.beginPath();
//                 ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
//                 ctx.fill();
//                 ctx.fillStyle = "black";
//                 ctx.fillText(p.name, p.x - 10, p.y - p.size - 10);
//             });

//             requestAnimationFrame(render);
//         };

//         render();

//         return () => {
//             window.removeEventListener('keydown', handleKeyDown);
//             socket.off();
//         };
//     }, [particles, players, myId]);

//     return (
//         <canvas
//             ref={canvasRef}
//             width={canvasWidth}
//             height={canvasHeight}
//             style={{ border: '2px solid black', backgroundColor: '#f5f5f5' }}
//         />
//     );
// }

// export default GameCanvas;








// src/GameCanvas.js
import React, { useEffect, useRef, useState } from 'react';
import socket from './socket';

const canvasWidth = 400;
const canvasHeight = 400;

function GameCanvas() {
    const canvasRef = useRef(null);
    const [players, setPlayers] = useState({});
    const [particles, setParticles] = useState([]);
    const [myId, setMyId] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const handleKeyDown = (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                const direction = e.key.replace('Arrow', '').toLowerCase();
                socket.emit('move', direction);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        const render = () => {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            particles.forEach((p) => {
                ctx.fillStyle = 'green';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });

            Object.values(players).forEach((p) => {
                ctx.fillStyle = p.id === myId ? 'blue' : 'red';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = 'black';
                ctx.fillText(p.name, p.x - 10, p.y - p.size - 10);
            });

            requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            socket.off();
        };
    }, [particles, players, myId]);

    useEffect(() => {
        socket.on('init', ({ id, players, particles }) => {
            setMyId(id);
            setPlayers(players);
            setParticles(particles);
        });

        socket.on('new-player', (player) => {
            setPlayers((prev) => ({ ...prev, [player.id]: player }));
        });

        socket.on('remove-player', (id) => {
            setPlayers((prev) => {
                const newState = { ...prev };
                delete newState[id];
                return newState;
            });
        });

        socket.on('game-state', ({ players, particles }) => {
            setPlayers(players);
            setParticles(particles);
        });

    }, []);


    return (
        <canvas
            ref={canvasRef}
            width={canvasWidth}
            // :: contentReference[oaicite: 0]{ index = 0 }
            height={canvasHeight}
            style={{ border: '3px solid black', backgroundColor: '#f5f5f5' }}
        />
    );
}

export default GameCanvas;
