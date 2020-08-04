
const fs = require('fs');
const total = []

for (var i = 0 ; i < 200001; i += 1000) {
  const filename = `poet.song.${i}.json`
  const list = require(`./data/${filename}`) 
  list.forEach((one) => {
    total.push(one)
  });
}


fs.writeFileSync("./data/total_song.json",JSON.stringify(total),"utf8")

console.log("get total count",total.length);
