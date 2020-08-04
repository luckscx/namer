
const fs = require('fs');
const filter_list = []

const total_list = require(`./data/total_song.json`) 
total_list.forEach((one) => {
  const a = one.author
  if (a == "不详" || a == "無名氏" || a == "佚名" || a == "不詳") {
    return
  }
  filter_list.push(one)
});


fs.writeFileSync("./data/total_song_filter.json",JSON.stringify(filter_list),"utf8")

console.log("get filter count",total_list.length, filter_list.length);
