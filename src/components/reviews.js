export function initReviews() {
  const container = document.querySelector('.reviews-container');
  const leftBtn = document.querySelector('.arrow-left');
  const rightBtn = document.querySelector('.arrow-right');
  const cards = document.querySelectorAll('.review-card');
  
  if (!container || !leftBtn || !rightBtn || cards.length === 0) return;
  
  let currentIndex = 0;
  
  function showCard(index) {
    cards.forEach((card, i) => {
      card.style.display = i === index ? 'flex' : 'none';
    });
    
    leftBtn.disabled = index === 0;
    rightBtn.disabled = index === cards.length - 1;
  }
  
  leftBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      showCard(currentIndex);
    }
  });
  
  rightBtn.addEventListener('click', () => {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      showCard(currentIndex);
    }
  });
  
  showCard(0);
}


