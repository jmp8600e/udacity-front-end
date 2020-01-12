const testapi = require('./aylienTXT');

test('Testing text sentiment api', () => {
  expect(testapi(encodeURIComponent("i am feeling good!"))).toBe(undefined);
});