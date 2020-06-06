#!/usr/bin/env npx ts-node

import * as fs from 'fs';
import { EOL } from 'os';

const inputFile = process.argv[2];
if (inputFile === undefined || !fs.existsSync(inputFile)) {
  console.log("Provide an input file");
  process.exit(1);
}
const topNCandidate = Number(process.argv[3])
const topN = isNaN(topNCandidate) ? 10 : topNCandidate;

function take(n: number, list: any[]) {
  const min = list.length < n ? list.length : n;
  const res = [];
  for (let i = 0; i < min; i++) {
    res.push(list[i]);
  }
  return res;
}

function prefixes(input: string) {
  const words = input.split(' ');
  const res = [];
  for (let i = 1; i <= words.length; i++) {
    res.push(take(i, words).join(' '));
  }
  return res;
}

function freq(input: string[]) {
  const res: { [propname: string]: number } = {};
  input.map((i) => {
    res[i] = res[i] || 0;
    res[i] = res[i] + 1;
  });
  return res;
}

const file = fs.readFileSync(inputFile, 'utf8');
const lines = file.split(EOL);
const commandInfo = lines.map(line => line.split(':0;'));
const commandInfoLengthOf2 = commandInfo.filter(cmd => cmd.length === 2);
const candidates = commandInfoLengthOf2.map(cmdInfo => cmdInfo[1]);
const candidatesPrefixes = candidates.map(c => prefixes(c));
const result = freq(candidatesPrefixes.flat());
let sorted = Object.entries(result).sort((b, a) => a[1] - b[1]);

console.log('Single word commands\n', take(topN, sorted));
console.log(
  'Multi word commands\n',
  take(topN, sorted.filter(e => e[0].split(' ').length > 1))
);
