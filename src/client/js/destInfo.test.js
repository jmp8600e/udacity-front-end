const testapi = require('./destInfo');

test('Testing text sentiment api', () => {
  expect(testapi(encodeURIComponent("New York,NJ"),1581033600)).toBe(undefined);
});