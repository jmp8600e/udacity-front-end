const testtxtapi = require('./aylienTXT');

test('Testing text sentiment api', () => {
  expect(testtxtapi(encodeURIComponent("i am feeling good!"))).toBe(4);
});