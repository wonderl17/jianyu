import React, {Component} from 'react'
import {withRouter} from 'react-router';
import './dataPreview.scss'

class DataPreview extends Component  {
    state = {
        tableTit: [
           
            {
                key: 'title',
                label: '项目名称',
                style: {
                    width: '270px'
                }
            },
            {
                key: 'bid_company.name',
                label: '中标单位',
                style: {
                    width: '130px'
                }
            },
            {
                key: 'bid_money',
                label: '中标金额（万元）',
                style: {
                    width: '109px'
                }
            },
            {
                key: 'publish_time',
                label: '发布时间',
                style: {
                    width: '90px'
                }
            },
        ],
        check_way:0,
  
    }
    checkWay = (index) => {
        this.setState({
            check_way : index
        })
    }
    render () {
        const {data} = this.props
        const {tableTit,check_way} = this.state
        return(
            
            <div className="data_preview">
                <div className="table_header">
                    <div className={"left" + (check_way === 0? " active" :'')} onClick={()=>this.checkWay(0)}>
                        标准字段包
                    </div>
                    <div className={"right" + (check_way === 1? " active" :'')} onClick={()=>this.checkWay(1)}>
                        高级字段包
                    </div>
                </div>
                <div className="table">
                    <table>
                        <tbody>
                            <tr className="title">
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
                                        <tr key={index} className={"item" + (index%2===1? ' active':'')} >
                                                <td>{index+1}</td>
                                                <td style={{textAlign:'left'}}>{item.title?item.title :''}</td>
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
            </div>
        )
    }
}

export default withRouter(DataPreview)