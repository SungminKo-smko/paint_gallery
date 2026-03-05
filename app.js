const tabs = document.querySelectorAll('.tab');
const grids = document.querySelectorAll('.grid');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.classList.remove('active'));
    grids.forEach((g) => g.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});
