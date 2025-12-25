document.addEventListener("DOMContentLoaded", () => {
 const resultsContainer = document.getElementById("results");

let allResults = [];



async function searchSongs(term) {
  const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&limit=200`);
  const data = await response.json();

  // Store all playable tracks
  allResults = data.results.filter(track =>
    track.previewUrl && track.previewUrl.endsWith(".m4a")
  );

  fuzzySearch(term);
}

function fuzzySearch(term) {
  const fuse = new Fuse(allResults, {
    keys: ['trackName', 'artistName'],
    includeScore: true,
    shouldSort: true,
    threshold: 0.5,     // More lenient
    distance: 100,
    useExtendedSearch: true,
    ignoreLocation: true,
  });

  const results = fuse.search(term);
  const matchedTracks = results.map(result => result.item);
  displaySongs(matchedTracks.length ? matchedTracks : allResults); // fallback
}

function displaySongs(songs) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "";

  if (!songs.length) {
    resultsContainer.innerHTML = "<p>No songs found.</p>";
    return;
  }



 
  songs.forEach(track => {
    const trackElement = document.createElement("div");
    trackElement.className = "track";

    trackElement.innerHTML = `
      <img src="${track.artworkUrl100}" alt="${track.trackName}">
      <h3>${track.trackName}</h3>
      <p>${track.artistName}</p>
      <audio controls preload="none">
        <source src="${track.previewUrl}" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
      <button onclick='addToFavorites(${JSON.stringify(track)})'>☆ Add to Favorites</button>

    `;

    const audio = trackElement.querySelector("audio");
    audio.addEventListener("play", () => {
      const allAudio = document.querySelectorAll("audio");
      allAudio.forEach(other => {
        if (other !== audio) {
          other.pause();
          other.currentTime = 0;
        }
      });
    });

    resultsContainer.appendChild(trackElement);
  });
}


 // 🔍 Hook search bar in navbar
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

if (searchForm && searchInput) {
  searchForm.addEventListener("submit", e => {
    e.preventDefault();
    const term = searchInput.value.trim();
    if (term) {
      searchSongs(term); // Reuse your existing function
    }
  });
}
 window.addToFavorites = function(track) {
    const favs = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favs.find(t => t.trackId === track.trackId)) {
      favs.push(track);
      localStorage.setItem("favorites", JSON.stringify(favs));
      alert("Added to favorites!");
    } else {
      alert("Already in favorites");
    }
  };


 // Example: Search on load
 searchSongs("Bollywood");

});
