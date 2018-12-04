import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
import InvitationFeedElement from '../../Feed/InvitationFeedElement/InvitationFeedElement';

const PlansIndex = (props) => {
    const plans = props.plans.map((plan)=>{
        return (
            <div key={plan._id}>
                <h2>{plan.title}</h2>
                <p>{plan.date}</p>
                <Link to={"/plans/"+plan._id}>View</Link>
            </div>
        )
    })
    const invitations = props.currentUser.invitations.map((invitation)=>{
        return <InvitationFeedElement invitation={invitation} key={invitation._id} />
    })
    return(
        <div>
            <p>You have been invited on {props.currentUser.invitations.length} plans.</p>
            {invitations}
            <h1>Here are all your current plans</h1>
            {plans}
        </div>
    )
}
const mapStateToProps = (state) => {
    return {
      plans: state.auth.currentUser.plans,
      currentUser: state.auth.currentUser
    }
  };
const mapDispatchToProps = (dispatch) => {
    return {
        
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PlansIndex));