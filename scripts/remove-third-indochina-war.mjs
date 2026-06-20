import fs from "node:fs";
import path from "node:path";

const frontRoot = "C:/Users/alons/Terra-Historia/Terra-Historia";
const backendRoot = "C:/Users/alons/Terra-Historia-Backend";

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function removeFromRelationships(file) {
  const data = readJson(file);
  delete data.nodes["third-indochina-war"];
  data.relationships = data.relationships.filter(
    ({ from, to }) =>
      from !== "third-indochina-war" && to !== "third-indochina-war"
  );
  writeJson(file, data);
}

function removeFromIndex(file) {
  const data = readJson(file).filter(
    ({ id }) => id !== "third-indochina-war"
  );
  writeJson(file, data);
}

removeFromRelationships(
  path.join(frontRoot, "src/constants/deepDiveRelationships.json")
);
removeFromRelationships(path.join(backendRoot, "deepdive-relationships.json"));
removeFromIndex(path.join(backendRoot, "deepdives-index.json"));

console.log("Removed third-indochina-war from deep-dive index and relationships.");
