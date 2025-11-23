export function initBasket() {
  const removeButtons = document.querySelectorAll('.basket-remove');
  const checkboxes = document.querySelectorAll('.basket-check');
  const checkoutBtn = document.querySelector('.btn-checkout');
  
  removeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const item = e.target.closest('.basket-item');
      if (item && confirm('Удалить товар из корзины?')) {
        item.remove();
        updateTotal();
      }
    });
  });
  
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateTotal);
  });
  
  function updateTotal() {
    const checkedItems = document.querySelectorAll('.basket-check:checked');
    const totalElement = document.querySelector('.basket-total');
    
    if (totalElement && checkedItems.length > 0) {
      let total = 0;
      checkedItems.forEach(checkbox => {
        const item = checkbox.closest('.basket-item');
        const priceText = item?.querySelector('.basket-price strong')?.textContent;
        if (priceText) {
          const price = parseInt(priceText.replace(/\s/g, '').replace('₽', ''));
          total += price;
        }
      });
      totalElement.innerHTML = `Итого: <strong>${total.toLocaleString('ru-RU')} ₽</strong>`;
    }
  }
  
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const checkedItems = document.querySelectorAll('.basket-check:checked');
      if (checkedItems.length === 0) {
        alert('Выберите товары для оформления заказа');
        return;
      }
      alert('Заказ оформлен! (Это демо-версия)');
    });
  }
}


