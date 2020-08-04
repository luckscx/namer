
const cnchar = require('cnchar')
const black_word = require('black.json')

const block_map = {}
black_word.forEach((one) => {
  block_map[one] = true
});

const getStokeWithTone = (num) => {
  const str = cnchar.strokeToWord(num)

  const out = {}
  for (let i = 0; i < str.length; ++i) {
    const c = str[i]
    if (block_map[c]) {
      continue
    }
    let py = cnchar.spell(c,"poly","tone")
    //去掉多音字
    if (py.split("|").length > 1) {
    } else {
      let spellInfo = cnchar.spellInfo(py)
      if (spellInfo.tone == 2) {
        spellInfo.tone = 1
      }
      out[c] = spellInfo.tone
    }
  }
  return out
};


module.exports = getStokeWithTone;
