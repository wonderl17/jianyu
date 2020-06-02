import React, {Component} from 'react'
import {withRouter} from 'react-router';
import './searchNone.scss'

class SearchNone extends Component  {
    state = {

    }
    checkSearchTypeAll = () => {
        this.props.checkSearchTypeAll && this.props.checkSearchTypeAll()
    }
    toAdvice = () => {
        this.props.history.push('/advice')
    }
    render () {
        return(
            <div className="search_none">
                <div className="container">
                    <img className="img1" src={require('../../assets/images/search_none_1.png')} alt=""/>
                    <h2>没有找到和该关键词匹配的信息</h2>
                    <div>试试<span className="can_click" onClick={this.checkSearchTypeAll}>全文搜索</span></div>
                    <img className="img2" src={require('../../assets/images/search_none_2.png')} alt="" onClick={this.toAdvice}/>
                </div>
            </div>
        )
    }
}

export default withRouter(SearchNone)

