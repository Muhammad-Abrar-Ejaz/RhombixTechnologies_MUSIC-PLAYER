// Enhanced Music Player with Smooth Animations
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const coverImage = document.getElementById('coverImage');
const nowTitle = document.getElementById('nowTitle');
const nowCategory = document.getElementById('nowCategory');
const searchBar = document.getElementById('searchBar');
const categorySelect = document.getElementById('categorySelect');
const overviewList = document.getElementById('overviewList');
const searchResults = document.getElementById('searchResults');
const categoryList = document.getElementById('categoryList');
const volumeSlider = document.getElementById('volumeSlider');
const volumePercent = document.getElementById('volumePercent');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');

const loadingOverlay = document.getElementById('loadingOverlay');
const toastContainer = document.getElementById('toastContainer');

const navButtons = document.querySelectorAll('.nav-btn');
const mainSections = document.querySelectorAll('.main-section');

let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let isInitialized = false;

// Liked songs and playlists management
let likedSongs = JSON.parse(localStorage.getItem('beatifyLikedSongs')) || [];
let playlists = JSON.parse(localStorage.getItem('beatifyPlaylists')) || [
  {
    id: 'default',
    name: 'My Favorites',
    description: 'Your favorite tracks',
    songs: [],
    createdAt: new Date().toISOString()
  }
];

// Enhanced song data with more details
const songs = [
 
  { 
    title: 'GIMME A HUG', 
    src: './assets/songs/GIMME A HUG.mp3', 
    category: 'hiphop', 
    cover: './assets/covers/GIMME A HUG.jpeg',
    artist: 'Drake',
    duration: '3:13'
  },

  { 
    title: 'Gods Plan', 
    src: './assets/songs/Gods Plan.mp3', 
    category: 'hiphop', 
    cover: './assets/covers/Gods Plan.jpeg',
    artist: 'Drake',
    duration: '3:19'
  },

  { 
    title: 'WHAT DID I MISS', 
    src: './assets/songs/WHAT DID I MISS.mp3', 
    category: 'hiphop', 
    cover: './assets/covers/WHAT DID I MISS.jpeg',
    artist: 'Drake',
    duration: '4:03'
  },

  { 
    title: 'Departure Lane', 
    src: 'assets/songs/Departure Lane.mp3', 
    category: 'desi', 
    cover: 'assets/covers/Departure Lane.jpeg',
    artist: 'Talha Anjum',
    duration: '4:18'
  },
  { 
    title: 'GUMAAN', 
    src: 'assets/songs/GUMAAN.mp3', 
    category: 'desi', 
    cover: 'assets/covers/GUMAAN.jpeg',
    artist: 'Talha Anjum',
    duration: '3:45'
  },
  { 
    title: 'Open Letter', 
    src: 'assets/songs/Open Letter.mp3', 
    category: 'desi', 
    cover: 'assets/covers/Open Letter.jpeg',
    artist: 'Talha Anjum',
    duration: '4:02'
  },
  { 
    title: 'Sahiba', 
    src: 'assets/songs/Sahiba.mp3', 
    category: 'lofi', 
    cover: 'assets/covers/Sahiba.jpeg',
    artist: 'Aditya',
    duration: '4:28'
  },
  { 
    title: 'Saiyaara', 
    src: 'assets/songs/Saiyaara.mp3', 
    category: 'lofi', 
    cover: 'assets/covers/Saiyaara.jpeg',
    artist: 'Faheem Abdullah ',
    duration: '5:42'
  },
  { 
    title: 'Tujhe Main Pyar Karoon', 
    src: 'assets/songs/Tujhe Main Pyar Karoon.mp3', 
    category: 'lofi', 
    cover: 'assets/covers/Tujhe Main Pyar Karoon.jpeg',
    artist: ' Hindi Lo-Fi',
    duration: '3:18'
  },
  { 
    title: 'Ik Baat Kahun Kya Ijazat Hai', 
    src: 'assets/songs/Ik Baat Kahun Kya Ijazat Hai.mp3', 
    category: 'romantic', 
    cover: 'assets/covers/Ik Baat Kahun Kya Ijazat Hai.jpeg',
    artist: 'Arijit Singh',
    duration: '4:15'
  },
  { 
    title: 'Kabhi Jo Badal Barse', 
    src: 'assets/songs/Kabhi Jo Badal Barse.mp3', 
    category: 'romantic', 
    cover: 'assets/covers/Kabhi Jo Badal Barse.jpeg',
    artist: 'Arijit Singh',
    duration: '3:56'
  },
  { 
    title: 'Phir Bhi Tumko Chaahunga', 
    src: 'assets/songs/Phir Bhi Tumko Chaahunga.mp3', 
    category: 'romantic', 
    cover: 'assets/covers/Phir Bhi Tumko Chaahunga.jpeg',
    artist: 'Arijit Singh',
    duration: '4:28'
  },
  
];

