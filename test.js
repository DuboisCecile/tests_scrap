const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
// const CronJob = require("cron").CronJob;
// const nodemailer = require("nodemailer");

const prefix = "https://www.zooplus.fr";
const baseURL = `${prefix}/esearch.htm#q%3D7613035120402`; // pour code barre 7613035120402
console.log(baseURL);
// const url = "https://www.amazon.com/Sony-Noise-Cancelling-Headphones-WH1000XM3/dp/B07G4MNFS1/";

async function configureBrowser(url) {
  // lancement de puppeeteer et configuration du navigateur
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  return page;
}

// .exo-prod-url
async function findDetailsUrl(page) {
  await page.reload(); // on recharge la page fonction s'exécute toutes les 15 minutes, mais on ne veut pas recharger le browser
  let html = await page.evaluate(() => document.body.innerHTML);
  let $ = await cheerio.load(html);
  console.log($);
  let urlList = [];
  $("a.exo-prod-url", html).each(() => {
    let exoProdUrl = $(this).attr("href");
    console.log("exoProdUrl   ", exoProdUrl);
    urlList.push(exoProdUrl);
  });
  console.log(urlList);
  return urlList;
}

// async function findDetails(page) {
//   await page.reload();
//   let html = await page.evaluate(() => document.body.innerHTML);
//   let $ = await cheerio.load(html);

//   const productName = $("h1.producttitle", html).text();
//   const productDetails = [];
//   $(".clearfix product__offer", html).each(() => {
//     // bloc de poids / prix
//     const volume = $(".article-description", html).text();
//     const price = $(".price__amount", html).text();
//     productDetails.push({ name: productName, volume, price });
//   });

//   return productDetails;
// }

async function startTracking() {
  const searchPage = await configureBrowser(baseURL);
  const urlList = await findDetailsUrl(searchPage);
  console.log(urlList);
  // if (urlList.length > 0) {
  //   const detailsURL = `${prefix}${urlList[0]}`;
  //   const pageDetails = await configureBrowser(detailsURL);
  //   const productDetails = await findDetails(pageDetails);
  //   console.log(productDetails);
  // }
}

startTracking();
