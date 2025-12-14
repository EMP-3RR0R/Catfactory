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

  render();
});
