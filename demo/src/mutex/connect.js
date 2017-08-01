import React, {Component} from 'react';
import store from './store';

window.store = store;

export default (mapperFunc, WrappedComponent) => {
  return class ConnectedComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        subscriptionKey: null,
        appState: store.getState()
      }
    }

    appStateChanged(appState) {
      this.setState({appState});
    }

    componentWillMount() {
      this.setState({subscriptionKey: store.subscribe(this)});
    }

    componentWillUnmount() {
      store.unsubscribe(this.state.subscriptionKey);
    }

    render() {
      return (<WrappedComponent {...mapperFunc(this.state.appState)} />);
    }
  }
};
