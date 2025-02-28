export interface IMenu {
  id: number;
  selected: boolean;
  text: string;
}

export const menu: IMenu[] = [
  {
    id: 0,
    selected: true,
    text: "Your Media",
  },
  {
    id: 1,
    selected: false,
    text: "AI Scenes",
  },
];
