# Three-WFC: A Blazing Fast ⚡ Wave Function Collapse Solver for Three.js

🚧 **Work in Progress** 🚧

This library provides a highly optimized Wave Function Collapse (WFC) implementation designed for use with Three.js (though the core logic can run independently). It focuses heavily on performance by leveraging techniques like Typed Arrays, bitmasking, min-heaps for entropy selection, and avoiding garbage collection during the solving process.

The goal is to enable complex procedural generation directly in the browser with minimal performance impact.

## ✨ Key Features

- **Performance-Focused:** Optimized for speed using:
  - **Typed Arrays:** Minimizes garbage collection and memory overhead by using pre-allocated buffers (`Uint32Array`, `Float32Array`, `Int16Array`, etc.) for all core data structures.
  - **Bitmasking (`WFCOptionsBuffer`):** Efficiently represents and checks tile compatibility using bitwise operations, significantly faster than array lookups.
  - **Min-Heap Entropy Selection (`WFCMinHeap`):** Quickly finds the next cell to collapse (O(log n)) without requiring full grid scans on each step. Includes a key-to-position map for fast updates/removals.
  - **Circular Stack Propagation (`WFCStackBuffer`):** Avoids recursion overhead and array resizing/shifting during constraint propagation.
- **Three.js Ready:** While the core solver is canvas-agnostic (`WFC2DBuffer`), the `WFC2D` class provides a convenient wrapper for rendering to an HTML Canvas, suitable for integration into Three.js textures or scenes.
- **2D Implementation:** Currently provides a robust 2D WFC solver (`WFC2D`, `WFC2DBuffer`).
- **Tile Transformations:** Supports automatic generation of rotated and reflected tile variations (`WFCTile2D`).
- **Edge Annotation Utilities:** Includes helpers (`annotateTiles2DEdges`) to automatically determine edge compatibility based on pixel data.
- **Interactive Examples:** Comes with live demos for visualization, performance testing, and tile annotation inspection.

## 🚀 Getting Started & Running Examples

Follow these steps to run the live examples locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Fennec-hub/three-wfc
    cd three-wfc
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start a Vite development server. Check your terminal output for the exact local URL (usually `http://localhost:5173` or similar).

## 🧪 Live Examples

Once the development server is running (`npm run dev`), you can access the following example pages in your browser:

- **Main Demo (`index.html`):**

  - URL: `http://localhost:5173/` or `http://localhost:5173/index.html`
  - Shows an interactive 2D WFC grid rendered to a canvas.
  - **Features:** Configure grid size, cell size, tile set, seed, step delay; step-by-step collapse, collapse all, reset; inspect cell options/entropy via tooltip; basic performance logging.

- **Performance Test (`performance.html`):**

  - URL: `http://localhost:5173/performance.html`
  - Runs automated performance benchmarks for different tile sets and grid sizes.
  - **Features:** Configure grid size, number of runs, tile set; measures initialization time and collapse time; calculates average time per cell and success rate. Useful for measuring the impact of optimizations or comparing tile sets.

- **Tile Edge Editor (`editor.html`):**
  - URL: `http://localhost:5173/editor.html`
  - Provides a visual tool to inspect the edge compatibility annotations automatically generated for tiles. Select a tile set and a specific tile to see which other tiles (including rotations/reflections) can connect to each of its edges.
  - ⚠️ **Note:** This editor is currently a **basic sketch**, primarily intended for **visualizing and debugging** the results of the `annotateTiles2DEdges` function. It does not currently allow manual editing or saving of annotations.

## 🛠️ Using the Library (Basic Example)

While the examples are the best way to see it in action, here's a simplified overview of using the core 2D solver:

```typescript
import { WFC2D } from "./lib/WFC2D"; // Adjust path if using as module
import { WFCTile2D } from "./lib/WFCTile2D";
import { annotateTiles2DEdges } from "./lib/utils/annotateTiles2DEdges";
import { imgLoaderBatch } from "./lib/utils/imgLoader";

async function setupWFC() {
  // 1. Load Images
  const tileImages = await imgLoaderBatch([
    "/path/to/tile1.png",
    "/path/to/tile2.png",
  ]);

  // 2. Define Base Tiles
  const baseTiles = [
    new WFCTile2D({ content: tileImages[0], name: "Grass" }),
    new WFCTile2D({
      content: tileImages[1],
      name: "Water",
      rotations: [1, 2, 3],
    }),
    // ... add more tiles with weights, rotations, etc.
  ];

  // 3. Annotate Edges (Crucial Step!)
  annotateTiles2DEdges(baseTiles); // This modifies tiles in place

  // 4. Get Canvas and Initialize WFC2D
  const canvas = document.getElementById("my-wfc-canvas") as HTMLCanvasElement;
  const wfc = new WFC2D({
    canvas: canvas,
    width: 256, // Desired output width
    height: 256, // Desired output height
    cellSize: 16, // Size of each tile in pixels
    seed: Date.now(), // Optional seed for reproducibility
    drawGrid: true, // Optional: draw grid lines
  });

  // 5. Add Annotated Tiles (includes generated variations)
  wfc.addTile(...baseTiles); // Add the base tiles; WFC handles clones internally

  // 6. Initialize the Solver Buffers
  wfc.init(); // Sets up internal WFC2DBuffer

  // 7. Collapse the Wave Function
  const success = wfc.collapseAll(); // Or use wfc.collapse() for step-by-step

  // 8. Draw the Result
  if (success) {
    wfc.draw();
  } else {
    console.error("WFC failed due to contradiction!");
    // Optionally draw an error state
  }
}

setupWFC();
```
