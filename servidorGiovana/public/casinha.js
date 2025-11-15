let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

ctx.beginPath();
ctx.lineWidth = 2;
ctx.fillStyle = 'gray';
ctx.fillRect(0,285,400,115);
ctx.closePath();

ctx.beginPath();
ctx.lineWidth = 2;
ctx.fillStyle = '#598CFA';
ctx.arc(0,290,50,1.5*Math.PI,2.5*Math.PI);
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.lineWidth = 2;
ctx.fillStyle = '#598CFA';
ctx.fillRect(0,290,50,110);
ctx.closePath();

ctx.beginPath();
ctx.lineWidth = 2;
ctx.fillStyle = '#598CFA';
ctx.fillRect(30,346,120,110);
ctx.closePath();

ctx.beginPath();
ctx.lineWidth = 2;
ctx.fillStyle = '#598CFA';
ctx.arc(150,396,50,1.5*Math.PI,2.5*Math.PI);
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.lineWidth = 2;
ctx.fillStyle = 'yellow';
ctx.arc(300,100,50,0*Math.PI,2*Math.PI);
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.lineWidth = 2;
ctx.fillStyle = '#81491F';
ctx.fillRect(155,190,100,95);
ctx.closePath();

ctx.beginPath();
ctx.lineWidth = 2;
ctx.fillStyle = '#61BBFB';
ctx.fillRect(217,210,35,35);
ctx.closePath();

ctx.beginPath();
ctx.lineWidth = 2;
ctx.fillStyle = '#61BBFB';
ctx.fillRect(158,210,35,35);
ctx.closePath();

ctx.beginPath();
ctx.lineWidth = 2;
ctx.fillStyle = '#5F4525';
ctx.fillRect(195,240,20,45);
ctx.closePath();

ctx.beginPath();
ctx.lineWidth = 2;
ctx.fillStyle = '#81491F';
ctx.fillRect(60,240,20,45);
ctx.closePath();

ctx.beginPath();
ctx.lineWidth = 2;
ctx.fillStyle = 'green';
ctx.arc(69,216,30,0*Math.PI,2*Math.PI);
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.lineWidth = 2;
ctx.fillStyle = '#81491F';
ctx.fillRect(360,300,20,45);
ctx.closePath();

ctx.beginPath();
ctx.lineWidth = 2;
ctx.fillStyle = 'green';
ctx.arc(368,273,30,0*Math.PI,2*Math.PI);
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.lineWidth = 2;
ctx.fillStyle = '#EC6E52';
ctx.moveTo(155,190);
ctx.lineTo(205,145);
ctx.lineTo(255,190);
ctx.fill();
ctx.closePath();








