document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("favorites");
  let currentAudio = null; // Track the currently playing audio

  function loadFavorites() {
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    container.innerHTML = "";

    if (favs.length === 0) {
      container.innerHTML = "<p>No favourites yet. Add some on the Home page!</p>";
      return;
    }

    favs.forEach(track => {
      const id = encodeURIComponent(track.trackName + "|" + track.artistName);
      const card = document.createElement("div");
      card.className = "track";
      card.innerHTML = `
        <img src="${track.artworkUrl100}" alt="${track.trackName}">
        <h3>${track.trackName}</h3>
        <p>${track.artistName}</p>
        <audio id="audio-${id}" src="${track.previewUrl}" controls></audio>
        <button class="fav-btn" onclick="removeFavorite(${track.trackId})">★ Remove Favorite</button>
      `;

      // 🔁 Auto-stop previous audio
      const audio = card.querySelector("audio");
      audio.addEventListener("play", () => {
        if (currentAudio && currentAudio !== audio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
        currentAudio = audio;
      });

      container.appendChild(card);
    });
  }

  // Remove from favorites
  window.removeFavorite = function(trackId) {
    let favs = JSON.parse(localStorage.getItem("favorites")) || [];
    favs = favs.filter(t => t.trackId !== trackId);
    localStorage.setItem("favorites", JSON.stringify(favs));
    loadFavorites();
  };

  // Optional: custom audio controls (used if called externally)
  window.playAudio = function(id) {
    document.querySelectorAll("audio").forEach(a => a.pause());
    const a = document.getElementById(`audio-${id}`);
    if (a) a.play();
    currentAudio = a;
  };
  window.pauseAudio = function(id) {
    const a = document.getElementById(`audio-${id}`);
    if (a) a.pause();
  };
  window.stopAudio = function(id) {
    const a = document.getElementById(`audio-${id}`);
    if (a) { a.pause(); a.currentTime = 0; }
  };
  window.changeSpeed = function(id, speed) {
    const a = document.getElementById(`audio-${id}`);
    if (a) a.playbackRate = speed;
  };

  loadFavorites();
});
