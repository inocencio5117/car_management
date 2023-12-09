import { Emitter, EventType } from 'mitt';

export type EmitterType = Emitter<Record<EventType, unknown>>;
