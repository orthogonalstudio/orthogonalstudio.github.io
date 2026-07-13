
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

        const btnTrailer = document.getElementById("btn-trailer");
        const btnSteam = document.getElementById("btn-steam");

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

            const offset = targetActiveIndex * 100;
            sliderTrack.style.transform = `translateX(-${offset}%)`;

            buildImageNavigation();
            updateButtonStates();

            // Butonlar her zaman disabled ve href'siz olacak şekilde sabitlendi
            if (btnTrailer) {
                btnTrailer.removeAttribute("href");
                btnTrailer.classList.add("disabled");
            }

            if (btnSteam) {
                btnSteam.removeAttribute("href");
                btnSteam.classList.add("disabled");
            }
        }

        function buildImageNavigation() {
            if (!dynamicImageNav) return;
            dynamicImageNav.innerHTML = "";

            const activeGame = gamesData[currentGameIndex];
            const totalButtonsToShow = Math.max(activeGame.images.length, 7); // En az 7 buton (c + 1..6) üretir

            for (let imgIdx = 0; imgIdx < totalButtonsToShow; imgIdx++) {
                const btn = document.createElement("button");
                btn.classList.add("presentation-btn", "btn-nav-spec");

                btn.textContent = (imgIdx === 0) ? "C" : imgIdx;

                if (imgIdx < activeGame.images.length) {
                    if (imgIdx === currentImageIndex) {
                        btn.classList.add("active");
                    }
                    
                    // Sadece 0. index (ilk görsel) aktif kalsın, diğerleri disable yapılsın
                    if (imgIdx === 0) {
                        btn.addEventListener("click", () => {
                            currentImageIndex = imgIdx;
                            updateGameDOM(currentImageIndex);
                        });
                    } else {
                        btn.classList.add("disabled");
                    }
                } else {
                    btn.classList.add("disabled"); // İmaj olmayan sayfaları pasif kilitli yap
                }

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

            const previousGameIndex = currentGameIndex;
            const previousImageIndex = currentImageIndex;

            if (direction === 'next') currentGameIndex++;
            else currentGameIndex--;

            currentImageIndex = 0;
            updateGameDOM(0);

            const oldImg = gamesData[previousGameIndex].images[previousImageIndex];
            const newImg = gamesData[currentGameIndex].images[currentImageIndex];
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
