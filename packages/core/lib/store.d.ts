import { Store } from './util';
import { JsonFormsCore } from './reducers/core';
import { JsonFormsCellRendererRegistryEntry } from './reducers/cells';
import { JsonFormsRendererRegistryEntry } from './reducers/renderers';
import { JsonFormsLocaleState } from './reducers/i18n';
import { JsonFormsUISchemaRegistryEntry } from './reducers/uischemas';
/**
 * JSONForms store.
 */
export interface JsonFormsStore extends Store<JsonFormsState> {
}
/**
 * The state shape of JSONForms.
 */
export interface JsonFormsState {
    /**
     * Represents JSONForm's sub-state.
     */
    jsonforms: JsonFormsSubStates;
}
export interface JsonFormsSubStates {
    /**
     * Substate for storing mandatory sub-state.
     */
    core?: JsonFormsCore;
    /**
     * Global configuration options.
     */
    config?: any;
    /**
     * All available renderers.
     */
    renderers?: JsonFormsRendererRegistryEntry[];
    /**
     * All available cell renderers.
     */
    cells?: JsonFormsCellRendererRegistryEntry[];
    /**
     *
     */
    i18n?: JsonFormsLocaleState;
    /**
     *
     */
    uischemas?: JsonFormsUISchemaRegistryEntry[];
    /**
     * If true, sets all controls to read-only.
     */
    readonly?: boolean;
    [additionalState: string]: any;
}
export interface JsonFormsExtendedState<T> extends JsonFormsState {
    jsonforms: {
        [subState: string]: T;
    };
}
