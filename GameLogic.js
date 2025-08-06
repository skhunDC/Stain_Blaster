/**
 * GameLogic.js – client difficulty/level logic
 * Each round lasts 12s and difficulty scales exponentially.
 */
let currentLevel = 1;
let timerHandle, spawnHandle, remainingStains;

function difficultyCurve(level){
  return {
    stainCount: Math.round(5 * Math.pow(1.45, level - 1)),
    stainSize: Math.max(20, 80 * Math.pow(0.88, level - 1)),
    spawnInterval: Math.max(200, 1000 * Math.pow(0.85, level - 1))
  };
}

function startGame(resultCallback){
  const area = document.getElementById('gameArea');
  document.getElementById('startScreen').classList.add('hidden');
  area.classList.remove('hidden');
  const diff = difficultyCurve(currentLevel);
  remainingStains = diff.stainCount;

  const levelEl = document.getElementById('levelBadge');
  levelEl.textContent = 'Level ' + currentLevel;

  const timerEl = document.getElementById('countdown');
  let t = 12;
  timerEl.textContent = t;
  timerHandle = setInterval(()=>{
    t--; timerEl.textContent = t;
    if(t <= 0){ endGame(false, resultCallback); }
  },1000);

  let spawned = 0;
  spawnHandle = setInterval(()=>{
    spawnStain(diff.stainSize, area, ()=>{
      remainingStains--;
      if(remainingStains <= 0){ endGame(true, resultCallback); }
    });
    spawned++;
    if(spawned >= diff.stainCount){ clearInterval(spawnHandle); }
  }, diff.spawnInterval);
}

function spawnStain(size, area, onRemove){
  const s = document.createElement('div');
  s.className = 'stain bg-amber-700 rounded-full';
  s.style.width = s.style.height = size + 'px';
  s.style.left = Math.random() * (area.clientWidth - size) + 'px';
  s.style.top  = Math.random() * (area.clientHeight - size) + 'px';
  s.addEventListener('pointerdown', ()=>{ s.remove(); onRemove(); });
  area.appendChild(s);
}

function endGame(win, cb){
  clearInterval(timerHandle);
  clearInterval(spawnHandle);
  document.querySelectorAll('#gameArea .stain').forEach(e=>e.remove());
  document.getElementById('gameArea').classList.add('hidden');
  currentLevel = win ? currentLevel + 1 : 1;
  if(cb) cb(win);
}
