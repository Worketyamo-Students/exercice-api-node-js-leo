const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const { parse, stringify } = require('csv/sync');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const statAsync = promisify(fs.stat);

// Synchronise JSON vers CSV
async function syncToCsv(jsonPath, csvPath) {
  try {
    const jsonData = await readFileAsync(jsonPath, 'utf8');
    const { tasks } = JSON.parse(jsonData);
    
    if (tasks.length > 0) {
      const csvData = stringify(tasks, {
        header: true,
        columns: Object.keys(tasks[0])
      });
      await writeFileAsync(csvPath, csvData);
    }
  } catch (err) {
    console.error('Erreur syncToCsv:', err);
    throw err;
  }
}

// Synchronise CSV vers JSON si plus récent
async function syncFromCsv(jsonPath, csvPath) {
  try {
    const [jsonStat, csvStat] = await Promise.all([
      statAsync(jsonPath).catch(() => null),
      statAsync(csvPath).catch(() => null)
    ]);

    if (csvStat && (!jsonStat || csvStat.mtime > jsonStat.mtime)) {
      const csvData = await readFileAsync(csvPath, 'utf8');
      const tasks = parse(csvData, { columns: true, skip_empty_lines: true });
      await writeFileAsync(jsonPath, JSON.stringify({ tasks }, null, 2));
      return true;
    }
    return false;
  } catch (err) {
    console.error('Erreur syncFromCsv:', err);
    throw err;
  }
}

module.exports = {
  syncToCsv,
  syncFromCsv
};