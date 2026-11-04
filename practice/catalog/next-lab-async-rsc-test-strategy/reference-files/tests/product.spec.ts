// Corrected review reference: tests/product.spec.ts
import { test,expect } from '@playwright/test';
test('product route supports direct navigation',async({page})=>{const response=await page.goto('/products/one');expect(response?.status()).toBe(200);await expect(page.getByRole('heading',{name:'Product one'})).toBeVisible();});
// Run against next build + next start with a controlled data fixture, not a mocked Next transport.
