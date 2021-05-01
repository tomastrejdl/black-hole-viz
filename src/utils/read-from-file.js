export function readDataFromFile() {
  // return fetch('http://127.0.0.1:5500/data/mag_sample_1_048_576_rows.csv');
  //   return fetch('http://127.0.0.1:5500/data/mag_sample_262144_rows.csv');
  return fetch('http://127.0.0.1:5500/data/mag_every_1000th_line.csv');
}
