/*
    上架物品：名称（单引号不能省略），售价，数量
    根据自身需求修改上架物品
    确保是交易搜索框能搜出来的物品，因为国服更新比较慢有的部件没更新交易
    需要用浏览器打开交易中心，网址为：
    https://trade.wf.qq.com/?hcfrom=WeGame.helper
    之后按f12打开控制台将下面的代码粘在控制台上按回车
*/

let list = [
  ['舍杜手炮枪机', 2, 1],
  ['舍杜手炮枪托', 2, 1],
  ['舍杜手炮握柄', 2, 1],
  ['舍杜手炮机体', 2, 1],
  ['手枪元素师', 2, 1],
  ['霰弹枪元素师', 2, 1],
  ['近战元素师', 2, 1],
  ['毒素弹幕', 1, 1],
  ['强力火力', 1, 1],
  ['剧毒灾害', 1, 1],
  ['异变手枪', 1, 1],
  ['地狱弹膛', 1, 1],
  ['分裂弹头', 1, 1],
  ['敏锐主武', 1, 1],
  ['励磁加速', 1, 1],
  ['磁化利爪', 1, 1],
  ['磁性弹容', 1, 1],
  ['追踪齐射', 1, 1],
  ['辐能利爪', 1, 1],
  ['衔回猎物', 1, 1],
  ['热流涌动', 1, 1],
  ['铁甲矩阵', 2, 1],
  ['一击消灭', 1, 1],
  ['集中聚精会神', 1, 1],
  ['能量枢纽', 1, 1],
  ['磨砺锋刃', 2, 1],
  ['烈焰风暴', 1, 1],
  ['毁灭堕落者', 1, 1],
  ['列阵归队', 2, 1],
  ['半自动步枪炮轰', 2, 1],
  ['半自动手枪炮轰', 2, 1],
  ['圣装迅电驰影 套装', 6, 1],
  ['圣装泊时灵械 套装', 6, 1],
  ['圣装虚空残响 套装', 6, 1],
  ['圣装无限术士 套装', 6, 1],
  ['圣装剧毒之触 套装', 8, 1],
  ['圣装暴食者 套装', 6, 1],
  ['主要·霜冻', 4, 1, 5],
  ['双枪·滑射', 5, 1, 5],
  ['次要·爆发', 10, 1, 5],
  ['赋能·充沛', 45, 1, 5],
  ['赋能·加速', 8, 1, 5],
  ['赋能·加速', 8, 1, 5],
  ['赋能·反击者', 9, 1, 5],
  ['高阶狂热打击', 8, 1, 10],
  ['高阶血压点', 8, 1, 10],
  ['高阶充电弹头', 8, 1, 10],
  ['高阶川流不息', 8, 1, 10],
  ['高阶弹夹增幅', 8, 1, 10],
  ['高阶串联弹夹', 8, 1, 10],
  ['高阶抵近射击', 8, 1, 10],
  ['高阶持久力', 8, 1, 10],
  ['高阶摧枯拉朽', 8, 1, 10],
];

function create() {
  let btn = document.querySelector('.btn_fqyy2.sp');

  function init([name, value, count, level = 0]) {
    btn.click();
    setTimeout(() => {
      let a = document.querySelector('.ipt1.slct1');
      var inputEvent = new Event('input', {
        bubbles: true,
        cancelable: true,
      });
      a.value = name;
      a.dispatchEvent(inputEvent);
      setTimeout(() => {
        document.querySelectorAll('.tipstxt')[0].click();
        let b = document.querySelectorAll('.pop_ipt3')[0];
        b.value = value;
        b.dispatchEvent(inputEvent);
        let c = document.querySelectorAll('.pop_ipt3')[1];
        c.value = count;
        c.dispatchEvent(inputEvent);
        if (level !== 0) {
          let d = document.querySelectorAll('.pop_ipt3')[2];
          d.value = level;
          d.dispatchEvent(inputEvent);
        }
        document.querySelector('.popxhbtn1.db').click();
        document.querySelector('.pop_close.sp.db').click();
      }, 1000);
    }, 500);
  }

  for (let i = 0; i < list.length; i++) {
    setTimeout(() => {
      init(list[i]);
    }, 2500 * i);
  }
}

function clear() {
  let allNode = document.querySelectorAll('.btn_del');
  if (!allNode?.[0]) {
    return;
  }
  allNode.forEach(i => {
    i.click();
  });
  setTimeout(() => {
    document.querySelector('.pop_close.sp.db').click();
  }, 500);
}

document.querySelector('.top_bar li:nth-of-type(3) a').click();

setTimeout(() => {
  clear();
  setTimeout(() => {
    document.querySelector('.logo.db').click();
    setTimeout(() => {
      create();
    }, 500);
  }, 500);
}, 500);
