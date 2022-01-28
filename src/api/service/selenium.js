import {
    Builder, By, Key, Capabilities
} from "selenium-webdriver"
import webdriver from "selenium-webdriver"
import chrome from 'selenium-webdriver/chrome.js'
const TIKI_BILLING_URL = 'https://tiki.vn/san-pham-so/thanh-toan-hoa-don-dien/s1?searchredirect=1'
const BILL = process.argv[4].split(",")

const screen = {
    width: 1920,
    height: 1080
};

let options = new chrome.Options();
options.setChromeBinaryPath(process.env.CHROME_BINARY_PATH);
let serviceBuilder = new chrome.ServiceBuilder(process.env.CHROME_DRIVER_PATH);

//Below arguments are critical for Heroku deployment
options.addArguments("--headless");
options.addArguments("--disable-gpu");
options.addArguments("--no-sandbox");
options.windowSize(screen);

let driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .setChromeService(serviceBuilder)
    .build();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let driver = new Builder().forBrowser('chrome').setChromeOptions(options).setChromeService(serviceBuilder).build();
const bank = {
    cardNumber: process.argv[5],
    cardName: process.argv[6],
    cardExpiration: process.argv[7],
    cardPass: process.argv[8],
}

// use for first time
async function autoFormBank(bank) {
    try {

        const radioMethodPayment = await driver.executeScript(`return document.querySelector('[value="cybersource"]').click()`)
        // radioMethodPayment.sendKeys(Key.RETURN)
        await sleep(1000)
        const buttonAddNewCard = await driver.executeScript(`return document.querySelector('.add-new-card')`)
        buttonAddNewCard.sendKeys(Key.RETURN)
        await sleep(1000)

        const inputCardNumber = await driver.executeScript(`return document.querySelector('[name="number"]')`)
        inputCardNumber.sendKeys(bank.cardNumber)

        const inputCardName = await driver.executeScript(`return document.querySelector('[placeholder="VD: NGUYEN VAN A"]')`)
        inputCardName.sendKeys(bank.cardName)

        const inputCardExpiration = await driver.executeScript(`return document.querySelector('[name="expiry"]')`)
        inputCardExpiration.sendKeys(bank.cardExpiration)

        const inputCardPass = await driver.executeScript(`return document.querySelector('[name="cvc"]')`)
        inputCardPass.sendKeys(bank.cardPass)

        await sleep(1000)

        const buttonConfirm = await driver.executeScript(`return document.querySelector('.confirm')`)
        buttonConfirm.sendKeys(Key.RETURN)

        await sleep(2000)

        return true
    } catch (error) {
        console.log(error)
    }
}

async function choosingCard() {
    try {
        const inputChoosingCard = await driver.executeScript(`return document.querySelector('[name="credit_card"]')`)
        inputChoosingCard.sendKeys(Key.RETURN)
        sleep(1000)

        return
    } catch (error) {
        console.log(error)
    }
}

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
        await sleep(2000)

        const buttonContinue2 = await driver.executeScript(`return document.querySelector('.hyWGAi')`)
        buttonContinue2.sendKeys(Key.RETURN)

        console.log('formOkay')

        return true
    } catch (error) {
        console.log(error)
    }
}

async function login(user) {
    try {
        const inputTel = await driver.executeScript(`return document.querySelector('[name="tel"]')`)
        inputTel.sendKeys(user.email)
        const button = await driver.executeScript(`return Array.from(document.querySelectorAll('button')).find(el => el.textContent.includes('Tiếp Tục'))`)
        button.sendKeys(Key.RETURN)
        await sleep(2000)
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
        await driver.get(TIKI_BILLING_URL)
        await sleep(1000)
        await driver.wait(() => login(user), 2000);
        await sleep(10000)

        //Store the ID of the original window
        const originalWindow = await driver.getWindowHandle();
        for (let index = 0; index < BILL.length - 1; index++) {
            console.log('start', index)
            await driver.executeScript(`window.open('${TIKI_BILLING_URL}','_blank')`)
            console.log('end', index)
        }
        await driver.switchTo().window(originalWindow)
        await sleep(10000)
        const windows = await driver.getAllWindowHandles();
        for (let index = 0; index < windows.length; index++) {
            console.log('start', index)
            await driver.switchTo().window(windows[index])
            await formBill(BILL[index])
            await sleep(2000)
            await autoFormBank(bank)
            console.log('end', index)
        }
    } catch (error) {
        console.log(error)
    }
}

seleniumCall({ user: { email: process.argv[2], password: process.argv[3] } })