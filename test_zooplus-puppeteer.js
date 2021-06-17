const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const prefix = "https://www.zooplus.fr";
const baseURL = `${prefix}/esearch.htm#q%3D7613035120402`; // pour code barre 7613035120402

async function configureBrowser(url) {
  // lancement de puppeeteer et configuration du navigateur
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  return page;
}

async function findUrl(page) {
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
  let html = await page.evaluate(() => document.body.innerHTML);
  let $ = await cheerio.load(html);

  const productName = $("h1.producttitle", html).text().trim();
  const productDetails = [];
  const offers = $(".product__offer", html).get();

  offers.forEach(async (elem) => {
    // elem = 1 bloc de poids / prix
    const volume = $(".article-description", elem, html).text().trim();
    const price = $("span.price__amount", elem).text().trim();
    productDetails.push({ name: productName, volume, price });
  });

  return productDetails;
}

async function startScraping() {
  const searchPage = await configureBrowser(baseURL);
  const urlList = await findUrl(searchPage);
  const detailsUrl = `${prefix}${urlList[0]}`;
  console.log(detailsUrl);
  const detailsPage = await configureBrowser(detailsUrl);
  const productDetails = await findDetails(detailsPage);
  console.log("productDetails   ", productDetails);
}

startScraping();
