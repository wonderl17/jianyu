import React, {Component} from 'react'
import {withRouter} from 'react-router';
import Search from '../search/Search'
import './searchZb_1.scss'

class SearchZb_1 extends Component  {
    state = {
        options: ['金额','地区'],
    }

    
    render () {
        const {options} = this.state
        return(
            <div className="search_zb">
                <Search options={options}
                    placeholder={"中标企业名称"}
                />
            </div>
        )
    }
}

export default withRouter(SearchZb_1)