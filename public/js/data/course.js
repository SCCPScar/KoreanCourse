/**
 * Percurso do curso: o "mapa do metrô de Seul".
 *
 * Cada trimestre é uma LINHA e cada unidade é uma ESTAÇÃO (uma lição de
 * 6 a 15 minutos). O conteúdo de cada linha fica em data/course/line-N.js;
 * as funções que criam os passos ficam em data/course/steps.js.
 */
import { LINE_1 } from './course/line-1.js';
import { LINE_2 } from './course/line-2.js';
import { LINE_3 } from './course/line-3.js';
import { LINE_4 } from './course/line-4.js';

export const LINES = [
  {
    id: 'l1',
    number: 1,
    name: 'Chegar a Seul',
    months: 'Meses 1–3',
    level: 'zero',
    tag: 'A1 · TOPIK 1',
    goal: 'Kit de viagem',
  },
  {
    id: 'l2',
    number: 2,
    name: 'O dia a dia',
    months: 'Meses 4–6',
    level: 'basico',
    tag: 'A2 · TOPIK 2',
    goal: 'Conversas simples',
  },
  {
    id: 'l3',
    number: 3,
    name: 'Conversar',
    months: 'Meses 7–9',
    level: 'intermedio',
    tag: 'B1 · TOPIK 3',
    goal: 'Falar sem roteiro',
  },
  {
    id: 'l4',
    number: 4,
    name: 'Viver em coreano',
    months: 'Meses 10–12',
    level: 'avancado',
    tag: 'B1+ · TOPIK 3–4',
    goal: 'Autonomia',
  },
];

export const STATIONS = [...LINE_1, ...LINE_2, ...LINE_3, ...LINE_4];

export const findStation = (id) => STATIONS.find((station) => station.id === id);
export const findLine = (id) => LINES.find((line) => line.id === id);
export const stationsOfLine = (lineId) => STATIONS.filter((station) => station.line === lineId);
export const hasContent = (station) => Array.isArray(station.steps) && station.steps.length > 0;
