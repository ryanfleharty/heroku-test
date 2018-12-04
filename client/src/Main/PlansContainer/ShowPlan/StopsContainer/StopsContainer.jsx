import React, { Component } from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';
import StopsIndex from './StopsIndex/StopsIndex';
import NewStop from './NewStop/NewStop';
import ShowStop from './ShowStop/ShowStop';

export default withRouter(class StopsContainer extends Component {
    render(){
        return(
                <Switch>
                    <Route path={this.props.match.url + "/stops/new"} render={()=>{
                            return <NewStop />
                    }}/>
                    <Route path={this.props.match.url + "/stops/:id"} component={ShowStop} />
                    <Route exact path={this.props.match.url} component={StopsIndex}/>
                </Switch>
        )
    }
})