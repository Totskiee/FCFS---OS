// ui.js - draws things on the page. It never calculates the schedule.

const COLORS = ["#8ecae6", "#ffb703", "#9bd1a4", "#f4a6a0", "#c3b1e1", "#f7d794", "#a0d8d8", "#e9b8d4"];

function colorOf(index) {
  return COLORS[index % COLORS.length];
}

// A small colored square, so a process has the same color everywhere.
function dot(index) {
  return `<span class="dot" style="background: ${colorOf(index)}"></span>`;
}

// The input table where the user edits processes.
function renderProcessTable(processes) {
  const rows = processes.map((p, i) => `
    <tr>
      <td>${dot(i)}${p.name}</td>
      <td><input type="number" min="0" value="${p.arrival}" data-index="${i}" data-field="arrival" aria-label="Arrival time of ${p.name}"></td>
      <td><input type="number" min="1" value="${p.burst}" data-index="${i}" data-field="burst" aria-label="Burst time of ${p.name}"></td>
      <td><button class="remove" data-remove="${i}">Remove</button></td>
    </tr>`);

  document.getElementById("process-rows").innerHTML =
    rows.length > 0
      ? rows.join("")
      : '<tr><td colspan="4">No processes yet. Click "+ Add process" to start.</td></tr>';
}

// The Gantt chart: one block per timeline segment, wider if it runs longer.
function renderGantt(timeline, totalTime) {
  document.getElementById("gantt").innerHTML = timeline.map((seg) => {
    const duration = seg.end - seg.start;
    const color = seg.idle ? "" : `background: ${colorOf(seg.colorIndex)};`;
    return `<div class="block ${seg.idle ? "idle" : ""}" style="flex: ${duration}; ${color}">${seg.label}</div>`;
  }).join("");

  // Time labels under the chart, positioned as a percentage of the total time.
  const times = [0, ...timeline.map((seg) => seg.end)];
  document.getElementById("ticks").innerHTML = times
    .map((t) => `<span style="left: ${(t / totalTime) * 100}%">${t}</span>`)
    .join("");
}

// Three summary cards under the chart.
function renderStats(outcome) {
  document.getElementById("stats").innerHTML = `
    <div class="stat"><b>${outcome.avgWaiting.toFixed(2)}</b><span>Average waiting time</span></div>
    <div class="stat"><b>${outcome.avgTurnaround.toFixed(2)}</b><span>Average turnaround time</span></div>
    <div class="stat"><b>${outcome.totalTime}</b><span>Total time</span></div>`;
}

// The results table.
function renderResults(results) {
  document.getElementById("result-rows").innerHTML = results.map((r) => `
    <tr>
      <td>${dot(r.colorIndex)}${r.name}</td><td>${r.arrival}</td><td>${r.burst}</td>
      <td>${r.start}</td><td>${r.completion}</td><td>${r.waiting}</td><td>${r.turnaround}</td>
    </tr>`).join("");
}

// A plain-English sentence for each process, to help students read the numbers.
function renderExplanations(results) {
  document.getElementById("explain").innerHTML = results.map((r) => `
    <li>${dot(r.colorIndex)}<b>${r.name}</b> arrived at ${r.arrival}, started at ${r.start}, and finished at ${r.completion}.
    It waited <b>${r.waiting}</b> and took <b>${r.turnaround}</b> in total.</li>`).join("");
}

// One short takeaway about the result, including the convoy effect.
function renderInsight(results) {
  const first = results[0];
  const others = results.slice(1);
  let text = "Try changing the arrival order or burst times and run again to see how the averages change.";

  if (others.length > 0) {
    const avgOthers = others.reduce((sum, r) => sum + r.burst, 0) / others.length;
    if (first.burst > 2 * avgOthers) {
      text = `<b>Convoy effect:</b> ${first.name} has a long burst and runs first, so every process behind it has to wait. ` +
             `Put the short processes first and the average waiting time drops.`;
    }
  }
  if (results.every((r) => r.waiting === 0)) {
    text = "No process had to wait, because each one arrived after the previous one finished.";
  }
  document.getElementById("insight").innerHTML = `<div class="insight">${text}</div>`;
}

// Empty the chart, results, and messages.
function clearOutput() {
  ["gantt", "ticks", "stats", "result-rows", "explain", "insight"].forEach((id) => {
    document.getElementById(id).innerHTML = "";
  });
  document.getElementById("message").textContent = "";
}
