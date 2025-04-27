import { WFCTile2D } from "../../../lib/WFCTile2D";
import { imgLoaderBatch } from "../../../lib/utils/imgLoader";
import { annotateTiles2DEdges } from "../../../lib/utils/annotateTiles2DEdges";

type TileSetName = "road" | "circuit" | "rail" | "kenneyMedieval";
type TileSetCollection = {
  [key in TileSetName]: WFCTile2D[];
};

type EdgeName = "top" | "bottom" | "left" | "right";

const tileSetSelect = document.getElementById(
  "tileset-select"
) as HTMLSelectElement;
const tileSelect = document.getElementById("tile-select") as HTMLSelectElement;
const mainTileImg = document.getElementById(
  "main-tile-img"
) as HTMLImageElement;
const centerTileArea = document.getElementById(
  "center-tile-area"
) as HTMLDivElement;
const saveButton = document.getElementById("save-button") as HTMLButtonElement;

const topEdgeEditor = document.getElementById(
  "top-edge-editor"
) as HTMLDivElement;
const bottomEdgeEditor = document.getElementById(
  "bottom-edge-editor"
) as HTMLDivElement;
const leftEdgeEditor = document.getElementById(
  "left-edge-editor"
) as HTMLDivElement;
const rightEdgeEditor = document.getElementById(
  "right-edge-editor"
) as HTMLDivElement;

const topCompatibleDiv = document.getElementById(
  "top-compatible"
) as HTMLDivElement;
const bottomCompatibleDiv = document.getElementById(
  "bottom-compatible"
) as HTMLDivElement;
const leftCompatibleDiv = document.getElementById(
  "left-compatible"
) as HTMLDivElement;
const rightCompatibleDiv = document.getElementById(
  "right-compatible"
) as HTMLDivElement;

const toleranceInput = document.getElementById(
  "ctrl-tolerance"
) as HTMLInputElement;
const toleranceValueSpan = document.getElementById(
  "tolerance-value"
) as HTMLSpanElement;
const sobelInput = document.getElementById("ctrl-sobel") as HTMLInputElement;
const sobelValueSpan = document.getElementById(
  "sobel-value"
) as HTMLSpanElement;
const autoAnnotateButton = document.getElementById(
  "auto-annotate-btn"
) as HTMLButtonElement;

let allTileSets: TileSetCollection | null = null;
let currentTileSetKey: TileSetName = "road";
let currentBaseTileIndex: number = 0;
let baseTiles: WFCTile2D[] = [];

let editedTileClone: WFCTile2D | null = null;

async function initializeEditor() {
  console.log("Initializing Tile Editor...");
  await loadAllTiles();
  if (!allTileSets) {
    console.error("Failed to load tile sets.");
    return;
  }

  tileSetSelect.value = currentTileSetKey;
  loadTileSet(currentTileSetKey);

  tileSetSelect.addEventListener("change", handleTileSetChange);
  tileSelect.addEventListener("change", handleTileSelectionChange);
  saveButton.addEventListener("click", handleSaveChanges);

  toleranceInput?.addEventListener("input", () => {
    toleranceValueSpan.textContent = parseFloat(toleranceInput.value).toFixed(
      3
    );
  });
  sobelInput?.addEventListener("input", () => {
    sobelValueSpan.textContent = sobelInput.value;
  });
  autoAnnotateButton?.addEventListener("click", handleAutoAnnotate);

  console.log("Editor Initialized.");
}