// Toast notification system
function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)';
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
}

// Enhanced loading animation
function showLoadingState(element) {
  element.classList.add('loading');
  element.style.pointerEvents = 'none';
}

function hideLoadingState(element) {
  element.classList.remove('loading');
  element.style.pointerEvents = 'auto';
}

function showLoadingOverlay() {
  loadingOverlay.classList.add('show');
}

function hideLoadingOverlay() {
  loadingOverlay.classList.remove('show');
}

// Enhanced song list loading with staggered animations
function loadSongList(targetElement, filteredSongs) {
  targetElement.innerHTML = '';
  
  if (filteredSongs.length === 0) {
    targetElement.innerHTML = `
      <li style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🎵</div>
        <h3>No songs found</h3>
        <p>Try adjusting your search or category filter</p>
      </li>
    `;
    return;
  }

  filteredSongs.forEach((song, index) => {
    const li = document.createElement('li');
    li.style.animationDelay = `${index * 0.1}s`;
    
    const isLiked = likedSongs.includes(song.title);
    const likeIcon = isLiked ? '❤️' : '🤍';
    
    li.innerHTML = `
      <div class="song-card">
        <div class="song-image-container">
          <img src="${song.cover}" alt="${song.title}" loading="lazy" />
          <div class="song-overlay">
            <button class="play-overlay-btn">▶</button>
          </div>
        </div>
        <div class="song-info">
          <h4>${song.title}</h4>
          <p class="song-artist">${song.artist}</p>
          <p class="song-category">${song.category}</p>
          <span class="song-duration">${song.duration}</span>
          <button class="like-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike('${song.title}')" title="Like/Unlike">
            <span class="like-icon">${likeIcon}</span>
          </button>
        </div>
      </div>
    `;
    
    // Add click event with ripple effect
    li.addEventListener('click', (e) => {
      if (!e.target.closest('.like-btn')) {
        createRippleEffect(e);
        currentSongIndex = songs.indexOf(song);
        playSong();
      }
    });
    
    targetElement.appendChild(li);
  });
}

// Like/Unlike functionality
function toggleLike(songTitle) {
  const likeBtn = event.target.closest('.like-btn');
  const likeIcon = likeBtn.querySelector('.like-icon');
  
  if (likedSongs.includes(songTitle)) {
    // Unlike
    likedSongs = likedSongs.filter(title => title !== songTitle);
    likeIcon.textContent = '🤍';
    likeBtn.classList.remove('liked');
    showToast(`Removed from liked songs`, 'info');
  } else {
    // Like
    likedSongs.push(songTitle);
    likeIcon.textContent = '❤️';
    likeBtn.classList.add('liked');
    showToast(`Added to liked songs`, 'success');
  }
  
  // Save to localStorage
  localStorage.setItem('beatifyLikedSongs', JSON.stringify(likedSongs));
  
  // Update liked songs count
  updateLikedCount();
  
  // Update liked songs list if on library tab
  if (document.getElementById('likedList') && document.getElementById('likedList').classList.contains('active')) {
    loadLikedSongs();
  }
}

