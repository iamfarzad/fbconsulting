import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from './test-utils';

describe('Test Environment', () => {
  it('should work with DOM operations', () => {
    render(<div data-testid="test">Test</div>);
    expect(screen.getByTestId('test')).toBeInTheDocument();
  });

  it('should mock ResizeObserver', () => {
    expect(window.ResizeObserver).toBeDefined();
    const ro = new window.ResizeObserver(() => {});
    expect(ro.observe).toBeDefined();
  });

  it('should mock fetch', () => {
    expect(global.fetch).toBeDefined();
  });
});