async function loadAllTiles() {
  console.log("Loading all tile images...");
  try {
    const roadImagePaths = Array.from(
      { length: 3 },
      (_, i) => `/road/${i}.png`
    );
    const railImagePaths = Array.from(
      { length: 5 },
      (_, i) => `/rail/${i}.png`
    );
    const circuitImagePaths = Array.from(
      { length: 13 },
      (_, i) => `/circuit/${i}.png`
    );
    const kenneyMedievalPaths = Array.from(
      { length: 43 },
      (_, i) => `/kenney_medieval-rts/tiles/${i}.png`
    );

    const [roadImages, circuitImages, railImages, kenneyMedievalImages] =
      await Promise.all([
        imgLoaderBatch(roadImagePaths),
        imgLoaderBatch(circuitImagePaths),
        imgLoaderBatch(railImagePaths),
        imgLoaderBatch(kenneyMedievalPaths),
      ]);

    allTileSets = {
      road: roadImages.map(
        (img, i) => new WFCTile2D({ content: img, name: `road_${i}` })
      ),
      circuit: circuitImages.map(
        (img, i) => new WFCTile2D({ content: img, name: `circuit_${i}` })
      ),
      rail: railImages.map(
        (img, i) => new WFCTile2D({ content: img, name: `rail_${i}` })
      ),
      kenneyMedieval: kenneyMedievalImages.map(
        (img, i) => new WFCTile2D({ content: img, name: `kenney_${i}` })
      ),
    };

    console.log("Performing initial auto-annotation on all sets...");
    for (const key in allTileSets) {
      annotateTiles2DEdges(allTileSets[key as TileSetName]);
    }

    console.log("Tile images loaded and WFCTile2D objects created/annotated.");
  } catch (error) {
    console.error("Error loading tile images:", error);
    allTileSets = null;
  }
}

function loadTileSet(setName: TileSetName) {
  if (!allTileSets || !allTileSets[setName]) {
    console.error(`Tile set "${setName}" not found.`);
    return;
  }
  currentTileSetKey = setName;
  baseTiles = allTileSets[setName];
  console.log(`Loaded tile set: ${setName} (${baseTiles.length} tiles)`);

  tileSelect.innerHTML = "";
  baseTiles.forEach((tile, index) => {
    const option = document.createElement("option");
    option.value = index.toString();
    option.textContent = tile.name || `Tile ${index}`;
    tileSelect.appendChild(option);
  });

  loadTileForEditing(0);
}

function loadTileForEditing(index: number) {
  if (index < 0 || index >= baseTiles.length) {
    console.error(`Invalid tile index: ${index}`);
    return;
  }
  currentBaseTileIndex = index;
  const originalTile = baseTiles[index];

  editedTileClone = originalTile.clone();
  tileSelect.value = index.toString();

  console.log(`Editing tile: ${editedTileClone.name || `Tile ${index}`}`);

  if (editedTileClone.image instanceof HTMLImageElement) {
    mainTileImg.src = editedTileClone.image.src;
    mainTileImg.alt = editedTileClone.name || `Tile ${index}`;
  } else {
    mainTileImg.src = "";
    mainTileImg.alt = "Invalid tile content";
  }

  displayEdgeAnnotations("top", topEdgeEditor, editedTileClone.top as string[]);
  displayEdgeAnnotations(
    "bottom",
    bottomEdgeEditor,
    editedTileClone.bottom as string[]
  );
  displayEdgeAnnotations(
    "left",
    leftEdgeEditor,
    editedTileClone.left as string[]
  );
  displayEdgeAnnotations(
    "right",
    rightEdgeEditor,
    editedTileClone.right as string[]
  );

  updateCompatibilityDisplays();
}

function displayEdgeAnnotations(
  edgeName: EdgeName,
  editorDiv: HTMLDivElement,
  edgeColors: string[]
) {
  editorDiv.innerHTML = "";

  edgeColors.forEach((color, tagIndex) => {
    const tagContainer = document.createElement("div");
    tagContainer.style.display = "inline-flex";
    tagContainer.style.alignItems = "center";
    if (edgeName === "left" || edgeName === "right") {
      tagContainer.style.flexDirection = "column";
      tagContainer.style.marginBottom = "3px";
    } else {
      tagContainer.style.marginRight = "3px";
    }

    const swatch = document.createElement("span");
    swatch.className = "tag-swatch";
    swatch.style.backgroundColor = color;
    swatch.title = `Tag ${tagIndex}: ${color}`;

    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.value = color;
    colorInput.addEventListener("input", (e) => {
      const newColor = (e.target as HTMLInputElement).value;
      handleChangeTagColor(edgeName, tagIndex, newColor);
    });
    swatch.appendChild(colorInput);

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-tag-btn";
    removeBtn.textContent = "x";
    removeBtn.title = `Remove Tag ${tagIndex}`;
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      handleRemoveTag(edgeName, tagIndex);
    });

    tagContainer.appendChild(swatch);
    tagContainer.appendChild(removeBtn);
    editorDiv.appendChild(tagContainer);
  });

  const addBtn = document.createElement("button");
  addBtn.className = "add-tag-btn";
  addBtn.textContent = "+";
  addBtn.title = `Add Tag to ${edgeName} edge`;
  addBtn.addEventListener("click", () => handleAddTag(edgeName));
  editorDiv.appendChild(addBtn);
}

