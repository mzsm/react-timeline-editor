import { TimelineEffect, TimelineRow } from '@itershukov/react-timeline-editor';

export const mockEffect: Record<string, TimelineEffect> = {
  effect0: {
    id: "effect0",
    name: "效果0",
  },
  effect1: {
    id: "effect1",
    name: "效果1",
  },
};


export const mockData: TimelineRow[] = [
  {
    id: "0",
    actions: [
      {
        id: "action00",
        start: 0,
        end: 2,
      },
    ],
  },
  {
    id: "1",
    actions: [
      {
        id: "action10",
        start: 1.5,
        end: 5,
      }
    ],
  },
  {
    id: "2",
    actions: [
      {
        id: "action20",

        start: 3,
        end: 4,
      },
    ],
  },
  {
    id: "3",
    actions: [
      {
        id: "action30",
        start: 4,
        end: 7,
      },
      {
        id: "action31",
        start: 10,
        end: 12,
      },
    ],
  },
];
