import React from 'react';


class App extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    return(
      <div>
      {this.props.chilsren}
      </div>
    );
  };
};

export default App;
