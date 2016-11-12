# react-not-another-table
- [Overview](#overview)
- [Components](#components)
  - [`<Table>`](#table)
  - [`<TableColumn>`](#tablecolumn)
- [API](#api)

## Overview

react-not-another-table is in fact, just another data table, built to avoid
external dependencies. It offers:

* flexible options for styling
* a simple declarative syntax for ordering and configuring columns
* common-sense column sorting

### Example
The following code: 

```jsx
  const data = [
    {
      foo: 1,
      bar: 'one',
      baz: {
        quux: {'uno'}
      },
    },
    {
      foo: 2,
      bar: 'two',
      baz: {
        quux: {'dos'}
      },
    },
  ]
  return (
    <Table data={data}>
      <TableColumn label="Foo" reference="foo">
        {props => <span>The value is {props.children}</span>}
      </TableColumn>
      <TableColumn label="Bar" reference="bar" />
      <TableColumn label="Baz" reference="baz.quux">
        {({children}) => <span>{children} {children} {children}</span>}
      </TableColumn>
    </Table>
  )
```

would yield markup similar to the following:

```html
  <table>
    <thead>
      <tr>
        <th>Foo</th>
        <th>Bar</th>
        <th>Baz</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>The value is 1</td>
        <td>one</td>
        <td>uno uno uno</td>
      </tr>
      <tr>
        <td>The value is 2</td>
        <td>two</td>
        <td>dos dos dos</td>
      </tr>
    </tbody>
  </table>
```

## Components

### Table

#### Props
* `tableComponent`: The component used for the table element. Defaults to plain
  `<table>`.
* `children`: Should only be instances of `<TableColumn>`
* `className`: optional className for the `<table>` element
* `data`: Any array of plain objects with like structure.

```es6
[
  {
    name: 'foo',
    count: 12
  },
  {
    name: 'bar',
    count: 9
  },
]
```

### TableColumn

Instances of `TableColumn` serve as a declarative configurations for each
column; rather than render DOM, their props are referenced and used in Table's
componentWillMount.

Instances of TableColumn must be direct children of `<Table>` to work properly.

#### Props
* `label`(string): the column name to be displayed. Defaults to the value of
  `reference`
* `reference` (string): required. Given an element from `<Table>`'s data prop,
  access the value at path `reference` (uses lodash's
  [get](https://lodash.com/docs/4.16.6#get))
* `comp` (component-like): Component to use in each cell of the column.
  Defaults to `<span>`

## API

### Styling

Styling can be accomplished either through a pre-styled table component passed
in under the `tableComponent` prop, or by the `className` prop.
