import { copyReverse } from "./utils/copyReverse";

/**
 * Represents a single tile type in the Wave Function Collapse algorithm.
 * Stores its visual content, weight, edge connection rules (tags),
 * allowed transformations (rotation, reflection), and provides methods
 * to generate transformed clones.
 */
export class WFCTile2D {
  /**  */
  name: string = "";
  /** Visual representation (THREE.Color, Image, or Canvas) */
  image: HTMLImageElement | HTMLCanvasElement;

  /** Edge connection tags for the top side */
  top: (string | number)[];
  /** Edge connection tags for the right side */
  right: (string | number)[];
  /** Edge connection tags for the bottom side */
  bottom: (string | number)[];
  /** Edge connection tags for the left side */
  left: (string | number)[];
  /** Convenience array holding edge tags in [UP, DOWN, LEFT, RIGHT] order */
  edges: (string | number)[][];

  /** Allowed rotations (90, 180, 270 degrees clockwise) */
  rotations: (1 | 2 | 3)[];
  /** Whether reflection along the vertical axis (X-reflection) is allowed */
  reflectX: boolean;
  /** Whether reflection along the horizontal axis (Y-reflection) is allowed */
  reflectY: boolean;

  /** Optional function for more complex placement rules beyond edge matching */
  rules?: () => boolean;

  /** The rotation applied to this specific tile instance (0 = none) */
  _rotation: 0 | 1 | 2 | 3 = 0;
  /** Whether this specific tile instance is reflected horizontally */
  _reflectX: boolean = false;
  /** Whether this specific tile instance is reflected vertically */
  _reflectY: boolean = false;

  private _weight: number = 10;

  /**
   * Creates a new WFCTile instance.
   * @param config - Configuration object for the tile.
   */
  constructor({
    content,
    weight = 1,
    rotations = [],
    top = [],
    right = [],
    bottom = [],
    left = [],
    reflectX = false,
    reflectY = false,
    rules,
    name,
  }: {
    content: HTMLImageElement | HTMLCanvasElement;
    name?: string;
    weight?: number;
    rotations?: (1 | 2 | 3)[];
    top?: (string | number)[];
    right?: (string | number)[];
    bottom?: (string | number)[];
    left?: (string | number)[];
    reflectX?: boolean;
    reflectY?: boolean;
    rules?: () => boolean;
  }) {
    this.name = name || "";
    this.image = content;

    this.weight = weight;

    this.top = top;
    this.bottom = bottom;
    this.left = left;
    this.right = right;

    this.edges = [this.top, this.bottom, this.left, this.right];

    this.rotations = rotations;
    this.reflectX = reflectX;
    this.reflectY = reflectY;
    this.rules = rules;
  }

  get weight(): number {
    return this._weight;
  }

  set weight(value: number) {
    this._weight = value > 0 ? value : 1;
  }

  /**
   * Generates all unique transformed versions (clones) of this tile
   * based on the allowed rotations and reflections defined in its properties.
   * Does not generate combinations (e.g., rotated *and* reflected).
   * @returns An array of WFCTile instances representing the transformations.
   */
  transformClones(): WFCTile2D[] {
    const clones: WFCTile2D[] = [];

    [...new Set(this.rotations)].forEach((rotation) =>
      clones.push(this._rotate(rotation))
    );

    if (this.reflectX) clones.push(this._reflect("x"));
    if (this.reflectY) clones.push(this._reflect("y"));

    return clones;
  }

  /**
   * Performs a deep copy of properties from a source tile into this tile.
   * Ensures arrays and Color objects are cloned, not just referenced.
   * @param source - The WFCTile to copy from.
   * @returns This WFCTile instance for chaining.
   */
  copy(source: WFCTile2D): this {
    Object.assign(this, source);

    this.top = [...source.top];
    this.bottom = [...source.bottom];
    this.left = [...source.left];
    this.right = [...source.right];
    this.edges = [this.top, this.bottom, this.left, this.right];
    this.rotations = [...source.rotations];

    return this;
  }

  /**
   * Creates a new WFCTile instance that is a deep copy of this one.
   * @returns A new WFCTile instance.
   */
  clone(): WFCTile2D {
    return new WFCTile2D({ content: this.image }).copy(this);
  }

  /**
   * Creates a new WFCTile instance rotated clockwise by the specified amount.
   * Updates the edge tags accordingly.
   * @param rotation - The rotation amount (1 = 90°, 2 = 180°, 3 = 270°).
   * @returns A new, rotated WFCTile clone.
   * @private
   */
  private _rotate(rotation: 1 | 2 | 3): WFCTile2D {
    const clone = this.clone();
    clone._rotation = rotation;

    const { top, bottom, left, right } = this;

    switch (rotation) {
      case 1:
        clone.top = copyReverse(left);
        clone.right = [...top];
        clone.bottom = copyReverse(right);
        clone.left = [...bottom];
        break;
      case 2:
        clone.top = copyReverse(bottom);
        clone.right = copyReverse(left);
        clone.bottom = copyReverse(top);
        clone.left = copyReverse(right);
        break;
      case 3:
        clone.top = [...right];
        clone.right = copyReverse(bottom);
        clone.bottom = [...left];
        clone.left = copyReverse(top);
        break;
    }

    clone.name += `-rot-${rotation}`;
    clone.edges = [clone.top, clone.bottom, clone.left, clone.right];

    return clone;
  }

  /**
   * Creates a new WFCTile instance reflected across the specified axis.
   * Updates the edge tags accordingly.
   * @param axis - The axis of reflection ('x' for vertical axis, 'y' for horizontal axis).
   * @returns A new, reflected WFCTile clone.
   * @private
   */
  private _reflect(axis: "x" | "y"): WFCTile2D {
    const clone = this.clone();

    const { top, bottom, left, right } = this;

    if (axis === "x") {
      clone._reflectX = true;

      clone.top = copyReverse(top);
      clone.right = [...left];
      clone.bottom = copyReverse(bottom);
      clone.left = [...right];
    } else {
      clone._reflectY = true;

      clone.top = [...bottom];
      clone.right = copyReverse(right);
      clone.bottom = [...top];
      clone.left = copyReverse(left);
    }

    clone.name += `-ref-${axis}`;
    clone.edges = [clone.top, clone.bottom, clone.left, clone.right];

    return clone;
  }
}
