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
    '2026-07-10': [{label: '浠婂ぉ浜嬮」', done: false}],
    '2026-07-17': [{label: '绗竷澶╀簨椤�', done: false}],
    '2026-07-18': [{label: '绗叓澶╀簨椤�', done: false}],
    '2026-07-09': [{label: '杩囨湡浜嬮�', done: false}],
    '2026-07-12': [{label: '宸插畬鎴�', done: true}, {label: '  ', done: false}],
    'not-a-date': [{label: '鏃犳晥鏃ユ湡', done: false}]
  }};
  assert.deepEqual(collect(data, new Date(2026, 6, 10), 7), [
    {date: '2026-07-10', days: 0, label: '浠婂ぉ浜嬮」', entryIndex: 0},
    {date: '2026-07-17', days: 7, label: '绗竷澶╀簨椤�', entryIndex: 0}
  ]);
});
