import React from "react";
import { render } from "react-dom";
import { withStyles } from "@material-ui/core/styles";
// import Chart from "./component/chart";
// import moment from 'moment-timezone'
// import _ from "lodash"
import PriceComponent from "./component/xbtusd_price"
import SizeComponent from "./component/xbtusd_size"

const styles = theme => ({
  "chart-container": {
    height: 400
  }
});

class App extends React.Component {

  componentDidMount() {
    
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <SizeComponent/>
        <PriceComponent/>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
