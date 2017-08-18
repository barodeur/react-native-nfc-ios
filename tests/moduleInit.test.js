describe('Module init', () => {
  let mockAddListener = jest.fn();

  jest.mock('NativeEventEmitter', () => () => ({
    addListener: mockAddListener,
  }));
  require('../index');

  test('Add native event listener', () => {
    expect(mockAddListener).toBeCalled();
  });
});