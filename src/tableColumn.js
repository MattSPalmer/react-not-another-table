import React from 'react'
import invariant from 'invariant'

const defaultComp = ({children}) => <span>{children}</span>

const Column = React.createClass({
  statics: {
    createColumnFromElement: (elem) => ({
      force: elem.props.force,
      label: elem.props.label,
      reference: elem.props.reference,
      cellClass: elem.props.cellClass,
      component: elem.props.children || elem.props.comp || defaultComp
    })
  },
  render() {
    invariant(
      false,
      '<Column> elements are for Grid configuration only and should not be rendered'
    )
  }
})

export default Column
