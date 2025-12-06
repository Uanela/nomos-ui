import "@testing-library/jest-dom";

Object.defineProperty(Element.prototype, "hasPointerCapture", {
  value: function () {
    return false;
  },
  writable: true,
  configurable: true,
});

Object.defineProperty(Element.prototype, "setPointerCapture", {
  value: function () {},
  writable: true,
  configurable: true,
});

Object.defineProperty(Element.prototype, "releasePointerCapture", {
  value: function () {},
  writable: true,
  configurable: true,
});

Element.prototype.scrollIntoView = jest.fn();
