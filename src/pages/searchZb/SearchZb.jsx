import React, {Component} from 'react'
import {withRouter} from 'react-router';
import Sieve from '../../compoments/sieve/Sieve'
import SearchResult from '../../compoments/searchResult/SearchResult'
import {search} from '../../api/index';

import './searchZb.scss'

class SearchZb extends Component  {
    state = {
        search_word : '',
        show_sieve: true,
        data_flow: [],
        show_loading: false,
        show_result:false,
        sieve : {
            min_money: '',
            max_money: '',
            search_type: 'title',
            area_checked:[],
            money_checked:'',
            max_date: null,
            min_date: null,
            option : '金额',
        }
    }

    inputChange = (e) => {
        const val = e.target.value
        this.setState({
            search_word:val,
        })
    }
    stopBub = (e) => {
        e.stopPropagation();
    }

    clearIpt = () => {
        this.setState({
            search_word:''
        })
    }

    toSearch = async () => {
        const obj = this.integration()
        // this.addHistory()
        this.setState({
            show_loading:true,
        },()=>{
            this.refs.search_input.blur()
        })
        const res = await search(obj)
        if(res&&res.status === '1'){
            if(res.data.info_flow_list.length){
                let data = res.data.info_flow_list
                const data_flow =  this.initData (data)
                const cursor = data_flow.length? data_flow[data_flow.length - 1].cursor:''
                this.setState({
                    data_flow,
                    cursor
                })
            }
        }
        this.setState({
            show_loading: false,
            show_sieve: false,
            show_result: true
        },()=>{
            // sessionStorage.setItem('sieve',JSON.stringify(this.state.sieve))
        })
    }

    showSieve = () => {
        const {show_sieve,data_flow} = this.state
        if(show_sieve){
            if(data_flow.length)
                this.setState({
                    show_result: true,
                })
            this.setState({
                show_sieve: false,
            })
        }
        else {
            this.setState({
                show_result: false,
                show_sieve: true
            })
        }
    }
    integration = () => {
        const {min_date,max_date,max_money,min_money, area_checked,search_type} = this.state.sieve
        const {search_word} = this.state
        let area = area_checked.map((item) => {
            return {
                key_field:"project_province",
                value_field: item,
                keyword:[]
            }
        })
        let obj = {
            db_id: 4,
            size : 20,
            search_type : search_type,
            search_word : search_word,
            filter_conditions : {
                date :{
                    publish_time:{
                    }
                },
                keyword: area,
                not_null:["title", "bid_company.stock_company.name", "timestamp"],
                number:{
                    bid_money:{
                    }
                }
            }
        }
        if(max_date || min_date){
            if(min_date)
                obj.filter_conditions.date.publish_time.gte = min_date.getTime()
            if(max_date)
                obj.filter_conditions.date.publish_time.lte = max_date.getTime()
        } else {
            delete  obj.filter_conditions.date
        }

        if(max_money || min_money){
            if(min_money)
                obj.filter_conditions.number.bid_money.gte = Number(min_money)
            if(max_money)
                obj.filter_conditions.number.bid_money.lte = Number(max_money)
        } else {
            delete  obj.filter_conditions.number
        }
        if(!area.length)
            delete obj.filter_conditions.keyword
        if(!search_word)
            delete obj.search_word
        return obj
    }
    setSieve = (obj) => {
        const  {sieve} = this.state
        if(obj){
            Object.assign(sieve,obj) 
            this.setState({
                sieve
            })
        }
    }

    searchReset = ()=> {
        this.setState({
            search_word:'',
            sieve:{
                min_money: '',
                max_money: '',
                max_date: null,
                min_date: null,
                search_type: 'title',
                area_checked:[],
                option : 0,
                money_checked:'',
            }
        })
    }
    setSearchType = (type) => {
        const  {sieve} = this.state
        if(type){
            sieve.search_type = type
            this.setState({
                sieve
            },() => {
                this.toSearch()
            })
        }
        
    }
    render () {
        const {search_word, show_sieve, sieve, show_loading,show_result,data_flow} = this.state
        return(
            <div className="search_zb">
                <form action="" className="wxhead">
                    <div className="search_head">
                        <input type="text" 
                            className="form_control search_input" 
                            maxLength="50" 
                            placeholder="中标企业名称"
                            autoComplete="off"
                            // onFocus={this.inputFocus}
                            onChange={this.inputChange}
                            value={search_word}
                            onClick={this.stopBub}
                            // onKeyDown={this.keyDown}
                            ref="search_input"
                        />
                        {/* {
                            show_history?
                            <div className="input_div"
                                onClick={this.stopBub}
                            >
                                 <div className="history_item history_title">
                                     <span className="iconfont">历史搜索</span>
                                     <i className="iconfont"
                                        onClick={this.clearHistory}
                                     ></i>
                                 </div>
                                 <ul className="history_content">
                                     {
                                         search_history.length?
                                         search_history.map((item,index) => {
                                             return(
                                                    <li className={"history_item" + ((history_cursor===index)? ' history_item_active':'')}
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
                            :''
                        } */}

                        <span className="screen"
                            onClick={this.showSieve}
                        >筛选</span>

                        {
                            search_word?
                            <div className="">
                                <span className="clearIpt"
                                      onClick={this.clearIpt}
                                >
                                    <img src={require('../../assets/images/delete_icon.png')} alt=""/>    
                                </span>
                                <span className="query"
                                      onClick={this.toSearch}
                                >
                                    <img src={require('../../assets/images/search_icon.png')} alt=""/>
                                </span>
                            </div>
                            :''
                        }
                    </div>
                        
                </form>
                {
                    show_sieve?
                    <Sieve reset={this.searchReset}
                           toSearch = {this.toSearch}
                           setSieve = {this.setSieve}
                           sieveState = {sieve}
                           has_option = {['金额','地区']}
                           keyword={search_word}
                    />
                    :"" 
                }
                {
                    show_loading?
                    <div className="loading">
                        <div className="item">
                            <div className="rotate"></div>
                        </div>
                    </div>
                    :''
                }
                {
                    show_result?
                    <SearchResult data={data_flow}
                    setSearchType = {this.setSearchType}
                    search_word ={search_word}
                    dataDrop = {this.dataDrop}
                    />
                    :''
                }
            </div>
        )
    }
}

export default withRouter(SearchZb)