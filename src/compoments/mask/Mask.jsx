import React, {Component} from 'react'
import {withRouter} from 'react-router';
import './mask.scss'

class Mask extends Component  {
    state = {

    }
    stopBub = (e) => {
        e.stopPropagation()
    }
    toConfirm = (e) =>{
        this.props.toConfirm && this.props.toConfirm()
    }
    render () {
        const {content,title,confirm,show} = this.props
        return(
            <div className={"mask" + (show?' on':'')}
            onClick={this.toConfirm}>
                <div className="dialog" onClick={this.stopBub}>
                    <div className="top">
                        <h2 className="title"> {title} </h2>
                        {content}
                    </div>
                    <div className="bottom" onClick={this.toConfirm}>
                        {confirm?confirm:'我知道了'}
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Mask)