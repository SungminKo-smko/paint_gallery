const tabs = document.querySelectorAll('.tab');
const grids = document.querySelectorAll('.grid');
const authModal = document.getElementById('authModal');
const saveModal = document.getElementById('saveModal');
const loginOpenBtn = document.getElementById('loginOpenBtn');
const authCloseBtn = document.getElementById('authCloseBtn');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const saveBtn = document.getElementById('saveBtn');
const saveCloseBtn = document.getElementById('saveCloseBtn');
const saveConfirmBtn = document.getElementById('saveConfirmBtn');
const drawModeBtn = document.getElementById('drawModeBtn');
const exitDrawModeBtn = document.getElementById('exitDrawModeBtn');
const toast = document.getElementById('toast');

const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const brushSizeLabel = document.getElementById('brushSizeLabel');
const eraserBtn = document.getElementById('eraserBtn');
const penBtn = document.getElementById('penBtn');
const clearBtn = document.getElementById('clearBtn');

let drawing = false;
let eraserMode = false;

function setupCanvasResolution() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const displayWidth = Math.max(1, Math.floor(rect.width));
  const displayHeight = Math.max(1, Math.floor(rect.height));

  // 리사이즈 전 그림 백업
  const prev = document.createElement('canvas');
  prev.width = canvas.width;
  prev.height = canvas.height;
  const prevCtx = prev.getContext('2d');
  if (canvas.width > 0 && canvas.height > 0) {
    prevCtx.drawImage(canvas, 0, 0);
  }

  canvas.width = Math.floor(displayWidth * dpr);
  canvas.height = Math.floor(displayHeight * dpr);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // 이전 그림 복원(새 비율에 맞춰 스케일)
  if (prev.width > 0 && prev.height > 0) {
    ctx.drawImage(prev, 0, 0, prev.width, prev.height, 0, 0, displayWidth, displayHeight);
  }

  ctx.strokeStyle = eraserMode ? '#ffffff' : colorPicker.value;
  ctx.lineWidth = Number(brushSize.value);
}

setupCanvasResolution();
window.addEventListener('resize', setupCanvasResolution);

function showToast(text) {
  toast.textContent = text;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 1600);
}

function toggleDrawingMode(isOn) {
  document.body.classList.toggle('drawing-mode', isOn);
  exitDrawModeBtn.classList.toggle('hidden', !isOn);

  requestAnimationFrame(() => {
    setupCanvasResolution();
  });

  showToast(isOn ? '전체화면 그리기 모드' : '일반 화면으로 돌아왔어요.');
}

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  const point = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]) || e;
  const x = point.clientX - rect.left;
  const y = point.clientY - rect.top;
  return { x, y };
}

function startDraw(e) {
  drawing = true;
  const { x, y } = getPos(e);
  ctx.beginPath();
  ctx.moveTo(x, y);
}

function draw(e) {
  if (!drawing) return;
  const { x, y } = getPos(e);
  ctx.lineTo(x, y);
  ctx.stroke();
}

function endDraw() {
  drawing = false;
  ctx.closePath();
}

canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', draw);
window.addEventListener('mouseup', endDraw);
canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDraw(e); }, { passive: false });
canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); }, { passive: false });
canvas.addEventListener('touchend', endDraw);

colorPicker.addEventListener('input', () => {
  if (!eraserMode) ctx.strokeStyle = colorPicker.value;
});

brushSize.addEventListener('input', () => {
  ctx.lineWidth = Number(brushSize.value);
  brushSizeLabel.textContent = brushSize.value;
});

eraserBtn.addEventListener('click', () => {
  eraserMode = true;
  ctx.strokeStyle = '#ffffff';
  showToast('지우개 모드');
});

penBtn.addEventListener('click', () => {
  eraserMode = false;
  ctx.strokeStyle = colorPicker.value;
  showToast('펜 모드');
});

clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  showToast('캔버스를 비웠어요.');
});

drawModeBtn.addEventListener('click', () => toggleDrawingMode(true));
exitDrawModeBtn.addEventListener('click', () => toggleDrawingMode(false));

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.classList.remove('active'));
    grids.forEach((g) => g.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

loginOpenBtn.addEventListener('click', () => authModal.classList.remove('hidden'));
authCloseBtn.addEventListener('click', () => authModal.classList.add('hidden'));

authSubmitBtn.addEventListener('click', () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!email || !password) return showToast('이메일과 비밀번호를 입력해요.');
  authModal.classList.add('hidden');
  showToast('로그인 UI 확인 완료!');
});

saveBtn.addEventListener('click', () => saveModal.classList.remove('hidden'));
saveCloseBtn.addEventListener('click', () => saveModal.classList.add('hidden'));

saveConfirmBtn.addEventListener('click', () => {
  const title = document.getElementById('drawingTitle').value.trim();
  const visibility = document.getElementById('visibilitySelect').value;
  if (!title) return showToast('그림 제목을 입력해요.');
  saveModal.classList.add('hidden');
  showToast(`저장 준비 완료: ${title} (${visibility === 'public' ? '공개' : '비공개'})`);
});
