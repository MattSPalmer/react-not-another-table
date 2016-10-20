# 0.2.0 (2016-10-19)

Features:

Breaking change: instead of depending on `className` to style the table
element, users should now pass `tableComponent` as a prop (default is 'table')
and handle any styling in `tableComponent`'s definition.

`tableComponent` receives the current column state and this.props.data as
props.
