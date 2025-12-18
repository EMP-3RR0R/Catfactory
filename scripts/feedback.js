// Обработка формы обратной связи
document.addEventListener('DOMContentLoaded', function() {
  const feedbackForm = document.querySelector('.feedback-form');
  const modal = document.getElementById('feedback-modal');
  const modalCloseBtn = document.querySelector('.modal__close');
  const modalCloseBtn2 = document.getElementById('modal-close-btn');
  const modalName = document.getElementById('modal-name');
  const modalPhone = document.getElementById('modal-phone');
  const modalEmail = document.getElementById('modal-email');
  
  // Маска для телефона
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      
      if (value.length > 0) {
        value = '+7 (' + value;
        
        if (value.length > 7) {
          value = value.slice(0, 7) + ') ' + value.slice(7);
        }
        if (value.length > 12) {
          value = value.slice(0, 12) + '-' + value.slice(12);
        }
        if (value.length > 15) {
          value = value.slice(0, 15) + '-' + value.slice(15);
        }
        if (value.length > 18) {
          value = value.slice(0, 18);
        }
      }
      
      e.target.value = value;
    });
  }
  
  // Валидация формы
  function validateForm(formData) {
    const errors = [];
    
    // Проверка имени
    if (!formData.name || formData.name.trim().length < 2) {
      errors.push('Имя должно содержать минимум 2 символа');
    }
    
    // Проверка телефона
    const phoneRegex = /^\+7\s?\(?\d{3}\)?\s?\d{3}[-]?\d{2}[-]?\d{2}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      errors.push('Введите корректный номер телефона');
    }
    
    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.push('Введите корректный email');
    }
    
    // Проверка согласия
    if (!formData.consent) {
      errors.push('Необходимо согласие на обработку данных');
    }
    
    return errors;
  }
  
  // Показать ошибки
  function showErrors(errors) {
    // Удаляем старые ошибки
    const oldErrors = document.querySelectorAll('.error-message');
    oldErrors.forEach(error => error.remove());
    
    // Добавляем новые ошибки
    errors.forEach(error => {
      const errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.style.color = '#ff4757';
      errorElement.style.fontSize = '0.9rem';
      errorElement.style.marginTop = '0.3rem';
      errorElement.textContent = error;
      
      // Находим соответствующее поле и добавляем ошибку
      if (error.includes('Имя')) {
        document.querySelector('input[name="name"]').parentElement.appendChild(errorElement);
      } else if (error.includes('телефон')) {
        document.querySelector('input[name="phone"]').parentElement.appendChild(errorElement);
      } else if (error.includes('email')) {
        document.querySelector('input[name="email"]').parentElement.appendChild(errorElement);
      } else if (error.includes('согласие')) {
        document.querySelector('.form-checkbox').appendChild(errorElement);
      }
    });
    
    // Анимация ошибки
    const firstErrorField = document.querySelector('.error-message');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  } 
  
  // Открыть модальное окно
  function openModal(formData) {
    // Заполняем данные в модалке
    modalName.textContent = formData.name;
    modalPhone.textContent = formData.phone;
    modalEmail.textContent = formData.email;
    
    // Показываем модалку
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Блокируем скролл
    
    // Фокус на кнопке закрытия для доступности
    setTimeout(() => {
      modalCloseBtn.focus();
    }, 100);
  }
  
  // Закрыть модальное окно
  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Разблокируем скролл
    
    // Фокус на кнопке отправки формы
    setTimeout(() => {
      feedbackForm.querySelector('.form-button').focus();
    }, 100);
  }
  
  // Обработка отправки формы
  feedbackForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Отменяем стандартную отправку
    
    // Собираем данные формы
    const formData = {
      name: this.querySelector('input[name="name"]').value.trim(),
      phone: this.querySelector('input[name="phone"]').value.trim(),
      email: this.querySelector('input[name="email"]').value.trim(),
      consent: this.querySelector('input[name="consent"]').checked
    };
    
    // Валидация
    const errors = validateForm(formData);
    
    if (errors.length > 0) {
      showErrors(errors);
      return;
    }
    
    // Если все ок - показываем модалку
    openModal(formData);
    
    // Очищаем форму (опционально)
    this.reset();
    
    // Удаляем ошибки
    const oldErrors = document.querySelectorAll('.error-message');
    oldErrors.forEach(error => error.remove());
    
    // Логируем отправку (в реальном проекте здесь был бы fetch на сервер)
    console.log('Форма отправлена:', formData);
  });
  
  // Закрытие модалки по кнопкам
  modalCloseBtn.addEventListener('click', closeModal);
  modalCloseBtn2.addEventListener('click', closeModal);
  
  // Закрытие модалки по клику на оверлей
  modal.querySelector('.modal__overlay').addEventListener('click', closeModal);
  
  // Закрытие модалки по Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });
  
  // Предотвращаем закрытие при клике на само окно
  modal.querySelector('.modal__content').addEventListener('click', function(e) {
    e.stopPropagation();
  });
});