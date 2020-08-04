const source_list = require("./data/total_song.json")
const OpenCC = require('opencc');
const converter = new OpenCC('t2s.json');
const cnchar = require('cnchar')
const colors = require('colors');
const getStokeWithTone = require('./tone')
const w7 = getStokeWithTone(7)
const w8 = getStokeWithTone(8)
const w9 = getStokeWithTone(9)

//   {                                                                                                                                                                                                                                      
    //author: '李白',                                                                                                                                                                                                                      
    //paragraphs: [ '昭君拂玉鞍，上馬啼紅頰。', '今日漢宮人，明朝胡地妾。' ],                                                                                                                                                              
    //title: '相和歌辭 王昭君二首 二',                                                                                                                                                                                                     
    //id: 'd859edea-5188-4d7f-b4c2-f281d106bd59'                                                                                                                                                                                           
  //},    
//console.log(source_list);

const black_list = require("./black.json")

const black_map = {}
black_list.forEach((one) => {
  black_map[one] = true
});

const hz_exp = new RegExp("[\u4e00-\u9fa5]")

let is_poly_map = {}
const is_poly = (t) => {
  if (is_poly_map[t] == undefined) {
    let py = cnchar.spell(t,"poly","tone")
    if (t == py) {
      is_poly_map[t] = true
    } else if (py.split("|").length > 1) {
      is_poly_map[t] = true
    } else {
      let spellInfo = cnchar.spellInfo(py)
      if (spellInfo.tone == 4 || spellInfo.tone == 3) {
        is_poly_map[t] = true
      } else {
        is_poly_map[t] = false
      }
    }
  }
  return is_poly_map[t]
}

const isPingTone = (t) => {
  const tone = cnchar.spellInfo(t)
};

const max_stroke = 20

const head_tail = () => {
  source_list.forEach((poet) => {
    const lines = poet.paragraphs
    lines.forEach((one) => {
      one = converter.convertSync(one)
      const short_lines = one.split("，")
      short_lines.forEach((line) => {
        if (line) {
          line = line.replace("。","")
          //if (line.length != 7) {
            //return
          //}
          const head_word = line[0]
          const last_word = line[line.length - 1]
          if (!hz_exp.test(head_word) || !hz_exp.test(last_word)) {
            return
          }

          if (is_poly(head_word) || is_poly(last_word)) {
            return
          }

          let stroke_c = cnchar.stroke(head_word)
          if (stroke_c != 7) {
            return
          }
          stroke_c = cnchar.stroke(last_word)
          if (stroke_c != 7) {
            return
          }

          if (black_map[head_word] || black_map[last_word]) {
            return
          }
          let name = `沈${head_word}${last_word}`
          console.log("%s  [%s - %s %s]",name,poet.author,poet.title,one);
        }
      });
    });
  });
};

const word_pick = () => {
  source_list.forEach((poet) => {
    const lines = poet.paragraphs
    lines.forEach((one) => {
      one = converter.convertSync(one)
      const short_lines = one.split(/[，。？]/)
      short_lines.forEach((line) => {
        if (line) {
          let hit_count = 0
          let name = "沈"
          let color_str = ""
          for (let i = 0; i < line.length; ++i) {
            const c = line[i]
            if (hit_count == 0 && w7[c] == 1) {
              hit_count++
              name = name + c
              color_str += colors.green(c)
            } else if (hit_count == 1 && w7[c] == 1) {
              hit_count++
              name = name + c
              color_str += colors.green(c)
            } else {
              color_str += c
            }
          }
          if (hit_count >= 2) {
            console.log("%s  [%s - %s %s]",colors.green(name),poet.author,poet.title,color_str);
          }
        }
      });
    });
  });
};


word_pick()
