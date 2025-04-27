import { annotateTiles2DEdges } from "../../lib/utils/annotateTiles2DEdges";
import { imgLoaderBatch } from "../../lib/utils/imgLoader";
import { generateTimeSeed } from "../../lib/utils/prngSeedGenerators";
import { WFC2DBuffer } from "../../lib/WFC2DBuffer";
import { WFCTile2D } from "../../lib/WFCTile2D";

const DEFAULT_GRID_SIZE = 20;
const DEFAULT_RUNS = 5;

const runBtn = document.getElementById(
  "runPerformanceTestBtn"
) as HTMLButtonElement;
const statusDiv = document.getElementById("status") as HTMLDivElement;
const resultsDiv = document.getElementById("results") as HTMLDivElement;
const gridSizeInput = document.getElementById("gridSize") as HTMLInputElement;
const runsInput = document.getElementById("runs") as HTMLInputElement;
const tileSetSelect = document.getElementById("tileSet") as HTMLSelectElement;

if (
  !runBtn ||
  !statusDiv ||
  !resultsDiv ||
  !gridSizeInput ||
  !runsInput ||
  !tileSetSelect
) {
  throw new Error(
    "One or more required UI elements not found in performance.html."
  );
}

async function loadTiles(
  tileSet: "circuit" | "rail" | "road"
): Promise<WFCTile2D[]> {
  console.log(`[PerfTest] Loading ${tileSet} images...`);
  statusDiv.textContent = `Loading ${tileSet} images...`;
  let imagePaths: string[] = [];
  let baseTiles: WFCTile2D[] = [];

  try {
    if (tileSet === "circuit") {
      imagePaths = Array.from({ length: 13 }, (_, i) => `/circuit/${i}.png`);
      const images = await imgLoaderBatch(imagePaths);
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
      baseTiles = images.map(
        (_, i) =>
          new WFCTile2D({
            content: images[i],
            rotations: circuitImagesRotations[i],
          })
      );
    } else if (tileSet === "rail") {
      imagePaths = Array.from({ length: 7 }, (_, i) => `/rail/${i}.png`);
      const images = await imgLoaderBatch(imagePaths);
      const railImagesRotations: (1 | 2 | 3)[][] = [
        [],
        [1, 2, 3],
        [1, 2, 3],
        [1],
        [],
        [1, 2, 3],
        [1, 2, 3],
      ];
      baseTiles = images.map(
        (_, i) =>
          new WFCTile2D({
            content: images[i],
            rotations: railImagesRotations[i],
          })
      );
    } else {
      imagePaths = Array.from({ length: 3 }, (_, i) => `/road/${i}.png`);
      const images = await imgLoaderBatch(imagePaths);
      const roadImagesRotations: (1 | 2 | 3)[][] = [[], [1, 2, 3], [1]];
      baseTiles = images.map(
        (_, i) =>
          new WFCTile2D({
            content: images[i],
            rotations: roadImagesRotations[i],
          })
      );
    }

    console.log(
      `[PerfTest] Annotating ${baseTiles.length} base ${tileSet} tiles...`
    );
    statusDiv.textContent = `Annotating ${tileSet} tiles...`;

    annotateTiles2DEdges(baseTiles);
    console.log(`[PerfTest] Annotation complete.`);
    statusDiv.textContent = "Tiles loaded and annotated.";
    return baseTiles;
  } catch (error) {
    console.error(
      `[PerfTest] Failed to load or annotate ${tileSet} tiles:`,
      error
    );
    statusDiv.textContent = `Error loading ${tileSet} tiles. Check console.`;
    throw error;
  }
}

interface PerformanceRunResult {
  run: number;
  seed: number;
  initTime: number;
  collapseTime: number;
  success: boolean;
}

interface PerformanceSummary {
  tileSet: string;
  gridSize: number;
  totalCells: number;
  numRuns: number;
  baseTileCount: number;
  totalTileStates: number;
  runs: PerformanceRunResult[];
  avgInitTime: number;
  avgCollapseTime: number;
  successRate: number;
  totalTestTime: number;
}

