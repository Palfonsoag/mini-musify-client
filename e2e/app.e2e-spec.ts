import { MiniMusifyClientPage } from './app.po';

describe('mini-musify-client App', function() {
  let page: MiniMusifyClientPage;

  beforeEach(() => {
    page = new MiniMusifyClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
