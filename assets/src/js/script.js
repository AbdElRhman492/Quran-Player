let audio = document.querySelector(".quranPlayer"),
  surasContainer = document.querySelector(".suras"),
  ayah = document.querySelector(".ayah"),
  next = document.querySelector(".next"),
  prev = document.querySelector(".prev"),
  play = document.querySelector(".play");
getSuras();

function getSuras() {
  // Fetch The Surah Data
  fetch("https://quran-endpoint.vercel.app/quran")
    .then((response) => response.json())
    .then((data) => {
      // Make Div For Each Surah In api
      for (surah in data.data) {
        surasContainer.innerHTML += `
          <div>
            <p>${data.data[surah].asma.ar.long}</p>
            <p>${data.data[surah].asma.en.long}</p>
          </div>
        `;
      }
      // Select All Suras
      let allSuras = document.querySelectorAll(".suras div"),
        ayahsAudios,
        ayahsText;
      allSuras.forEach((surah, index) => {
        surah.addEventListener("click", () => {
          fetch(`https://quran-endpoint.vercel.app/quran/${index + 1}`)
            .then((response) => response.json())
            .then((data) => {
              // Fetch Surah Text and Audio's SRC
              let verses = data.data.ayahs;
              ayahsAudios = [];
              ayahsText = [];
              verses.forEach((verse) => {
                ayahsAudios.push(verse.audio.url);
                ayahsText.push(verse.text.ar);
              });
              let ayahIndex = 0;
              changeAyah(ayahIndex);
              audio.addEventListener("ended", () => {
                ayahIndex++;
                if (ayahIndex < ayahsAudios.length) {
                  changeAyah(ayahIndex);
                } else {
                  ayahIndex = 0;
                  changeAyah(ayahIndex);
                  audio.pause();
                  // Sweet Alert
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Surah has been ended",
                    showConfirmButton: true,
                    timer: 3000,
                  });
                  isPlaying = true;
                  togglePlay();
                }
              });
              // Handle Next And Prev
              next.addEventListener("click", () => {
                ayahIndex++;
                if (ayahIndex < ayahsAudios.length) {
                  changeAyah(ayahIndex);
                } else {
                  ayahIndex = 0;
                  changeAyah(ayahIndex);
                }
              });
              prev.addEventListener("click", () => {
                ayahIndex--;
                if (ayahIndex < 0) {
                  ayahIndex = 0;
                  changeAyah(ayahIndex);
                } else {
                  changeAyah(ayahIndex);
                }
              });
              // Handle Play and Pause Button
              let isPlaying = false;
              togglePlay();
              function togglePlay() {
                if (isPlaying) {
                  audio.pause();
                  play.innerHTML = `<i class='fas fa-play'></i>`;
                  isPlaying = false;
                } else {
                  audio.play();
                  play.innerHTML = `<i class='fas fa-pause'></i>`;
                  isPlaying = true;
                }
              }
              play.addEventListener("click", togglePlay);
              // Change Ayah Text And Audio's SRC
              function changeAyah(index) {
                audio.src = ayahsAudios[index];
                ayah.innerHTML = ayahsText[index];
              }
            });
        });
      });
    });
}

var loader = document.getElementById("preloader");
window.addEventListener("load", () => {
  loader.style.display = "none";
});
