document.addEventListener('DOMContentLoaded', () => {
    const catImg = document.getElementById('cat-img');
    const caption = document.getElementById('caption');

    let catState = 'calm'; 
    let resetTimeout = null;
    let isPetting = false; // Прапорець: true, коли мишка затиснута або палець на екрані

    // 1. Перший клік/тап — котик злиться
    catImg.addEventListener('click', () => {
        if (catState === 'calm') {
            catState = 'angry';
            catImg.src = 'Cat_Photos/Angry_Cat.png';
            caption.textContent = 'Что ты наделала? Теперь надо быстро ее погладить';
        }
    });

    // 2. Початок гладження: коли затиснули кнопку миші або торкнулися екрану телефона
    catImg.addEventListener('pointerdown', (e) => {
        if (catState === 'angry') {
            isPetting = true;
            // Захоплюємо поінтер, щоб подія руху зчитувалася, навіть якщо вийти за межі картинки
            catImg.setPointerCapture(e.pointerId); 
        }
    });

    // 3. Сам процес гладження: рух відбувається ТІЛЬКИ якщо затиснуто (isPetting === true)
    catImg.addEventListener('pointermove', () => {
        if (catState === 'angry' && isPetting) {
            catState = 'relaxed';
            catImg.src = 'Cat_Photos/Relaxed_Cat.png';
            caption.textContent = 'Ммм, вот так хорошо... 🥰';

            // Очищаємо старий таймер повернення, якщо він був
            if (resetTimeout) clearTimeout(resetTimeout);

            // Через 3 секунди Емичка знову стає спокійною
            resetTimeout = setTimeout(() => {
                catState = 'calm';
                catImg.src = 'Cat_Photos/Cat.png';
                caption.textContent = 'Нажми на нее!';
                isPetting = false; // Скидаємо стан гладження
            }, 3000);
        }
    });

    // 4. Кінець гладження: коли відпустили кнопку миші або прибрали палець з екрану
    const endPetting = (e) => {
        isPetting = false;
        try {
            catImg.releasePointerCapture(e.pointerId);
        } catch (err) {
            // Запобігання дрібним помилкам старіших браузерів
        }
    };

    catImg.addEventListener('pointerup', endPetting);
    catImg.addEventListener('pointercancel', endPetting); // Якщо дзвінок перервав тач
});
