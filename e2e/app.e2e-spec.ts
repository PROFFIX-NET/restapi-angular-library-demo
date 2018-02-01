import { RestapiAngularLibraryDemoPage } from './app.po';

describe('restapi-angular-library-demo App', () => {
  let page: RestapiAngularLibraryDemoPage;

  beforeEach(() => {
    page = new RestapiAngularLibraryDemoPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
