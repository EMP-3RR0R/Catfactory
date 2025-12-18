// Слайдер для карточек отзывов с правильной цикличностью
document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.reviews-container');
  const cards = document.querySelectorAll('.review-card');
  const prevBtn = document.querySelector('.arrow-left');
  const nextBtn = document.querySelector('.arrow-right');
  
  const totalCards = cards.length; // 7
  let cardsPerView = 3;
  let currentGroup = 0; // Группа 0 = карточки 0,1,2; группа 1 = 1,2,3 и т.д.
  
  // Определяем сколько карточек показывать
  function updateCardsPerView() {
    const width = window.innerWidth;
    
    if (width <= 600) {
      cardsPerView = 1;
    } else if (width <= 900) {
      cardsPerView = 2;
    } else {
      cardsPerView = 3;
    }
    
    // Обновляем CSS
    cards.forEach(card => {
      if (cardsPerView === 1) {
        card.style.flex = '0 0 100%';
        card.style.minWidth = '100%';
      } else if (cardsPerView === 2) {
        card.style.flex = '0 0 calc(50% - 1rem)';
        card.style.minWidth = 'calc(50% - 1rem)';
      } else {
        card.style.flex = '0 0 calc(33.333% - 1.33rem)';
        card.style.minWidth = 'calc(33.333% - 1.33rem)';
      }
    });
    
    // При изменении размера сбрасываем на первую группу
    currentGroup = 0;
    showCurrentGroup();
  }
  
  // Показываем текущую группу
  function showCurrentGroup() {
    // Скрываем все
    cards.forEach(card => card.classList.remove('active'));
    
    // Рассчитываем максимальное количество групп
    const maxGroups = totalCards - cardsPerView + 1;
    
    // Нормализуем currentGroup
    if (currentGroup < 0) currentGroup = maxGroups - 1;
    if (currentGroup >= maxGroups) currentGroup = 0;
    
    console.log(`Группа ${currentGroup}: показываем карточки`);
    
    // Показываем карточки текущей группы
    for (let i = 0; i < cardsPerView; i++) {
      let cardIndex;
      
      if (currentGroup < maxGroups - cardsPerView) {
        // Обычный случай: группа внутри основных карточек
        cardIndex = currentGroup + i;
      } else {
        // Циклический случай: вышли за пределы
        cardIndex = (currentGroup + i) % totalCards;
      }
      
      console.log(`  - Карточка ${cardIndex + 1} (${cards[cardIndex].querySelector('.review-name').textContent})`);
      cards[cardIndex].classList.add('active');
    }
  }
  
  // Переход к следующей группе
  function goToNext() {
    const maxGroups = totalCards - cardsPerView + 1;
    const cyclicGroups = cardsPerView; // Количество циклических групп
    
    if (currentGroup < maxGroups - 1) {
      // Идем к следующей обычной группе
      currentGroup++;
    } else {
      // Переходим к циклической группе или к началу
      currentGroup = (currentGroup + 1) % maxGroups;
    }
    
    console.log('--- ВПРАВО ---');
    showCurrentGroup();
  }
  
  // Переход к предыдущей группе
  function goToPrev() {
    const maxGroups = totalCards - cardsPerView + 1;
    
    if (currentGroup > 0) {
      // Идем к предыдущей обычной группе
      currentGroup--;
    } else {
      // Переходим к последней группе (циклической)
      currentGroup = maxGroups - 1;
    }
    
    console.log('--- ВЛЕВО ---');
    showCurrentGroup();
  }
  
  // Инициализация
  function initSlider() {
    // Показываем первую группу
    showCurrentGroup();
    
    // Назначаем обработчики
    prevBtn.addEventListener('click', goToPrev);
    nextBtn.addEventListener('click', goToNext);
    
    // Адаптивность
    window.addEventListener('resize', updateCardsPerView);
    updateCardsPerView();
  }
  
  initSlider();
});