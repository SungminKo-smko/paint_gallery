const tabs = document.querySelectorAll('.tab');
const grids = document.querySelectorAll('.grid');
const authModal = document.getElementById('authModal');
const loginOpenBtn = document.getElementById('loginOpenBtn');
const authCloseBtn = document.getElementById('authCloseBtn');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const uploadBtn = document.getElementById('uploadBtn');
const toast = document.getElementById('toast');

function showToast(text) {
  toast.textContent = text;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 1600);
}

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
  if (!email || !password) {
    showToast('이메일과 비밀번호를 입력해요.');
    return;
  }
  authModal.classList.add('hidden');
  showToast('로그인 UI 확인 완료!');
});

uploadBtn.addEventListener('click', () => {
  showToast('다음 단계: 그림 업로드 화면 만들기');
});
