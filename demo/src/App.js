import React, {Component} from 'react';
import connect from 'mutex/connect';
import {fetchCollection} from 'actions/dogs';

class App extends Component {
  componentWillMount() {
    fetchCollection();
  }

  render() {
    return (<div className='sans-serif'>
      <div className='cf'>
        <div className='w-20 fl-ns vh-100 pa3' style={{backgroundColor: '#f5f5f5'}}>
          <div className='f4 black-60'>Dogs Api</div>
        </div>
        <div className='w-80 fl-ns pa3'>
          Showing a list of {this.props.dogs.length} breeds.
        </div>
      </div>
    </div>);
  }
}

export default connect((state) => ({
  dogs: state.dogs.collection,
  fetchError: state.dogs.fetchError
}), App);

// export default App;