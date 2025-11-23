export function initConstructor() {
  const furColorInput = document.getElementById('fur-color');
  const earsColorInput = document.getElementById('ears-color');
  const tailColorInput = document.getElementById('tail-color');
  const patternSelect = document.getElementById('pattern');
  const eyesColorSelect = document.getElementById('eyes-color');
  const temperSelect = document.getElementById('temper');
  
  if (!furColorInput) return;
  
  const svg = document.querySelector('.cat-constructor');
  if (!svg) return;
  
  function updateColors() {
    const furColor = furColorInput.value;
    const earsColor = earsColorInput.value;
    const tailColor = tailColorInput.value;
    
    const bodyElements = svg.querySelectorAll('#body, #belly, #stripes .stripe');
    bodyElements.forEach(el => {
      el.style.color = furColor;
    });
    
    const earsElements = svg.querySelectorAll('.ear');
    earsElements.forEach(el => {
      el.style.color = earsColor;
    });
    
    const tailElements = svg.querySelectorAll('.tail-path');
    tailElements.forEach(el => {
      el.style.color = tailColor;
    });
  }
  
  function updatePattern() {
    const pattern = patternSelect.value;
    const stripes = svg.querySelector('#stripes');
    
    if (stripes) {
      stripes.style.display = pattern === 'striped' ? 'block' : 'none';
    }
  }
  
  function updateEyes() {
    const eyesColor = eyesColorSelect.value;
    const pupils = svg.querySelectorAll('.eye-pupil');
    
    const colorMap = {
      green: '#4CAF50',
      blue: '#2196F3',
      amber: '#FF9800'
    };
    
    pupils.forEach(pupil => {
      pupil.setAttribute('fill', colorMap[eyesColor] || '#000');
    });
  }
  
  furColorInput.addEventListener('input', updateColors);
  earsColorInput.addEventListener('input', updateColors);
  tailColorInput.addEventListener('input', updateColors);
  patternSelect.addEventListener('change', updatePattern);
  eyesColorSelect.addEventListener('change', updateEyes);
  
  updateColors();
  updatePattern();
  updateEyes();
}