function areEdgesCompatible(
  edgeAColors: (string | number)[],
  edgeBColors: (string | number)[]
): boolean {
  if (edgeAColors.length !== edgeBColors.length) return false;
  if (edgeAColors.length === 0) return true;

  for (let i = 0; i < edgeAColors.length; i++) {
    if (edgeAColors[i] !== edgeBColors[edgeAColors.length - 1 - i]) {
      return false;
    }
  }
  return true;
}

function updateCompatibilityDisplays() {
  if (!editedTileClone) return;

  updateSingleCompatibilityDisplay(
    "top",
    editedTileClone.top,
    "bottom",
    topCompatibleDiv
  );
  updateSingleCompatibilityDisplay(
    "bottom",
    editedTileClone.bottom,
    "top",
    bottomCompatibleDiv
  );
  updateSingleCompatibilityDisplay(
    "left",
    editedTileClone.left,
    "right",
    leftCompatibleDiv
  );
  updateSingleCompatibilityDisplay(
    "right",
    editedTileClone.right,
    "left",
    rightCompatibleDiv
  );
}

function updateSingleCompatibilityDisplay(
  editedEdgeName: EdgeName,
  editedEdgeColors: (string | number)[],
  oppositeEdgeName: EdgeName,
  displayDiv: HTMLDivElement
) {
  const title = displayDiv.querySelector("h4");
  displayDiv.innerHTML = "";
  if (title) displayDiv.appendChild(title);

  let compatibleFound = false;
  baseTiles.forEach((otherTile, otherIndex) => {
    if (otherIndex === currentBaseTileIndex) return;

    const oppositeEdgeColors = otherTile[oppositeEdgeName];
    if (areEdgesCompatible(editedEdgeColors, oppositeEdgeColors)) {
      compatibleFound = true;
      if (otherTile.image instanceof HTMLImageElement) {
        const img = document.createElement("img");
        img.src = otherTile.image.src;
        img.alt = otherTile.name || `Tile ${otherIndex}`;
        img.title = `Compatible: ${img.alt}\n(${editedEdgeName} matches ${oppositeEdgeName})`;
        img.className = "compatible-tile-preview";
        displayDiv.appendChild(img);
      }
    }
  });

  if (!compatibleFound) {
    const noMatch = document.createElement("p");
    noMatch.textContent = "No compatible tiles found.";
    noMatch.style.fontSize = "12px";
    noMatch.style.textAlign = "center";
    noMatch.style.color = "#888";
    displayDiv.appendChild(noMatch);
  }
}

function handleTileSetChange(event: Event) {
  const selectedSet = (event.target as HTMLSelectElement).value as TileSetName;
  loadTileSet(selectedSet);
}

function handleTileSelectionChange(event: Event) {
  const selectedIndex = parseInt((event.target as HTMLSelectElement).value, 10);
  loadTileForEditing(selectedIndex);
}

function handleAddTag(edgeName: EdgeName) {
  if (!editedTileClone) return;

  (editedTileClone[edgeName] as string[]).push("#ffffff");

  const editorDiv = document.getElementById(
    `${edgeName}-edge-editor`
  ) as HTMLDivElement;
  displayEdgeAnnotations(
    edgeName,
    editorDiv,
    editedTileClone[edgeName] as string[]
  );

  updateCompatibilityDisplays();
}

