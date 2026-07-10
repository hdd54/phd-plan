const assert = require('node:assert');
const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');

const source = fs.readFileSync('js/calendar-reminders.js', 'utf8');

function collect(data, today, horizonDays) {
  const context = { console };
  vm.runInNewContext(source, context);
  return context.CalendarReminders.collect(data, today, horizonDays);
}

test('collects unfinished reminders from today through day seven', function () {
  const data = {_calEntries: {
    '2026-07-10': [{label: 'today item', done: false}],
    '2026-07-17': [{label: 'day seven item', done: false}],
    '2026-07-18': [{label: 'day eight item', done: false}],
    '2026-07-09': [{label: 'expired item', done: false}],
    '2026-07-12': [{label: 'completed item', done: true}, {label: '  ', done: false}],
    'not-a-date': [{label: 'invalid date item', done: false}]
  }};
  assert.deepEqual(collect(data, new Date(2026, 6, 10), 7), [
    {date: '2026-07-10', days: 0, label: 'today item', entryIndex: 0},
    {date: '2026-07-17', days: 7, label: 'day seven item', entryIndex: 0}
  ]);
});
