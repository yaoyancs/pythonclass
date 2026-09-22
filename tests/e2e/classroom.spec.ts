import { test, expect } from '@playwright/test';

test('home lists all lectures', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Python 程序设计' })).toBeVisible();
  await expect(page.getByText('第 1 讲　Python概述')).toBeVisible();
  await expect(page.getByText('第 10 讲　数据可视化（Matplotlib）')).toBeVisible();
});

test('opens lecture from home', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /第 1 讲　Python概述/ }).click();
  await expect(page).toHaveURL(/\/lesson\/lesson01/);
  await expect(page.getByText('Scene')).toBeVisible();
});

test('legacy /classroom redirects to lesson01', async ({ page }) => {
  await page.goto('/classroom');
  await expect(page).toHaveURL(/\/lesson\/lesson01/);
});

test('navigates scenes with keyboard', async ({ page }) => {
  await page.goto('/lesson/lesson01');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByText(/Scene\s*2/)).toBeVisible();
});
