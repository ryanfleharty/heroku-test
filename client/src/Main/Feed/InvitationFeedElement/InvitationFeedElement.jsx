import React from 'react';
import {Link} from 'react-router-dom';
import {Button} from 'reactstrap';
import { connect } from 'react-redux';
import { acceptInvitationToPlan, declineInvitationToPlan } from '../../../actions/actions';

const InvitationFeedElement = (props) => {
    return(
        <div>
            <p>{props.invitation.inviter.displayName} invites you to 
                <Link to={`/plans/${props.invitation.plan._id}`}>
                    {props.invitation.plan.title}
                </Link>
            </p>
            <Button className="btn-success" onClick={props.acceptInvitationToPlan.bind(null, props.invitation._id)}>
                Accept
            </Button>
            <Button className="btn-danger" onClick={props.declineInvitationToPlan.bind(null, props.invitation._id)}>
                Decline
            </Button>

        </div>
    )
}
const mapStateToProps = (state) => {
    return {
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        acceptInvitationToPlan: (id) => { acceptInvitationToPlan(dispatch, id)},
        declineInvitationToPlan: (id) => { declineInvitationToPlan(dispatch, id)}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InvitationFeedElement);