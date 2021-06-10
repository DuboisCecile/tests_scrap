const axios = require("axios");
const cheerio = require("cheerio");

const baseURL =
  // "https://www.croquetteland.com/fr/purina-one-chien-mini-10kg-senior-poulet.html"
  "https://archeologie.culture.fr/chauvet/fr/grotte-chauvet-2-ardeche";
// "https://www.croquetteland.com/fr/purina-proplan-veterinary-diets-ha-chien.html?___store=fr";

(async () => {
  const html = await axios.get(baseURL);
  const $ = await cheerio.load(html.data);
  // console.log($.html());
  let data = [];
  $("body").each((i, elem) => {
    console.log($(elem).text());
    data.push({
      title: $(elem).find("h1").text(),
      title2: $(elem).find("h2").text(),
      name: $(elem).find(".base").text(),
      // paragraph: $(elem).find("p").text(),
      linktext: $(elem).find("a").text(),
      link: $(elem).find("a").attr("href"),
      // link: $(elem).find("a.exo-prod-url").attr("href"),
    });
  });
  console.log(data);
})();
