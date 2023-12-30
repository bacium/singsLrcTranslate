// console.log(lrc);
/***
 * 转化歌词数据
 * 1先把数据分割成数组
 * 2 然后遍历进行添加到对象中 obj={time:'timeLine',words:'content'}
 * 3把转化后的对象添加到数组中返回
 */
function parseData() {
  let lrcPart = lrc.split("\n")
  let timeData = []
  for (let i = 0; i < lrcPart.length; i++) {
    let formatdara = lrcPart[i].split("]")
    //  console.log(formatdara);
    const obj = {
      time: parseTime(formatdara[0]),
      words: formatdara[1],
    }
    //  console.log(obj);
    timeData.push(obj)
  }
  return timeData
}

/**
 * 把时间数据（String）转化成时间数据
 * @param {String} timeStr
 * @returns {Number}
 */

function parseTime(timeStr) {
  let time = timeStr.substring(1).split(":")
  return parseFloat((+time[0] * 60 + +time[1]).toPrecision(12))
}
let timeData = parseData()
//  console.log(timeData);
let elObj = {
  container: document.querySelector(".container"),
  ul: document.querySelector("ul"),
  li: document.querySelector(".container li"),
  audio:document.querySelector('audio')
}
function createElement() {
  // 创建一个fragment标签，把li元素添加进去，然后把fragment添加到ul中，这样处理可以优化性能，不然每次创建li都追加到ul中都会引起大量回流操作重新渲染dom。
  const fragment = document.createDocumentFragment()

  for (let index = 0; index < timeData.length; index++) {
    let li = document.createElement("li")
    li.textContent = timeData[index].words
    // console.log(li.textContent);
    fragment.appendChild(li)
  }
  elObj.ul.appendChild(fragment)
  // console.log(elObj.ul);
}

createElement()

/**
 * 查找当前播放时间歌词的下标，如果是当前时间比当前时间小，则播放的是前一句歌词，
 * @returns 返回前一个下标即当前播放的歌词
 * 如果查找不到当前下标则播放的是最后一句歌词，即返回length-1
 */
function findIndex() {
  const audio = document.querySelector("audio")
  activeTime = audio.currentTime
  // console.log(activeTime,'播放时间')
  for (let index = 0; index < timeData.length; index++) {
    if (activeTime < timeData[index].time) {
      // console.log(index-1);
      return index - 1
    }
  }
  return timeData.length - 1
}
//  容器高度
const containerHeight = elObj.container.clientHeight
//  li元素高度
const liHeight = elObj.ul.children[0].clientHeight
const maxHeight=elObj.ul.clientHeight-containerHeight
function setOffset() {
  // 播放当前的歌词下标
  let activeIndex = findIndex()
  console.log(activeIndex,'偏移下标');
  // 偏移高度
  let transHeight = liHeight * activeIndex + liHeight / 2 - containerHeight / 2
  if(transHeight<0) {
    transHeight=0
  }
  if(transHeight>maxHeight) {
    transHeight=maxHeight
  }
  // console.log(transHeight,'偏移距离');
  elObj.ul.style.transform=`translateY(-${transHeight}px)`
  let li=elObj.ul.querySelector('.active')
  if(li) {
    li.classList.remove('active')
  }

   li=elObj.ul.children[activeIndex]
  if(li) {
    li.classList.add('active')
  }
  
}
elObj.audio.addEventListener('timeupdate',()=>{
  // console.log(123);
  setOffset()
})

