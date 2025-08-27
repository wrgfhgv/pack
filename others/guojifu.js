// 按 ctrl+下滚轮 把页面缩小到所有物品全部出现在屏幕中再粘贴代码

const a = document.querySelectorAll(
  '.widget-modal__actions--bs5BU .btn__primary--L8HyD',
)[1];
const b = document.querySelectorAll('.btn.btn__primary--L8HyD.red--sqBa6')[2];
let i = 0;
const list = document.querySelectorAll('.order-own--NIM7c');
let c = setInterval(() => {
  list[i]
    .querySelector('.order-own__buttons--E1wap')
    .childNodes[0].childNodes[1].click();
  setTimeout(() => {
    a.click();
  }, 200);
  console.log(
    list[i].querySelector('.order-own__item-name--K7IDS span').innerHTML +
      '------更新完成',
  );
  i++;
  if (i === list.length) {
    clearInterval(c);
    b.click();
  }
}, 1500);
