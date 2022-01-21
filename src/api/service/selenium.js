import {
    Builder, By, Key, Capabilities
} from "selenium-webdriver"
// let driver = new Builder().withCapabilities(Capabilities.firefox()).build();
const TIKI_BILLING_URL = 'https://tiki.vn/san-pham-so/thanh-toan-hoa-don-dien/s1?searchredirect=1'
const BILL = process.argv[4].split(",")

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let driver = new Builder().withCapabilities(Capabilities.firefox()).build();

async function formBill(bill) {
    try {
        const input = await driver.executeScript(`return document.querySelector('.iHtmmM')`)
        input.sendKeys(bill)
        const inputDropdown = await driver.executeScript(`return document.querySelector('.Dropdown__Input-sc-l4w3y3-1')`)
        inputDropdown.sendKeys(Key.RETURN)
        await sleep(1000)
        const dropDownMienTrung = await driver.executeScript(`return document.querySelector('[alt="Thanh toán hóa đơn điện EVN Miền Trung"]').click()`)
        await sleep(1000)
        const buttonContinue = await driver.executeScript(`return Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Tiếp tục'))`)
        buttonContinue.sendKeys(Key.RETURN)
        return true
    } catch (error) {
        console.log(error)
    }
}

async function login(user) {
    try {
        //get input
        const inputTel = await driver.executeScript(`return document.querySelector('[name="tel"]')`)
        inputTel.sendKeys(user.email)
        const button = await driver.executeScript(`return Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Tiếp Tục'))`)
        button.sendKeys(Key.RETURN)
        await sleep(1000)
        const inputPassword = await driver.executeScript(`return document.querySelector('[type="password"]')`)
        inputPassword.sendKeys(user.password)
        const buttonLogin = await driver.executeScript(`return Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Đăng Nhập'))`)
        buttonLogin.sendKeys(Key.RETURN)
        return true;
    }
    catch (error) {
        console.log(error)
    }
}

const seleniumCall = async ({ user }) => {
    try {

        console.log(41)
        console.log(driver)
        await driver.get(TIKI_BILLING_URL)
        await sleep(1000)
        await driver.wait(() => login(user), 2000);
        //Store the ID of the original window
        const originalWindow = await driver.getWindowHandle();
        for (let index = 0; index < BILL.length - 1; index++) {
            console.log('start', index)
            await driver.executeScript(`window.open('${TIKI_BILLING_URL}','_blank')`)
            console.log('end', index)
        }
        await driver.switchTo().window(originalWindow)
        console.log(71)
        await sleep(8000)
        const windows = await driver.getAllWindowHandles();
        console.log(windows)
        console.log(73)
        for (let index = 0; index < windows.length; index++) {
            console.log('start', index)
            await driver.switchTo().window(windows[index])
            await formBill(BILL[index])
            await sleep(2000)
            console.log('end', index)
        }
    } catch (error) {
        console.log(error)
    }
}

seleniumCall({ user: { email: process.argv[2], password: process.argv[3] } })