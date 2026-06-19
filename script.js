document.addEventListener('DOMContentLoaded', () => {
    const catImg = document.getElementById('cat-img');
    const caption = document.getElementById('caption');

    // Можливі стани кота: 'calm' (спокійна), 'angry' (зла), 'relaxed' (насолоджується)
    let catState = 'calm'; 
    let resetTimeout = null;

    // 1. Клік на кота (робимо її злою)
    catImg.addEventListener('click', () => {
        if (catState === 'calm') {
            catState = 'angry';
            catImg.src = 'Cat_Photos/Angry_Cat.jpg';
            caption.textContent = 'Что ты наделала? Теперь надо быстро ее погладить';
        }
    });

    // 2. Рух мишкою по коту (гладимо її, коли вона зла)
    catImg.addEventListener('mousemove', () => {
        if (catState === 'angry') {
            catState = 'relaxed';
            catImg.src = 'Cat_Photos/Relaxed_Cat.jpg';
            caption.textContent = 'Ммм, вот так хорошо... 🥰';

            // Очищаємо попередній таймер, якщо він раптом був
            if (resetTimeout) clearTimeout(resetTimeout);

            // 3. Через 3 секунди повертаємо все назад до звичайного фото
            resetTimeout = setTimeout(() => {
                catState = 'calm';
                catImg.src = 'Cat_Photos/Cat.jpg';
                caption.textContent = 'Нажми на нее!';
            }, 3000); // 3000 мілісекунд = 3 секунди
        }
    });
});