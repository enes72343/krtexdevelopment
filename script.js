const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

const fallingTexts = [];
const heartStars = [];
const meteors = [];

let heartBeat = 1;
let heartScale = Math.min(width, height) * 0.015;
// mesajlar
const messages = [
  "Seni Seviyorum 💖",
  "Aşkım benim 🌹",
  "Kalbim hep seninle 💕",
  "My forever love ❤️",
  "Du bist mein Herz 💓",
  "Hayatımın anlamı sensin ✨",
  "Benim tek evrenim sensin 🌌",
  "Canımın içi 💫",
  "Always & Forever 💍",
  "Bebeğim 😘"
];

// Kalp formülü
function heartShape(t, scale = 1) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t)
  );
  return { x: x * scale, y: y * scale };
}

// Düşen yazılar
function createFallingText() {
  const text = messages[Math.floor(Math.random() * messages.length)];
  const fontSize = Math.random() * 10 + 10;

  ctx.font = `bold ${fontSize}px Pacifico`;
  const textWidth = ctx.measureText(text).width;
  const x = Math.random() * (width - textWidth);

  fallingTexts.push({
    text,
    x,
    y: -10,
    speed: Math.random() * 2 + 2,
    alpha: 1,
    fontSize,
    hue: Math.random() * 360,
  });
}

// Kalp şeklinde yıldızlar
function createHeartStars(count = 6000) {
  const centerX = width / 2;
  const centerY = height / 2 + 20;
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const heart = heartShape(t, heartScale);
    const offsetX = (Math.random() - 0.5) * 15;
    const offsetY = (Math.random() - 0.5) * 15;

    const targetX = centerX + heart.x + offsetX;
    const targetY = centerY + heart.y + offsetY;

    heartStars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      targetX,
      targetY,
      size: Math.random() * 2 + 1,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
      brightness: Math.random() * 0.5 + 0.5,
      hue: Math.random() * 60 + 300,
      mode: "flying",
    });
  }
}

// Kayan yıldız (meteor)
function createMeteor() {
  meteors.push({
    x: Math.random() * width,
    y: -50,
    length: Math.random() * 80 + 50,
    speed: Math.random() * 6 + 6,
    angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
    alpha: 1,
  });
}

// Periyodik olarak düşen yazılar ve meteorlar
setInterval(() => {
  if (Math.random() < 0.8) createFallingText();
  if (Math.random() < 0.3) createMeteor();
}, 300);

// Animasyon
function animate() {
  ctx.clearRect(0, 0, width, height);

  // Yıldızlar
  heartStars.forEach((star) => {
    if (star.mode === "flying") {
      star.x += (star.targetX - star.x) * 0.02;
      star.y += (star.targetY - star.y) * 0.02;
      if (Math.abs(star.x - star.targetX) < 1 && Math.abs(star.y - star.targetY) < 1) {
        star.mode = "static";
      }
    }

    star.twinkle += star.twinkleSpeed;
    const opacity = 0.5 + 0.5 * Math.sin(star.twinkle);

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = `hsl(${star.hue}, 100%, 70%)`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // Meteorlar
  meteors.forEach((m, i) => {
    const dx = Math.cos(m.angle) * m.length;
    const dy = Math.sin(m.angle) * m.length;
    ctx.save();
    ctx.globalAlpha = m.alpha;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(m.x, m.y);
    ctx.lineTo(m.x - dx, m.y - dy);
    ctx.stroke();
    ctx.restore();
    m.x += Math.cos(m.angle) * m.speed;
    m.y += Math.sin(m.angle) * m.speed;
    m.alpha -= 0.005;
    if (m.alpha <= 0) meteors.splice(i, 1);
  });

  // Düşen yazılar
  fallingTexts.forEach((t, i) => {
    ctx.save();
    ctx.font = `bold ${t.fontSize}px Pacifico`;
    ctx.fillStyle = `hsla(${t.hue}, 100%, 85%, ${t.alpha})`;
    ctx.shadowBlur = 5;
    ctx.shadowColor = `hsla(${t.hue}, 100%, 70%, ${t.alpha})`;
    ctx.fillText(t.text, t.x, t.y);
    ctx.restore();

    t.y += t.speed;
    t.alpha -= 0.002;

    if (t.y > height + 30 || t.alpha <= 0) {
      fallingTexts.splice(i, 1);
    }
  });

  requestAnimationFrame(animate);
}

// Resize event
window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

// Başlat
createHeartStars();
animate();
