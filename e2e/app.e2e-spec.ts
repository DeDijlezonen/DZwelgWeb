import { DzwelgWebPage } from './app.po';

describe('dzwelg-web App', () => {
  let page: DzwelgWebPage;

  beforeEach(() => {
    page = new DzwelgWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