async function runPerformanceTest(
  tiles: WFCTile2D[],
  gridSize: number,
  numRuns: number,
  tileSetName: string
): Promise<PerformanceSummary> {
  const baseSeed = generateTimeSeed();
  const cols = gridSize;
  const rows = gridSize;
  const totalCells = cols * rows;
  const baseTileCount = tiles.length;
  let totalTileStates = 0;

  const results: PerformanceRunResult[] = [];
  let totalInitTime = 0;
  let totalCollapseTime = 0;
  let successfulRuns = 0;

  console.log(`\n--- Starting Performance Test ---`);
  console.log(
    `Tileset: ${tileSetName}, Grid: ${gridSize}x${gridSize} (${totalCells} cells), Runs: ${numRuns}, Base Seed: ${baseSeed}`
  );
  statusDiv.textContent = `Starting test: ${tileSetName} ${gridSize}x${gridSize}, ${numRuns} runs...`;
  resultsDiv.innerHTML = `Starting test...\nTileset: ${tileSetName}\nGrid: ${gridSize}x${gridSize} (${totalCells} cells)\nRuns: ${numRuns}\nBase Seed: ${baseSeed}\n\n`;
  await new Promise((resolve) => setTimeout(resolve, 20));

  const testStartTime = performance.now();

  console.log(`[PerfTest] Running warm-up...`);
  statusDiv.textContent = `Running warm-up...`;
  resultsDiv.innerHTML += `Running warm-up...\n`;
  await new Promise((resolve) => setTimeout(resolve, 10));
  try {
    const warmUpSeed = baseSeed - 1;

    const warmUpBuffer = new WFC2DBuffer([...tiles], cols, rows, warmUpSeed);
    totalTileStates = warmUpBuffer.tiles.count;
    console.log(
      `[PerfTest] Total tile states (including transformations): ${totalTileStates}`
    );
    resultsDiv.innerHTML = `Starting test...\nTileset: ${tileSetName} (${baseTileCount} base tiles -> ${totalTileStates} states)\nGrid: ${gridSize}x${gridSize} (${totalCells} cells)\nRuns: ${numRuns}\nBase Seed: ${baseSeed}\n\nRunning warm-up...\n`;

    const warmUpSuccess = warmUpBuffer.collapseAll();
    resultsDiv.innerHTML += `Warm-up ${
      warmUpSuccess ? "completed" : "failed (Contradiction)"
    }.\n\n`;
    console.log(
      `[PerfTest] Warm-up ${
        warmUpSuccess ? "completed" : "failed (Contradiction)"
      }.`
    );
    if (!warmUpSuccess) {
      console.warn(
        `Warm-up run failed (Seed: ${warmUpSeed}). Contradictions might occur in test runs.`
      );
    }
  } catch (e) {
    console.error("[PerfTest] Error during warm-up:", e);
    resultsDiv.innerHTML += `ERROR during warm-up: ${e}\n`;
    throw new Error("Warm-up failed, stopping test.");
  }

  for (let i = 0; i < numRuns; i++) {
    const runNumber = i + 1;
    const currentSeed = baseSeed + i;
    let runResult: PerformanceRunResult = {
      run: runNumber,
      seed: currentSeed,
      initTime: 0,
      collapseTime: 0,
      success: false,
    };

    console.log(
      `\n[PerfTest] Starting Run ${runNumber}/${numRuns} (Seed: ${currentSeed})...`
    );
    statusDiv.textContent = `Running Test ${runNumber}/${numRuns}...`;
    resultsDiv.innerHTML += `\n--- Run ${runNumber}/${numRuns} (Seed: ${currentSeed}) ---\n`;
    await new Promise((resolve) => setTimeout(resolve, 10));

    try {
      const initStart = performance.now();

      const buffer = new WFC2DBuffer([...tiles], cols, rows, currentSeed);

      if (buffer.tiles.count !== totalTileStates) {
        console.warn(
          `Tile state count mismatch! Expected ${totalTileStates}, got ${buffer.tiles.count}. Using new value.`
        );
        totalTileStates = buffer.tiles.count;
      }
      const initEnd = performance.now();
      runResult.initTime = initEnd - initStart;
      totalInitTime += runResult.initTime;
      resultsDiv.innerHTML += `Initialization: ${runResult.initTime.toFixed(
        3
      )} ms\n`;
      console.log(
        `[PerfTest] Run ${runNumber} Init: ${runResult.initTime.toFixed(3)} ms`
      );

      const collapseStart = performance.now();
      const success = buffer.collapseAll();
      const collapseEnd = performance.now();

      runResult.success = success;
      runResult.collapseTime = collapseEnd - collapseStart;
      totalCollapseTime += runResult.collapseTime;
      if (success) {
        successfulRuns++;
        resultsDiv.innerHTML += `Collapse All: ${runResult.collapseTime.toFixed(
          3
        )} ms <span class="success">[Success]</span>\n`;
        console.log(
          `[PerfTest] Run ${runNumber} Collapse: ${runResult.collapseTime.toFixed(
            3
          )} ms (Success)`
        );
      } else {
        resultsDiv.innerHTML += `Collapse All: ${runResult.collapseTime.toFixed(
          3
        )} ms <span class="failure">[CONTRADICTION]</span>\n`;
        console.warn(
          `[PerfTest] Run ${runNumber} Collapse: ${runResult.collapseTime.toFixed(
            3
          )} ms (Contradiction)`
        );
      }
    } catch (error) {
      console.error(`[PerfTest] Error during Run ${runNumber}:`, error);
      resultsDiv.innerHTML += `ERROR during run: ${error}\n`;

      runResult.success = false;
      runResult.initTime = 0;
      runResult.collapseTime = 0;
    }

    results.push(runResult);

    await new Promise((resolve) => setTimeout(resolve, 5));
  }

  const testEndTime = performance.now();
  const totalTestTime = testEndTime - testStartTime;

  const avgInitTime = numRuns > 0 ? totalInitTime / numRuns : 0;
  const avgCollapseTime = numRuns > 0 ? totalCollapseTime / numRuns : 0;
  const successRate = numRuns > 0 ? successfulRuns / numRuns : 0;

  console.log(`\n--- Performance Test Complete ---`);
  console.log(`Total Time: ${totalTestTime.toFixed(3)} ms`);
  console.log(`Avg Init Time: ${avgInitTime.toFixed(3)} ms`);
  console.log(`Avg Collapse Time: ${avgCollapseTime.toFixed(3)} ms`);
  console.log(
    `Success Rate: ${(successRate * 100).toFixed(
      1
    )}% (${successfulRuns}/${numRuns})`
  );

  return {
    tileSet: tileSetName,
    gridSize: gridSize,
    totalCells: totalCells,
    numRuns: numRuns,
    baseTileCount: baseTileCount,
    totalTileStates: totalTileStates,
    runs: results,
    avgInitTime: avgInitTime,
    avgCollapseTime: avgCollapseTime,
    successRate: successRate,
    totalTestTime: totalTestTime,
  };
}

