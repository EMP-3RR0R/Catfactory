document.addEventListener('DOMContentLoaded', function() {
  const orderList = document.querySelector('.order-list');
  
  function loadOrders() {
    try {
      return JSON.parse(localStorage.getItem('userOrders') || '[]');
    } catch {
      return [];
    }
  }
  
  function renderOrders() {
    const orders = loadOrders();
    
    orderList.innerHTML = '';
    
    if (orders.length === 0) {
      orderList.innerHTML = `
        <li class="order-item">
          <div style="text-align: center; padding: 2rem; color: #666; width: 100%;">
            <p>У вас пока нет заказов.</p>
            <p>Создайте своего первого котика в конструкторе!</p>
          </div>
        </li>
      `;
      return;
    }
    
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const catName = item.catName || 'Безымянный котик';
        
        const li = document.createElement('li');
        li.className = 'order-item';
        
        let status = 'в обработке';
        let statusClass = 'processing';
        const orderDate = new Date(order.date);
        const now = new Date();
        const daysDiff = (now - orderDate) / (1000 * 60 * 60 * 24);
        
        if (daysDiff > 3) {
          status = 'доставлен';
          statusClass = 'delivered';
        } else if (daysDiff > 1) {
          status = 'в пути';
          statusClass = 'shipping';
        }
        
        let svgPreview = '';
        if (item.svg) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = item.svg;
          const svg = tempDiv.querySelector('svg');
          if (svg) {
            svg.setAttribute('width', '80');
            svg.setAttribute('height', '80');
            svg.style.maxWidth = '80px';
            svg.style.height = 'auto';
            svgPreview = svg.outerHTML;
          }
        }
        
        li.innerHTML = `
          ${svgPreview ? `<div class="order-cat-preview">${svgPreview}</div>` : '<div class="order-cat-preview" style="width: 80px; height: 80px; background: #ffeadd; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 2rem;">🐱</div>'}
          <div style="flex: 1;">
            <p><strong style="color: #ff6b35; font-size: 1.2rem;">${catName}</strong></p>
            <p class="order-details">
              <small>
                Заказ ${order.orderId} от ${order.date.split(',')[0]} — 
                <span class="status-${statusClass}">Статус: ${status}</span>
              </small>
            </p>
            ${order.address ? `<p class="order-address"><small>Адрес доставки: ${order.address}</small></p>` : ''}
            <p class="order-price"><small>Цена: ${item.total || 0} ₽</small></p>
          </div>
        `;
        
        orderList.appendChild(li);
      });
    });
  }
  
  renderOrders();
  
  const userNameInput = document.getElementById('user-name');
  const savedName = localStorage.getItem('userName');
  if (savedName && userNameInput) {
    userNameInput.value = savedName;
    const greeting = document.querySelector('.main-description strong');
    if (greeting) {
      greeting.textContent = savedName;
    }
  }
  
  if (userNameInput) {
    userNameInput.addEventListener('change', function() {
      localStorage.setItem('userName', this.value);
      const greeting = document.querySelector('.main-description strong');
      if (greeting) {
        greeting.textContent = this.value;
      }
    });
  }
  
  const logoutBtn = document.querySelector('.btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      if (confirm('Вы уверены, что хотите выйти?')) {
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userPhone');
        localStorage.removeItem('userAddress');
        window.location.href = 'index.html';
      }
    });
  }
  
  const userForm = document.querySelector('.user-form');
  if (userForm) {
    userForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const userName = document.getElementById('user-name').value;
      const userEmail = document.getElementById('user-email').value;
      const userPhone = document.getElementById('user-phone').value;
      const userAddress = document.getElementById('user-address').value;
      
      localStorage.setItem('userName', userName);
      localStorage.setItem('userEmail', userEmail);
      localStorage.setItem('userPhone', userPhone);
      localStorage.setItem('userAddress', userAddress);
      
      alert('Данные профиля сохранены!');
    });
  }
  
  function loadUserData() {
    const userEmailInput = document.getElementById('user-email');
    const userPhoneInput = document.getElementById('user-phone');
    const userAddressInput = document.getElementById('user-address');
    
    if (userEmailInput) {
      userEmailInput.value = localStorage.getItem('userEmail') || 'meow@example.com';
    }
    if (userPhoneInput) {
      userPhoneInput.value = localStorage.getItem('userPhone') || '+7 (900) 123-45-67';
    }
    if (userAddressInput) {
      userAddressInput.value = localStorage.getItem('userAddress') || '';
    }
  }
  
  loadUserData();
});