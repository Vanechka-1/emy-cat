document.addEventListener('DOMContentLoaded', () => {
    const catImg = document.getElementById('cat-img');
    const caption = document.getElementById('caption');

    let catState = 'calm'; // Можливі стани: 'calm' (спокійна), 'annoyed' (натиснули 1 раз), 'angry' (зла), 'relaxed' (задоволена)
    let resetTimeout = null; 
    let isPetting = false;   

    let pettingSuccessTimeout = null; 
    let movementWatchdog = null;     

    function resetPettingProgress() {
        if (pettingSuccessTimeout) {
            clearTimeout(pettingSuccessTimeout);
            pettingSuccessTimeout = null;
        }
        if (movementWatchdog) {
            clearTimeout(movementWatchdog);
            movementWatchdog = null;
        }
    }

    // 1. Обробка кліків (Фаза "Дражніння")
    catImg.addEventListener('click', () => {
        // Якщо котик спокійний — перший клік нічого не ламає, тільки попереджає
        if (catState === 'calm') {
            catState = 'annoyed';
            caption.textContent = 'Давай нажимай дальше!';
        } 
        // Якщо вже натискали раніше — кожне наступне натискання має 50% шансу розізлити
        else if (catState === 'annoyed') {
            const chance = Math.random(); // Генерує число від 0 до 1
            
            if (chance < 0.5) { 
                // 50% ШАНС: Котик розізлився!
                catState = 'angry';
                catImg.src = 'Cat_Photos/Angry_Cat.png';
                caption.textContent = 'Что ты наделала? Теперь гладь ее без остановки 2 секунды!';
            } else {
                // Інші 50% ШАНС: Пронесло, гравець клікає далі
                caption.textContent = 'Давай нажимай дальше! (Ух, пока везет...)';
            }
        }
    });

    // 2. Початок гладження (затиснули кнопку або торкнулися екрану)
    catImg.addEventListener('pointerdown', (e) => {
        if (catState === 'angry') {
            isPetting = true;
            catImg.setPointerCapture(e.pointerId); 
        }
    });

    // 3. Процес гладження (рух мишкою/пальцем без зупинок 2 секунди)
    catImg.addEventListener('pointermove', () => {
        if (catState === 'angry' && isPetting) {
            
            if (!pettingSuccessTimeout) {
                caption.textContent = 'Гладь-гладь... Еще чуть-чуть... ⏳';
                
                pettingSuccessTimeout = setTimeout(() => {
                    // УСПІХ: Гладили чесно 2 секунди
                    catState = 'relaxed';
                    catImg.src = 'Cat_Photos/Relaxed_Cat.png';
                    caption.textContent = 'Ммм, вот так хорошо... 🥰';
                    
                    resetPettingProgress(); 

                    // Через 3 секунди задоволена Емічка знову повертається в початковий стан
                    if (resetTimeout) clearTimeout(resetTimeout);
                    resetTimeout = setTimeout(() => {
                        catState = 'calm';
                        catImg.src = 'Cat_Photos/Cat.png';
                        caption.textContent = 'Нажми на нее!';
                        isPetting = false;
                    }, 3000);

                }, 2000); 
            }

            // Перевірка на зупинку руху
            clearTimeout(movementWatchdog);
            movementWatchdog = setTimeout(() => {
                if (catState === 'angry') {
                    resetPettingProgress();
                    caption.textContent = 'Не останавливайся, гладь дальше!';
                }
            }, 300);
        }
    });

    // 4. Кінець гладження (відпустили кнопку/прибрали палець)
    const endPetting = (e) => {
        isPetting = false;
        resetPettingProgress(); 
        
        if (catState === 'angry') {
            caption.textContent = 'Ты отпустила? Продолжай гладить!';
        }

        try {
            catImg.releasePointerCapture(e.pointerId);
        } catch (err) {}
    };

    catImg.addEventListener('pointerup', endPetting);
    catImg.addEventListener('pointercancel', endPetting);
});
