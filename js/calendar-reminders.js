(function (global) {
  'use strict';

  function parseDateKey(key) {
    var match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(key));
    if (!match) return null;
    var date = new Date(+match[1], +match[2] - 1, +match[3]);
    return date.getFullYear() === +match[1] && date.getMonth() === +match[2] - 1 && date.getDate() === +match[3] ? date : null;
  }

  function collect(data, today, horizonDays) {
    var base = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var horizon = Number.isFinite(horizonDays) ? horizonDays : 7;
    var all = data && data._calEntries || {};
    var output = [];
    Object.keys(all).forEach(function (dateKey) {
      var date = parseDateKey(dateKey);
      if (!date || !Array.isArray(all[dateKey])) return;
      var days = Math.round((date - base) / 86400000);
      if (days < 0 || days > horizon) return;
      all[dateKey].forEach(function (entry, entryIndex) {
        var label = entry && String(entry.label || '').trim();
        if (!label || entry.done) return;
        output.push({date: dateKey, days: days, label: label, entryIndex: entryIndex});
      });
    });
    return output.sort(function (a, b) { return a.days - b.days || a.entryIndex - b.entryIndex; });
  }

  global.CalendarReminders = Object.freeze({collect: collect});
})(typeof window === 'undefined' ? globalThis : window);
