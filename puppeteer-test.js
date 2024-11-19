// Recording from Chrome Recording.  See https://www.youtube.com/watch?v=LBgzmqzp7ew
// Exported by Doug Horner

const puppeteer = require('puppeteer'); // v23.0.0 or later
// get the passwor from the environment, abort if not set
const password = process.env.PUPPET_PASS;
if (!password) {
    console.error('PUPPET_PASS environment not set');
    process.exit(1);
}

const launchOptions = {  };
//const launchOptions = { headless: false, slowMo: 10,  args: ['--start-maximized'] };

(async () => {
    console.log('Launching browser...');
    const browser = await puppeteer.launch(launchOptions);
    console.log('Browser launched.');

    console.log('Opening new page...');
    const page = await browser.newPage();
    console.log('New page opened.');

    const timeout = 5000;
    page.setDefaultTimeout(timeout);

    {
        const targetPage = page;
        console.log('Setting viewport...');
        await targetPage.setViewport({
            width: 645,
            height: 736
        });
        console.log('Viewport set.');
    }
    {
        const targetPage = page;
        console.log('Navigating to http://localhost:8080/...');
        await targetPage.goto('http://localhost:8080/');
        console.log('Navigation complete.');
    }
    {
        const targetPage = page;
        console.log('Waiting for "Get Code" button and clicking it...');
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        }
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Get Code)'),
            targetPage.locator('a'),
            targetPage.locator('::-p-xpath(/html/body/a)'),
            targetPage.locator(':scope >>> a'),
            targetPage.locator('::-p-text(Get Code)')
        ])
            .setTimeout(timeout)
            .on('action', () => startWaitingForEvents())
            .click({
              offset: {
                x: 44,
                y: 13,
              },
            });
        await Promise.all(promises);
        console.log('"Get Code" button clicked.');
    }
    {
        const targetPage = page;
        console.log('Filling in username...');
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Username)'),
            targetPage.locator('#login_user'),
            targetPage.locator('::-p-xpath(//*[@id=\\"login_user\\"])'),
            targetPage.locator(':scope >>> #login_user')
        ])
            .setTimeout(timeout)
            .fill('whart123');
        console.log('Username filled.');
    }
    {
        const targetPage = page;
        console.log('Clicking "Next" button...');
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Next)'),
            targetPage.locator('#login_submit'),
            targetPage.locator('::-p-xpath(//*[@id=\\"login_submit\\"])'),
            targetPage.locator(':scope >>> #login_submit')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 65.5,
                y: 24.296875,
              },
            });
        console.log('"Next" button clicked.');
    }
    {
        const targetPage = page;
        console.log('Clicking password field...');
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Password)'),
            targetPage.locator('#login_passwd'),
            targetPage.locator('::-p-xpath(//*[@id=\\"login_passwd\\"])'),
            targetPage.locator(':scope >>> #login_passwd')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 108.5,
                y: 23.796875,
              },
            });
        console.log('Password field clicked.');
    }
    {
        const targetPage = page;
        console.log('Filling in password...');
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Password)'),
            targetPage.locator('#login_passwd'),
            targetPage.locator('::-p-xpath(//*[@id=\\"login_passwd\\"])'),
            targetPage.locator(':scope >>> #login_passwd')
        ])
            .setTimeout(timeout)
            .fill(password);
        console.log('Password filled.');
    }
    {
        const targetPage = page;
        console.log('Clicking "Next" button...');
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        }
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Next)'),
            targetPage.locator('#login_submit'),
            targetPage.locator('::-p-xpath(//*[@id=\\"login_submit\\"])'),
            targetPage.locator(':scope >>> #login_submit')
        ])
            .setTimeout(timeout)
            .on('action', () => startWaitingForEvents())
            .click({
              offset: {
                x: 50.5,
                y: 19.296875,
              },
            });
        await Promise.all(promises);
        console.log('"Next" button clicked.');
    }
    {
        const targetPage = page;
        console.log('Clicking "Scope" radio button...');
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria([role=\\"row\\"]) >>>> ::-p-aria([role=\\"radio\\"])'),
            targetPage.locator('#pat_scope'),
            targetPage.locator('::-p-xpath(//*[@id=\\"pat_scope\\"])'),
            targetPage.locator(':scope >>> #pat_scope')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 6,
                y: 5.7421875,
              },
            });
        console.log('"Scope" radio button clicked.');
    }
    {
        const targetPage = page;
        console.log('Clicking "patient/CarePlan.read" option...');
        await puppeteer.Locator.race([
            targetPage.locator('li:nth-of-type(8)'),
            targetPage.locator('::-p-xpath(//*[@id=\\"Rf1Vl4o\\"]/li[8])'),
            targetPage.locator(':scope >>> li:nth-of-type(8)'),
            targetPage.locator('::-p-text(patient/CarePlan.read)')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 269,
                y: 14.0859375,
              },
            });
        console.log('"patient/CarePlan.read" option clicked.');
    }
    {
        const targetPage = page;
        console.log('Clicking "Allow" button...');
        const promises = [];
        const startWaitingForEvents = () => {
            promises.push(targetPage.waitForNavigation());
        }
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Allow)'),
            targetPage.locator('input:nth-of-type(8)'),
            targetPage.locator('::-p-xpath(//*[@id=\\"wc_main\\"]/div[2]/form/input[8])'),
            targetPage.locator(':scope >>> input:nth-of-type(8)'),
            targetPage.locator('::-p-text(Allow)')
        ])
            .setTimeout(timeout)
            .on('action', () => startWaitingForEvents())
            .click({
              offset: {
                x: 26.8828125,
                y: 12.9296875,
              },
            });
        await Promise.all(promises);
        console.log('"Allow" button clicked.');
    }

    console.log('Closing browser...');
    await browser.close();
    console.log('Browser closed.');

})().catch(err => {
    console.error(err);
    process.exit(1);
});
