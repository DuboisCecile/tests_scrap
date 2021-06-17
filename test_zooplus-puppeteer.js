const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const prefix = "https://www.zooplus.fr";
const baseURL = `${prefix}/esearch.htm#q%3D7613035120402`; // pour code barre 7613035120402

async function configureBrowser(url) {
  // lancement de puppeeteer et configuration du navigateur
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  return { page, browser };
}

async function findUrl(page) {
  // chargement de la page de recherche, puis du lien du premier produit pour pouvoir aller sur cette page de détails
  let html = await page.evaluate(() => document.body.innerHTML);
  let $ = await cheerio.load(html);
  let urlList = [];
  $("a.exo-prod-url", html).each(
    await function () {
      let exoProdUrl = $(this).attr("href");
      urlList.push(exoProdUrl);
    }
  );
  return urlList;
}

async function findDetails(page) {
  // chargement de la page de détails, puis du nom du produit, et des différentes poids avec leurs prix associés
  let html = await page.evaluate(() => document.body.innerHTML);
  let $ = await cheerio.load(html);

  const productName = $("h1.producttitle", html).text().trim();
  const productDetails = [];
  const offers = $(".product__offer", html).get();

  offers.forEach(async (elem) => {
    // elem = 1 bloc de poids/prix
    const volume = $(".article-description", elem, html).text().trim();
    const price = $("span.price__amount", elem).text().trim();
    productDetails.push({ name: productName, volume, price });
  });

  return productDetails;
}

async function startScraping() {
  // fonction de base
  const { page: searchPage, browser: browserUrl } = await configureBrowser(
    baseURL
  );
  const urlList = await findUrl(searchPage);
  const detailsUrl = `${prefix}${urlList[0]}`;
  console.log(detailsUrl);
  await browserUrl.close(); // fermeture de puppeteer sur la page de recherche
  const { page: detailsPage, browser: browserDetails } = await configureBrowser(
    detailsUrl
  );
  const productDetails = await findDetails(detailsPage);
  console.log("productDetails   ", productDetails);
  await browserDetails.close(); // fermeture de puppeteer sur la page de détails
}

startScraping();
