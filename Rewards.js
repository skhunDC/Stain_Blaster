/**
 * Rewards.js – tier pick, win-streak adjustment, progress bar UI
 */
let winStreak = 0;
let points    = 0;
const thresholds = [0.60,0.85,0.97,1.00];
let seed = 42;

function rng(){
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}

function rand(){
  const debug = new URLSearchParams(location.search).get('debug') === 'true';
  return debug ? rng() : Math.random();
}

function pickTier(){
  const r = rand();
  for(let i=0;i<thresholds.length;i++){
    if(r <= thresholds[i]) return i+1;
  }
  return 4;
}

function handleReward(win, level, cb){
  const playerId = localStorage.getItem('playerId') || (Math.random().toString(36).slice(2));
  localStorage.setItem('playerId', playerId);
  if(typeof google !== 'undefined'){
    google.script.run.withSuccessHandler(res=>{
      winStreak = res.winStreak;
      updatePoints(win);
      cb(res);
    }).playGame(playerId, win, level);
  }else{
    const tier = pickTier();
    updatePoints(win);
    cb({tier, rewardText:REWARDS_TEXT[tier], qrBlob:null, winStreak:winStreak});
  }
}

function updatePoints(win){
  points += 5;
  if(win) points += 10;
  const bar = document.getElementById('pointsBar');
  if(bar){
    bar.style.width = Math.min(points,100) + '%';
  }
}

const REWARDS_TEXT = {
  1:'Eco tip: line-dry to save energy',
  2:'$5 cleaning credit',
  3:'$10 cleaning credit',
  4:'Comped premium garment'
};
