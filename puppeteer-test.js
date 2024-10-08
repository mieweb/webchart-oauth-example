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
//const launchOptions = { headless: false, args: ['--start-maximized'] };

(async () => {
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    const timeout = 5000;
    page.setDefaultTimeout(timeout);

    {
        const targetPage = page;
        await targetPage.setViewport({
            width: 645,
            height: 736
        })
    }
    {
        const targetPage = page;
        await targetPage.goto('http://localhost:8080/');
    }
    {
        const targetPage = page;
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
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Username)'),
            targetPage.locator('#login_user'),
            targetPage.locator('::-p-xpath(//*[@id=\\"login_user\\"])'),
            targetPage.locator(':scope >>> #login_user')
        ])
            .setTimeout(timeout)
            .fill('whart123');
    }
    {
        const targetPage = page;
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
    }
    {
        const targetPage = page;
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
    }
    {
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(Password)'),
            targetPage.locator('#login_passwd'),
            targetPage.locator('::-p-xpath(//*[@id=\\"login_passwd\\"])'),
            targetPage.locator(':scope >>> #login_passwd')
        ])
            .setTimeout(timeout)
            .fill(password);
    }
    {
        const targetPage = page;
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
    }
    {
        const targetPage = page;
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
    }
    {
        const targetPage = page;
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
    }
    {
        const targetPage = page;
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
    }

    await browser.close();

})().catch(err => {
    console.error(err);
    process.exit(1);
});
