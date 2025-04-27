import { WFC2D } from "../../lib/WFC2D";
import { WFCTile2D } from "../../lib/WFCTile2D";
import { annotateTiles2DEdges } from "../../lib/utils/annotateTiles2DEdges";
import { imgLoaderBatch } from "../../lib/utils/imgLoader";
import { generateTimeSeed } from "../../lib/utils/prngSeedGenerators";

const canvas = document.getElementById("wfc-canvas") as HTMLCanvasElement;
const tooltip = document.getElementById("wfc-tooltip") as HTMLDivElement;
const controlsPanel = document.getElementById("wfc-controls") as HTMLDivElement;
const seedInput = document.getElementById("ctrl-seed") as HTMLInputElement;

const randomSeedButton = document.getElementById(
  "ctrl-random-seed"
) as HTMLButtonElement;
const widthInput = document.getElementById("ctrl-width") as HTMLInputElement;
const heightInput = document.getElementById("ctrl-height") as HTMLInputElement;
const cellSizeInput = document.getElementById(
  "ctrl-cellsize"
) as HTMLInputElement;
const tileSetSelect = document.getElementById(
  "ctrl-tileset"
) as HTMLSelectElement;
const delayInput = document.getElementById("ctrl-delay") as HTMLInputElement;
const gridInput = document.getElementById("ctrl-grid") as HTMLInputElement;
const resetButton = document.getElementById("ctrl-reset") as HTMLButtonElement;
const stepButton = document.getElementById("ctrl-step") as HTMLButtonElement;
const collapseAllButton = document.getElementById(
  "ctrl-collapse-all"
) as HTMLButtonElement;
const statusDiv = document.getElementById("ctrl-status") as HTMLDivElement;

const logTilesCountSpan = document.getElementById(
  "log-tiles-count"
) as HTMLSpanElement;

const logCellsCountSpan = document.getElementById(
  "log-cells-count"
) as HTMLSpanElement;

const logStepTimeSpan = document.getElementById(
  "log-step-time"
) as HTMLSpanElement;
const logAllTimeSpan = document.getElementById(
  "log-all-time"
) as HTMLSpanElement;
const logAllCountSpan = document.getElementById(
  "log-all-count"
) as HTMLSpanElement;
const logAllAvgSpan = document.getElementById("log-all-avg") as HTMLSpanElement;

if (
  !canvas ||
  !tooltip ||
  !controlsPanel ||
  !seedInput ||
  !randomSeedButton ||
  !widthInput ||
  !heightInput ||
  !cellSizeInput ||
  !tileSetSelect ||
  !delayInput ||
  !gridInput ||
  !resetButton ||
  !stepButton ||
  !collapseAllButton ||
  !statusDiv ||
  !logStepTimeSpan ||
  !logAllTimeSpan ||
  !logAllCountSpan ||
  !logAllAvgSpan ||
  !logTilesCountSpan ||
  !logCellsCountSpan
) {
  throw new Error("One or more required UI elements not found.");
}

let currentSeed: number | string = seedInput.value || 0;
let currentCellSize = parseInt(cellSizeInput.value, 10);
let currentGridWidthCells = parseInt(widthInput.value, 10);
let currentGridHeightCells = parseInt(heightInput.value, 10);

let currentTileSet: "circuit" | "road" | "rail" | "kenneyMedieval" =
  tileSetSelect.value as "circuit" | "road" | "rail" | "kenneyMedieval";
let currentStepDelay = parseInt(delayInput.value, 10);
let currentDrawGrid = !!gridInput.checked;

let wfcInstance: WFC2D | null = null;
let isCollapsingAll = false;

const roadImagePaths = Array.from({ length: 3 }, (_, i) => `/road/${i}.png`);
const roadImagesPromise: Promise<HTMLImageElement[]> = imgLoaderBatch(
  roadImagePaths
).catch((error) => {
  console.error("Failed to load road images:", error);
  setStatus("Error loading road images!");
  return [];
});

const railImagePaths = Array.from({ length: 5 }, (_, i) => `/rail/${i}.png`);
const railImagesPromise: Promise<HTMLImageElement[]> = imgLoaderBatch(
  railImagePaths
).catch((error) => {
  console.error("Failed to load rail images:", error);
  setStatus("Error loading rail images!");
  return [];
});

