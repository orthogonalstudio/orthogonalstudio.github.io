// --- 1. OYUN DATA ALANI ---
const gamesData = [
    {
        id: "mosquitos",
        title: "Mosquitos",
        images: ["jpg/game1_1.jpg", "jpg/game1_2.jpg", "jpg/game1_3.jpg", "jpg/game1_4.jpg", "jpg/game1_5.jpg", "jpg/game1_6.jpg", "jpg/game1_7.jpg"],
        videoUrl: "https://www.youtube.com/watch?v=pTkEwnbjX24",
        steamUrl: "https://store.steampowered.com/",
        presskitUrl: "#",
        pitchdeckUrl: "#",
        hasTrailer: true
    },
    {
        id: "jason-must-be-killed",
        title: "Jason Must Be Killed",
        images: ["jpg/game2_1.jpg"],
        videoUrl: "#",
        steamUrl: "#",
        presskitUrl: "#",
        pitchdeckUrl: "#",
        hasTrailer: false
    },
    {
        id: "good-guys-lose",
        title: "Good Guys Lose",
        images: ["jpg/game3_1.jpg"],
        videoUrl: "#",
        steamUrl: "#",
        presskitUrl: "#",
        pitchdeckUrl: "#",
        hasTrailer: false
    }
];

let currentGameIndex = 0;
let currentImageIndex = 0;

// --- 2. DOM ELEMENT TANIMLARI ---
const sliderTrack = document.getElementById("slider-track");
const presentationControls = document.getElementById("presentation-controls");
const dynamicImageNav = document.getElementById("dynamic-image-nav");
const prevGameBtn = document.getElementById("prev-game");
const nextGameBtn = document.getElementById("next-game");

const btnCover = document.getElementById("btn-cover");
const btnTrailer = document.getElementById("btn-trailer");
const btnSteam = document.getElementById("btn-steam");

const vLine1 = document.getElementById("v-line-1");
const vLine2 = document.getElementById("v-line-2");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxPrev = document.getElementById("lightbox-prev");
const lightboxNext = document.getElementById("lightbox-next");
const imageContainer = document.querySelector(".spec-games-container");

// --- 3. CORE SPA PAGE SWITCHER MECHANISM ---
function switchPage(pageTarget) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active-page'));
    document.getElementById('menu-games').classList.remove('active');
    document.getElementById('menu-studio').classList.remove('active');

    const globalNav = document.getElementById('global-nav');
    globalNav.style.display = 'flex';

    const plusBtn = document.getElementById('dynamic-nav-plus');

    if (pageTarget === 'games') {
        document.getElementById('page-games').classList.add('active-page');
        document.getElementById('menu-games').classList.add('active');
        plusBtn.style.display = 'none';
    }
    else if (pageTarget === 'studio') {
        document.getElementById('page-studio').classList.add('active-page');
        document.getElementById('menu-studio').classList.add('active');

        plusBtn.style.display = 'inline-block';
        plusBtn.classList.remove('active-close');
        plusBtn.onclick = function (e) {
            e.preventDefault();
            plusBtn.classList.add('active-close');
            setTimeout(() => { switchPage('vaiz'); }, 400);
        };
    }
    else if (pageTarget === 'vaiz') {
        document.getElementById('page-vaiz').classList.add('active-page');
        globalNav.style.display = 'none';

        plusBtn.style.display = 'inline-block';
        plusBtn.classList.add('active-close');
        plusBtn.onclick = function (e) {
            e.preventDefault();
            plusBtn.classList.remove('active-close');
            setTimeout(() => { switchPage('studio'); }, 400);
        };
    }
}

// --- 4. SLIDER ENGINE ---
function renderTrackImages(customSequence = null) {
    if (!sliderTrack) return;
    sliderTrack.innerHTML = "";
    const list = customSequence || gamesData[currentGameIndex].images;
    list.forEach(imgSrc => {
        const img = document.createElement("img");
        img.src = imgSrc;
        img.alt = "Game View";
        sliderTrack.appendChild(img);
    });
}

function updateGameDOM(targetActiveIndex = 0) {
    if (!sliderTrack) return;

    currentImageIndex = targetActiveIndex;
    const offset = currentImageIndex * 100;
    sliderTrack.style.transform = `translateX(-${offset}%)`;

    // Sadece ilk oyun (Mosquitos) için alt buton panelini göster, diğerlerinde gizle
    if (presentationControls) {
        if (currentGameIndex === 0) {
            presentationControls.style.display = "flex";
        } else {
            presentationControls.style.display = "none";
        }
    }

    buildImageNavigation();
    updateButtonStates();

    const activeGame = gamesData[currentGameIndex];

    // C Butonu Durumu
    if (btnCover) {
        if (currentImageIndex === 0) {
            btnCover.classList.add("active");
        } else {
            btnCover.classList.remove("active");
        }
    }

    // Trailer Butonu Durumu
    if (btnTrailer) {
        if (activeGame.hasTrailer && activeGame.videoUrl && activeGame.videoUrl !== "#") {
            btnTrailer.href = activeGame.videoUrl;
            btnTrailer.classList.remove("disabled");
        } else {
            btnTrailer.removeAttribute("href");
            btnTrailer.classList.add("disabled");
        }
    }

    // Steam Butonu Durumu
    if (btnSteam) {
        if (activeGame.steamUrl && activeGame.steamUrl !== "#") {
            btnSteam.href = activeGame.steamUrl;
            btnSteam.classList.remove("disabled");
        } else {
            btnSteam.removeAttribute("href");
            btnSteam.classList.add("disabled");
        }
    }
}

