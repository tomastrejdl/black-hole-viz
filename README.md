[![Netlify Status](https://api.netlify.com/api/v1/badges/713f3d9a-88c9-4e51-99a7-baabcf591f35/deploy-status)](https://app.netlify.com/sites/black-hole-viz/deploys)

# Vizualization of electromagnetic field near a black hole

FEL ČVUT 2021

Author: Tomáš Trejdl

Available at: https://black-hole-viz.netlify.app/

## Built with

- [TroisJS](https://troisjs.github.io/)
- [Vue.js](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [three.js](https://threejs.org/)
- [TailwindCSS](https://tailwindcss.com/)

## How to run

### Prerequisites 

- [Node.js](https://nodejs.org/en/)

### Install dependencies

`npm install`

### Run the application locally

`npm run serve`

### Build for production

`npm run build`

## Description of Data (in Czech)

Jsou k dispozici 3 datasety

Každý ze zip souborů má cca 1.3 GB.

Dataset 1:
elektricke pole: el1_512_512_512.zip
magneticke pole: mag1_512_512_512.zip

Dataset 2:
elektricke pole: el2_512_512_512.zip
magneticke pole: mag2_512_512_512.zip
nulovy bod magnetickeho pole: x_0=0.847, y_0=-1.997, z_0=0

Dataset 3:
elektricke pole: el3_512_512_512.zip
magneticke pole: mag3_512_512_512.zip
nulovy bod magnetickeho pole: x_0=0.723, y_0=-1.117, z_0=-0.97

Jedná se o jednoduchý formát csv (Coma separated values). Na každém
řádku je jeden bod v 3D prostoru a data v tomto bodě, např.:

x,y,z,d1,d2,d3

Mezi daty a čárkami by neměly být mezerníky. Stejně tak na začátku řádku a na konci řádku by neměly být mezerníky. Čísla mohou být celá nebo reálná čísla. Oddělovačem desetinných čísel je tečka. Čísla mohou být i ve formě 1.5e-10. Tam kde je černá díra je uvedena hodnota/text NaN.

Aby šlo data snadno načíst v nějaké strukturované formě (3D mřížka) jsou data v souboru zapsána dle souřadnic. Nejprve postupujeme dle osy X od minimální souřadnice k maximální, pokud v tomto směru načteme vše, posuneme se v ose Y o jeden vzorek (opět bychom měli postupovat od minimální souřadnice k maximální) a opět načítáme data dle osy X od minimální souřadnice k maximální. Toto opakujeme dokud nenačteme vše v rozsahu osy Y. Pak se posuneme o jeden vzorek v ose Z a opět to celé opakujeme dokud nenačteme vše v rozsahu osy Z.

Kolik vzorků je ve směru osy X, ve směru osy Y a ve směru osy Z je uvedeno v názvu souboru (např. název_X_Y_Z.csv)

Jako příklad uvádím ukázku. Na ose X, Y i Z jsou vždy dva vzorky(vždy na pozici 0 a 1). Data v místě vzorku jsou trojrozměrný vektor (pro jednoduchost tam je vždy číslo řádku). Název souboru tedy bude test_2_2_2.csv a data v souboru budou:

0,0,0,0,0,0
1,0,0,1,1,1
0,1,0,2,2,2
1,1,0,3,3,3
0,0,1,4,4,4
1,0,1,5,5,5
0,1,1,6,6,6
1,1,1,7,7,7