const circuitImagePaths = Array.from(
  { length: 13 },
  (_, i) => `/circuit/${i}.png`
);
const circuitImagesPromise: Promise<HTMLImageElement[]> = imgLoaderBatch(
  circuitImagePaths
).catch((error) => {
  console.error("Failed to load circuit images:", error);
  setStatus("Error loading circuit images!");
  return [];
});

const kenneyMedievalPaths = Array.from(
  { length: 43 },
  (_, i) => `/kenney_medieval-rts/tiles/${i}.png`
);
const kenneyMedievalPromise: Promise<HTMLImageElement[]> = imgLoaderBatch(
  kenneyMedievalPaths
).catch((error) => {
  console.error("Failed to load 'Kenney medieval' images:", error);
  setStatus("Error loading 'Kenney medieval' images!");
  return [];
});

async function defineTiles() {
  const roadImages = await roadImagesPromise;
  const circuitImages = await circuitImagesPromise;
  const railImages = await railImagesPromise;
  const kenneyMedievalImages = await kenneyMedievalPromise;

  const roadImagesRotations: (1 | 2 | 3)[][] = [[], [1, 2, 3], [1]];
  const circuitImagesRotations: (1 | 2 | 3)[][] = [
    [],
    [],
    [1, 2, 3],
    [1],
    [1, 2, 3],
    [1, 2, 3],
    [1],
    [1],
    [1, 2, 3],
    [1, 2, 3],
    [1],
    [1, 2, 3],
    [1],
  ];

  const railImagesRotations: (1 | 2 | 3)[][] = [
    [],
    [1, 2, 3],
    [1, 2, 3],
    [1],
    [],
  ];

  const allTiles = {
    circuit: circuitImages.map(
      (_, i) =>
        new WFCTile2D({
          content: circuitImages[i],
          rotations: circuitImagesRotations[i],
          name: `circuit_${i}`,
        })
    ),
    road: roadImages.map(
      (_, i) =>
        new WFCTile2D({
          content: roadImages[i],
          rotations: roadImagesRotations[i],
          name: `road_${i}`,
        })
    ),
    rail: railImages.map(
      (_, i) =>
        new WFCTile2D({
          content: railImages[i],
          rotations: railImagesRotations[i],
          name: `rail_${i}`,
        })
    ),
    kenneyMedieval: kenneyMedievalImages.map(
      (_, i) =>
        new WFCTile2D({
          content: kenneyMedievalImages[i],
          name: `kenney_${i}`,
        })
    ),
  };

  annotateTiles2DEdges(allTiles.circuit);
  annotateTiles2DEdges(allTiles.road);

  annotateTiles2DEdges(allTiles.rail, 0.05, 30);
  annotateTiles2DEdges(allTiles.kenneyMedieval, 0.05, 30);

  console.log("Defined and annotated tiles:", allTiles);
  return allTiles;
}

/** Sets the status message in the control panel */
function setStatus(message: string) {
  statusDiv.textContent = message;
}

/** Clears the performance log display */
function clearPerfLog() {
  logTilesCountSpan.textContent = `${wfcInstance?.tiles.length || 0}`;
  updateCellsCount();
  logStepTimeSpan.textContent = "- ms";
  logAllTimeSpan.textContent = "- ms";
  logAllCountSpan.textContent = "-";
  logAllAvgSpan.textContent = "- ms";
}

function updateTilesCount(count: number) {
  logTilesCountSpan.textContent = `${count}`;
}

function updateCellsCount() {
  const width = parseInt(widthInput.value, 10) || 0;
  const height = parseInt(heightInput.value, 10) || 0;
  logCellsCountSpan.textContent = `${width * height}`;
}

/** Updates the performance log for a single step */
function updateStepLog(duration: number) {
  logStepTimeSpan.textContent = `${duration.toFixed(3)} ms`;
}

/** Updates the performance log after collapseAll */
function updateCollapseAllLog(
  totalDuration: number,
  count: number,
  avgTime: number
) {
  logAllTimeSpan.textContent = `${totalDuration.toFixed(3)} ms`;
  logAllCountSpan.textContent = count.toString();
  logAllAvgSpan.textContent = `${avgTime.toFixed(3)} ms`;
}

