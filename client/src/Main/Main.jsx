import React, {Component} from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import PlansContainer from './PlansContainer/PlansContainer';
import FriendsContainer from './FriendsContainer/FriendsContainer';
import Feed from './Feed/Feed';

class Main extends Component {
    render(){
        return( 
            <Switch>
                <Route path="/plans" render={()=>{
                    return <PlansContainer />
                }}/>
                <Route path="/friends" render={() => {
                    return <FriendsContainer />
                }}/>
                <Route exact path='/' render={() => {
                    return <Feed />
                }}/>
            </Switch>
        )
    }
}

export default withRouter(Main);
