window.addEventListener("scroll", function() {
    let header = document.querySelector('#header');
    header.classList.toggle('rolagem', window.scrollY > 0);
});
document.addEventListener('DOMContentLoaded', function() {
    const audioPlayer = document.getElementById('audio-player');
    const bookIcon = document.getElementById('book-icon');
    const volumeIcon = document.getElementById('volume-icon');
    const soundWaves = document.querySelectorAll('.sound-wave');
    let audioContext, analyser, dataArray;

    const playlist = [
        './audio/Love Yourself.mp3',
        './audio/Como Tudo Deve Ser.mp3',
        './audio/Just the Way You Are.mp3',
        './audio/Seu Astral.mp3',
        './audio/Gods Plan.mp3',
        './audio/Os Anjos Cantam.mp3'
    ];

    let currentTrack = parseInt(localStorage.getItem('currentTrack')) || 0;
    let currentTime = parseFloat(localStorage.getItem('currentTime')) || 0;
    let isPlaying = localStorage.getItem('isPlaying') === 'true';

    // Funções para áudio e ondas sonoras
    function setupAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 32;
            const source = audioContext.createMediaElementSource(audioPlayer);
            source.connect(analyser);
            analyser.connect(audioContext.destination);

            dataArray = new Uint8Array(analyser.frequencyBinCount);
        }
    }

    function playTrack(index) {
        setupAudioContext();
        currentTrack = index;
        localStorage.setItem('currentTrack', currentTrack);
        audioPlayer.src = playlist[currentTrack];
        audioPlayer.currentTime = currentTime;
        audioPlayer.play().catch(function(error) {
            console.log('Erro ao tentar tocar áudio: ', error);
        });
        localStorage.setItem('isPlaying', 'true');
        animateWaves();
        showSoundWaves();
    }

    function animateWaves() {
        if (!audioContext || audioPlayer.paused) return;

        requestAnimationFrame(animateWaves);
        analyser.getByteFrequencyData(dataArray);

        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;

        soundWaves.forEach((wave) => {
            const scale = average / 100;
            wave.style.transform = `scaleY(${1 + scale})`;
        });
    }

    function showSoundWaves() {
        soundWaves.forEach(function(wave) {
            wave.style.display = 'inline-block';
        });
    }

    function hideSoundWaves() {
        soundWaves.forEach(function(wave) {
            wave.style.display = 'none';
        });
    }

    // Evento para salvar o tempo da música
    audioPlayer.addEventListener('timeupdate', function() {
        localStorage.setItem('currentTime', audioPlayer.currentTime);
    });

    // Função para exibir o pop-up
    function showContinuePopup() {
        const continuePopup = document.getElementById('continue-popup');
        continuePopup.style.display = 'flex';
    }

    function hideContinuePopup() {
        const continuePopup = document.getElementById('continue-popup');
        continuePopup.style.display = 'none';
    }

    // Exibir o pop-up ao carregar a página
    window.addEventListener('load', function() {
        if (isPlaying) {
            showContinuePopup();
        }
    });

    // Botão "Sim" no pop-up de continuar música
    document.getElementById('continue-yes-btn').addEventListener('click', function() {
        hideContinuePopup();
        playTrack(currentTrack);
        volumeIcon.classList.add('show');
        showSoundWaves();
    });

    // Botão "Não" no pop-up de continuar música
    document.getElementById('continue-no-btn').addEventListener('click', function() {
        hideContinuePopup();
        audioPlayer.pause();
        volumeIcon.classList.remove('show');
        hideSoundWaves();
        localStorage.setItem('isPlaying', 'false');
    });

    // Controle manual de tocar/pausar música
    bookIcon.addEventListener('click', function(event) {
        event.preventDefault();
        if (audioPlayer.paused) {
            playTrack(currentTrack);
            volumeIcon.classList.add('show');
            showSoundWaves();
        } else {
            audioPlayer.pause();
            volumeIcon.classList.remove('show');
            hideSoundWaves();
            localStorage.setItem('isPlaying', 'false');
        }
    });

    // Continuar música automaticamente, caso o usuário já tenha escolhido "Sim"
    if (isPlaying) {
        playTrack(currentTrack);
        volumeIcon.classList.add('show');
        showSoundWaves();
    }
});
