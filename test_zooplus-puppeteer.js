const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const prefix = "https://www.zooplus.fr";
const baseURL = `${prefix}/esearch.htm#q%3D7613035120402`; // pour code barre 7613035120402

// const url = "https://www.amazon.com/Sony-Noise-Cancelling-Headphones-WH1000XM3/dp/B07G4MNFS1/";

async function configureBrowser(url) {
  // lancement de puppeeteer et configuration du navigateur
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  return page;
}

async function findUrl(page) {
  // await page.reload(); // on recharge la page fonction s'exécute toutes les 15 minutes, mais on ne veut pas recharger le browser
  let html = await page.evaluate(() => document.body.innerHTML);
  // console.log(html);
  let $ = await cheerio.load(html);
  let urlList = [];
  $("a.exo-prod-url", html).each(
    await function () {
      let exoProdUrl = $(this).attr("href");
      // console.log("exoProdUrl    ", exoProdUrl);
      urlList.push(exoProdUrl);
    }
  );
  // console.log(urlList);
  return urlList;
}

async function findDetails(page) {
  // await page.reload(); // on recharge la page fonction s'exécute toutes les 15 minutes, mais on ne veut pas recharger le browser
  let html = await page.evaluate(() => document.body.innerHTML);
  // console.log(html);
  let $ = await cheerio.load(html, {
    xml: {
      normalizeWhitespace: true,
    },
  });

  const productName = $("h1.producttitle", html).text().trim();

  const productDetails = [];

  $(".product__offer", html).each(async (elem) => {
    // console.log("elem             ", $(elem));
    // bloc de poids / prix
    // console.log("elem children    ", $(elem).contents().children());
    const volume = $(".article-description", html).text().trim();
    // console.log("volume   ", volume);
    const price = $("span.price__amount", elem).text().trim();
    // console.log("price   ", price);
    productDetails.push({ name: productName, volume, price });
  });

  const testlist = [];
  $(".product__offer")
    .find(".article-description")
    .each(function (index, element) {
      testlist.push($(element).text());
    });
  // console.dir("testlist   ", testlist);

  // console.log(productDetails);
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
