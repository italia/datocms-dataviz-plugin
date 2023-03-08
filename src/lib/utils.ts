import { sampleData, palettes } from '../lib/constants';
import { create } from 'zustand';

export function getAvailablePalettes(numSeries) {
  const keys = Object.keys(palettes);
  const availabelPalettes = [
    ...keys.filter((k) => k.indexOf(`_${numSeries}_`) > -1),
    ...keys.slice(0, 3),
  ].sort();

  return availabelPalettes;
}
export function getPalette(palette) {
  return palettes[palette];
}

export function transposeData(data) {
  return data[0].map((_, colIndex) => data.map((row) => row[colIndex]));
}

export function toDataSource(parsed, config = {}, chartType = 'bar') {
  const categories = parsed[0].slice(1) || [];
  const series = parsed.slice(1).map((row) => {
    const [name, ...data] = row;
    return {
      type: chartType,
      name,
      data,
    };
  });
  const dataSource = {
    categories,
    series,
  };
  const cfg = { config: { ...sampleData.config, ...config } };
  const transformed = {
    ...sampleData,
    ...cfg,
    dataSource,
  };
  // console.log('transformed', transformed);
  return { ...transformed, data: parsed, chart: chartType };
}

export function getBarValues(data) {
  return {
    ...data,
    dataSource: {
      categories: data.dataSource.categories,
      series: data.dataSource.series.map((s) => {
        return { ...s, type: 'bar' };
      }),
    },
  };
}

export function getLineValues(data) {
  return {
    ...data,
    dataSource: {
      categories: data.dataSource.categories,
      series: data.dataSource.series.map((s) => {
        return { ...s, type: 'line' };
      }),
    },
  };
}

export function getPieValues(data) {
  return {
    ...data,
    dataSource: {
      categories: [],
      series: {
        type: 'pie',
        radius: ['50%', '85%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'inside',
        },
        labelLine: {
          show: false,
        },
        data: data.dataSource.series.map((row) => {
          return { name: row.name, value: row.data[0] };
        }),
      },
    },
  };
}

export function getMapValues(data) {
  // const names = data.data[0];
  const objectData = data.data.slice(1).map((row) => {
    return {
      name: row[0],
      value: row[1],
    };
  });
  console.log('objectData', objectData);
  return {
    ...data,
    dataSource: {
      categories: data.dataSource.categories,
      series: [
        {
          type: 'map',
          label: {
            show: true,
          },
          zoom: 1.2,
          roam: 'scale',
          select: { disabled: true },
          data: objectData,
        },
      ],
    },
  };
}

//create a functions to generate a series of random numbers between a range of values
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
//create a functions  to move a number in a range of values positive and negative
export function moveNumber(number, min, max) {
  const move = getRandomInt(min, max);
  return number + move;
}
//create a function to fill an array of a given length with random numbers
export function fillArray(length, min, max) {
  return Array.from({ length }, () => getRandomInt(min, max));
}
//create a function to generate a random array of arrays
export function generateRandomData(length, min, max) {
  return Array.from({ length }, () => fillArray(length, min, max));
}

// create a function to generate words from a string of words
export function generateWords(words, length) {
  const wordsArray = words.split(' ');
  return Array.from(
    { length },
    () => wordsArray[getRandomInt(0, wordsArray.length - 1)]
  ).join(' ');
}

//return a letter of the alphabet
export function getLetter(index) {
  return String.fromCharCode(65 + index);
}

//generate a string given the the length from random letters of the alphabet
export function generateCategories(length) {
  return Array.from({ length }, (_, index) => getLetter(getRandomInt(0, 25)));
}

export function generateItems(prefix, length) {
  return Array.from({ length }, (_, index) => `${prefix} ${index + 1}`);
}
