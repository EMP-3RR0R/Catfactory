document.addEventListener('DOMContentLoaded', () => {
  const steps = document.querySelectorAll('.form-step');
  const prevButton = document.querySelector('.btn-prev');
  const nextButton = document.querySelector('.btn-next');
  const submitButton = document.querySelector('.btn-submit');
  const exitButton = document.querySelector('.btn-exit');
  let currentStep = 0;
  let hasUnsavedChanges = false;
  // Pricing data and defaults
  const defaultConfig = { selects: {}, colors: {} };
  const prices = { selects: {}, colors: {}, base: 0 };

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function updateNavigation() {
    prevButton.classList.toggle('hidden', currentStep === 0);
    const hideNext = currentStep === 0 || currentStep === steps.length - 1;
    nextButton.classList.toggle('hidden', hideNext);
    submitButton.classList.toggle('hidden', currentStep !== steps.length - 1);
    // Show Exit only after leaving intro (>= step 1)
    if (exitButton) exitButton.classList.toggle('hidden', currentStep < 1);
  }

  function showStep(step) {
    steps.forEach((stepElement, index) => {
      stepElement.classList.toggle('active', index === step);
    });
    updateNavigation();
    // If this is the last step, render the summary preview
    if (step === steps.length - 1) {
      renderSummary();
    }
  }

  prevButton.addEventListener('click', () => {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      showStep(currentStep);
    }
  });

  // Initialize the first step
  showStep(currentStep);

  // Handle start/exit on the intro step
  const startBtn = document.querySelector('.btn-start');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      currentStep = 1;
      showStep(currentStep);
    });
  }
  if (exitButton) {
    exitButton.addEventListener('click', () => {
      if (hasUnsavedChanges) {
        const ok = confirm('Есть несохранённые изменения. Выйти без сохранения?');
        if (!ok) return;
      }
      window.location.href = 'index.html';
    });
  }

  // Handle constructor submit: save configuration to localStorage cart
  document.querySelector('.constructor-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
      const item = buildCartItem();
      const key = 'cartItems';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(item);
      localStorage.setItem(key, JSON.stringify(existing));
      hasUnsavedChanges = false;
      // Optional: navigate to basket
      window.location.href = 'basket.html';
    } catch (err) {
      console.error('Failed to save item to cart', err);
      alert('Не удалось сохранить в корзину. Попробуйте ещё раз.');
    }
  });

  // Helper: safely add settings only if the select element exists
  const settings = {};
  function addSetting(key, selectSelector, optionMap) {
    const select = document.querySelector(selectSelector);
    // Only bind to actual form <select> elements; avoid grabbing SVG nodes
    if (!select || select.tagName !== 'SELECT') return;
    const options = {};
    Object.keys(optionMap).forEach(optKey => {
      const el = document.querySelector(optionMap[optKey]);
      if (el) options[optKey] = el;
    });
    settings[key] = { select, options };
  }

  addSetting('ears', '#ears', {
    normal: '#earsNormal',
    tufted: '#earsTufted',
    folded: '#earsFolded',
    none: '#earsNone',
  });

  addSetting('eyes', '#eyes', {
    round: '#eyesRound',
    sly: '#eyesSly',
    happy: '#eyesHappy',
  });

  addSetting('nose', '#nose', {
    triangle: '#noseTriangle',
    round: '#noseRound',
  });

  addSetting('mouth', '#mouth', {
    neutral: '#mouthNeutral',
    smile: '#mouthSmile',
    sad: '#mouthSad',
  });

  addSetting('tail', '#tail', {
    long: '#tailLong',
    short: '#tailShort',
    none: '#tailNone',
  });

  addSetting('tailPattern', '#tail-pattern', {
    plain: '#tailPlain',
    striped: '#tailStriped',
  });

  // Initialize defaultConfig and random prices for select options
  (function initPricesAndDefaults() {
    // base price for the cat
    prices.base = randInt(3000, 10000);

    Object.keys(settings).forEach(key => {
      const s = settings[key];
      if (!s || !s.select) return;
      defaultConfig.selects[key] = s.select.value;
      prices.selects[key] = {};
      // assign random price to each option value (guard if options missing)
      const opts = s.select && s.select.options ? Array.from(s.select.options) : [];
      opts.forEach(opt => {
        const val = opt.value;
        prices.selects[key][val] = randInt(100, 1000);
      });
    });

    // colors defaults and prices (per color input change)
    const colorInputs = ['#fur-color','#ears-color','#tail-color','#stripes-color','#belly-color','#paws-color','#tapochki-color','#nose-color'];
    colorInputs.forEach(sel => {
      const input = document.querySelector(sel);
      if (!input) return;
      defaultConfig.colors[sel.replace('#','')] = input.value;
      prices.colors[sel.replace('#','')] = randInt(50, 400); // price for changing this color
    });
  })();

  // Render per-option price list under a select
  function renderOptionPrices(settingKey) {
    const setting = settings[settingKey];
    if (!setting || !setting.select) return;
    const select = setting.select;
    // ensure container element exists
    let container = select.parentNode.querySelector('.option-price-list');
    if (!container) {
      container = document.createElement('div');
      container.className = 'option-price-list';
      container.style.marginTop = '0.25rem';
      container.style.fontSize = '0.85em';
      container.style.opacity = '0.8';
      select.parentNode.insertBefore(container, select.nextSibling);
    } else {
      container.innerHTML = '';
    }
    const map = prices.selects[settingKey] || {};
    Array.from(select.options).forEach(opt => {
      const val = opt.value;
      const txt = opt.text;
      const extra = map[val] || 0;
      const row = document.createElement('div');
      row.textContent = `${txt}: +${extra} ₽`;
      container.appendChild(row);
    });
  }

  function updateSetting(settingKey, selectedValue) {
    const setting = settings[settingKey];
    if (!setting) return;
    // Ensure we have a selectedValue; fallback to current select value
    if (selectedValue == null) {
      try { selectedValue = setting.select ? setting.select.value : selectedValue; } catch (e) {}
    }

    // 1) Try using explicit mapped options (existing logic)
    const opts = Object.values(setting.options || {});
    if (opts.length > 0) {
      opts.forEach(option => {
        try { option.classList.add('hidden'); option.style.display = 'none'; } catch (e) {}
      });
      const target = setting.options[selectedValue];
      if (target) {
        try { target.classList.remove('hidden'); target.style.display = ''; } catch (e) {}
        return;
      }
    }

    // 2) Fallback: hide all groups by class name matching the settingKey (e.g., '.ears', '.eyes')
    try {
      const groupEls = document.querySelectorAll('.' + settingKey);
      if (groupEls && groupEls.length) {
        groupEls.forEach(el => { try { el.classList.add('hidden'); el.style.display = 'none'; } catch (e) {} });
      }
    } catch (e) {}

    // 3) Attempt to find element by id pattern: settingKey + Capitalize(value)
    if (typeof selectedValue !== 'string') {
      console.debug(`updateSetting: invalid selectedValue for ${settingKey}`, selectedValue);
      return;
    }
    const cap = selectedValue.charAt(0).toUpperCase() + selectedValue.slice(1);
    let candidate = document.getElementById(settingKey + cap);
    if (!candidate) {
      // try value + capitalized (e.g., 'tailLong' already covered, but try value capitalized alone)
      candidate = document.getElementById(selectedValue + cap);
    }
    if (candidate) {
      try { candidate.classList.remove('hidden'); candidate.style.display = ''; } catch (e) {}
      return;
    }

    // 4) If still not found, log for debugging
    console.debug(`updateSetting: unable to find target for ${settingKey} -> ${selectedValue}`);
  }

  Object.keys(settings).forEach(settingKey => {
    const setting = settings[settingKey];
    if (!setting || !setting.select) return;
    setting.select.addEventListener('change', (event) => {
      console.debug(`change fired for ${settingKey}:`, event.target.value);
      updateSetting(settingKey, event.target.value);
      updateInlinePrice(settingKey);
      renderOptionPrices(settingKey);
      hasUnsavedChanges = true;
    });

    // create inline price element after select
    (function ensurePriceEl() {
      let el = setting.select.nextElementSibling;
      if (!el || !el.classList || !el.classList.contains('option-price')) {
        el = document.createElement('span');
        el.className = 'option-price';
        setting.select.parentNode.insertBefore(el, setting.select.nextSibling);
      }
    })();

    // Initialize visibility for each setting and inline price
    updateSetting(settingKey, setting.select.value);
    updateInlinePrice(settingKey);
    renderOptionPrices(settingKey);
  });

  // Render summary content into the final step
  function renderSummary() {
    // Textual fields
    const mapText = (selector, targetId) => {
      const el = document.querySelector(selector);
      const out = document.getElementById(targetId);
      if (!out) return;
      if (!el) { out.textContent = ''; return; }
      const text = el.options ? el.options[el.selectedIndex].text : el.value;
      out.textContent = text;
    };

    mapText('#ears', 'summary-ears');
    mapText('#eyes', 'summary-eyes');
    mapText('#nose', 'summary-nose');
    mapText('#mouth', 'summary-mouth');
    mapText('#tail', 'summary-tail');
    mapText('#tail-pattern', 'summary-tail-pattern');

    // Colors
    const mapColor = (inputSelector, targetId) => {
      const input = document.querySelector(inputSelector);
      const out = document.getElementById(targetId);
      if (!out) return;
      out.textContent = input ? input.value : '';
      if (input && input.value) {
        out.style.background = input.value;
        out.style.color = getContrastingColor(input.value);
        out.style.padding = '0.1rem 0.4rem';
        out.style.borderRadius = '4px';
        out.style.display = 'inline-block';
      } else {
        out.style.background = '';
      }
    };

    mapColor('#fur-color', 'summary-furColor');
    mapColor('#ears-color', 'summary-earsColor');
    mapColor('#tail-color', 'summary-tailColor');
    mapColor('#stripes-color', 'summary-stripesColor');
    mapColor('#belly-color', 'summary-bellyColor');
    mapColor('#paws-color', 'summary-pawsColor');
    mapColor('#tapochki-color', 'summary-tapochkiColor');
    mapColor('#nose-color', 'summary-noseColor');

    // SVG preview (clone current SVG)
    const preview = document.getElementById('summary-preview');
    const svg = document.querySelector('.cat-constructor');
    if (preview && svg) {
      preview.innerHTML = '';
      const clone = svg.cloneNode(true);
      clone.removeAttribute('id');
      clone.style.maxWidth = '220px';
      clone.style.width = '100%';
      clone.style.height = 'auto';
      preview.appendChild(clone);
    }

    // Pricing: compute breakdown and total
    const breakdownEl = document.getElementById('price-breakdown');
    const totalEl = document.getElementById('summary-total');
    if (breakdownEl) breakdownEl.innerHTML = '';
    let total = prices.base;
    // show base price
    if (breakdownEl) {
      const li = document.createElement('li');
      li.textContent = `Базовая цена кота: ${prices.base} ₽`;
      breakdownEl.appendChild(li);
    }

    // check selects for deviations from defaults
    Object.keys(settings).forEach(key => {
      const s = settings[key];
      if (!s || !s.select) return;
      const cur = s.select.value;
      const def = defaultConfig.selects[key];
      if (cur !== def) {
        const extra = (prices.selects[key] && prices.selects[key][cur]) ? prices.selects[key][cur] : 0;
        total += extra;
        if (breakdownEl) {
          const labelText = `${s.select.options[s.select.selectedIndex].text} (${key})`;
          const li = document.createElement('li');
          li.textContent = `${labelText}: +${extra} ₽`;
          breakdownEl.appendChild(li);
        }
      }
    });

    // check colors
    const colorKeys = Object.keys(defaultConfig.colors);
    colorKeys.forEach(k => {
      const sel = `#${k}`;
      const input = document.querySelector(sel);
      if (!input) return;
      const def = defaultConfig.colors[k];
      if (input.value !== def) {
        const extra = prices.colors[k] || 0;
        total += extra;
        if (breakdownEl) {
          const li = document.createElement('li');
          li.textContent = `Изменён цвет ${k.replace('-',' ')}: +${extra} ₽`;
          breakdownEl.appendChild(li);
        }
      }
    });

    if (totalEl) {
      totalEl.textContent = `Итого: ${total} ₽`;
      totalEl.style.fontWeight = '700';
      totalEl.style.marginTop = '0.6rem';
    }
  }

  // Build a cart item JSON from current selections/colors and pricing
  function buildCartItem() {
    const selects = {};
    Object.keys(settings).forEach(key => {
      const s = settings[key];
      if (!s || !s.select) return;
      const val = s.select.value;
      const text = s.select.options[s.select.selectedIndex]?.text || val;
      selects[key] = { value: val, label: text };
    });
    const colors = {};
    ['fur-color','ears-color','tail-color','stripes-color','belly-color','paws-color','tapochki-color','nose-color']
      .forEach(id => {
        const el = document.getElementById(id);
        if (el) colors[id] = el.value;
      });

    // Compute price total similarly to renderSummary
    let total = prices.base;
    const breakdown = [];
    breakdown.push({ label: 'Базовая цена кота', amount: prices.base });
    Object.keys(settings).forEach(key => {
      const s = settings[key];
      if (!s || !s.select) return;
      const cur = s.select.value;
      const def = defaultConfig.selects[key];
      if (cur !== def) {
        const extra = (prices.selects[key] && prices.selects[key][cur]) ? prices.selects[key][cur] : 0;
        total += extra;
        breakdown.push({ label: `${s.select.options[s.select.selectedIndex].text} (${key})`, amount: extra });
      }
    });
    Object.keys(defaultConfig.colors).forEach(k => {
      const input = document.getElementById(k);
      if (!input) return;
      const def = defaultConfig.colors[k];
      if (input.value !== def) {
        const extra = prices.colors[k] || 0;
        total += extra;
        breakdown.push({ label: `Изменён цвет ${k.replace('-',' ')}`, amount: extra });
      }
    });

    // Snapshot SVG as markup for preview in basket
    const svg = document.querySelector('.cat-constructor');
    const svgHtml = svg ? svg.outerHTML : '';

    return {
      id: Date.now(),
      selects,
      colors,
      basePrice: prices.base,
      breakdown,
      total,
      svg: svgHtml,
    };
  }

  // Utility: decide contrasting text color for swatches
  function getContrastingColor(hex) {
    if (!hex) return '#000';
    const c = hex.replace('#','');
    const r = parseInt(c.substr(0,2),16);
    const g = parseInt(c.substr(2,2),16);
    const b = parseInt(c.substr(4,2),16);
    const yiq = (r*299 + g*587 + b*114) / 1000;
    return yiq >= 128 ? '#000' : '#fff';
  }

  // ---------- Цвета: привязка инпутов цвета к частям SVG ----------
  const colorMappings = [
    { input: '#fur-color', targets: ['#body', '#bodyMain'] },
    { input: '#ears-color', targets: ['#earsNormal', '#earsTufted', '#earsFolded', '#earsNone'] },
    { input: '#tail-color', targets: ['#tailLong', '#tailShort', '#tailNone'] },
    { input: '#stripes-color', targets: ['#stripes', '#stripe1Left', '#stripe2Left', '#stripe1Right', '#stripe2Right'] },
    { input: '#belly-color', targets: ['#belly', '#bellyMain'] },
    { input: '#paws-color', targets: ['#backLeftPaw', '#backRightPaw', '#frontLeftPaw', '#frontRightPaw'] },
    { input: '#tapochki-color', targets: ['#backLeftTapochka', '#backRightTapochka', '#frontLeftTapochka', '#frontRightTapochka'] },
    { input: '#nose-color', targets: ['#noseTriangle', '#noseRound', '#noseRoundPath'] },
  ];

  colorMappings.forEach(mapping => {
    const input = document.querySelector(mapping.input);
    if (!input) return;
    const applyColor = (value) => {
      mapping.targets.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          el.style.color = value;
        });
      });
    };
    input.addEventListener('input', (e) => {
      applyColor(e.target.value);
      updateInlineColorPrice(input);
      hasUnsavedChanges = true;
    });
    // initialize
    applyColor(input.value);
    // ensure price span exists
    (function ensureColorPriceEl() {
      let el = input.nextElementSibling;
      if (!el || !el.classList || !el.classList.contains('option-price')) {
        el = document.createElement('span');
        el.className = 'option-price';
        input.parentNode.insertBefore(el, input.nextSibling);
      }
      updateInlineColorPrice(input);
    })();
  });

  // Update inline price for select setting
  function updateInlinePrice(settingKey) {
    const setting = settings[settingKey];
    if (!setting || !setting.select) return;
    const select = setting.select;
    const cur = select.value;
    const def = defaultConfig.selects[settingKey];
    const span = select.parentNode.querySelector('.option-price');
    if (!span) return;
    const extra = (prices.selects[settingKey] && prices.selects[settingKey][cur]) ? prices.selects[settingKey][cur] : 0;
    span.textContent = `+${extra} ₽`;
    span.style.display = 'inline-block';
  }

  // Update inline price for color input
  function updateInlineColorPrice(input) {
    if (!input) return;
    const key = input.id; // e.g. 'fur-color'
    const def = defaultConfig.colors[key];
    const span = input.parentNode.querySelector('.option-price');
    if (!span) return;
    const extra = prices.colors[key] || 0;
    span.textContent = `+${extra} ₽`;
    span.style.display = 'inline-block';
  }

  // Поместить группы хвоста в начало SVG, чтобы хвост рендерился позади остальных элементов
  (function moveTailToBack() {
    const svg = document.querySelector('.cat-constructor');
    if (!svg) return;
    ['tailLong', 'tailShort', 'tailNone'].forEach(id => {
      const node = document.getElementById(id);
      if (node) svg.insertBefore(node, svg.firstChild);
    });
  })();
});