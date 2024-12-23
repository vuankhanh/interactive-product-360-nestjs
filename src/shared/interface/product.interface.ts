export interface IProduct {
  name: string;
  price: number;
  availability: boolean;
  category: string;
  size?: TSize;
  description?: string;
  usageInstructions?: string;
}

export type TSize = {
  width: number,
  height: number,
}