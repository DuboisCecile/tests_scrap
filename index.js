const rp = require("request-promise");
const otcsv = require("objects-to-csv");
const cheerio = require("cheerio");

const baseURL = "https://www.zooplus.fr/"; // URL de base du site
const searchURL = "/esearch.htm#q%3DPurina%2520chien"; // pattern pour la recherche sur Hill's Prescription diet k/d chien
// /esearch.htm#q=Hill%2527s%2520Prescription%2520Diet%2520k%252Fd%2520Poulet%2520chat&p=1&type_food=Croquettes&npp=48
// /esearch.htm#q=Hill%2527s%2520Prescription%2520Diet%2520k%252Fd&cats=2Chien%253ECroquettes

// si true, cela charge <html> <head> et <body> alors que si false, cela ne garde que le contenu du body

const getProducts = async () => {
  const searchHtml = await rp(baseURL + searchURL);
  console.log(baseURL + searchURL);
  // console.log(searchHtml);
  const $ = cheerio.load(searchHtml, null, false);
  const exo = $(".exo-prod-url").html();
  console.log(exo);
};

getProducts();
//   .then((result) => {
//     const transformed = new otcsv(result);
//     return transformed.toDisk("./output.csv");
//   })
//   .then(() => console.log("SUCCESSFULLY COMPLETED THE WEB SCRAPING SAMPLE"));
