import React from 'react'
import Icon from 'react-fontawesome'
import {get, isFunction, isEqual, orderBy} from 'lodash/fp'

export {default as TableColumn} from './tableColumn'

const callOrSelf = (...args) => x => (isFunction(x) ? x(...args) : x)

class Row extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props.datum, nextProps.datum)
  }

  render() {
    const {datum, columns, rowClass} = this.props
    const calledRowClass = callOrSelf(datum)(rowClass)
    return (
      <tr className={calledRowClass}>
        {columns.map(c => <Col key={c.reference} datum={datum} columnData={c} />)}
      </tr>
    )
  }
}

Row.propTypes = {
  datum: React.PropTypes.object,
  columns: React.PropTypes.arrayOf(React.PropTypes.object),
  rowClass: React.PropTypes.oneOfType([
    React.PropTypes.func,
    React.PropTypes.string,
  ])
}

class Col extends React.Component {
  shouldComponentUpdate(nextProps) {
    const {datum, columnData: {reference, force}} = this.props
    if (force) return true
    const getRef = get(reference)
    return getRef(datum) !== getRef(nextProps.datum)
  }

  render() {
    const {datum, columnData} = this.props
    const cellClass = callOrSelf(datum)(columnData.cellClass)
    return (
      <td key={columnData.reference} className={cellClass}>
        <columnData.component datum={datum} {...columnData.props}>
          {get(columnData.reference)(datum)}
        </columnData.component>
      </td>
    )
  }
}

Col.propTypes = {
  datum: React.PropTypes.object,
  columnData: React.PropTypes.shape({
    component: React.PropTypes.oneOfType([
      React.PropTypes.func,
      React.PropTypes.instanceOf(React.Component),
    ]),
    reference: React.PropTypes.string,
    force: React.PropTypes.string,
    label: React.PropTypes.string,
    cellClass: React.PropTypes.string,
  }),
}

class Table extends React.Component {
  state = {
    columns: [],
    sortOrder: {empty: true},
  };

  componentWillMount() {
    this.setColumns(this.props.children)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.children !== this.props.children) {
      this.setColumns(nextProps.children)
    }
  }

  setColumns = (children) => {
    const columns = React.Children.map(children, (element) => {
      if (element.type.createColumnFromElement) {
        return element.type.createColumnFromElement(element)
      }
      return null
    })
    this.setState({columns})
  };

  setSort = (c) => {
    const {sortOrder} = this.state
    if (sortOrder.empty || (sortOrder.column.reference !== c.reference)) {
      this.setState({
        sortOrder: {column: c, ascending: true}
      })
    } else if (sortOrder.column.reference === c.reference) {
      if (sortOrder.ascending) {
        this.setState({
          sortOrder: {...sortOrder, ascending: false}
        })
      } else {
        this.setState({sortOrder: {empty: true}})
      }
    }
  };

  prepData = () => {
    const {data} = this.props
    const {sortOrder} = this.state
    if (sortOrder.empty) { return data }
    return orderBy(
      [sortOrder.column.reference],
      [sortOrder.ascending ? 'asc' : 'desc']
    )(this.props.data)
  };

  renderHeaderRow = () => {
    const {columns, sortOrder} = this.state
    const renderHeading = c => {
      let glyph
      if (!sortOrder.empty && sortOrder.column.reference === c.reference) {
        const code = sortOrder.ascending ? 'chevron-up' : 'chevron-down'
        glyph = <Icon style={{marginLeft: 8}} name={code} />
      }
      return (
        <th onClick={() => this.setSort(c)} key={c.reference}>
          {c.label || c.reference}
          <span>{glyph}</span>
        </th>
      )
    }
    return (
      <thead>
        <tr>
          {columns.map(renderHeading)}
        </tr>
      </thead>
    )
  };

  render() {
    const data = this.prepData()
    const {rowClass} = this.props
    const toRow = (d, i) => (
      <Row key={i} datum={d} columns={this.state.columns} rowClass={rowClass} />
    )
    return (
      <table className={this.props.className || null}>
        {this.renderHeaderRow()}
        <tbody>{data.map(toRow)}</tbody>
      </table>
    )
  }
}

Table.propTypes = {
  children: React.PropTypes.node,
  data: React.PropTypes.arrayOf(React.PropTypes.object),
  className: React.PropTypes.string,
  rowClass: React.PropTypes.oneOfType([
    React.PropTypes.func,
    React.PropTypes.string,
  ]),
}

export default Table
