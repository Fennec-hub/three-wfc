import { prng } from "../../lib/utils/prng";
import { prng2D } from "../../lib/utils/prng2D";
import { generateTimeSeed } from "../../lib/utils/prngSeedGenerators";

const testCols = 10;
const testRows = 10;
const testSeed = generateTimeSeed();
const testOrigin = { x: 0, y: 0 };
const generator = prng2D(testSeed, testCols, testOrigin);
const generator2 = prng(testSeed);

testPRNG(generator, "grid2DPRNG");
testPRNG(generator2, "prng");

function testPRNG(generator: any, name: string = "PRNG") {
  const values = [];
  console.log("------------------");
  console.log(`Testing ${name} (${testCols}x${testRows}, seed=${testSeed})`);
  console.log(`seed=${testSeed}`);
  if (name === "grid2DPRNG") console.log(`${testCols}x${testRows}`);
  for (let i = 0; i < testCols * testRows; i++) {
    const val = generator(i);
    values.push(val);
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  console.log(
    `Min: ${min.toFixed(6)}, Max: ${max.toFixed(6)}, Avg: ${avg.toFixed(6)}`
  );

  const lowThreshold = 0.1;
  const lowCount = values.filter((v) => v < lowThreshold).length;
  console.log(
    `Count < ${lowThreshold}: ${lowCount} / ${values.length} (${(
      (lowCount / values.length) *
      100
    ).toFixed(1)}%)`
  );
}
