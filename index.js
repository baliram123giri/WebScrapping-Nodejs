const puppeteer = require("puppeteer")

const test = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        userDataDir: "./tmp"
    })
    const page = await browser.newPage()
    await page.goto(`https://www.amazon.in/s?i=computers&bbn=976392031&rh=n%3A976392031%2Cp_89%3AHP&pf_rd_i=976392031&pf_rd_m=A1VBAL9TL5WCBF&pf_rd_p=13d51f0e-b7cd-4ad6-b531-81224b191d16&pf_rd_r=13S0K0BHS5Q8EQ6PV33B&pf_rd_s=merchandised-search-17&ref=PC_revamp21_brands_desk_2`)

    //get the product data
    const productDataHandler = await page.$$('.sg-col-inner')
    // console.log(productDataHandler)
    let productData = []
    for (const item of productDataHandler) {
        try {
            const title = await page.evaluate(ele => ele.querySelector(".a-size-base-plus").textContent, item)
            const price = await page.evaluate(ele => ele.querySelector(".a-offscreen").textContent, item)
            const image = await page.evaluate(ele => ele.querySelector(".s-image").getAttribute("src"), item)
            productData.push({ title, price, image })
        } catch (error) {

        }

    }
    console.log(productData)

}
test()