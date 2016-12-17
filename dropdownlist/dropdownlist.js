var mockData = [
  '我是第一行',
  '我是第二行',
  '我是第三行',
  '我是第四行',
  '我是第五行',
  '我是第六行',
  '我是第七行',
  '我是第八行',
  '我是第九行',
  '我是第十行',
  '我是第十一行',
  '我是第十二行',
  '我是第十三行',
  '我是第十四行'
];

var listWrapper = document.querySelector('.list-wrapper-hook');
var listContent = document.querySelector('.list-content-hook');

function initData() {
  var tpl = [
    '{{#each this}}',
    '<li class="list-item">',
    '<span>{{this}}</span>',
    '</li>',
    '{{/each}}'].join('');

  var html = window.Handlebars.compile(tpl)(mockData);

  listContent.innerHTML = html
}

function initScroll() {
  var scroll = new window.BScroll(listWrapper, {
    probeType: 1
  });
  scroll.on('touchend', function (pos) {
    if (pos.y > 50) {
      setTimeout(function () {
        reloadData();
        scroll.refresh()
      }, 1000)
    }
  })
}

function reloadData() {
  var html = '<li class="list-item"><span>我是新增数据' + Math.random() + '</span></li><li class="list-item"><span>我是新增数据' + Math.random() + '</span></li>' +
    '<li class="list-item"><span>我是新增数据' + Math.random() + '</span></li>'

  listContent.innerHTML = html + listContent.innerHTML
}

initData();

initScroll();