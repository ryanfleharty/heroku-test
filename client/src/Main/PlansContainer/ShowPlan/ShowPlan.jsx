import React, {Component} from 'react';
import StopsContainer from './StopsContainer/StopsContainer';
import InviteFriendsModal from './InviteFriendsModal/InviteFriendsModal';
import { Row, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getPlan } from '../../../actions/actions';
import Moment from 'react-moment';

class ShowPlan extends Component{
    constructor(props){
        super(props);
        this.state = {
            "searched": false,
            "dataLoaded": false
        }
    }
    componentDidMount = async () =>{
        await this.props.getPlan(this.props.match.params.id);
        this.setState({
            dataLoaded: true
        })
    }
    render(){
        const calendarStrings = {
            lastDay : '[Yesterday at] LT',
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            lastWeek : '[last] dddd [at] LT',
            nextWeek : 'dddd [at] LT',
            sameElse : 'MMMM DD YYYY'
        };
        console.log(this.props.plan);
        return(
            <div>
               {this.state.dataLoaded ? 
                    //Are they a joiner or invited? If so, they can see the plan
                    this.props.plan.joiners.find(user => user._id === this.props.currentUser._id) || this.props.plan.invitedUsers.find(user => user._id === this.props.currentUser._id) ?
                        <div>
                            <Row className="justify-content-center">
                                <h3><Link to={`/plans/${this.props.plan._id}`}>{this.props.plan.title}</Link></h3>
                                <Moment calendar={calendarStrings}>{this.props.plan.date}</Moment>
                            </Row>
                            <Row className="justify-content-center">
                                <p>planned by {this.props.plan.creator.username}</p>
                                <InviteFriendsModal />
                                <Link to={this.props.match.url + "/stops/new"}><Button>Add a stop</Button></Link>
                            </Row>
                            <StopsContainer stops={this.props.plan.stops} 
                                            addStopToTrip={this.addStopToTrip}
                                            plan={this.props.plan}
                                            />
                        </div> 
                        :
                        //This part is for if they're not invited or joining this plan- probably a 404 would be best
                        <h4>Get out of here party crasher!</h4>
                :
                    //This is for if the data hasn't loaded yet
                    <img src="/images/loading-spinner.gif" alt="waiting..."></img>
                }
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        plan: state.plan.currentPlan,
        currentUser: state.auth.currentUser
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getPlan: (planId) => { return getPlan(dispatch, planId) },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ShowPlan);