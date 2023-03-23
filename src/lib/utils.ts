import { palettes } from "../lib/constants";

export function log(...args) {
  console.log(args);
}

// constant to check if config is empty
const emptyConfig = {};

// function to compare two objects deeply
export function isEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

// function to get available palettes based on number of series + defaults
export function getAvailablePalettes(numSeries) {
  const keys = Object.keys(palettes);
  const availabelPalettes = [
    ...keys.filter((k) => k.indexOf(`_${numSeries}_`) > -1),
    ...keys.slice(0, 7),
  ].sort();

  return availabelPalettes;
}

// function to get palette colors for map type, adds default colors
export function getMapPalettes() {
  const keys = Object.keys(palettes);
  const availabelPalettes = [
    ...keys.filter((k) => k.indexOf(`_${2}_`) > -1),
    ...keys.slice(0, 7),
  ].sort();
  return availabelPalettes;
}

// function to get palette colors by name
export function getPalette(palette) {
  return palettes[palette];
}

// transpose data matrix
export function transposeData(data) {
  return data[0].map((_, colIndex) => data.map((row) => row[colIndex]));
}

// function to get values for basic charts
export function getBasicValues({ config, data, chart }) {
  const categories = data[0].slice(1) || [];
  const series = data.slice(1).map((row) => {
    const [name, ...data] = row;
    return {
      type: chart,
      name,
      data,
    };
  });
  return {
    config,
    data,
    chart,
    dataSource: {
      categories,
      series: series.map((s) => {
        return { ...s, type: chart };
      }),
    },
  };
}

// function to get values for pie charts
export function getPieValues({ config, data, chart }) {
  const series = data.slice(1).map((row) => {
    const [name, ...data] = row;
    return {
      type: chart,
      name,
      data,
    };
  });
  return {
    config,
    data,
    chart,
    dataSource: {
      categories: [],
      series: {
        type: "pie",
        radius: ["50%", "85%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "inside",
        },
        labelLine: {
          show: false,
        },
        data: series.map((row) => {
          return { name: row.name, value: row.data[0] };
        }),
      },
    },
  };
}

// function to get values for map charts
export function getMapValues({ config, data, chart }) {
  const objectData = data.slice(1).map((row) => {
    return {
      name: row[0],
      value: row[1],
    };
  });
  return {
    config,
    data,
    chart,
    dataSource: {
      categories: [],
      series: [
        {
          type: "map",
          label: {
            show: true,
          },
          zoom: 1.2,
          roam: "scale",
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
  const wordsArray = words.split(" ");
  return Array.from(
    { length },
    () => wordsArray[getRandomInt(0, wordsArray.length - 1)]
  ).join(" ");
}

//return a letter of the alphabet
export function getLetter(index) {
  return String.fromCharCode(65 + index);
}

//generate a string given the the length from random letters of the alphabet
export function generateCategories(length) {
  return Array.from({ length }, (_, index) => getLetter(getRandomInt(0, 25)));
}

//generate a string given the the length from random letters of the alphabet
export function generateItems(prefix, length) {
  return Array.from({ length }, (_, index) => `${prefix} ${index + 1}`);
}

export function formatTooltip(value, config) {
  const formatter = config.tooltipFormatter;
  const valueFormatter = config.valueFormatter;
  let valueFormatted = value;
  if (formatter) {
    if (formatter === "percentage") {
      valueFormatted = `${value}%`;
    } else if (formatter === "currency") {
      valueFormatted = new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
      }).format(value);
    } else if (formatter === "number") {
      valueFormatted = new Intl.NumberFormat("it-IT", {
        style: "decimal",
      }).format(value);
    }
  }
  return `${valueFormatted} ${valueFormatter ? valueFormatter : ""}\n`;
}
