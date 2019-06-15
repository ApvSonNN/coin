import React from "react";
import { render } from "react-dom";
import { withStyles } from "@material-ui/core/styles";
// import Chart from "./component/chart";
import moment from 'moment-timezone'
// import _ from "lodash"
import PriceComponent from "./component/xbtusd_price"
import SizeComponent from "./component/xbtusd_size"

const styles = theme => ({
  "chart-container": {
    height: 400
  }
});

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      start: moment.utc(),
      // is_selected: true,
      is_selected: moment.utc().get('seconds') === 0,
      intervalId: 0
    }
  }
  componentDidMount() {
    const interval = setInterval(() => {
      if (this.state.start.get('seconds') !== 0 && !this.state.is_selected) {
        this.setState({ start: moment.utc(), is_selected: moment.utc().get('seconds') === 0 })
      } else {
        clearInterval(this.state.intervalId)
      }
    }, 1000);

    this.setState({intervalId: interval})
  }

  componentWillUnmount() {
     clearInterval(this.state.intervalId);
  }

  render() {
    const { classes } = this.props;
    let end = this.state.start.clone()
    end = end.add(1, 'minutes')
    return (
      <div>
        {(this.state.start.get('seconds') !== 0) && <h2>It is {this.state.start.format('YYYY-MM-DD HH:mm:ss')}.</h2> } 
        {(this.state.start.get('seconds') === 0) && <SizeComponent start={this.state.start} end={end} is_selected={this.state.is_selected}/>}
        <br/>
        {(this.state.start.get('seconds') === 0) && <PriceComponent start={this.state.start} end={end} is_selected={this.state.is_selected}/>}
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
