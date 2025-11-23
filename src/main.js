import { initConstructor } from './components/constructor.js';
import { initReviews } from './components/reviews.js';
import { initBasket } from './components/basket.js';
import { initForms } from './components/forms.js';

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.constructor')) {
    initConstructor();
  }
  
  if (document.querySelector('.reviews-container')) {
    initReviews();
  }
  
  if (document.querySelector('.basket-items')) {
    initBasket();
  }
  
  if (document.querySelector('form')) {
    initForms();
  }
});


