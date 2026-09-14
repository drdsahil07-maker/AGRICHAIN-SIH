import { Request, Response } from 'express';
import { SEED_PRICE_BENCHMARKS } from '../../../shared/data/seedData';

export const getBenchmarks = async (_req: Request, res: Response) => {
  // Check if real API is configured
  if (process.env.MANDI_API_URL && process.env.MANDI_API_KEY) {
    try {
      // Simulate real fetch 
      // const response = await fetch(`${process.env.MANDI_API_URL}?key=${process.env.MANDI_API_KEY}`);
      // const data = await response.json();
      // res.json({ success: true, benchmarks: parseMandiData(data) });
      // return;
    } catch (e) {
      console.error("Error fetching live Mandi data:", e);
      // Fallback
    }
  }

  // Fallback to DEMO/SEED data
  res.json({ success: true, count: Object.keys(SEED_PRICE_BENCHMARKS).length, benchmarks: SEED_PRICE_BENCHMARKS });
};
