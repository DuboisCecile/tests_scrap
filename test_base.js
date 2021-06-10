const cheerio = require("cheerio");

const $ = cheerio.load(
  '<h2 class="title myh2">Hello world</h2><h3 class="title">Essai2</h3>',
  null,
  false
);

$(".title").text("Hello there!");
$("h2").addClass("welcome");

console.log($.html());
