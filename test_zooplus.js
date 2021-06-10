const axios = require("axios");
const cheerio = require("cheerio");

const baseURL = "https://www.zooplus.fr/esearch.htm#q%3DPurina%2520chien";

(async () => {
  const html = await axios.get(baseURL);
  const $ = await cheerio.load(html.data);
  console.log($.html());
  let data = [];
  $(".exo-prod-url").each((i, elem) => {
    data.push({
      // title: $(elem).find("h1").text(),
      // paragraph: $(elem).find("p").text(),
      link: $(elem).find("a").attr("href"),
      // link: $(elem).find("a.exo-prod-url").attr("href"),
    });
  });
  console.log(data);
})();

/* si body en ligne 10, cela renvoie :
[
    title: 'Résultats de votre recherche Nous n’avons trouvé aucune correspondance pour terme que vous recherchez.',
tre recherche : assurez-vous que les mots sont correctement orthographiés ou essayez avec des synonymes. Si vous ne trouvez toujours pas ce que vous cherchez, n’hésitez pas à contacter notre service client, pour obtenir de l’aide ou pour nous demander d’ajouter un produit en particulier à notre boutique.  Filtrer par  Filtrer parFiltrer par',
    link: '/checkout/overview'
  }
] */
