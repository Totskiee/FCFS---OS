# FCFS Scheduling Simulator

Open `index.html` in a browser. No install or server needed. Works on phones and desktops, in light and dark mode.

## Folder structure

```
fcfs-simulator/
├── index.html        Page structure; links to the CSS and JS files
├── README.md         This file
├── css/
│   └── style.css     All styling (colors are in the :root block at the top)
└── js/
    ├── fcfs.js       The FCFS algorithm (pure logic, no HTML)
    ├── ui.js         Draws the tables, Gantt chart, and explanations
    └── main.js       Stores the process list and handles button clicks
```

## How the files connect

```
index.html
 ├── <link>   css/style.css
 ├── <script> js/fcfs.js    defines runFCFS()
 ├── <script> js/ui.js      defines render...() functions
 └── <script> js/main.js    uses both of the above
```

The script order in `index.html` matters: `main.js` calls functions from the two files loaded before it.

## Flow

Click "Run simulation" -> `main.js` calls `runFCFS()` in `fcfs.js` -> `main.js` passes the result to the `render...()` functions in `ui.js`.