function displayPerformanceResults(summary: PerformanceSummary) {
  let html = `<div class="results-summary">`;
  html += `<h2>Performance Summary</h2>`;
  html += `<strong>Tileset:</strong> ${summary.tileSet}<br>`;
  html += `<strong>Base Tiles:</strong> ${summary.baseTileCount}<br>`;
  html += `<strong>Total Tile States:</strong> ${summary.totalTileStates} (incl. transformations)<br>`;
  html += `<strong>Grid Size:</strong> ${summary.gridSize}x${summary.gridSize}<br>`;
  html += `<strong>Total Cells:</strong> ${summary.totalCells}<br>`;
  html += `<strong>Runs:</strong> ${summary.numRuns}<br>`;
  html += `<strong>Total Test Time:</strong> ${summary.totalTestTime.toFixed(
    3
  )} ms<br>`;
  html += `<strong>Avg Init Time:</strong> ${summary.avgInitTime.toFixed(
    3
  )} ms<br>`;
  html += `<strong>Avg Collapse Time:</strong> ${summary.avgCollapseTime.toFixed(
    3
  )} ms<br>`;
  html += `<strong>Avg Time per Cell:</strong> ${(
    (summary.avgCollapseTime * 1000) /
    summary.totalCells
  ).toFixed(3)} µs<br>`;
  html += `<strong>Success Rate:</strong> ${(summary.successRate * 100).toFixed(
    1
  )}% (${Math.round(summary.successRate * summary.numRuns)}/${
    summary.numRuns
  })<br>`;
  html += `</div>`;

  html += `<h3>Run Details:</h3>`;
  summary.runs.forEach((run) => {
    html += `<div class="run-log">`;
    html += `Run ${run.run} (Seed: ${run.seed}) | `;
    html += `Init: ${run.initTime.toFixed(3)} ms | `;
    html += `Collapse: ${run.collapseTime.toFixed(3)} ms | `;
    html += run.success
      ? `<span class="success">Success</span>`
      : `<span class="failure">Contradiction</span>`;
    html += `</div>`;
  });

  resultsDiv.innerHTML = html;
}

async function main() {
  runBtn.disabled = true;
  resultsDiv.innerHTML = "Starting performance test...";

  const gridSize = parseInt(gridSizeInput.value, 10) || DEFAULT_GRID_SIZE;
  const numRuns = parseInt(runsInput.value, 10) || DEFAULT_RUNS;
  const tileSet = tileSetSelect.value as "circuit" | "rail" | "road";

  try {
    const tiles = await loadTiles(tileSet);

    if (!tiles || tiles.length === 0) {
      throw new Error("No tiles were loaded or defined.");
    }

    const summary = await runPerformanceTest(tiles, gridSize, numRuns, tileSet);

    displayPerformanceResults(summary);
    statusDiv.textContent = "Performance test complete.";
  } catch (error) {
    console.error("[PerfTest] Test failed:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    statusDiv.textContent = `Test failed: ${errorMessage}`;
    resultsDiv.innerHTML += `\n\n<p style="color: red; font-weight: bold;">TEST FAILED: ${errorMessage}. See console for details.</p>`;
  } finally {
    runBtn.disabled = false;
  }
}

runBtn.addEventListener("click", main);

statusDiv.textContent = "Ready to run performance test.";
resultsDiv.textContent = "Configure options and click 'Run Performance Test'.";