// Ripple effect for click interactions
function createRippleEffect(event) {
  const button = event.currentTarget;
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.classList.add('ripple');
  
  button.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Enhanced play song function
function playSong() {
  const song = songs[currentSongIndex];
  
  // Debug: Check if song exists
  console.log('🎵 Attempting to play:', song);
  console.log('🎵 Song path:', song.src);
  console.log('🎵 Cover path:', song.cover);
  
  // Add loading state
  showLoadingState(playPauseBtn);
  
  // Smooth transition for cover image
  coverImage.style.opacity = '0';
  coverImage.style.transform = 'scale(0.8)';
  
  setTimeout(() => {
    // Check if audio file exists
    const audio = new Audio();
    audio.addEventListener('error', (e) => {
      console.error('❌ Audio file error:', e);
      showToast(`Error loading song: ${song.title}`, 'error');
      hideLoadingState(playPauseBtn);
    });
    
    audio.addEventListener('canplay', () => {
      console.log('✅ Audio file loaded successfully');
      audioPlayer.src = song.src;
      audioPlayer.play();
      isPlaying = true;
      playPauseBtn.textContent = '⏸';
      
      // Update song info with animation
      nowTitle.style.opacity = '0';
      nowTitle.style.transform = 'translateY(10px)';
      
      setTimeout(() => {
        nowTitle.textContent = song.title;
        nowTitle.style.opacity = '1';
        nowTitle.style.transform = 'translateY(0)';
      }, 150);
      
      nowCategory.textContent = song.category;
      coverImage.src = song.cover;
      
      // Show cover image with animation
      setTimeout(() => {
        coverImage.style.opacity = '1';
        coverImage.style.transform = 'scale(1)';
      }, 200);
      
      hideLoadingState(playPauseBtn);
      
      // Add visual feedback
      playPauseBtn.classList.add('playing');
      setTimeout(() => playPauseBtn.classList.remove('playing'), 300);
      
      // Show success toast
      showToast(`Now playing: ${song.title}`, 'success');
    });
    
    // Start loading audio
    audio.src = song.src;
    
  }, 100);
}

// Enhanced play/pause toggle
function togglePlayPause() {
  if (isPlaying) {
    audioPlayer.pause();
    isPlaying = false;
    playPauseBtn.textContent = '▶';
    playPauseBtn.classList.remove('playing');
    showToast('Music paused', 'info');
  } else {
    audioPlayer.play();
    isPlaying = true;
    playPauseBtn.textContent = '⏸';
    playPauseBtn.classList.add('playing');
    showToast('Music resumed', 'success');
  }
}

// Enhanced next/previous with smooth transitions
function nextSong() {
  if (isShuffle) {
    currentSongIndex = Math.floor(Math.random() * songs.length);
  } else {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
  }
  
  // Add transition effect
  document.querySelector('.floating-player').style.transform = 'translateX(20px)';
  setTimeout(() => {
    playSong();
    document.querySelector('.floating-player').style.transform = 'translateX(0)';
  }, 150);
}

function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  
  // Add transition effect
  document.querySelector('.floating-player').style.transform = 'translateX(-20px)';
  setTimeout(() => {
    playSong();
    document.querySelector('.floating-player').style.transform = 'translateX(0)';
  }, 150);
}

// Enhanced shuffle and repeat with visual feedback
function toggleShuffle() {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
  
  // Add animation
  if (isShuffle) {
    shuffleBtn.style.transform = 'rotate(180deg) scale(1.1)';
    setTimeout(() => {
      shuffleBtn.style.transform = 'rotate(180deg) scale(1)';
    }, 200);
    showToast('Shuffle mode enabled', 'success');
  } else {
    shuffleBtn.style.transform = 'rotate(0deg) scale(1.1)';
    setTimeout(() => {
      shuffleBtn.style.transform = 'rotate(0deg) scale(1)';
    }, 200);
    showToast('Shuffle mode disabled', 'info');
  }
}

function toggleRepeat() {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("active", isRepeat);
  
  // Add animation
  if (isRepeat) {
    repeatBtn.style.transform = 'scale(1.1)';
    setTimeout(() => {
      repeatBtn.style.transform = 'scale(1)';
    }, 200);
    showToast('Repeat mode enabled', 'success');
  } else {
    repeatBtn.style.transform = 'scale(1)';
    showToast('Repeat mode disabled', 'info');
  }
}

// Enhanced volume control
function setVolume(value) {
  audioPlayer.volume = value;
  volumePercent.textContent = Math.round(value * 100) + '%';
  
  // Update volume fill
  const volumeFill = document.querySelector('.volume-fill');
  if (volumeFill) {
    volumeFill.style.width = `${value * 100}%`;
  }
  
  // Add visual feedback
  volumeSlider.style.transform = 'scale(1.05)';
  setTimeout(() => {
    volumeSlider.style.transform = 'scale(1)';
  }, 150);
}

// Enhanced time formatting
function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}

// Enhanced progress bar with smooth updates
audioPlayer.addEventListener('timeupdate', () => {
  if (!isNaN(audioPlayer.duration)) {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    
    // Update progress bar
    progressBar.value = Math.floor(audioPlayer.currentTime);
    progressBar.max = Math.floor(audioPlayer.duration);
    
    // Update progress fill
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
    
    // Update mini progress bar
    const miniProgressFill = document.querySelector('.mini-progress-fill');
    if (miniProgressFill) {
      miniProgressFill.style.width = `${progress}%`;
    }
    
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
  }
});

audioPlayer.addEventListener('loadedmetadata', () => {
  progressBar.max = Math.floor(audioPlayer.duration);
  durationEl.textContent = formatTime(audioPlayer.duration);
});

// Enhanced progress bar interaction
progressBar.addEventListener('input', () => {
  audioPlayer.currentTime = progressBar.value;
});

