/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import './MatchMediaMock';
import * as React from 'react';
import {
  Actions,
  ControlElement,
  jsonformsReducer,
  JsonFormsState,
  JsonSchema,
  NOT_APPLICABLE,
  UISchemaElement
} from '@jsonforms/core';
import IntegerCell, {
  materialIntegerCellTester
} from '../../src/cells/MaterialIntegerCell';
import { materialRenderers } from '../../src';
import { AnyAction, combineReducers, createStore, Reducer, Store } from 'redux';

import Enzyme, { mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { JsonFormsStateProvider, JsonFormsContext, JsonFormsStateContext } from '@jsonforms/react';
import { resolveRef, waitForResolveRef } from '../util';

Enzyme.configure({ adapter: new Adapter() });

const data = { foo: 42 };
const schema = {
  type: 'integer',
  minimum: 5
};
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo'
};

const initJsonFormsStore = (
  testData: any,
  testSchema: JsonSchema,
  testUiSchema: UISchemaElement
): Store<JsonFormsState> => {
  const s: JsonFormsState = {
    jsonforms: {
      renderers: materialRenderers
    }
  };
  const reducer: Reducer<JsonFormsState, AnyAction> = combineReducers({
    jsonforms: jsonformsReducer()
  });
  const store: Store<JsonFormsState> = createStore(reducer, s);
  store.dispatch(Actions.init(testData, testSchema, testUiSchema));
  return store;
};

describe('Material integer cells tester', () => {
  const controlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo'
  };

  it('should fail', async () => {
    expect(await materialIntegerCellTester(undefined, undefined, undefined)).toBe(
      NOT_APPLICABLE
    );
    expect(await materialIntegerCellTester(null, undefined, undefined)).toBe(NOT_APPLICABLE);
    expect(await materialIntegerCellTester({ type: 'Foo' }, undefined, undefined)).toBe(
      NOT_APPLICABLE
    );
    expect(await materialIntegerCellTester({ type: 'Control' }, undefined, undefined)).toBe(
      NOT_APPLICABLE
    );
  });

  it('should fail 2', async () => {
    const jsonSchema = {
      type: 'object',
      properties: { foo: { type: 'string' } }
    };
    expect(await materialIntegerCellTester(controlElement, jsonSchema, resolveRef(jsonSchema))).toBe(NOT_APPLICABLE);
  });

  it('should fail 3', async () => {
    const jsonSchema = {
      type: 'object',
      properties: { foo: { type: 'string' }, bar: { type: 'integer' } }
    };
    expect(await materialIntegerCellTester(controlElement, jsonSchema, resolveRef(jsonSchema))).toBe(NOT_APPLICABLE);
  });

  it('should succeed', async () => {
    const jsonSchema = {
      type: 'object',
      properties: { foo: { type: 'integer' } }
    };
    expect(await materialIntegerCellTester(controlElement, jsonSchema, resolveRef(jsonSchema))).toBe(2);
  });
});

describe('Material integer cells', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  it('should autofocus via option', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      options: {
        focus: true
      }
    };
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { uischema, schema, data } }}>
        <IntegerCell schema={schema} uischema={control} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().autoFocus).toBeTruthy();
  });

  it('should not autofocus via option', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      options: {
        focus: false
      }
    };
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { uischema, schema, data } }}>
        <IntegerCell schema={schema} uischema={control} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input');
    expect(input.props().autoFocus).toBeFalsy();
  });

  it('should not autofocus by default', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo'
    };
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { uischema, schema, data } }}>
        <IntegerCell schema={schema} uischema={control} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().autoFocus).toBeFalsy();
  });

  it('should render', async () => {
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { uischema, schema, data } }}>
        <IntegerCell schema={schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );

    await waitForResolveRef(wrapper)
    const input = wrapper.find('input').first();
    expect(input.props().type).toBe('number');
    expect(input.props().step).toBe('1');
    expect(input.props().value).toBe(42);
  });

  it('should render 0', async () => {
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { uischema, schema, data: { foo: 0 } } }}>
        <IntegerCell schema={schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );

    await waitForResolveRef(wrapper);
    const input = wrapper.find('input').first();
    expect(input.props().type).toBe('number');
    expect(input.props().step).toBe('1');
    expect(input.props().value).toBe(0);
  });

  it('should update via input event', () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider
        initState={{
          core: { uischema, schema, data }
        }}
      >
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return (<IntegerCell schema={schema} uischema={uischema} path='foo' />);
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 13 } });
    expect(ctx.core.data.foo).toBe(13);
  });

  it('should update via action', () => {
    const store = initJsonFormsStore({ foo: 13 }, schema, uischema);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { uischema, schema, data } }}>
        <IntegerCell schema={schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    store.dispatch(Actions.update('foo', () => 42));
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe(42);
  });

  it('should not update with undefined value', async () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { uischema, schema, data } }}>
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return (<IntegerCell schema={schema} uischema={uischema} path='foo' />);
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    ctx.dispatch(Actions.update('foo', () => undefined));
    await waitForResolveRef(wrapper);
    wrapper.update();
    const input = wrapper.find('input');
    expect(input.props().value).toBe('');
  });

  it('should not update with null value', () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { uischema, schema, data } }}>
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return <IntegerCell schema={schema} uischema={uischema} path='foo' />
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    ctx.dispatch(Actions.update('foo', () => null));
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe('');
  });

  it('should not update with wrong ref', () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { uischema, schema, data } }}>
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return <IntegerCell schema={schema} uischema={uischema} path='foo' />
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    ctx.dispatch(Actions.update('bar', () => 11));
    wrapper.update();
    const input = wrapper.find('input');
    expect(input.props().value).toBe(42);
  });

  it('should not update with null ref', () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { uischema, schema, data } }}>
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return <IntegerCell schema={schema} uischema={uischema} path='foo' />;
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    ctx.dispatch(Actions.update(null, () => 13));
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe(42);
  });

  it('should not update with undefined ref', () => {
    let ctx: JsonFormsStateContext;
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { uischema, schema, data } }}>
        <JsonFormsContext.Consumer>
          {(context: JsonFormsStateContext) => {
            ctx = context;
            return <IntegerCell schema={schema} uischema={uischema} path='foo' />
          }}
        </JsonFormsContext.Consumer>
      </JsonFormsStateProvider>
    );
    ctx.dispatch(Actions.update(undefined, () => 13));
    wrapper.update();
    const input = wrapper.find('input').first();
    expect(input.props().value).toBe(42);
  });

  it('can be disabled', () => {
    wrapper = mount(
      <IntegerCell
        schema={schema}
        uischema={uischema}
        enabled={false}
        path='foo'
      />
    );
    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBeTruthy();
  });

  it('should be enabled by default', () => {
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core: { uischema, schema, data } }}>
        <IntegerCell schema={schema} uischema={uischema} path='foo' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').first();
    expect(input.props().disabled).toBeFalsy();
  });
});
