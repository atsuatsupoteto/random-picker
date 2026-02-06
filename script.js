const names = [];
let clickCount = 0;
let clickTimer = null;

const isPickupPage = window.location.pathname.includes('pickup.html');

document.getElementById('title').addEventListener('click', function() {
  clickCount++;
  if (clickCount === 3) {
    window.location.href = isPickupPage ? 'index.html' : 'pickup.html';
  }
  clearTimeout(clickTimer);
  clickTimer = setTimeout(() => { clickCount = 0; }, 800);
});

function isHiguchi(s) {
  const n = s.normalize('NFKC');
  return /(樋口|ひぐち|ヒグチ)/.test(n);
}

function addName() {
  const input = document.getElementById("nameInput");
  const name = input.value.trim();
  if (name) {
    names.push(name);
    updateNames();
    input.value = "";
    if (isPickupPage) input.focus();
  }
}

function updateNames() {
  const listDiv = document.getElementById("names");
  listDiv.innerHTML = "";
  names.forEach(n => {
    const div = document.createElement("div");
    div.className = "name";
    div.textContent = n;
    listDiv.appendChild(div);
  });
}

function pickRandom() {
  const resultEl = document.getElementById("result");
  if (names.length === 0) {
    resultEl.textContent = "名前がありません！";
    return;
  }

  let pool = names;
  if (isPickupPage) {
    const riggedCandidates = names.filter(isHiguchi);
    pool = riggedCandidates.length > 0 ? riggedCandidates : names;
  }

  const picked = pool[Math.floor(Math.random() * pool.length)];
  let index = 0;
  let count = 0;
  const maxCount = 65;
  
  resultEl.classList.add('spinning');
  
  function spin() {
    resultEl.textContent = names[index % names.length];
    index++;
    count++;
    
    if (count >= maxCount) {
      resultEl.textContent = names[index % names.length];
      resultEl.classList.remove('spinning');
      setTimeout(() => {
        resultEl.textContent = `漢気を見せるのは: ${picked}`;
        setTimeout(() => {
          resultEl.classList.add('selected');
          setTimeout(() => resultEl.classList.remove('selected'), 300);
        }, 200);
      }, 50);
      return;
    }
    
    let delay = 50;
    if (count > maxCount * 0.5) {
      delay = 50 + (count - maxCount * 0.5) * 8;
    }
    if (count > maxCount * 0.8) {
      delay = 50 + (count - maxCount * 0.5) * 15;
    }
    
    setTimeout(spin, delay);
  }
  
  spin();
}
