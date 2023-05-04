import { palettes } from "../lib/constants";

export function log(...args) {
  return; // comment this line to enable logs
  console.log(...args);
}

// function to compare two objects deeply
export function isEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

// function to get available palettes based on number of series + defaults
export function getAvailablePalettes(numSeries) {
  const keys = Object.keys(palettes);
  const availabelPalettes = [
    ...keys.slice(1, 7),
    ...keys.filter((k) => k.indexOf(`_${numSeries}_`) > -1),
  ].sort();

  return ["default", ...availabelPalettes];
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

// move a column of the data matrix to first position
export function moveDataColumn(data, columnName) {
  const columnIndex = data[0].indexOf(columnName);
  const newData = data.map((row) => {
    const withouthCol = [
      ...row.slice(0, columnIndex),
      ...row.slice(columnIndex + 1),
    ];
    return [row[columnIndex], ...withouthCol];
  });

  return newData;
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
        radius: ["45%", "75%"],
        avoidLabelOverlap: true,
        label: {
          show: true,
          position: "inside",
        },
        labelLine: {
          show: false,
        },
        data: series.map((row) => {
          return {
            name: row.name,
            value: row.data[0],
            itemStyle: { borderColor: "white", borderWidth: 1 },
          };
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

//a function that given a color hex and a number of resourceLimits, generate different hex of same color
export function generateColors(color, resourceLimits) {
  const colors = [];
  const colorHex = color.replace("#", "");
  const colorInt = parseInt(colorHex, 16);
  const step = Math.floor(colorInt / resourceLimits);
  for (let i = 0; i < resourceLimits; i++) {
    const newColor = colorInt - i * step;
    const newColorHex = newColor.toString(16);
    colors.push(`#${newColorHex}`);
  }
  return colors;
}

//a function that convert a hex color to hsla
export function hexToHsla(hex, alpha = 1) {
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = parseInt("0x" + hex[1] + hex[1], 16);
    g = parseInt("0x" + hex[2] + hex[2], 16);
    b = parseInt("0x" + hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt("0x" + hex[1] + hex[2], 16);
    g = parseInt("0x" + hex[3] + hex[4], 16);
    b = parseInt("0x" + hex[5] + hex[6], 16);
  }
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;
  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  return `hsla(${h}, ${s}%, ${l}%, ${alpha})`;
}

//a function that given a hlsa color  reatutn a gradient as a list of colors, changing luminosity and saturation
export function generateGradient(color, resourceLimits) {
  let colors = [];
  const [h, s, l, a] = color
    .replace("hsla(", "")
    .replace(")", "")
    .split(",")
    .map((v) => parseInt(v));
  const step = Math.floor(l / resourceLimits);

  for (let i = 0; i < resourceLimits; i++) {
    const newL = l + i * step;
    const newS = s - i * step;
    colors.push(`hsla(${h}, ${newS}%, ${newL}%, ${a})`);
  }
  colors = colors.reverse();
  colors.push(color);
  for (let i = 0; i < resourceLimits; i++) {
    const newL = l - i * step;
    const newS = s + i * step;
    colors.push(`hsla(${h}, ${newS}%, ${newL}%, ${a})`);
  }
  return colors;
}