/** Draws a message overlay on the canvas */
function drawOverlayMessage(message: string, color: string = "red") {
  if (!wfcInstance) return;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
    ctx.fillStyle = color;
    ctx.font = "bold 48px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
  }
}

/** Toggles the disabled state of control buttons */
function setControlsDisabled(disabled: boolean) {
  resetButton.disabled = disabled;
  stepButton.disabled = disabled;
  collapseAllButton.disabled = disabled;
  randomSeedButton.disabled = disabled;

  seedInput.disabled = disabled;
  widthInput.disabled = disabled;
  heightInput.disabled = disabled;
  cellSizeInput.disabled = disabled;
  tileSetSelect.disabled = disabled;
  delayInput.disabled = disabled;
  gridInput.disabled = disabled;
}

/** Initializes or re-initializes the WFC grid based on UI settings */
async function initializeWFC() {
  if (isCollapsingAll) return;

  setStatus("Initializing...");
  clearPerfLog();
  setControlsDisabled(true);
  tooltip.style.display = "none";

  currentSeed = seedInput.value.trim();
  currentGridWidthCells = parseInt(widthInput.value, 10);
  currentGridHeightCells = parseInt(heightInput.value, 10);
  currentCellSize = parseInt(cellSizeInput.value, 10);

  currentTileSet = tileSetSelect.value as
    | "circuit"
    | "road"
    | "rail"
    | "kenneyMedieval";
  currentStepDelay = parseInt(delayInput.value, 10);
  currentDrawGrid = !!gridInput.checked;

  if (
    isNaN(currentGridWidthCells) ||
    currentGridWidthCells <= 0 ||
    isNaN(currentGridHeightCells) ||
    currentGridHeightCells <= 0 ||
    isNaN(currentCellSize) ||
    currentCellSize <= 0
  ) {
    setStatus("Error: Invalid grid dimensions or cell size.");
    setControlsDisabled(false);
    return;
  }

  let seedValue: number;
  if (currentSeed === "" || isNaN(Number(currentSeed))) {
    seedValue = generateTimeSeed();
    seedInput.value = seedValue.toString();
    currentSeed = seedValue;
    console.log(`Generated random seed: ${seedValue}`);
  } else {
    seedValue = Number(currentSeed);
  }

  console.log(`Initializing WFC with seed: ${seedValue}`);

  const targetWidth = currentGridWidthCells * currentCellSize;
  const targetHeight = currentGridHeightCells * currentCellSize;
  const drawGrid = currentDrawGrid;

  try {
    setStatus("Loading tiles...");
    const allTiles = await defineTiles();

    if (!allTiles[currentTileSet] || allTiles[currentTileSet].length === 0) {
      throw new Error(
        `Tile set "${currentTileSet}" is empty or failed to load.`
      );
    }

    setStatus("Creating WFC instance...");
    wfcInstance = new WFC2D({
      canvas: canvas,
      width: targetWidth,
      height: targetHeight,
      cellSize: currentCellSize,
      seed: seedValue,
      drawGrid,
    });

    wfcInstance.clear();
    wfcInstance.addTile(...allTiles[currentTileSet]);
    wfcInstance.init();

    updateTilesCount(wfcInstance.wfcBuffer.tiles.count);
    updateCellsCount();

    console.log(
      `Grid dimensions: ${wfcInstance.wfcBuffer.cols}x${wfcInstance.wfcBuffer.rows}`
    );
    console.log(`Canvas dimensions: ${canvas.width}x${canvas.height}`);
    console.log(`Total tile states: ${wfcInstance.wfcBuffer.tiles.count}`);

    wfcInstance.draw();
    setStatus("Ready. Click a cell or use controls.");
  } catch (error) {
    console.error("WFC Initialization failed:", error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    setStatus(`Error: ${errorMsg}. Check console.`);
    drawOverlayMessage("Initialization Error!", "orange");
    wfcInstance = null;
  } finally {
    setControlsDisabled(false);
  }
}

async function collapseStep() {
  if (!wfcInstance || isCollapsingAll || wfcInstance.wfcBuffer.isCompleted)
    return;

  console.log("Performing single collapse step...");
  setStatus("Collapsing step...");
  setControlsDisabled(true);
  tooltip.style.display = "none";

  await new Promise((resolve) => setTimeout(resolve, 1));

  const startTime = performance.now();
  const success = wfcInstance.collapse();
  const endTime = performance.now();
  const duration = endTime - startTime;

  console.log(`Single collapse call took: ${duration.toFixed(3)} ms`);
  updateStepLog(duration);

  wfcInstance.draw();

  if (success) {
    if (wfcInstance.wfcBuffer.isCompleted) {
      console.log("Collapse complete!");
      setStatus("Collapse complete!");
    } else {
      setStatus(`Ready. ${wfcInstance.wfcBuffer.remainingCells} cells left.`);
    }
  } else {
    if (wfcInstance.wfcBuffer.isCompleted) {
      setStatus("Grid already fully collapsed.");
    } else {
      console.error("WFC step failed! Contradiction likely.");
      setStatus("CONTRADICTION!");
      drawOverlayMessage("CONTRADICTION!");
    }
  }
  setControlsDisabled(false);
}

async function collapseAll() {
  if (!wfcInstance || isCollapsingAll || wfcInstance.wfcBuffer.isCompleted)
    return;

  isCollapsingAll = true;
  setControlsDisabled(true);
  setStatus("Collapsing all...");
  tooltip.style.display = "none";
  console.log("Starting full collapse...");

  const totalStartTime = performance.now();
  let collapseCount = 0;
  let totalCollapseDurationInternal = 0;

  let success = true;
  const delay = currentStepDelay;

  while (!wfcInstance.wfcBuffer.isCompleted && success) {
    const stepStartTime = performance.now();
    success = wfcInstance.collapse();
    const stepEndTime = performance.now();

    if (success) {
      collapseCount++;
      totalCollapseDurationInternal += stepEndTime - stepStartTime;

      if (delay > 0) {
        wfcInstance.draw();
        setStatus(
          `Collapsing... ${wfcInstance.wfcBuffer.remainingCells} cells left.`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else if (collapseCount % 100 === 0) {
        setStatus(
          `Collapsing... ${wfcInstance.wfcBuffer.remainingCells} cells left.`
        );

        await new Promise((resolve) => setTimeout(resolve, 1));
      }
    }
  }

  const totalEndTime = performance.now();
  const totalDuration = totalEndTime - totalStartTime;
  const averageTimePerStep =
    collapseCount > 0 ? totalCollapseDurationInternal / collapseCount : 0;

  wfcInstance.draw();

  console.log(
    `collapseAll total wall-clock time: ${totalDuration.toFixed(3)} ms`
  );
  console.log(`collapseAll performed ${collapseCount} collapse steps.`);
  if (collapseCount > 0) {
    console.log(
      `collapseAll total internal collapse time: ${totalCollapseDurationInternal.toFixed(
        3
      )} ms`
    );
    console.log(
      `collapseAll average time per collapse step: ${averageTimePerStep.toFixed(
        3
      )} ms`
    );
  }

  updateCollapseAllLog(totalDuration, collapseCount, averageTimePerStep);

  if (success && wfcInstance.wfcBuffer.isCompleted) {
    console.log("Collapse successful!");
    setStatus("Collapse complete!");
  } else {
    console.error("WFC failed to collapse! Contradiction occurred.");
    setStatus("CONTRADICTION!");
    drawOverlayMessage("CONTRADICTION!");
  }

  isCollapsingAll = false;
  setControlsDisabled(false);
}

async function handleCanvasClick(event: MouseEvent) {
  if (!wfcInstance || !wfcInstance.wfcBuffer || isCollapsingAll) {
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const cols = wfcInstance.wfcBuffer.cols;
  const rows = wfcInstance.wfcBuffer.rows;
  const actualCellSize = wfcInstance.size;

  const cellX = Math.floor(mouseX / actualCellSize);
  const cellY = Math.floor(mouseY / actualCellSize);
  const index = cellY * cols + cellX;

  if (
    cellX < 0 ||
    cellX >= cols ||
    cellY < 0 ||
    cellY >= rows ||
    index < 0 ||
    index >= wfcInstance.wfcBuffer.count
  ) {
    console.log("Clicked outside grid bounds.");
    return;
  }

  if (wfcInstance.wfcBuffer.collapsed[index] !== -1) {
    console.log(
      `Cell [${cellX}, ${cellY}] (Index: ${index}) is already collapsed.`
    );

    return;
  }

  console.log(
    `Attempting to collapse cell [${cellX}, ${cellY}] (Index: ${index})`
  );
  setStatus(`Collapsing cell ${index}...`);
  setControlsDisabled(true);
  tooltip.style.display = "none";

  await new Promise((resolve) => setTimeout(resolve, 1));

  const startTime = performance.now();
  const success = wfcInstance.collapseCell(index);
  const endTime = performance.now();
  const duration = endTime - startTime;

  console.log(`collapseCell(${index}) took: ${duration.toFixed(3)} ms`);
  updateStepLog(duration);

  wfcInstance.draw();

  if (success) {
    console.log(`Cell ${index} collapsed successfully.`);
    if (wfcInstance.wfcBuffer.isCompleted) {
      setStatus("Collapse complete!");
    } else {
      setStatus(
        `Cell ${index} collapsed. ${wfcInstance.wfcBuffer.remainingCells} cells left.`
      );
    }
  } else {
    console.error(
      `WFC failed to collapse cell ${index}! Contradiction occurred.`
    );
    setStatus(`CONTRADICTION collapsing cell ${index}!`);
    drawOverlayMessage("CONTRADICTION!");
  }

  setControlsDisabled(false);
}

resetButton.addEventListener("click", initializeWFC);
stepButton.addEventListener("click", collapseStep);
collapseAllButton.addEventListener("click", collapseAll);
canvas.addEventListener("click", handleCanvasClick);

randomSeedButton.addEventListener("click", () => {
  const newSeed = generateTimeSeed();
  seedInput.value = newSeed.toString();
  currentSeed = newSeed;
  console.log(`Generated random seed via button: ${newSeed}`);
});

seedInput.addEventListener("change", () => (currentSeed = seedInput.value));
widthInput.addEventListener("change", () => {
  currentGridWidthCells = parseInt(widthInput.value, 10);
  updateCellsCount();
});
heightInput.addEventListener("change", () => {
  currentGridHeightCells = parseInt(heightInput.value, 10);
  updateCellsCount();
});
cellSizeInput.addEventListener("change", () => {
  currentCellSize = parseInt(cellSizeInput.value, 10);
});
tileSetSelect.addEventListener("change", () => {
  currentTileSet = tileSetSelect.value as
    | "circuit"
    | "road"
    | "rail"
    | "kenneyMedieval";
});
delayInput.addEventListener(
  "change",
  () => (currentStepDelay = parseInt(delayInput.value, 10))
);
gridInput.addEventListener("change", () => {
  currentDrawGrid = !!gridInput.checked;
  if (wfcInstance) {
    wfcInstance.drawGrid = currentDrawGrid;
    wfcInstance.draw();
  }
});

canvas.addEventListener("mousemove", (event) => {
  if (!wfcInstance || !wfcInstance.wfcBuffer || isCollapsingAll) {
    tooltip.style.display = "none";
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const cols = wfcInstance.wfcBuffer.cols;
  const rows = wfcInstance.wfcBuffer.rows;

  const actualCellSize = wfcInstance.size;
  const cellX = Math.floor(mouseX / actualCellSize);
  const cellY = Math.floor(mouseY / actualCellSize);
  const index = cellY * cols + cellX;

  if (
    cellX < 0 ||
    cellX >= cols ||
    cellY < 0 ||
    cellY >= rows ||
    index < 0 ||
    index >= wfcInstance.wfcBuffer.count
  ) {
    tooltip.style.display = "none";
    return;
  }

  tooltip.innerHTML = "";
  const headerDiv = document.createElement("div");
  headerDiv.className = "tooltip-header";
  const optionsDiv = document.createElement("div");
  optionsDiv.className = "tooltip-options";

  const gridX = cellX;
  const gridY = cellY;

  if (wfcInstance.wfcBuffer.collapsed[index] !== -1) {
    const tileIndex = wfcInstance.wfcBuffer.collapsedTile(index);

    const tile =
      tileIndex !== -1 ? wfcInstance.wfcBuffer.tiles.tiles[tileIndex] : null;

    headerDiv.textContent = `Cell [${gridX}, ${gridY}] (Idx: ${index}) - Collapsed`;
    if (tile && tile.image) {
      const img = document.createElement("img");
      if (
        tile.image instanceof HTMLImageElement ||
        tile.image instanceof HTMLCanvasElement
      ) {
        img.src =
          (tile.image as any).src ||
          (tile.image as HTMLCanvasElement).toDataURL();
      }
      img.alt = tile.name || `Tile ${tileIndex}`;
      img.title = `${tile.name || `Tile ${tileIndex}`} (Rot: ${
        tile._rotation * 90
      }°, RefX: ${tile._reflectX}, RefY: ${tile._reflectY})`;

      Object.assign(img.style, {
        transform: `rotate(${tile._rotation * 90}deg) scale(${
          tile._reflectX ? -1 : 1
        }, ${tile._reflectY ? -1 : 1})`,
      });
      optionsDiv.appendChild(img);
    } else {
      optionsDiv.textContent = `Error: Collapsed to tile ${tileIndex}`;
    }
  } else {
    const possibleIndices = wfcInstance.wfcBuffer.options.indices(index);
    const optionCount = possibleIndices ? possibleIndices.length : 0;
    const entropy = wfcInstance.wfcBuffer.entropyHeap.read(index).toFixed(4);

    headerDiv.textContent = `Cell [${gridX}, ${gridY}] (Idx: ${index}) - Options: ${optionCount}, Entropy: ${entropy}`;

    if (possibleIndices) {
      possibleIndices.forEach((tileIndex) => {
        const tile = wfcInstance!.wfcBuffer.tiles.tiles[tileIndex];
        if (tile && tile.image) {
          const img = document.createElement("img");
          if (
            tile.image instanceof HTMLImageElement ||
            tile.image instanceof HTMLCanvasElement
          ) {
            img.src =
              (tile.image as any).src ||
              (tile.image as HTMLCanvasElement).toDataURL();
          }
          img.alt = tile.name || `Tile ${tileIndex}`;
          img.title = `${tile.name || `Tile ${tileIndex}`} (Rot: ${
            tile._rotation * 90
          }°, RefX: ${tile._reflectX}, RefY: ${tile._reflectY})`;

          Object.assign(img.style, {
            transform: `rotate(${tile._rotation * 90}deg) scale(${
              tile._reflectX ? -1 : 1
            }, ${tile._reflectY ? -1 : 1})`,
          });
          optionsDiv.appendChild(img);
        } else {
          const span = document.createElement("span");
          span.textContent = tileIndex.toString();
          span.title = `Tile ${tileIndex} (No Image)`;
          optionsDiv.appendChild(span);
        }
      });
    } else {
      optionsDiv.textContent = "No options remaining (Contradiction?)";
    }
  }

  tooltip.appendChild(headerDiv);
  tooltip.appendChild(optionsDiv);

  const tooltipOffsetX = 15;
  const tooltipOffsetY = 10;
  let tooltipX = event.pageX + tooltipOffsetX;
  let tooltipY = event.pageY + tooltipOffsetY;
  const screenPadding = 10;

  if (tooltipX + tooltip.offsetWidth + screenPadding > window.innerWidth) {
    tooltipX = event.pageX - tooltip.offsetWidth - tooltipOffsetX;
  }
  if (tooltipY + tooltip.offsetHeight + screenPadding > window.innerHeight) {
    tooltipY = event.pageY - tooltip.offsetHeight - tooltipOffsetY;
  }

  if (tooltipX < screenPadding) tooltipX = screenPadding;
  if (tooltipY < screenPadding) tooltipY = screenPadding;
  tooltip.style.left = `${tooltipX}px`;
  tooltip.style.top = `${tooltipY}px`;
  tooltip.style.display = "block";
});

canvas.addEventListener("mouseout", () => {
  tooltip.style.display = "none";
});

clearPerfLog();
setStatus("Loading...");
initializeWFC().catch((err) => {
  console.error("Initial WFC setup failed:", err);
  setStatus("FATAL ERROR during initial setup. Check console.");
  drawOverlayMessage("WFC Setup Error!", "orange");
});
