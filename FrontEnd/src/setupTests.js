import '@testing-library/jest-dom';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

beforeEach(() => {
    localStorage.clear();
});