progressBar.addEventListener('mousedown', () => {
  progressBar.style.transform = 'scale(1.05)';
});

progressBar.addEventListener('mouseup', () => {
  progressBar.style.transform = 'scale(1)';
});

// Enhanced audio end handling
audioPlayer.addEventListener('ended', () => {
  if (isRepeat) {
    playSong();
  } else {
    nextSong();
  }
});

// Enhanced navigation with smooth transitions
navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all buttons
    navButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const targetId = btn.dataset.target;
    
    // Hide all sections with fade out
    mainSections.forEach(section => {
      if (section.classList.contains('active')) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(-20px)';
        setTimeout(() => {
          section.classList.remove('active');
        }, 200);
      }
    });

    // Show target section with fade in
    setTimeout(() => {
      mainSections.forEach(section => {
        if (section.id === targetId) {
          section.classList.add('active');
          section.style.opacity = '1';
          section.style.transform = 'translateY(0)';
        }
      });

      // Load appropriate content
      if (targetId === 'overview') {
        loadSongList(overviewList, songs);
      } else if (targetId === 'library') {
        loadLibraryContent();
      } else if (targetId === 'search') {
        searchBar.value = '';
        loadSongList(searchResults, songs);
      } else if (targetId === 'categories') {
        categorySelect.value = 'all';
        loadSongList(categoryList, songs);
      }
    }, 200);
  });
});

// Library tab functionality
function loadLibraryContent() {
  loadLikedSongs();
  loadPlaylists();
  updateLikedCount();
  updatePlaylistsCount();
}

// Load liked songs
function loadLikedSongs() {
  const likedList = document.getElementById('likedList');
  if (!likedList) return;
  
  const likedSongsList = songs.filter(song => likedSongs.includes(song.title));
  
  if (likedSongsList.length === 0) {
    likedList.innerHTML = `
      <li style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">
        <div style="font-size: 3rem; margin-bottom: 1rem;">❤️</div>
        <h3>No liked songs yet</h3>
        <p>Like some songs to see them here</p>
      </li>
    `;
  } else {
    loadSongList(likedList, likedSongsList);
  }
}

// Load playlists
function loadPlaylists() {
  const playlistsContainer = document.getElementById('playlistsContainer');
  if (!playlistsContainer) return;
  
  if (playlists.length === 0) {
    playlistsContainer.innerHTML = `
      <div class="empty-playlists">
        <div style="font-size: 3rem; margin-bottom: 1rem;">📚</div>
        <h3>No playlists yet</h3>
        <p>Create your first playlist to get started</p>
      </div>
    `;
  } else {
    playlistsContainer.innerHTML = '';
    playlists.forEach(playlist => {
      const playlistCard = createPlaylistCard(playlist);
      playlistsContainer.appendChild(playlistCard);
    });
  }
}

// Create playlist card
function createPlaylistCard(playlist) {
  const card = document.createElement('div');
  card.className = 'playlist-card';
  card.innerHTML = `
    <div class="playlist-header">
      <h4>${playlist.name}</h4>
      <div class="playlist-actions">
        <button class="playlist-btn play-btn" onclick="playPlaylist('${playlist.id}')" title="Play Playlist">▶</button>
        <button class="playlist-btn edit-btn" onclick="editPlaylist('${playlist.id}')" title="Edit Playlist">✏️</button>
        <button class="playlist-btn delete-btn" onclick="deletePlaylist('${playlist.id}')" title="Delete Playlist">🗑️</button>
      </div>
    </div>
    <p class="playlist-description">${playlist.description}</p>
    <div class="playlist-info">
      <span class="playlist-songs-count">${playlist.songs.length} songs</span>
      <span class="playlist-date">${new Date(playlist.createdAt).toLocaleDateString()}</span>
    </div>
  `;
  return card;
}

// Create new playlist
function createNewPlaylist() {
  const name = prompt('Enter playlist name:');
  if (name && name.trim()) {
    const newPlaylist = {
      id: 'playlist_' + Date.now(),
      name: name.trim(),
      description: 'Your custom playlist',
      songs: [],
      createdAt: new Date().toISOString()
    };
    
    playlists.push(newPlaylist);
    localStorage.setItem('beatifyPlaylists', JSON.stringify(playlists));
    loadPlaylists();
    updatePlaylistsCount();
    showToast(`Playlist "${name}" created successfully!`, 'success');
  }
}

