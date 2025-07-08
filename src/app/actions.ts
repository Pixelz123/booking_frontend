'use server';

import { suggestPrice, SuggestPriceInput } from '@/ai/flows/suggest-price';

export async function suggestPriceAction(input: SuggestPriceInput) {
  try {
    const output = await suggestPrice(input);
    return output;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to get price suggestion.');
  }
}
