import React, {Component} from 'react'
import {withRouter} from 'react-router';
import './recommender.scss'

class Recommender extends Component  {
    state = {
        item_cursor:''
    }
    clickHistoryItem = () => { 
        this.props.clickHistoryItem && this.props.clickHistoryItem()
    }

    render () {
        const { item_cursor } = this.state
        const {recommenderList } = this.props
        return(
            <div className="recommender">
                <div className="input_div"
                    onClick={this.stopBub}
                >
                     <div className="list_item list_title">
                         <span className="iconfont">历史搜索</span>
                         <i className="iconfont"
                            onClick={this.clearHistory}
                         ></i>
                     </div>
                     <ul className="list_content">
                         {
                             recommenderList&&recommenderList.length?
                             recommenderList.map((item,index) => {
                                 return(
                                        <li className={"list_item" + ((item_cursor===index)? ' list_item_active':'')}
                                            key={index}
                                            onClick={() => this.clickHistoryItem(item)}
                                        >
                                             {item}
                                        </li>
                                 )
                             }):''
                        }
                     </ul>
                </div>
            </div>
        )
    }
}

export default withRouter(Recommender)