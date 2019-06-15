import React from "react";
import { render } from "react-dom";
import { withStyles } from "@material-ui/core/styles";
import Chart from "./chart";
import moment from 'moment-timezone'
import _ from "lodash"

const styles = theme => ({
  "chart-container": {
    height: 400
  }
});

class App extends React.Component {
  state = {
    stop_ws: false,
    start: this.props.start,
    end: this.props.end,
    is_first: true,
    lineChartDataSize: {
      labels: [],
      datasets: [
        {
          type: "line",
          label: "XBTUSD-SIZE",
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
    if (this.state.is_first && this.props.is_selected) {
      const oldBtcDataSet = this.state.lineChartDataSize.datasets[0];
      const newBtcDataSize = { ...oldBtcDataSet };
      newBtcDataSize.data.push(0);
      const newChartData = {
        ...this.state.lineChartDataSize,
        datasets: [newBtcDataSize],
        labels: this.state.lineChartDataSize.labels.concat(
          this.state.start.format('YYYY-MM-DD HH:mm:ss')
        )
      };

      this.setState({ lineChartDataSize: newChartData, is_first: false});
    }
    this.run_ws_trade_size()
  }

  componentWillUnmount() {
    this.ws.close();
  }

  run_ws_trade_size = () => {
    let start = this.state.start
    let end = this.state.end

    const subscribe = {
      type: "subscribe",
      channels: [
        {
          name: "ticker",
          product_ids: ["XBTUSD"]
        }
      ]
    };

    this.ws = new WebSocket("wss://www.bitmex.com/realtime?subscribe=trade,orderBook:XBTUSD");

    this.ws.onopen = () => {
      this.ws.send(JSON.stringify(subscribe));
    };

    let arrData = []
    this.ws.onmessage = e => {
      let value = JSON.parse(e.data);

      if (typeof value.data !== 'undefined' && value.data.length > 0 && value.data[0].symbol === 'XBTUSD' && this.props.is_selected) {
        value = value.data[0]
        const currentTime = moment.utc()

        if (arrData.length === 0) {
          arrData.push(value)
        } else { 
          if (currentTime < end ) {
            arrData.push(value)
          } else {
            // console.log('arrData', arrData)
            const buyListData = arrData.filter(function(value) {
              return value.side === 'Buy'
            }).map(a => a.size)
            const sellListData = arrData.filter(function(value) {
              return value.side === 'Sell'
            }).map(a => a.size)
            const totalSell = sellListData.reduce((a, b) => a + b, 0)
            const totalBuy = buyListData.reduce((a, b) => a + b, 0)
            // console.log('buyListData', buyListData)
            // console.log('sellListData', sellListData)
            // console.log('totalSell', totalSell)
            // console.log('totalBuy', totalBuy)
            const lastSize = totalBuy - totalSell
            // console.log('lastSize', lastSize)
            arrData = [value]

            const oldBtcDataSet = this.state.lineChartDataSize.datasets[0];
            const newBtcDataSize = { ...oldBtcDataSet };
            newBtcDataSize.data.push(lastSize);

            start = end.clone()
            end = end.clone().add(1, 'minutes')
            const newChartData = {
              ...this.state.lineChartDataSize,
              datasets: [newBtcDataSize],
              labels: this.state.lineChartDataSize.labels.concat(
                currentTime.format('YYYY-MM-DD HH:mm:ss')
              )
            };

            this.setState({ lineChartDataSize: newChartData});
          }
        }
      }
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes["chart-container"]}>
        <Chart
          data={this.state.lineChartDataSize}
          options={this.state.lineChartOptions}
        />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
