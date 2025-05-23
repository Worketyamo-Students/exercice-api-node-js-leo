const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const crypto = require("crypto");

const { syncToCsv, syncFromCsv } = require('../services/fileSync');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const DATA_FILE = path.join(__dirname, '../tasks.json');
const CSV_FILE = path.join(__dirname, '../tasks.csv');

async function initializeDataFile() {
  try {
    try {
      await syncFromCsv(DATA_FILE, CSV_FILE);
    } catch {
      await writeFileAsync(DATA_FILE, JSON.stringify({ tasks: [] }, null, 2));
    }
  } catch (err) {
    throw err;
  }
}

async function getAllTasks(req, res) {
  try {
    const data = await readFileAsync(DATA_FILE, 'utf8');
    res.json(JSON.parse(data).tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createTask(req, res) {
  try {
    const data = await readFileAsync(DATA_FILE, 'utf8');
    const jsonData = JSON.parse(data);
    
    const newTask = {
      id: crypto.randomBytes(3).toString('hex'),
        name: req.body.name,
        date: req.body.date
    };
    
    jsonData.tasks.push(newTask);
    await writeFileAsync(DATA_FILE, JSON.stringify(jsonData, null, 2));
    await syncToCsv(DATA_FILE, CSV_FILE); // Synchronisation vers CSV
    
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getTaskById(req, res) {
try {
    const data = await readFileAsync(DATA_FILE, 'utf8');
    const jsonData = JSON.parse(data);
    const task = jsonData.tasks.find(t => t.id === Number(req.params.id));
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
} catch (err) {
    res.status(500).json({ error: err.message });
}
}

async function updateTask(req, res) {
try {
    const data = await readFileAsync(DATA_FILE, 'utf8');
    const jsonData = JSON.parse(data);
    const taskIndex = jsonData.tasks.findIndex(t => t.id === Number(req.params.id));
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    jsonData.tasks[taskIndex] = {
        ...jsonData.tasks[taskIndex],
        name: req.body.name,
        date: req.body.date
    };
    await writeFileAsync(DATA_FILE, JSON.stringify(jsonData, null, 2));
    await syncToCsv(DATA_FILE, CSV_FILE);
    res.json(jsonData.tasks[taskIndex]);
} catch (err) {
    res.status(500).json({ error: err.message });
}
}

async function deleteTask(req, res) {
try {
    const data = await readFileAsync(DATA_FILE, 'utf8');
    const jsonData = JSON.parse(data);
    const taskIndex = jsonData.tasks.findIndex(t => t.id === Number(req.params.id));
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task is not' });
    }
    const deletedTask = jsonData.tasks.splice(taskIndex, 1)[0];
    await writeFileAsync(DATA_FILE, JSON.stringify(jsonData, null, 2));
    await syncToCsv(DATA_FILE, CSV_FILE);
    res.json(deletedTask);
} catch (err) {
    res.status(500).json({ error: err.message });
}
}



module.exports = {
  initializeDataFile,
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};