export function initForms() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      console.log('Form data:', data);
      
      if (form.classList.contains('feedback-form')) {
        alert('Спасибо! Ваша заявка отправлена. (Это демо-версия)');
        form.reset();
      } else if (form.classList.contains('user-form')) {
        alert('Данные сохранены! (Это демо-версия)');
      } else if (form.classList.contains('constructor-form')) {
        alert('Котик добавлен в корзину! (Это демо-версия)');
      }
    });
  });
}


