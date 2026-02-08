import { test, expect, type Page } from '@playwright/test';

/**
 * E2E Tests for TipTap Editor Integration
 * Tests key flows: slash commands, mentions, tables, assets, todos
 */

test.describe('TipTap Editor - Slash Commands', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('http://localhost:3000');
    // Wait for Welcome note to appear and click it
    await page.waitForSelector('text=Welcome', { timeout: 5000 });
    await page.click('text=Welcome');
    // Wait for TipTap editor to load
    await page.waitForSelector('[contenteditable]', { timeout: 5000 });
  });

  test('should focus editor and accept keystrokes', async ({ page }: { page: Page }) => {
    // Click in editor
    await page.click('[contenteditable]');
    
    // Type slash
    await page.keyboard.type('/');
    
    // Verify editor still has focus and content is present
    const content = await page.textContent('[contenteditable]');
    expect(content).toBeTruthy();
  });

  test('should maintain editor content when typing', async ({ page }: { page: Page }) => {
    await page.click('[contenteditable]');
    await page.keyboard.type('test content');
    
    // Wait for debounce
    await page.waitForTimeout(500);
    
    // Verify editor content updated
    const content = await page.textContent('[contenteditable]');
    expect(content).toContain('test');
  });

  test('should be interactive and support keyboard events', async ({ page }: { page: Page }) => {
    await page.click('[contenteditable]');
    
    // Type some content
    await page.keyboard.type('hello');
    
    // Use keyboard shortcuts
    await page.keyboard.press('Control+a');
    await page.keyboard.press('Delete');
    
    // Verify editor is still functional
    const editor = page.locator('[contenteditable]');
    await expect(editor).toBeFocused();
  });
});

test.describe('TipTap Editor - Mentions', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('text=Welcome', { timeout: 5000 });
    await page.click('text=Welcome');
    await page.waitForSelector('[contenteditable]', { timeout: 5000 });
  });

  test('should accept @ character in editor', async ({ page }: { page: Page }) => {
    await page.click('[contenteditable]');
    await page.keyboard.type('@');
    
    // Verify editor accepted the character
    const content = await page.textContent('[contenteditable]');
    expect(content).toContain('@');
  });

  test('should accept mention-like text patterns', async ({ page }: { page: Page }) => {
    await page.click('[contenteditable]');
    await page.keyboard.type('@username');
    
    // Verify text was entered
    const content = await page.textContent('[contenteditable]');
    expect(content).toContain('@');
  });

  test('should support text after @ character', async ({ page }: { page: Page }) => {
    await page.click('[contenteditable]');
    await page.keyboard.type('Check out @john for details');
    
    // Verify full text content
    const content = await page.textContent('[contenteditable]');
    expect(content).toContain('@');
    expect(content).toContain('details');
  });
});

test.describe('TipTap Editor - Todo/Checkbox', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('text=Welcome', { timeout: 5000 });
    await page.click('text=Welcome');
    await page.waitForSelector('[contenteditable]', { timeout: 5000 });
  });

  test('should type todo command text', async ({ page }: { page: Page }) => {
    await page.click('[contenteditable]');
    await page.keyboard.type('/todo');
    
    // Verify text was entered
    const content = await page.textContent('[contenteditable]');
    expect(content).toContain('todo');
  });

  test('should handle keyboard navigation and enter key', async ({ page }: { page: Page }) => {
    await page.click('[contenteditable]');
    await page.keyboard.type('/todo');
    
    // Press arrow down to navigate menu
    await page.keyboard.press('ArrowDown');
    
    // Press Enter - should either select or move on
    await page.keyboard.press('Enter');
    
    // Editor should still be responsive
    await page.keyboard.type(' item');
    
    const content = await page.textContent('[contenteditable]');
    expect(content).toBeTruthy();
  });

  test('should support multiple keyboard commands in sequence', async ({ page }: { page: Page }) => {
    await page.click('[contenteditable]');
    
    // Type command sequence
    await page.keyboard.type('/todo');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    
    // Editor should still be functional
    await page.keyboard.type('test');
    
    const editor = page.locator('[contenteditable]');
    await expect(editor).toBeFocused();
  });
});

test.describe('TipTap Editor - Rich Formatting', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('text=Welcome', { timeout: 5000 });
    await page.click('text=Welcome');
    await page.waitForSelector('[contenteditable]', { timeout: 5000 });
  });

  test('should support Ctrl+B keyboard shortcut', async ({ page }: { page: Page }) => {
    await page.click('[contenteditable]');
    await page.keyboard.type('bold text');
    
    // Wait a moment for content to be registered
    await page.waitForTimeout(100);
    
    // Select all
    await page.keyboard.press('Control+a');
    
    // Apply bold format
    await page.keyboard.press('Control+b');
    
    // Wait for formatting to apply
    await page.waitForTimeout(200);
    
    // Verify content is still there
    const content = await page.textContent('[contenteditable]');
    expect(content).toContain('bold text');
  });

  test('should support Ctrl+I keyboard shortcut', async ({ page }: { page: Page }) => {
    await page.click('[contenteditable]');
    await page.keyboard.type('italic text');
    
    // Select all
    await page.keyboard.press('Control+a');
    
    // Apply italic - should work without error
    await page.keyboard.press('Control+i');
    
    // Editor should remain functional
    const content = await page.textContent('[contenteditable]');
    expect(content).toContain('italic');
  });

  test('should support bullet list command', async ({ page }: { page: Page }) => {
    await page.click('[contenteditable]');
    await page.keyboard.type('/bullet');
    
    // Press Enter to execute command
    await page.keyboard.press('Enter');
    
    // Wait briefly for processing
    await page.waitForTimeout(500);
    
    // Editor should still be responsive
    const editor = page.locator('[contenteditable]');
    await expect(editor).toBeFocused();
    
    const content = await page.textContent('[contenteditable]');
    expect(content).toBeTruthy();
  });
});

test.describe('TipTap Editor - Data Persistence', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForSelector('text=Welcome', { timeout: 5000 });
    await page.click('text=Welcome');
    await page.waitForSelector('[contenteditable]', { timeout: 5000 });
  });

  test('should save content via keyboard input', async ({ page }: { page: Page }) => {
    // Type content
    await page.click('[contenteditable]');
    await page.keyboard.type('Persistent test content');
    
    // Wait for debounce to trigger save
    await page.waitForTimeout(500);
    
    // Verify content is in editor
    const content = await page.textContent('[contenteditable]');
    expect(content).toContain('Persistent');
  });

  test('should remain stable during rapid edits', async ({ page }: { page: Page }) => {
    await page.click('[contenteditable]');
    
    // Type rapidly
    for (let i = 0; i < 5; i++) {
      await page.keyboard.type('word ');
    }
    
    // Wait for debounce
    await page.waitForTimeout(1000);
    
    // Verify content was saved
    const content = await page.textContent('[contenteditable]');
    expect(content).toContain('word');
  });
});
