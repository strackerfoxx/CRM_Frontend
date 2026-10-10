import { test } from 'node:test';
import assert from 'node:assert';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

global.localStorage = localStorageMock;

// Import the actual functions
import {
  saveAccessToken,
  getAccessToken,
  clearAccessToken,
  saveUser,
  getUser,
  clearUser
} from '../tokenService.js';

test('AccessToken operations', async (t) => {
  await t.test('saveAccessToken saves token to localStorage', () => {
    localStorage.clear();
    const token = 'test-token';
    saveAccessToken(token);
    assert.strictEqual(localStorage.getItem('accessToken'), token);
  });

  await t.test('getAccessToken retrieves token from localStorage', () => {
    localStorage.clear();
    const token = 'test-token';
    localStorage.setItem('accessToken', token);
    assert.strictEqual(getAccessToken(), token);
  });

  await t.test('clearAccessToken removes token from localStorage', () => {
    localStorage.clear();
    localStorage.setItem('accessToken', 'test-token');
    clearAccessToken();
    assert.strictEqual(localStorage.getItem('accessToken'), null);
  });
});

test('User operations', async (t) => {
  await t.test('saveUser saves user object to localStorage as JSON', () => {
    localStorage.clear();
    const user = { id: 1, name: 'Test User' };
    saveUser(user);
    assert.strictEqual(localStorage.getItem('user'), JSON.stringify(user));
  });

  await t.test('getUser retrieves and parses user object from localStorage', () => {
    localStorage.clear();
    const user = { id: 1, name: 'Test User' };
    localStorage.setItem('user', JSON.stringify(user));
    assert.deepStrictEqual(getUser(), user);
  });

  await t.test('getUser returns null if no user in localStorage', () => {
    localStorage.clear();
    assert.strictEqual(getUser(), null);
  });

  await t.test('clearUser removes user from localStorage', () => {
    localStorage.clear();
    localStorage.setItem('user', JSON.stringify({ id: 1 }));
    clearUser();
    assert.strictEqual(localStorage.getItem('user'), null);
  });
});
