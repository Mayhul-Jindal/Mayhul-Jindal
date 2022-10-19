const Mustache = require('mustache');
const fs = require('fs');
const MUSTACHE_MAIN_DIR = './main.mustache';

// let bookmarksData = {
//     topic1 : [{name: "hala", url: "www.some",}, {name: "hooho", url: "wwww.hfhf",}],
//     topic2 : [{name: "opop", url: "www.opop",}, {name: "qqwww", url: "wwww.qwqw",},{name: "mmama", url: "www.mama",}, {name: "vbnv", url: "wwww.vcbn",}],
//     topic3 : [{name: "mayhul", url: "www.jindal",}],
//     topic4 : [{name: "mayhul", url: "www.jindal",}],
// }

let table = {}

async function generateTable(){
    let bookmarksData = await fetch(`https://5861-185-177-125-178.eu.ngrok.io/getBookmarks`)
    console.log(bookmarksData)
    let maxElement = 0;
    let h = `<tr></tr>`; // yaha to hheading ke saath done hain
    let r = ``;
    for (const key in bookmarksData) {
        if(bookmarksData[key].length > maxElement){
            maxElement = bookmarksData[key].length
        }
        h = h.slice(0,4) + `<th>${key}</th>` + h.slice(4)
    }
    for (let index = 0; index < maxElement; index++) {
        let tempr = `<tr></tr>`
        for (const key in bookmarksData) {
            if(bookmarksData[key][index] != undefined){
                tempr = tempr.slice(0,4) + `<td><a href="${bookmarksData[key][index].url}">${bookmarksData[key][index].name}</a></td>` + tempr.slice(4)
            }else{
                tempr = tempr.slice(0,4) + `<td></td>` + tempr.slice(4)
            }
        }
        r = r + tempr
    }

    table.headings = h;
    table.rows = r;

    console.log(table)
}

async function generateReadMe() {
    await generateTable()
    await fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
      if (err) throw err;
      const output = Mustache.render(data.toString(), table);
      fs.writeFileSync('README.md', output);
    });
}

generateReadMe()
