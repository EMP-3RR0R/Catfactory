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
            <input type="tel" id="order-phone" name="phone" required placeholder="+7 (999) 123-45-67">
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
    
    const form = document.getElementById('checkout-form');
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.btn-cancel');
    
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
      
      const consent = document.getElementById('order-consent');
      if (!consent.checked) {
        alert('Пожалуйста, подтвердите согласие на обработку данных.');
        return;
      }
      
      const formData = new FormData(form);
      const orderData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        address: formData.get('address'),
        comment: formData.get('comment') || 'Нет комментария',
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

  render();
}); 