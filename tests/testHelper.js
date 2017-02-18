import { DragDropContext } from 'react-dnd'
import TestBackend from 'react-dnd-test-backend'
import React, { Component } from 'react'
import { Provider, connect } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
//import reducers from '../src/reducers'
import teaspoon from 'teaspoon'

const DD = DragDropContext(TestBackend)

function renderComponent(ComponentClass, props = {}, state = {}, returnStore = false) {
  const log = []
  const logger = store => next => action => {
    log.push(action)
    return next(action)
  }

  class Tester extends Component {
    constructor(props) {
      super(props)
      this.state = props
    }
    componentWillReceiveProps(props) {
      if (props !== this.props)
      this.setState(props)
    }
    render() {
      return (
        <Provider store={store}>
          <ComponentClass {...this.state} />
        </Provider>
      )
    }
  }

  const Draggable = DD(Tester)

  const store = createStore(reducers, state, applyMiddleware(logger))
  const componentInstance = teaspoon(
    <Draggable {...props} />
  ).render()
  const ret = componentInstance
  if (returnStore) {
    return [ret, store, log]
  }
  return ret
}

export { renderComponent }
