import { readFileSync, writeFileSync } from "fs";
import { join, parse } from "path";

const idlFilePath = join(__dirname, "../components/icp/ledger.did");
const outputFilePath = join(__dirname, "../components/icp/ledger.ts");

const idlText = readFileSync(idlFilePath, "utf8");

const parseIDL = parse(idlText);

console.log(parseIDL);

writeFileSync(outputFilePath, idlText);
