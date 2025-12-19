document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.getElementById('basket-list');
  const emptyEl = document.getElementById('basket-empty');
  const totalEl = document.getElementById('basket-total');
  const clearBtn = document.getElementById('basket-clear');

  function loadCart() {
    try {
      const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
      return Array.isArray(items) ? items : [];
    } catch {
      return [];
    }
  }

  function saveCart(items) {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }

  function render() {
    const items = loadCart();
    listEl.innerHTML = '';
    let grandTotal = 0;
    if (!items.length) {
      emptyEl.style.display = 'block';
      totalEl.textContent = '';
      return;
    }
    emptyEl.style.display = 'none';

    items.forEach((item, idx) => {
      grandTotal += item.total || 0;
      const card = document.createElement('div');
      card.className = 'basket-item';

      // Preview
      const preview = document.createElement('div');
      preview.className = 'basket-item-preview';
      preview.innerHTML = item.svg || '';
      // scale preview
      const svg = preview.querySelector('svg');
      if (svg) { svg.style.maxWidth = '180px'; svg.style.width = '100%'; svg.style.height = 'auto'; }

      // Info block
      const info = document.createElement('div');
      info.className = 'basket-item-info';
      const title = document.createElement('h3');
      title.textContent = 'Ваш котик';
      const price = document.createElement('div');
      price.className = 'basket-item-price';
      price.textContent = `Цена: ${item.total || item.basePrice || 0} ₽`;

      // Breakdown list
      const ul = document.createElement('ul');
      ul.className = 'basket-item-breakdown';
      (item.breakdown || []).forEach(b => {
        const li = document.createElement('li');
        li.textContent = `${b.label}: ${b.amount} ₽`;
        ul.appendChild(li);
      });

      // Remove button
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Удалить';
      removeBtn.className = 'basket-item-remove';
      removeBtn.addEventListener('click', () => {
        const items = loadCart();
        items.splice(idx, 1);
        saveCart(items);
        render();
      });

      info.appendChild(title);
      info.appendChild(price);
      if (ul.children.length) info.appendChild(ul);
      info.appendChild(removeBtn);

      card.appendChild(preview);
      card.appendChild(info);
      listEl.appendChild(card);
    });

    totalEl.textContent = `Итого: ${grandTotal} ₽`;
  }

  clearBtn && clearBtn.addEventListener('click', () => {
    if (confirm('Очистить корзину?')) {
      saveCart([]);
      render();
    }
  });

	 // ========== ОФОРМЛЕНИЕ ЗАКАЗА ==========
	const checkoutBtn = document.querySelector('.btn-checkout');

	if (checkoutBtn) {
	  checkoutBtn.addEventListener('click', () => {
		const items = loadCart();
		
		if (items.length === 0) {
		  alert('Корзина пуста! Добавьте котика в конструкторе.');
		  return;
		}
		
		showCheckoutModal(items);
	  });
	}

	function showCheckoutModal(items) {
	  const modal = document.createElement('div');
	  modal.className = 'checkout-modal';
	  modal.innerHTML = `
		<div class="modal-content">
		  <button class="modal-close">&times;</button>
		  <h2>Оформление заказа</h2>
		  <p class="modal-subtitle">Заполните данные для доставки ваших котиков</p>
		  
		  <form id="checkout-form" class="feedback-form">
			<div class="form-field">
			  <label for="order-name">Имя и фамилия*</label>
			  <input type="text" id="order-name" name="name" required placeholder="Иван Иванов">
			</div>
			
			<div class="form-field">
			  <label for="order-phone">Телефон*</label>
			  <input type="tel" id="order-phone" name="phone" required placeholder="+7 (9__) ___ __ __">
			</div>
			
			<div class="form-field">
			  <label for="order-email">Email*</label>
			  <input type="email" id="order-email" name="email" required placeholder="example@mail.ru">
			</div>
			
			<div class="form-field">
			  <label for="order-address">Адрес доставки*</label>
			  <textarea id="order-address" name="address" required placeholder="Город, улица, дом, квартира" rows="3"></textarea>
			</div>
			
			<div class="form-field">
			  <label for="order-comment">Комментарий к заказу (необязательно)</label>
			  <textarea id="order-comment" name="comment" placeholder="Особые пожелания к доставке" rows="2"></textarea>
			</div>
			
			<div class="order-summary">
			  <h3>Сводка заказа</h3>
			  <p><strong>Котиков в заказе:</strong> ${items.length}</p>
			  <p><strong>Общая сумма:</strong> ${items.reduce((sum, item) => sum + item.total, 0)} ₽</p>
			</div>
			
			<div class="form-checkbox">
			  <input type="checkbox" id="order-consent" name="consent" required>
			  <label for="order-consent">
				Согласен(а) на обработку персональных данных и готов(а) принять пушистое счастье.
			  </label>
			</div>
			
			<div class="modal-actions">
			  <button type="submit" class="form-button">Подтвердить заказ</button>
			  <button type="button" class="btn-cancel">Отмена</button>
			</div>
		  </form>
		</div>
	  `;
	  
	  document.body.appendChild(modal);
	  
	  const style = document.createElement('style');
	  style.textContent = `
		.checkout-modal {
		  position: fixed;
		  top: 0;
		  left: 0;
		  width: 100%;
		  height: 100%;
		  background-color: rgba(0,0,0,0.7);
		  display: flex;
		  justify-content: center;
		  align-items: center;
		  z-index: 1000;
		  padding: 1rem;
		}
		.modal-content {
		  background: #fff9f4;
		  border-radius: 15px;
		  box-shadow: 0 4px 22px #ff6b3532;
		  padding: 2rem;
		  max-width: 500px;
		  width: 100%;
		  max-height: 90vh;
		  overflow-y: auto;
		  position: relative;
		}
		.modal-close {
		  position: absolute;
		  top: 1rem;
		  right: 1rem;
		  background: none;
		  border: none;
		  font-size: 1.5rem;
		  cursor: pointer;
		  color: #666;
		  width: 30px;
		  height: 30px;
		  display: flex;
		  align-items: center;
		  justify-content: center;
		  border-radius: 50%;
		}
		.modal-close:hover {
		  background-color: #ffeadd;
		  color: #ff6b35;
		}
		.modal-content h2 {
		  color: #ff6b35;
		  margin-bottom: 0.8rem;
		  font-size: 1.7rem;
		  text-align: center;
		}
		.modal-subtitle {
		  color: #906c4c;
		  font-size: 1.06rem;
		  text-align: center;
		  margin-bottom: 1.4rem;
		}
		.modal-content .feedback-form {
		  margin: 0 auto;
		  width: 100%;
		  max-width: 100%;
		  min-width: 240px;
		  background: #fff;
		  border-radius: 11px;
		  padding: 1.5rem 1.2rem;
		  box-shadow: 0 2px 8px #ffd3b06b;
		  display: flex;
		  flex-direction: column;
		  gap: 1rem;
		}
		.order-summary {
		  background: #fff8f0;
		  padding: 1rem;
		  border-radius: 8px;
		  margin: 0.5rem 0;
		  border-left: 4px solid #ff6b35;
		}
		.order-summary h3 {
		  color: #ff6b35;
		  margin-top: 0;
		  margin-bottom: 0.5rem;
		  font-size: 1.3rem;
		}
		.order-summary p {
		  margin: 0.5rem 0;
		  color: #666;
		}
		.modal-actions {
		  display: flex;
		  gap: 1rem;
		  margin-top: 0.5rem;
		}
		.modal-actions .form-button {
		  flex: 2;
		  background: #ff6b35;
		  color: #fff;
		  border: none;
		  font-weight: 600;
		  border-radius: 7px;
		  padding: 0.9rem 0;
		  font-size: 1.1rem;
		  cursor: pointer;
		  transition: background 0.21s;
		  box-shadow: 0 1px 10px #ffd99944;
		}
		.modal-actions .form-button:hover {
		  background: #ff935f;
		}
		.btn-cancel {
		  flex: 1;
		  background: #92644c;
		  color: #fff7f1;
		  border: none;
		  font-weight: 600;
		  border-radius: 7px;
		  padding: 0.9rem 0;
		  font-size: 1.1rem;
		  cursor: pointer;
		  transition: background 0.21s;
		}
		.btn-cancel:hover {
		  background: #b98967;
		}
		.success-modal .modal-content {
		  text-align: center;
		  padding: 3rem 2rem;
		}
		.success-icon {
		  width: 70px;
		  height: 70px;
		  background-color: #4CAF50;
		  color: white;
		  border-radius: 50%;
		  display: flex;
		  align-items: center;
		  justify-content: center;
		  font-size: 2.5rem;
		  margin: 0 auto 1.5rem;
		  font-weight: bold;
		}
		.order-success-details {
		  background: #f9f9f9;
		  padding: 1.5rem;
		  border-radius: 8px;
		  margin: 1.5rem 0;
		  text-align: left;
		}
		.order-success-details p {
		  margin: 0.5rem 0;
		  color: #555;
		}
		@media (max-width: 700px) {
		  .modal-content {
			padding: 1.5rem 1rem;
		  }
		  .modal-actions {
			flex-direction: column;
		  }
		  .modal-actions button {
			width: 100%;
		  }
		}
	  `;
	  document.head.appendChild(style);
	  
	  const orderPhoneInput = document.getElementById('order-phone');
	  const orderNameInput = document.getElementById('order-name');
	  const orderEmailInput = document.getElementById('order-email');
	  const orderConsentInput = document.getElementById('order-consent');
	  const orderAddressInput = document.getElementById('order-address');
	  const form = document.getElementById('checkout-form');
	  const closeBtn = modal.querySelector('.modal-close');
	  const cancelBtn = modal.querySelector('.btn-cancel');
	  
	  if (orderPhoneInput) {
		orderPhoneInput.addEventListener('input', function(e) {
		  const input = e.target;
		  
		  let digits = input.value.replace(/\D/g, '');
		  
		  if (digits.startsWith('7') || digits.startsWith('8')) {
			digits = digits.slice(1);
		  }
		  
		  digits = digits.substring(0, 10);
		  
		  let formatted = '';
		  if (digits.length > 0) {
			formatted = '+7';
			if (digits.length > 0) {
			  formatted += ' (' + digits.substring(0, 3);
			}
			if (digits.length > 3) {
			  formatted += ') ' + digits.substring(3, 6);
			}
			if (digits.length > 6) {
			  formatted += '-' + digits.substring(6, 8);
			}
			if (digits.length > 8) {
			  formatted += '-' + digits.substring(8, 10);
			}
		  }
		  
		  input.value = formatted;
		  
		  setTimeout(() => {
			const len = input.value.length;
			input.setSelectionRange(len, len);
		  }, 0);
		});
		
		orderPhoneInput.addEventListener('focus', function() {
		  if (!this.value.trim()) {
			this.value = '+7 (';
			setTimeout(() => {
			  this.setSelectionRange(4, 4);
			}, 0);
		  }
		});
		
		orderPhoneInput.addEventListener('click', function() {
		  setTimeout(() => {
			const len = this.value.length;
			this.setSelectionRange(len, len);
		  }, 0);
		});
	  }
	  
	  function validateOrderForm(formData) {
		const errors = [];
		
		if (!formData.name || formData.name.trim().length < 2) {
		  errors.push('Имя должно содержать минимум 2 символа');
		  highlightField(orderNameInput, true);
		} else {
		  highlightField(orderNameInput, false);
		}
		
		if (!formData.phone) {
		  errors.push('Введите номер телефона');
		  highlightField(orderPhoneInput, true);
		} else {
		  const phoneRegex = /^\+7\s\([0-9]{3}\)\s[0-9]{3}-[0-9]{2}-[0-9]{2}$/;
		  const phoneDigits = formData.phone.replace(/\D/g, '');
		  
		  if (!phoneRegex.test(formData.phone)) {
			errors.push('Введите номер в формате: +7 (999) 123-45-67');
			highlightField(orderPhoneInput, true);
		  } else if (phoneDigits.length !== 11) {
			errors.push('Номер должен содержать 10 цифр после +7');
			highlightField(orderPhoneInput, true);
		  } else {
			const phoneWithoutFormatting = formData.phone.replace(/\s|\(|\)|-/g, '');
			const regionCode = phoneWithoutFormatting.substring(2, 5);
			
			if (regionCode[0] !== '9') {
			  errors.push('Код региона должен начинаться с цифры 9');
			  highlightField(orderPhoneInput, true);
			} else {
			  highlightField(orderPhoneInput, false);
			}
		  }
		}
		
		if (!formData.email) {
		  errors.push('Введите email');
		  highlightField(orderEmailInput, true);
		} else {
		  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		  if (!emailRegex.test(formData.email)) {
			errors.push('Введите корректный email (например: example@mail.ru)');
			highlightField(orderEmailInput, true);
		  } else {
			highlightField(orderEmailInput, false);
		  }
		}
		
		if (!formData.address) {
		  errors.push('Введите адрес доставки');
		  highlightField(orderAddressInput, true);
		} else {
		  highlightField(orderAddressInput, false);
		}
		
		if (!formData.consent) {
		  errors.push('Необходимо согласие на обработку данных');
		  highlightField(orderConsentInput, true);
		} else {
		  highlightField(orderConsentInput, false);
		}
		
		return errors;
	  }
	  
	  function highlightField(field, hasError) {
		if (!field) return;
		
		if (hasError) {
		  field.style.borderColor = '#ff4757';
		  field.style.boxShadow = '0 0 0 2px rgba(255, 71, 87, 0.2)';
		} else {
		  field.style.borderColor = '#ffdecd';
		  field.style.boxShadow = 'none';
		}
	  }
	  
	  function showOrderErrors(errors) {
		modal.querySelectorAll('.error-message').forEach(error => error.remove());
		
		errors.forEach(error => {
		  const errorElement = document.createElement('div');
		  errorElement.className = 'error-message';
		  errorElement.style.cssText = `
			color: #ff4757;
			font-size: 0.9rem;
			margin-top: 0.3rem;
			padding: 0.3rem 0.5rem;
			background: rgba(255, 71, 87, 0.1);
			border-radius: 4px;
		  `;
		  errorElement.textContent = error;
		  
		  if (error.includes('Имя')) {
			orderNameInput.parentElement.appendChild(errorElement);
		  } else if (error.includes('телефон') || error.includes('номер')) {
			orderPhoneInput.parentElement.appendChild(errorElement);
		  } else if (error.includes('email')) {
			orderEmailInput.parentElement.appendChild(errorElement);
		  } else if (error.includes('адрес')) {
			orderAddressInput.parentElement.appendChild(errorElement);
		  } else if (error.includes('согласие')) {
			orderConsentInput.closest('.form-checkbox').appendChild(errorElement);
		  }
		});
	  }
	  
	  closeBtn.addEventListener('click', () => {
		closeModal();
	  });
	  
	  cancelBtn.addEventListener('click', () => {
		closeModal();
	  });
	  
	  modal.addEventListener('click', (e) => {
		if (e.target === modal) {
		  closeModal();
		}
	  });
	  
	  form.addEventListener('submit', (e) => {
		e.preventDefault();
		
		const formData = {
		  name: orderNameInput.value.trim(),
		  phone: orderPhoneInput.value.trim(),
		  email: orderEmailInput.value.trim(),
		  address: orderAddressInput.value.trim(),
		  consent: orderConsentInput.checked
		};
		
		const errors = validateOrderForm(formData);
		
		if (errors.length > 0) {
		  showOrderErrors(errors);
		  return;
		}
		
		const comment = document.getElementById('order-comment').value.trim();
		
		const orderData = {
		  name: formData.name,
		  phone: formData.phone,
		  email: formData.email,
		  address: formData.address,
		  comment: comment || 'Нет комментария',
		  items: items,
		  total: items.reduce((sum, item) => sum + item.total, 0),
		  date: new Date().toLocaleString('ru-RU'),
		  orderId: 'ORD-' + Date.now().toString().slice(-8)
		};
		
		closeModal();
		showOrderSuccess(orderData);
		saveCart([]);
		render();
	  });
	  
	  function closeModal() {
		document.body.removeChild(modal);
		document.head.removeChild(style);
	  }
	  
	  [orderNameInput, orderPhoneInput, orderEmailInput, orderAddressInput].forEach(field => {
		field.addEventListener('input', function() {
		  highlightField(this, false);
		  const error = this.parentElement.querySelector('.error-message');
		  if (error) error.remove();
		});
	  });
	  
	  if (orderConsentInput) {
		orderConsentInput.addEventListener('change', function() {
		  highlightField(this, false);
		  const checkboxContainer = this.closest('.form-checkbox');
		  const error = checkboxContainer.querySelector('.error-message');
		  if (error) error.remove();
		});
	  }
	}

	function showOrderSuccess(orderData) {
	  const successDiv = document.createElement('div');
	  successDiv.style.cssText = `
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: white;
		padding: 2rem;
		border-radius: 12px;
		box-shadow: 0 0 30px rgba(0,0,0,0.3);
		z-index: 9999;
		max-width: 500px;
		width: 90%;
		text-align: center;
		border: 4px solid #4CAF50;
	  `;
	  
	  successDiv.innerHTML = `
		<div style="font-size: 3rem; color: #4CAF50; margin-bottom: 1rem;">✓</div>
		<h2 style="color: #4CAF50; margin-bottom: 1rem;">Заказ успешно оформлен!</h2>
		<p>Спасибо за заказ, <strong>${orderData.name}</strong>!</p>
		<div style="background: #f9f9f9; padding: 1rem; border-radius: 8px; margin: 1rem 0; text-align: left;">
		  <p><strong>Номер заказа:</strong> ${orderData.orderId}</p>
		  <p><strong>Сумма:</strong> ${orderData.total} ₽</p>
		</div>
		<button id="close-success-btn" style="
		  background: #4CAF50;
		  color: white;
		  border: none;
		  padding: 10px 30px;
		  border-radius: 6px;
		  font-size: 1.1rem;
		  cursor: pointer;
		  margin-top: 1rem;
		">Отлично!</button>
	  `;
	  
	  document.body.appendChild(successDiv);
	  
	  document.getElementById('close-success-btn').addEventListener('click', () => {
		document.body.removeChild(successDiv);
	  });
	  
	  successDiv.addEventListener('click', (e) => {
		if (e.target === successDiv) {
		  document.body.removeChild(successDiv);
		}
	  });
	}

	function showOrderSuccess(orderData) {
  const successDiv = document.createElement('div');
  successDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 0 30px rgba(0,0,0,0.3);
    z-index: 9999;
    max-width: 500px;
    width: 90%;
    text-align: center;
    border: 4px solid #4CAF50;
  `;
  
  successDiv.innerHTML = `
    <div style="font-size: 3rem; color: #4CAF50; margin-bottom: 1rem;">✓</div>
    <h2 style="color: #4CAF50; margin-bottom: 1rem;">Заказ успешно оформлен!</h2>
    <p>Спасибо за заказ, <strong>${orderData.name}</strong>!</p>
    <div style="background: #f9f9f9; padding: 1rem; border-radius: 8px; margin: 1rem 0; text-align: left;">
      <p><strong>Номер заказа:</strong> ${orderData.orderId}</p>
      <p><strong>Сумма:</strong> ${orderData.total} ₽</p>
    </div>
    <button id="close-success-btn" style="
      background: #4CAF50;
      color: white;
      border: none;
      padding: 10px 30px;
      border-radius: 6px;
      font-size: 1.1rem;
      cursor: pointer;
      margin-top: 1rem;
    ">Отлично!</button>
  `;
  
  document.body.appendChild(successDiv);
  
  saveOrderToProfile(orderData);
  
  document.getElementById('close-success-btn').addEventListener('click', () => {
    document.body.removeChild(successDiv);
  });
  
  successDiv.addEventListener('click', (e) => {
    if (e.target === successDiv) {
      document.body.removeChild(successDiv);
    }
  });
}

function saveOrderToProfile(orderData) {
  try {
    const orderWithCatNames = {
      ...orderData,
      items: orderData.items.map(item => ({
        ...item,
        catName: generateCatName()
      }))
    };
    
    const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    
    existingOrders.push(orderWithCatNames);
    
    localStorage.setItem('userOrders', JSON.stringify(existingOrders));
    
    console.log('Заказ сохранен в профиль с именами котиков:', orderData.orderId);
  } catch (error) {
    console.error('Ошибка при сохранении заказа:', error);
  }
}

function generateCatName() {
  const names = [
    'Мурзик', 'Барсик', 'Васька', 'Рыжик', 'Снежок', 'Пушок', 'Кузя', 'Бандит',
    'Гарфилд', 'Симба', 'Луна', 'Оскар', 'Зефир', 'Маркиз', 'Персик', 'Шерлок',
    'Гудини', 'Феня', 'Цезарь', 'Боня', 'Чарли', 'Лексус', 'Базилио', 'Матроскин',
    'Мурчелло', 'Пушинка', 'Молния', 'Лапочка', 'Бобби', 'Мурка', 'Василиса',
    'Том', 'Джерри', 'Леопольд', 'Масяня', 'Кекс', 'Бублик', 'Пончик', 'Батон'
  ];
  return names[Math.floor(Math.random() * names.length)];
}

	render();
}); 