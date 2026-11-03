/** Public, deterministic UI journeys. Each case starts with a fresh component. */
export type ReactAction =
  | { type: 'input'; selector: string; value: string }
  | { type: 'click'; selector: string }
  | { type: 'key'; selector: string; key: string };

export interface ReactAssertion {
  selector: string;
  property: 'text' | 'value' | 'count' | 'attribute';
  attribute?: string;
  equals: string | number | null;
}

export interface ReactJourney {
  props?: Record<string, unknown>;
  actions: ReactAction[];
  assertions: ReactAssertion[];
}
