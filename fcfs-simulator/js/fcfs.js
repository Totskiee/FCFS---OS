// fcfs.js - the scheduling algorithm only. No HTML in this file.
//
// Input:  a list of processes, e.g. [{ name: "P1", arrival: 0, burst: 5 }, ...]
// Output: the timeline (for the Gantt chart), a result for each process,
//         and the averages.

function runFCFS(processes) {
  // Step 1: put processes in arrival order.
  // If two arrive at the same time, the one added first goes first.
  const queue = processes
    .map((process, index) => ({ process, index }))
    .sort((a, b) => a.process.arrival - b.process.arrival || a.index - b.index);

  let clock = 0;
  const timeline = [];
  const results = [];

  // Step 2: run each process to completion, one after another.
  queue.forEach(({ process, index }) => {
    // If the CPU has nothing to run yet, it sits idle until this process arrives.
    if (clock < process.arrival) {
      timeline.push({ label: "idle", start: clock, end: process.arrival, idle: true });
      clock = process.arrival;
    }

    const start = clock;
    const completion = start + process.burst;
    clock = completion;

    timeline.push({ label: process.name, start, end: completion, idle: false, colorIndex: index });

    // Step 3: calculate the times for this process.
    results.push({
      name: process.name,
      colorIndex: index, // so the table and chart use the same color
      arrival: process.arrival,
      burst: process.burst,
      start,
      completion,
      turnaround: completion - process.arrival, // total time in the system
      waiting: start - process.arrival          // time spent waiting to start
    });
  });

  // Step 4: averages.
  const total = (field) => results.reduce((sum, r) => sum + r[field], 0);

  return {
    timeline,
    results,
    avgWaiting: total("waiting") / results.length,
    avgTurnaround: total("turnaround") / results.length,
    totalTime: clock
  };
}
