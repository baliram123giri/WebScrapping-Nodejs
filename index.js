const puppeteer = require("puppeteer")
var json2xls = require('json2xls');
const fs = require("fs")
const test = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        // defaultViewport: false,
        userDataDir: "./tmp"
    })
    const page = await browser.newPage()
    await page.goto(`https://www.amazon.in/s?i=computers&bbn=976392031&rh=n%3A976392031%2Cp_89%3AHP&pf_rd_i=976392031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=13d51f0e-b7cd-4ad6-b531-81224b191d16&pf_rd_r=13S0K0BHS5Q8EQ6PV33B&pf_rd_s=merchandised-search-17&ref=PC_revamp21_brands_desk_2`)

    //get the product data
    let isDisabled
    let productData = []
    while (!isDisabled) {
        await page.waitForSelector(".s-pagination-next", { visible: true })
        const productDataHandler = await page.$$('.sg-col-inner')

        for (const item of productDataHandler) {
            let title = null
            try {
                title = await page.evaluate(ele => ele.querySelector(".a-size-base-plus").textContent, item)
            } catch (error) {

            }
            let price = null
            try {
                price = await page.evaluate(ele => ele.querySelector(".a-offscreen").textContent, item)
            } catch (error) {

            }
            let image = null
            try {
                image = await page.evaluate(ele => ele.querySelector(".s-image").getAttribute("src"), item)
            } catch (error) {

            }
            productData.push({ title, price, image })

        }

        let isButtonDisabled = await page.$('.s-pagination-next.s-pagination-disabled') !== null
        isDisabled = isButtonDisabled
        if (!isButtonDisabled) {
            await Promise.all([
                page.click('.s-pagination-next'),
                page.waitForNavigation({ waitUntil: "networkidle2" })
            ])
        }
    }
    // console.log(productDataHandler)
    var xls = json2xls(productData);
    fs.writeFileSync('data.xlsx', xls, 'binary');

    await browser.close()
}
test()