function buildImageNavigation() {
    if (!dynamicImageNav) return;
    dynamicImageNav.innerHTML = "";

    // Sadece ilk oyundaysak buton navigasyonunu oluştur
    if (currentGameIndex !== 0) return;

    const activeGame = gamesData[currentGameIndex];

    for (let imgIdx = 1; imgIdx < activeGame.images.length; imgIdx++) {
        const btn = document.createElement("button");
        btn.classList.add("presentation-btn", "btn-nav-spec");
        btn.textContent = imgIdx;

        if (imgIdx === currentImageIndex) {
            btn.classList.add("active");
        }

        btn.addEventListener("click", () => {
            updateGameDOM(imgIdx);
        });

        dynamicImageNav.appendChild(btn);
    }
}

function updateButtonStates() {
    if (!prevGameBtn || !nextGameBtn) return;

    if (currentGameIndex === 0) prevGameBtn.classList.add("disabled");
    else prevGameBtn.classList.remove("disabled");

    if (currentGameIndex === gamesData.length - 1) nextGameBtn.classList.add("disabled");
    else nextGameBtn.classList.remove("disabled");
}

/********** SWITCH GAME ENGINE **********/
function switchGame(direction) {
    if (!sliderTrack) return;

    if (direction === 'next' && currentGameIndex === gamesData.length - 1) return;
    if (direction === 'prev' && currentGameIndex === 0) return;

    const targetGameIndex = (direction === 'next') ? currentGameIndex + 1 : currentGameIndex - 1;

    // Eğer diğer bir oyuna geçiliyorsa paneli ANINDA kapatıyoruz.
    // İlk oyuna geri dönüyorsak paneli burada değil, geçiş tamamlandıktan sonra (setTimeout içinde) açıyoruz.
    if (presentationControls && targetGameIndex !== 0) {
        presentationControls.style.display = "none";
    }

    const previousGameIndex = currentGameIndex;
    const previousImageIndex = currentImageIndex;

    if (direction === 'next') currentGameIndex++;
    else currentGameIndex--;

    currentImageIndex = 0;

    const oldImg = gamesData[previousGameIndex].images[previousImageIndex];
    const newImg = gamesData[currentGameIndex].images[0];
    const transitionSequence = (direction === 'next') ? [oldImg, newImg] : [newImg, oldImg];

    renderTrackImages(transitionSequence);

    sliderTrack.style.transition = "none";
    sliderTrack.style.transform = (direction === 'next') ? "translateX(0%)" : "translateX(-100%)";

    sliderTrack.offsetHeight;

    sliderTrack.style.transition = "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
    sliderTrack.style.transform = (direction === 'next') ? "translateX(-100%)" : "translateX(0%)";

    setTimeout(() => {
        renderTrackImages();
        sliderTrack.style.transition = "none";
        sliderTrack.style.transform = "translateX(0%)";
        sliderTrack.offsetHeight;
        sliderTrack.style.transition = "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
        updateGameDOM(0);
    }, 600);
}

// --- 5. LIGHTBOX SYSTEM ---
function openLightbox() {
    if (!lightbox || !lightboxImg) return;
    const activeGame = gamesData[currentGameIndex];
    lightboxImg.src = activeGame.images[currentImageIndex];
    lightbox.style.display = "flex";
}

function closeLightbox(e) {
    if (e.target === lightbox || e.target === lightboxImg) {
        lightbox.style.display = "none";
    }
}

function navigateLightbox(direction) {
    const activeGame = gamesData[currentGameIndex];
    if (direction === 'next') {
        currentImageIndex = (currentImageIndex + 1) % activeGame.images.length;
    } else if (direction === 'prev') {
        currentImageIndex = (currentImageIndex - 1 + activeGame.images.length) % activeGame.images.length;
    }
    lightboxImg.src = activeGame.images[currentImageIndex];
    updateGameDOM(currentImageIndex);
}

// --- 6. GLOBAL LISTENERS ---
nextGameBtn?.addEventListener("click", () => switchGame('next'));
prevGameBtn?.addEventListener("click", () => switchGame('prev'));

btnCover?.addEventListener("click", () => updateGameDOM(0));

imageContainer?.addEventListener("click", openLightbox);
lightbox?.addEventListener("click", closeLightbox);
lightboxPrev?.addEventListener("click", () => navigateLightbox('prev'));
lightboxNext?.addEventListener("click", () => navigateLightbox('next'));

document.addEventListener("keydown", (e) => {
    if (lightbox && lightbox.style.display === "flex") {
        if (e.key === "Escape") lightbox.style.display = "none";
        if (e.key === "ArrowRight") navigateLightbox('next');
        if (e.key === "ArrowLeft") navigateLightbox('prev');
    }
});

// --- 7. INITIALIZER ---
document.addEventListener("DOMContentLoaded", () => {
    renderTrackImages();
    updateGameDOM(0);
});