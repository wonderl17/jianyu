import React, {Component} from 'react'
import {withRouter} from 'react-router';
import DataFlow from '../dataflow/DataFlow'
import SearchNone from '../searchNone/SearchNone'
import './searchResult.scss'
import TableList from '../tableList/TableList';

class SearchResult extends Component  {
    state = {
        list_show:false, //0关闭 1标题 2列表
        list_type:'1',
        search_type:'title',
        show_way:'list',
        list_option:[
            ['标题搜索','全文搜索'],
            ['列表显示','表格显示']
        ],
       

    }
    componentDidMount(){
        this.scrollListener()
        this.props.history.listen(location => {
            // 最新路由的 location 对象，可以通过比较 pathname 是否相同来判断路由的变化情况
            if (this.props.location.pathname !== location.pathname) {
               // 路由发生了变化
               if(location.pathname === '/export'){
                   console.log(1);
                   
               }
               
            }
        })
    }
    componentWillUnmount(){
        window.removeEventListener('scroll', this.scrollHandler)
    }

    scrollListener = () => {
        window.addEventListener('scroll',this.scrollHandler)
    }

    scrollHandler = () => {
        const {data,cantDrop} = this.props
        const scrollH = document.body.scrollTop + document.documentElement.scrollTop
        const clientH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        const eleH = document.getElementsByClassName('search')[0].offsetHeight
        if (eleH - (clientH + scrollH) === 0  && data.length  && !cantDrop) { 
            this.props.dataDrop && this.props.dataDrop()
        }
    }

    optionClick = (type) => {
        const {list_show,list_type} = this.state
        if(!list_show || list_type !==type){
            this.setState({
                list_show: true,
                list_type: type,
            })
        } else{
            this.setState({
                list_show: false
            })
        }
    }

    checkSearchType = (index) => {
        let search_type
        if(index === 0){
            search_type = 'title'
        } else {
            search_type = 'all'
        }
        this.setState({
            search_type,
            list_show:false
        },()=>{
            this.props.setSearchType && this.props.setSearchType(search_type)
        })
    }

    checkShowWay = (index) => {
        let show_way
        if(index === 0){
            show_way = 'list'
        }else{
            show_way = 'table'
        }
        this.setState({
            show_way,
            list_show:false
        })
    }
    closeList = () =>{
        this.setState({
            list_show : false
        })
    }

    toExport = () => {

        this.props.toExport && this.props.toExport()
        // console.log(this.props);
        
    }
    render () {
        const {list_show,search_type,show_way,list_option,list_type} = this.state
        const { data, search_word, cantDrop, dataLoading, toMore} = this.props
        const  searchArr=['title','all']
        const  showArr = ['list','table']
        return(
            <div className="result">
                <div className="header">
                    <div className="headline">
                        <div className="options">
                            <div className="search_title iconfont"
                                onClick={() => this.optionClick('1')}
                            >{search_type==='title'? '标题搜索':'全文搜索'}</div>
                            <div className="show_list iconfont"
                                onClick={() => this.optionClick('2')}
                            >{show_way==='list'? '列表显示':'表格显示'}</div>
                        </div>
                        <div className="date_export"
                            onClick={this.toExport}
                        >
                            <span className="iconfont">数据导出</span>
                        </div>
                    </div>
                    {
                        <div className="down_list">
                            {   
                                <div className={"list"+ (list_show? " down_list_active":'')}>
                                    {
                                        list_type==='1'?
                                        list_option[0].map((item,index) => {
                                            return (
                                                <div className={"list_item iconfont" + (search_type === searchArr[index]?" list_item_active":'')}
                                                    onClick={()=>this.checkSearchType(index)}
                                                    key = {index}
                                                >
                                                    <span>{item}</span>
                                                </div>
                                            )
                                        })
                                        :''
                                    }
                                    {
                                        list_type==='2'?
                                        list_option[1].map((item,index) => {
                                            return (
                                                <div className={"list_item iconfont" + (show_way === showArr[index]?" list_item_active":'')}
                                                    onClick={()=>this.checkShowWay(index)}
                                                    key = {index}
                                                >
                                                    <span>{item}</span>
                                                </div>
                                            )
                                        })
                                        :""
                                    }
                                </div>
                            }
                        </div>
                    }
                            {
                                list_show?
                                <div className="mask" onClick={this.closeList}></div>
                                :''
                            }
                </div>
                {
                    show_way ==='list'?
                    <div className="result_content">
                    {
                        data.length?
                         <DataFlow dataArray={data}
                         highlight={search_word}/>
                        :
                        <SearchNone
                        checkSearchTypeAll = {()=>this.checkSearchType(1)}
                        />
                    }
                    {
                        dataLoading?
                        <div className="data_loading">
                            加载中
                        </div>
                        :''
                    }
                    {
                        cantDrop&& !toMore?
                        <div className="cant_drop">
                            没有更多了
                        </div>
                        :''
                    }
                    {
                        toMore?
                        <div className="cant_drop" onClick={this.toExport}>
                            查看更多
                        </div>
                        :''
                    }
                    </div>
                    :
                    <div className="result_content">
                       {
                           data.length?
                           <TableList data={data}
                            highlight={search_word}
                           />
                          :
                          <SearchNone
                          checkSearchTypeAll = {()=>this.checkSearchType(1)}
                          />
                       }
                    </div>

                }
                
            </div>
        )
    }
}

export default withRouter(SearchResult)