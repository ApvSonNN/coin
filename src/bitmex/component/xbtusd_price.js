import React from "react";
import { render } from "react-dom";
import { withStyles } from "@material-ui/core/styles";
import moment from 'moment-timezone'
import Chart from "./chart";

const styles = theme => ({
  "chart-container": {
    height: 400
  }
});

class App extends React.Component {
  state = {
    stop_ws: false,
    lineChartDataPrice: {
      labels: [],
      datasets: [
        {
          type: "line",
          label: "XBTUSD-PRICE",
          backgroundColor: "rgba(0, 0, 0, 0)",
          borderColor: this.props.theme.palette.primary.main,
          pointBackgroundColor: this.props.theme.palette.secondary.main,
          pointBorderColor: this.props.theme.palette.secondary.main,
          borderWidth: "2",
          lineTension: 0.45,
          data: []
        }
      ]
    },

    lineChartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        enabled: true
      },
      scales: {
        xAxes: [
          {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10
            }
          }
        ]
      }
    }
  };

  componentDidMount() {
    this.run_ws_trade_price()
  }

  componentWillUnmount() {
    this.ws.close();
  }

  run_ws_trade_price = () => {
    const subscribe = {
      type: "subscribe",
      channels: [
        {
          name: "ticker",
          product_ids: ["XBTUSD"]
        }
      ]
    };

    this.ws = new WebSocket("wss://www.bitmex.com/realtime?subscribe=tradeBin1m,orderBook:XBTUSD");

    this.ws.onopen = () => {
      this.ws.send(JSON.stringify(subscribe));
    };

    this.ws.onmessage = e => {
      let value = JSON.parse(e.data);
      console.log('time',moment.utc().format('YYYY-MM-DD HH:mm:ss'))

      if (typeof value.data !== 'undefined' && value.data.length > 0 && value.data[0].symbol === 'XBTUSD' && this.props.is_selected) {
        value = value.data[0]

        if (moment.utc(value.timestamp).get('minutes') === moment.utc().get('minutes')) {
          const oldBtcDataSet = this.state.lineChartDataPrice.datasets[0];
          const newBtcDataBuySet = { ...oldBtcDataSet };
          newBtcDataBuySet.data.push(value.close);
          console.log('jjjjjjjjjjjj', value )
          const newChartData = {
            ...this.state.lineChartDataPrice,
            datasets: [newBtcDataBuySet],
            labels: this.state.lineChartDataPrice.labels.concat(
              moment.utc().format('YYYY-MM-DD HH:mm:ss')
            )
          };
          this.setState({ lineChartDataPrice: newChartData });
        }
      }
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes["chart-container"]}>
        <Chart
          data={this.state.lineChartDataPrice}
          options={this.state.lineChartOptions}
        />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
