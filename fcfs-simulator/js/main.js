// main.js - holds the data and connects button clicks to the other files.
//   fcfs.js does the calculation, ui.js draws it, and this file ties them together.

let processes = [];  // the list of processes the user has entered

function addProcess() {
  processes.push({ name: "P" + (processes.length + 1), arrival: 0, burst: 5 });
  renderProcessTable(processes);
  clearOutput();
}

function removeProcess(index) {
  processes.splice(index, 1);
  // Rename the rest so the names stay P1, P2, P3, ...
  processes.forEach((p, i) => (p.name = "P" + (i + 1)));
  renderProcessTable(processes);
  clearOutput();
}

function clearAll() {
  processes = [];
  renderProcessTable(processes);
  clearOutput();
}

function runSimulation() {
  clearOutput();
  if (processes.length === 0) {
    document.getElementById("message").textContent = "Add at least one process first.";
    return;
  }

  const outcome = runFCFS(processes);              // calculate (fcfs.js)
  renderGantt(outcome.timeline, outcome.totalTime); // draw (ui.js)
  renderResults(outcome.results);
  renderStats(outcome);
  renderExplanations(outcome.results);
  renderInsight(outcome.results);
}

// ---- Wire up the buttons ----
document.getElementById("add-btn").addEventListener("click", addProcess);
document.getElementById("clear-btn").addEventListener("click", clearAll);
document.getElementById("run-btn").addEventListener("click", runSimulation);

// One listener for the whole table handles every Remove button and every input box.
const tableBody = document.getElementById("process-rows");

tableBody.addEventListener("click", (event) => {
  if (event.target.dataset.remove !== undefined) {
    removeProcess(Number(event.target.dataset.remove));
  }
});

tableBody.addEventListener("input", (event) => {
  const { index, field } = event.target.dataset;
  if (index === undefined) return;
  const minimum = field === "burst" ? 1 : 0;
  processes[index][field] = Math.max(minimum, Number(event.target.value) || 0);
});

// Show the empty table on first load.
renderProcessTable(processes);
