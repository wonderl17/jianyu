import React, {Component} from 'react'
import {withRouter} from 'react-router';
import './tableList.scss'

class TableList extends Component  {
    state = {
        tableTit: [
           
            {
                key: 'title',
                label: '项目名称',
                style: {
                    width: '5.4rem'
                }
            },
            {
                key: 'bid_company.name',
                label: '中标单位',
                style: {
                    width: '2.6rem'
                }
            },
            {
                key: 'bid_money',
                label: '中标金额（万元）',
                style: {
                    width: '2.18rem'
                }
            },
            {
                key: 'publish_time',
                label: '发布时间',
                style: {
                    width: '1.8rem'
                }
            },
        ],
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

    toMore = ()=>{
        this.props.history.push('/export')
    }
        
    render () {
        const {data,highlight} = this.props
        const {tableTit} = this.state
        return(
            <div className="table_list">
                <div className="table">
                    <table>
                        <tbody>
                            <tr>
                                <td style={{width:"50px"}}>序号</td>

                                {
                                    tableTit.map((item,index) => {
                                        return(
                                            <td style ={
                                                {
                                                    ...item.style
                                                }
                                                }
                                                key= {index}
                                         >
                                         {item.label}
                                         </td>
                                        )
                                    })
                                }
                            </tr>
                        </tbody>
                        <tbody>
                            {
                                data.slice(0,20).map((item,index) => {
                                    return(
                                        <tr key={index}>
                                                <td>{index+1}</td>
                                                <td style={{textAlign:'left'}}>{item.title? this.keyRender(item.title,highlight) :''}</td>
                                                <td>{item['bid_company.stock_company.name']? item['bid_company.stock_company.name']:''}</td>
                                                <td>{item.bid_money?item.bid_money:''}</td>
                                                <td>{item.publish_time? item.publish_time.substr(0,10):''}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                    <div className="shade">
                        <div className="btn" onClick={this.toMore}> 
                            查看更多
                        </div>
                    </div>
            </div>
        )
    }
}

export default withRouter(TableList)