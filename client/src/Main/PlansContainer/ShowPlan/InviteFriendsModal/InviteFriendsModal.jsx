import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { inviteUserToPlan } from '../../../../actions/actions';

class InviteFriendsModal extends Component{
    constructor(){
        super();
        this.state = {
            modal: false
        }
    }
    toggle = () => {
        this.setState({
          modal: !this.state.modal
        });
    }
    render(){
        const inviteButtons = this.props.friends.map((friend)=>{
            if(!this.props.plan.joiners.find(user=>user._id === friend._id)){
                return <Button key={friend._id} onClick={this.props.inviteUserToPlan.bind(null, friend._id, this.props.plan._id)}>
                Invite {friend.displayName}
                </Button>
            }else{
                return null;
            }
        })
        return(
            <div>
                <Button color="success" onClick={this.toggle}>Invite Friends</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                <ModalHeader toggle={this.toggle}>Invite friends to {this.props.plan.title}</ModalHeader>
                <ModalBody>
                    {inviteButtons}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.toggle}>Done</Button>
                </ModalFooter>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
      friends: state.auth.currentUser.friends,
      plan: state.plan.currentPlan
    }
  };
const mapDispatchToProps = (dispatch) => {
    return {
        inviteUserToPlan: (userId, planId) => { inviteUserToPlan(dispatch, userId, planId)}
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(InviteFriendsModal);