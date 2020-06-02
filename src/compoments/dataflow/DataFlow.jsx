import React, {Component} from 'react'
import {withRouter} from 'react-router';
import {urlStr} from '../../api/index'

import './dataFlow.scss'


class DataFlow extends Component {
    state = {
    }

    componentDidMount (){
    }
    
    

    clickHandle = (data) => {
            const {sign, id} = data
            const url = `${urlStr}/news-detail?sign=${encodeURIComponent(sign)}&doc_id=${id}`
            // this.props.history.push(url)
            // const w = window.open('about:blank');
            window.location.href=url;
    }
    keyRender = (text, key) => {
    // const specialCharater = new RegExp("[`~!@#$%^&*()\\-+={}':;,\\[\\].<>/?￥…（）_|【】‘；：”“’。，、？\\s]");
        if (key && text && typeof text === 'string' && typeof key === 'string') {
          const keyArr = key.split(' ').filter(k => k);
          const newText = text.replace(
            new RegExp(keyArr.join("|"), "ig"),
            str => `<font color="#2cb7ca">${str}</font>`
          );
          return (<p dangerouslySetInnerHTML={{ __html: newText }} />);
        } else {
          return (<p>{text}</p>);
        }
      }
    
    render(){
        const {dataArray,highlight} = this.props
        return(
            <div className="dataFlow">
                    <div className="data_list">
                       { 
                       dataArray.length?
                       dataArray.map((item ,index) => {
                            return(
                                <div className="list_item"
                                    key = {index}
                                    onClick = {()=>this.clickHandle(item)}
                                >
                                    <div className="list_title">
                                        <span className="serial_number">{index+1}. &nbsp;</span>
                                        {this.keyRender(item.title,highlight)}
                                    </div>
                                    <div className="list_info">
                                        <div className="tags">
                                            {/* <div className="area">四川</div> */}
                                            {item["bid_company.stock_company.name"]?
                                            <div className="industry">{item["bid_company.stock_company.name"]}</div>
                                            :''
                                             }
                                            {/* <div className="course">成交</div> */}
                                            {item.bid_money?
                                            <div className="price">{ item.bid_money.toFixed(2)}万</div>:''}
                                        </div>
                                        <div className="timer">{item.publish_time}</div>
                                    </div>
                                </div>
                            )
                       })
                       :''
                        }
                    </div>
                </div>

        )
    }

}

export default withRouter(DataFlow)