function handleRemoveTag(edgeName: EdgeName, tagIndex: number) {
  if (!editedTileClone) return;
  const edgeColors = editedTileClone[edgeName] as string[];
  if (tagIndex < 0 || tagIndex >= edgeColors.length) return;

  edgeColors.splice(tagIndex, 1);

  const editorDiv = document.getElementById(
    `${edgeName}-edge-editor`
  ) as HTMLDivElement;
  displayEdgeAnnotations(edgeName, editorDiv, edgeColors);

  updateCompatibilityDisplays();
}

function handleChangeTagColor(
  edgeName: EdgeName,
  tagIndex: number,
  newColor: string
) {
  if (!editedTileClone) return;
  const edgeColors = editedTileClone[edgeName] as string[];
  if (tagIndex < 0 || tagIndex >= edgeColors.length) return;

  edgeColors[tagIndex] = newColor;

  const editorDiv = document.getElementById(
    `${edgeName}-edge-editor`
  ) as HTMLDivElement;
  const swatch = editorDiv.querySelectorAll(".tag-swatch")[
    tagIndex
  ] as HTMLElement;
  if (swatch) {
    swatch.style.backgroundColor = newColor;
    swatch.title = `Tag ${tagIndex}: ${newColor}`;
  }

  updateCompatibilityDisplays();
}

function handleSaveChanges() {
  if (
    !editedTileClone ||
    currentBaseTileIndex < 0 ||
    currentBaseTileIndex >= baseTiles.length
  ) {
    console.error("No tile loaded or index out of bounds.");
    alert("Error: No tile loaded for saving.");
    return;
  }

  const originalTile = baseTiles[currentBaseTileIndex];
  originalTile.top = [...editedTileClone.top];
  originalTile.bottom = [...editedTileClone.bottom];
  originalTile.left = [...editedTileClone.left];
  originalTile.right = [...editedTileClone.right];

  originalTile.edges = [
    originalTile.top,
    originalTile.bottom,
    originalTile.left,
    originalTile.right,
  ];

  console.log(
    `Changes saved for tile: ${
      originalTile.name || `Tile ${currentBaseTileIndex}`
    }`
  );
  alert(
    `Changes applied to ${
      originalTile.name || `Tile ${currentBaseTileIndex}`
    } in memory. Use 'Export JSON' to persist.`
  );

  handleExportToJson();
}

function handleExportToJson() {
  if (!allTileSets) {
    console.error("No tile sets loaded to export.");
    alert("Error: No tile sets loaded to export.");
    return;
  }

  const serializableData: { [key: string]: any } = {};

  for (const setName in allTileSets) {
    serializableData[setName] = allTileSets[setName as TileSetName].map(
      (tile) => ({
        name: tile.name,

        top: tile.top,
        bottom: tile.bottom,
        left: tile.left,
        right: tile.right,

        weight: tile.weight,
        rotations: tile.rotations,
        reflectX: tile.reflectX,
        reflectY: tile.reflectY,
      })
    );
  }

  const jsonString = JSON.stringify(serializableData, null, 2);
  console.log("--- EXPORTED ANNOTATIONS (JSON) ---");
  console.log(jsonString);

  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "wfc_tile_annotations.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  alert(
    "Annotations exported as wfc_tile_annotations.json and logged to console."
  );
}

function handleAutoAnnotate() {
  if (!baseTiles || baseTiles.length === 0) {
    alert("Load a tile set first!");
    return;
  }
  const tolerance = parseFloat(toleranceInput.value);
  const sobel = parseInt(sobelInput.value, 10);

  console.log(
    `Running auto-annotation on current set with Tolerance: ${tolerance}, Sobel: ${sobel}`
  );
  try {
    annotateTiles2DEdges(baseTiles, tolerance, sobel);

    console.log("Auto-annotation complete. Reloading current tile display.");

    loadTileForEditing(currentBaseTileIndex);
    alert("Auto-annotation applied to the current tile set.");
  } catch (error) {
    console.error("Auto-annotation failed:", error);
    alert("Auto-annotation failed. Check console.");
  }
}

initializeEditor();
