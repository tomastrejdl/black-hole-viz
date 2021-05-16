function CSVToArray(strData, strDelimiter) {
  strDelimiter = strDelimiter || ',';
  const objPattern = new RegExp(
    '(\\' +
      strDelimiter +
      '|\\r?\\n|\\r|^)' +
      '(?:"([^"]*(?:""[^"]*)*)"|' +
      '([^"\\' +
      strDelimiter +
      '\\r\\n]*))',
    'gi',
  );

  const arrData = [[]];
  let arrMatches = null;
  while ((arrMatches = objPattern.exec(strData))) {
    const strMatchedDelimiter = arrMatches[1];

    if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter)
      arrData.push([]);
    
    let strMatchedValue;
    if (arrMatches[2]) 
      strMatchedValue = arrMatches[2].replace(new RegExp('""', 'g'), '"');
    else 
      strMatchedValue = arrMatches[3];

    arrData[arrData.length - 1].push(Number(strMatchedValue));
  }

  return arrData;
}


module.exports = CSVToArray;
