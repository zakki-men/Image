document.addEventListener("DOMContentLoaded", () => {
  const questionText = document.querySelector(".question-text");
  const mainImage = document.querySelector(".main-image"); // Tetap mainImage
  const yesButton = document.querySelector(".yes-button");
  const noButton = document.querySelector(".no-button");
  const buttonGroup = document.querySelector(".button-group");

  // DAFTAR FOTO UNTUK SETIAP STATUS / EKSPRESI
  // Pastikan nama folder 'foto' dan nama file gambar benar-benar sesuai!
  const imageStates = {
    initial: "foto/neutral_face.png", // Gambar untuk keadaan awal/netral
    sad: "foto/sad_face.png", // Gambar ketika tombol 'Tidak' di-hover berkali-kali
    happy: "foto/love.png", // Gambar ketika tombol 'Ya!' diklik
    surprised: "foto/surprised_face.png", // Gambar ketika tombol 'Tidak' pertama kali di-hover
    annoyed: "foto/angry_face.png", // Opsional: Gambar ketika tombol 'Tidak' di-hover lebih banyak lagi
  };

  // Text options for the No button
  const noButtonTexts = [
    "Tidak",
    "Tidak Mau",
    "Coba Lagi",
    "Pasti Tidak",
    "Tidak Ada Kesempatan",
    "Apa Ini?",
    "Tidak mungkin",
    "Geser!",
    "Lewati",
    "Salah Klik!",
  ];

  let noButtonClickCount = 0;
  const maxNoClicksForSadImage = 5;

  // --- Utility Functions ---

  function getRandomPosition() {
    const buttonRect = noButton.getBoundingClientRect();
    const containerRect = buttonGroup.getBoundingClientRect();

    const offset = 100;
    const newLeft = Math.random() * offset * 2 - offset;
    const newTop = Math.random() * offset * 2 - offset;

    return { left: newLeft, top: newTop };
  }

  // Fungsi untuk memperbarui gambar utama
  function updateImage(state) {
    // Pastikan state yang diminta ada di imageStates
    if (imageStates[state] && mainImage.dataset.image !== state) {
      mainImage.style.transform = "scale(0.9)"; // Efek shrink
      setTimeout(() => {
        mainImage.src = imageStates[state]; // Ganti sumber gambar
        mainImage.dataset.image = state; // Update data-image
        mainImage.style.transform = "scale(1)"; // Kembali ke ukuran normal
      }, 100); // Penundaan untuk animasi
    }
  }

  // --- Event Listeners ---

  // "No" button hover effect
  noButton.addEventListener("mouseover", () => {
    noButtonClickCount++;

    if (noButtonClickCount === 1) {
      updateImage("surprised");
    } else if (
      noButtonClickCount >= maxNoClicksForSadImage &&
      mainImage.dataset.image !== "sad"
    ) {
      updateImage("sad");
    } else if (
      noButtonClickCount > 1 &&
      mainImage.dataset.image === "initial"
    ) {
      updateImage("surprised");
    }

    const randomTextIndex = Math.floor(Math.random() * noButtonTexts.length);
    noButton.textContent = noButtonTexts[randomTextIndex];

    const currentTransform = window.getComputedStyle(noButton).transform;
    let currentX = 0,
      currentY = 0;
    if (currentTransform && currentTransform !== "none") {
      const matrix = currentTransform.match(/matrix.*\((.+)\)/)[1].split(", ");
      currentX = parseFloat(matrix[4]);
      currentY = parseFloat(matrix[5]);
    }

    const { left, top } = getRandomPosition();
    noButton.style.transform = `translate(${left}px, ${top}px)`;
    noButton.style.transition = "transform 0.2s ease-out";
  });

  // Reset gambar jika mouse meninggalkan tombol (dan belum mencapai threshold sedih)
  noButton.addEventListener("mouseout", () => {
    if (
      noButtonClickCount < maxNoClicksForSadImage &&
      mainImage.dataset.image !== "initial"
    ) {
      updateImage("initial");
    }
  });

  // "Yes" button click effect
  yesButton.addEventListener("click", () => {
    questionText.textContent = "Yay! Aku juga menyukaimu! ❤️";
    updateImage("happy"); // Ganti ke gambar 'happy' (foto/love.png)
    yesButton.style.display = "none";
    noButton.style.display = "none";
    buttonGroup.style.display = "none";

    startConfetti();
  });

  // --- Confetti Animation (Basic) --- (Tetap sama)
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  let confetti = [];
  const NUM_CONFETTI = 50;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createConfetti() {
    for (let i = 0; i < NUM_CONFETTI; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 10 + 5,
        d: Math.random() * NUM_CONFETTI,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        tilt: Math.random() * 10 - 5,
        tiltAngle: 0,
        tiltSpeed: Math.random() * 0.07 + 0.05,
      });
    }
  }

  function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach((c, i) => {
      ctx.beginPath();
      ctx.lineWidth = c.r;
      ctx.strokeStyle = c.color;
      ctx.moveTo(c.x + c.tilt, c.y);
      ctx.lineTo(c.x, c.y + c.r / 2);
      ctx.stroke();

      c.y += (c.d / 100) * 5;
      c.tiltAngle += c.tiltSpeed;
      c.tilt = Math.sin(c.tiltAngle) * c.r;

      if (c.y > canvas.height) {
        confetti[i] = {
          x: Math.random() * canvas.width,
          y: -20,
          r: Math.random() * 10 + 5,
          d: Math.random() * NUM_CONFETTI,
          color: `hsl(${Math.random() * 360}, 100%, 50%)`,
          tilt: Math.random() * 10 - 5,
          tiltAngle: 0,
          tiltSpeed: Math.random() * 0.07 + 0.05,
        };
      }
    });
    requestAnimationFrame(drawConfetti);
  }

  function startConfetti() {
    resizeCanvas();
    createConfetti();
    drawConfetti();
    setTimeout(() => {
      confetti = [];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 5000);
  }

  window.addEventListener("resize", resizeCanvas);

  noButton.style.position = "relative";
  noButton.style.transform = "translate(0, 0)";
});
