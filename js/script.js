window.addEventListener("scroll", function() {
    let header = document.querySelector('#header');
    header.classList.toggle('rolagem', window.scrollY > 0);
});

document.addEventListener('DOMContentLoaded', function() {
    const audioPlayer = document.getElementById('audio-player');
    const bookIcon = document.getElementById('book-icon');
    const volumeIcon = document.getElementById('volume-icon');

    const playlist = [
        './audio/Love Yourself.mp3',
        './audio/Como Tudo Deve Ser.mp3',
        './audio/Just the Way You Are.mp3',
        './audio/Seu Astral.mp3',
        './audio/Gods Plan.mp3',
        './audio/Os Anjos Cantam.mp3'
    ];

    let currentTrack = parseInt(sessionStorage.getItem('currentTrack')) || 0;
    let currentTime = parseFloat(sessionStorage.getItem('currentTime')) || 0;
    let isPlaying = sessionStorage.getItem('isPlaying') === 'true';

    function playTrack(index) {
        if (index < 0 || index >= playlist.length) return; // Verifica se o índice está dentro do intervalo da playlist
        currentTrack = index;
        sessionStorage.setItem('currentTrack', currentTrack);
        audioPlayer.src = playlist[currentTrack];
        audioPlayer.load(); // Carrega a nova faixa

        audioPlayer.addEventListener('canplay', function() {
            if (currentTrack === index) { // Verifica se ainda estamos na faixa correta
                audioPlayer.currentTime = (currentTrack === parseInt(sessionStorage.getItem('currentTrack'))) ? currentTime : 0;
                audioPlayer.play().then(() => {
                    sessionStorage.setItem('isPlaying', 'true');
                    volumeIcon.classList.add('show');
                }).catch(error => {
                    console.error("Erro ao reproduzir a música:", error);
                });
            }
        }, { once: true }); // Adiciona a escuta apenas uma vez para evitar múltiplas chamadas
    }

    function showPopup() {
        const popup = document.getElementById('popup');
        popup.style.display = 'flex';
    }

    function hidePopup() {
        const popup = document.getElementById('popup');
        popup.style.display = 'none';
    }

    audioPlayer.addEventListener('ended', function() {
        currentTrack = (currentTrack + 1) % playlist.length; // Avança para a próxima faixa
        sessionStorage.setItem('currentTrack', currentTrack);
        playTrack(currentTrack);
    });

    audioPlayer.addEventListener('timeupdate', function() {
        sessionStorage.setItem('currentTime', audioPlayer.currentTime);
    });

    document.getElementById('yes-btn').addEventListener('click', function() {
        hidePopup();
        sessionStorage.setItem('popupShown', 'true');
        playTrack(currentTrack);
    });

    document.getElementById('no-btn').addEventListener('click', function() {
        hidePopup();
        sessionStorage.setItem('popupShown', 'true');
    });

    bookIcon.addEventListener('click', function(event) {
        event.preventDefault();
        if (audioPlayer.paused) {
            playTrack(currentTrack);
        } else {
            audioPlayer.pause();
            volumeIcon.classList.remove('show');
            sessionStorage.setItem('isPlaying', 'false');
        }
    });

    const popupShown = sessionStorage.getItem('popupShown');

    if (!popupShown) {
        showPopup();
    } else {
        hidePopup();
    }

    if (isPlaying) {
        playTrack(currentTrack);
        volumeIcon.classList.add('show');
    }
});
