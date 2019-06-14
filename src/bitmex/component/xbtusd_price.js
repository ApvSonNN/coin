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

      if (typeof value.data !== 'undefined' && value.data.length > 0 && value.data[0].symbol === 'XBTUSD') {
        value = value.data[0]

        const oldBtcDataSet = this.state.lineChartDataPrice.datasets[0];
        const newBtcDataBuySet = { ...oldBtcDataSet };
        newBtcDataBuySet.data.push(value.close);

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

  toggleStopWs = () => {
    const {
      stop_ws
    } = this.state
    console.log(stop_ws)
    if (stop_ws) {
      this.setState({stop_ws: false})
      this.run_ws_trade_price()
    } else {
      this.setState({stop_ws: true})
      this.ws.close()
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes["chart-container"]}>
        {this.state.stop_ws && <button className="btn btn-danger" onClick={() => this.toggleStopWs()}>Start</button>}
        {!this.state.stop_ws && <button className="btn btn-primary" onClick={() => this.toggleStopWs()}>Stop</button>}
        <Chart
          data={this.state.lineChartDataPrice}
          options={this.state.lineChartOptions}
        />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
