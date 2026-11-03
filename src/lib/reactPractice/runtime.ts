// Bundled separately for the opaque-origin practice iframe. Never imported by app UI.
import * as React from 'react';
import * as JSXRuntime from 'react/jsx-runtime';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { transform } from 'sucrase';
import type { ReactJourney } from '@/types/reactExercise';

const pause = () => new Promise(resolve => setTimeout(resolve, 20));

export async function execute(code: string, journey?: ReactJourney) {
  let renderError: unknown;
  const root = createRoot(document.getElementById('root')!, {
    onUncaughtError: error => { renderError = error; },
    onCaughtError: error => { renderError = error; },
  });
  const fail = (error: unknown) => ({ passed: false, error: String(error instanceof Error ? error.message : error).slice(0, 1000) });
  try {
    const compiled = transform(code, { transforms: ['jsx', 'imports'], jsxRuntime: 'automatic', production: true }).code;
    const modules: Record<string, unknown> = { react: React, 'react/jsx-runtime': JSXRuntime };
    const requireModule = (name: string) => {
      if (!Object.hasOwn(modules, name)) throw new Error('Only react and react/jsx-runtime imports are available.');
      return modules[name];
    };
    const candidateModule = { exports: {} as { default?: React.ComponentType<Record<string, unknown>> } };
    new Function('require', 'module', 'exports', compiled)(requireModule, candidateModule, candidateModule.exports);
    const Component = candidateModule.exports.default;
    if (typeof Component !== 'function') throw new Error('Export default function App(props) from solution.jsx.');
    flushSync(() => root.render(React.createElement(Component, journey?.props ?? {})));
    await pause();
    if (renderError) throw renderError;
    if (!journey) return { passed: true };

    for (const action of journey.actions) {
      const element = document.querySelector<HTMLElement>(action.selector);
      if (!element) throw new Error(`Missing action target: ${action.selector}`);
      if (action.type === 'click') element.click();
      else if (action.type === 'key') {
        element.focus();
        element.dispatchEvent(new KeyboardEvent('keydown', { key: action.key, bubbles: true }));
      } else {
        const prototype = element instanceof HTMLSelectElement ? HTMLSelectElement.prototype
          : element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        const setter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
        if (!setter) throw new Error(`Target does not accept a value: ${action.selector}`);
        setter.call(element, action.value);
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
      }
      await pause();
      if (renderError) throw renderError;
    }
    for (const assertion of journey.assertions) {
      const element = document.querySelector(assertion.selector);
      let actual: string | number | null;
      if (assertion.property === 'count') actual = document.querySelectorAll(assertion.selector).length;
      else {
        if (!element) throw new Error(`Missing assertion target: ${assertion.selector}`);
        actual = assertion.property === 'text' ? element.textContent!.replace(/\s+/g, ' ').trim()
          : assertion.property === 'value' ? (element as HTMLInputElement).value
          : element.getAttribute(assertion.attribute!);
      }
      if (actual !== assertion.equals) throw new Error(`${assertion.selector} ${assertion.property}: expected ${JSON.stringify(assertion.equals)}, received ${JSON.stringify(actual)}`);
    }
    return { passed: true };
  } catch (error) {
    const result = fail(error);
    document.getElementById('error')!.textContent = result.error;
    return result;
  } finally {
    if (journey) root.unmount();
  }
}
