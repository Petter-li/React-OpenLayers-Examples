import config from '../config/config';

const RouterConfig = config.routes;

const BASE_URL = `http://localhost:${process.env.PORT || 8000}`;

function formatter(data) {
  return data
    .reduce((pre, item) => {
      pre.push(item.path);
      return pre;
    }, [])
    .filter(item => item);
}

describe('Homepage', async () => {
  const testPage = path => async () => {
    await page.goto(`${BASE_URL}${path}`);
    await page.waitForSelector('footer', {
      timeout: 2000,
    });
    const haveFooter = await page.evaluate(
      () => document.getElementsByTagName('footer').length > 0
    );
    expect(haveFooter).toBeTruthy();
  };

  beforeAll(async () => {
    jest.setTimeout(1000000);
    await page.setCacheEnabled(false);
  });
  const routers = formatter(RouterConfig[1].routes);
  routers.forEach(route => {
    if (/^https?:\/\//.test(route)) {
      return;
    }
    fit(`test pages ${route}`, testPage(route));
  });
});