// Edit playlist
function editPlaylist(playlistId) {
  const playlist = playlists.find(p => p.id === playlistId);
  if (playlist) {
    const newName = prompt('Enter new playlist name:', playlist.name);
    if (newName && newName.trim()) {
      playlist.name = newName.trim();
      localStorage.setItem('beatifyPlaylists', JSON.stringify(playlists));
      loadPlaylists();
      showToast(`Playlist renamed to "${newName}"`, 'success');
    }
  }
}

// Delete playlist
function deletePlaylist(playlistId) {
  const playlist = playlists.find(p => p.id === playlistId);
  if (playlist && confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
    playlists = playlists.filter(p => p.id !== playlistId);
    localStorage.setItem('beatifyPlaylists', JSON.stringify(playlists));
    loadPlaylists();
    updatePlaylistsCount();
    showToast(`Playlist "${playlist.name}" deleted`, 'info');
  }
}

// Play playlist
function playPlaylist(playlistId) {
  const playlist = playlists.find(p => p.id === playlistId);
  if (playlist && playlist.songs.length > 0) {
    // Find first song in playlist
    const firstSong = songs.find(song => song.title === playlist.songs[0]);
    if (firstSong) {
      currentSongIndex = songs.indexOf(firstSong);
      playSong();
      showToast(`Playing playlist: ${playlist.name}`, 'success');
    }
  } else {
    showToast('This playlist is empty', 'info');
  }
}

// Update counts
function updateLikedCount() {
  const likedCount = document.querySelector('.liked-count');
  if (likedCount) {
    likedCount.textContent = `${likedSongs.length} songs`;
  }
}

function updatePlaylistsCount() {
  const playlistsCount = document.querySelector('.playlists-count');
  if (playlistsCount) {
    playlistsCount.textContent = `${playlists.length} playlists`;
  }
}

// Enhanced search with debouncing
let searchTimeout;
if (searchBar) {
  searchBar.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const query = searchBar.value.toLowerCase();
      const filtered = songs.filter(song => 
        song.title.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query) ||
        song.category.toLowerCase().includes(query)
      );
      loadSongList(searchResults, filtered);
    }, 300);
  });
}

// Enhanced category filtering
if (categorySelect) {
  categorySelect.addEventListener('change', () => {
    const category = categorySelect.value;
    const filtered = category === 'all' ? songs : songs.filter(song => song.category === category);
    loadSongList(categoryList, filtered);
  });
}

// Enhanced visualizer
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
let audioCtx, analyser, source, dataArray, bufferLength;

function initVisualizer() {
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    source = audioCtx.createMediaElementSource(audioPlayer);

    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    analyser.fftSize = 256;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    drawVisualizer();
  } catch (error) {
    console.log('Visualizer not supported in this browser');
  }
}

function drawVisualizer() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const width = canvas.width;
  const height = canvas.height;

  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, width, height);

    const barWidth = (width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * height * 0.6;
      const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
      gradient.addColorStop(0, 'rgba(139, 92, 246, 0.8)');
      gradient.addColorStop(1, 'rgba(236, 72, 153, 0.4)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);
      
      // Add glow effect
      ctx.shadowColor = 'rgba(139, 92, 246, 0.5)';
      ctx.shadowBlur = 10;
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);
      ctx.shadowBlur = 0;
      
      x += barWidth + 1;
    }
  }
  draw();
}

// Initialize visualizer when audio starts playing
audioPlayer.addEventListener('play', () => {
  if (!audioCtx) initVisualizer();
});

// Enhanced window resize handling
window.addEventListener('resize', () => {
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});

// Initialize the app
function initApp() {
  // Show loading overlay initially
  showLoadingOverlay();
  
  // Load initial content
  loadSongList(overviewList, songs);
  setVolume(1);
  volumeSlider.value = 1;
  
  // Initialize library tabs
  initLibraryTabs();
  
  // Hide loading overlay after a short delay
  setTimeout(() => {
    hideLoadingOverlay();
    
    // Add initial animation
    document.body.style.opacity = '0';
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.8s ease';
      document.body.style.opacity = '1';
    }, 100);
  }, 1000);
  
  // Show welcome toast
  setTimeout(() => {
    showToast('Welcome to Beatify! 🎵', 'success', 4000);
  }, 1500);
}

// Initialize library tabs
function initLibraryTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;
      
      // Remove active class from all tabs
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab
      btn.classList.add('active');
      const targetTabElement = document.getElementById(`${targetTab}-tab`);
      if (targetTabElement) {
        targetTabElement.classList.add('active');
      }
      
      // Load appropriate content
      if (targetTab === 'liked') {
        loadLikedSongs();
        updateLikedCount();
      } else if (targetTab === 'playlists') {
        loadPlaylists();
        updatePlaylistsCount();
      }
    });
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

