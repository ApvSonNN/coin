import React from 'react'
import BitMEXClient from './bitmex/index'
import Websocket from 'react-websocket';

export class Question extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataBitmex: null,
    }
  }

  componentDidMount = () => {
    
  }

  handleData = (data) => {
    let result = JSON.parse(data);
    this.setState({dataBitmex: result.data});
  }

  renderDataBitmex = () => {
    const {
      dataBitmex
    } = this.state
    console.log("gggggggggg",dataBitmex)
    if (!dataBitmex) return 

    const arr = []
    for (let i = 0; i < dataBitmex.length; i++) {
      arr.push(<tr>
        <td>{i+1}</td>
        <td>{dataBitmex[i].side}</td>
        <td>{dataBitmex[i].price}</td>
        <td>{dataBitmex[i].foreignNotional}</td>
        <td>{dataBitmex[i].grossValue}</td>
        <td>{dataBitmex[i].symbol}</td>
        <td>{dataBitmex[i].tickDirection}</td>
        <td>{dataBitmex[i].trdMatchID}</td>
        <td>{dataBitmex[i].timestamp}</td>
      </tr>)
    }
    console.log("jjjjjjjjjjjjjjjjj", arr)
    return arr
  }

  

  render() {
    const {
      dataBitmex
    } = this.state
    

    return (
      <div>
        <table class="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>side</th>
              <th>price</th>
              <th>foreignNotional</th>
              <th>grossValue</th>
              <th>symbol</th>
              <th>tickDirection</th>
              <th>trdMatchID</th>
              <th>timestamp</th>
            </tr>
          </thead>
          <tbody>
            {this.renderDataBitmex()}
          </tbody>
        </table>
        <Websocket url='wss://www.bitmex.com/realtime?subscribe=instrument,orderBook:orderBookL2_25'
              onMessage={this.handleData.bind(this)}/>
      </div>
    )
  }
}

export default Question