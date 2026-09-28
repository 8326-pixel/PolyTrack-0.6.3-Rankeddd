const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const assert = require('node:assert/strict');

const source = fs.readFileSync(path.join(__dirname, '../polytrack_062_patch.js'), 'utf8');
const start = source.indexOf('  let rankingsSyncHandle = 0;');
const end = source.indexOf('  function syncRankingsButtonAnimation(', start);
assert.ok(start >= 0 && end > start);

test('menu animation sync does not restart on repeated reconciliation', () => {
  const frames = [];
  let visible = true;
  let syncs = 0;
  const context = {
    Date,
    rankingsSpawnedOnce: false,
    requestAnimationFrame(callback) { frames.push(callback); return frames.length; },
    isElementVisible() { return visible; },
    syncRankingsButtonAnimation() { syncs++; }
  };
  vm.createContext(context);
  vm.runInContext(source.slice(start, end), context);
  const button = { isConnected: true };
  const container = { isConnected: true };
  context.scheduleRankingsSync(button, container);
  context.scheduleRankingsSync(button, container);
  assert.equal(frames.length, 1);
  frames.shift()();
  assert.equal(syncs, 1);
  assert.equal(frames.length, 1);
  visible = false;
  frames.shift()();
  assert.equal(syncs, 1);
  assert.equal(frames.length, 0);
  visible = true;
  context.scheduleRankingsSync(button, container);
  assert.equal(frames.length, 1);
});
