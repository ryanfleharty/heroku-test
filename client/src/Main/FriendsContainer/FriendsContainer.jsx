import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getFriendRequests, addFriend, requestFriend } from '../../actions/actions';

class FriendsContainer extends Component {
    constructor(){
        super();
        this.state = {
            searchForm: {
                query: ""
            },
            searchResults: [],
            loaded: false
        };
    }
    componentDidMount(){
        this.props.getFriendRequests();
    }
    handleChange = (e) => {
        this.setState({
            searchForm: {
                ...this.state.searchForm,
                [e.currentTarget.name] : e.currentTarget.value
            }
        });
    }
    searchForFriends = async (e) => {
        e.preventDefault();
        const results = await fetch(`${process.env.REACT_APP_API_HOST}/api/v1/users?query=${this.state.searchForm.query}&friends=new`, {
            method: "GET",
            credentials: 'include'
        })
        const parsedResults = await results.json();
        this.setState({
            searchResults: parsedResults.data
        })
    }
    render(){
        const searchResults = this.state.searchResults
        .map((user)=>{
            return(
                <div key={user._id}>
                    <h2>{user.username}</h2>
                    {
                        this.props.currentUser.friendRequests.find((friendRequest)=>{
                            return friendRequest.requested._id === user._id
                        }) ? <p>{user.username} has been requested</p>
                            :
                            this.props.currentUser.friends.find((friend)=>{
                            return friend._id === user._id
                            }) ? <p>{user.username} is already your friend</p>
                            :
                            this.props.currentUser.friendRequests.find((friendRequest)=>{
                                return friendRequest.requester._id === user._id
                            }) ? <Button onClick={this.props.addFriend.bind(null, user._id)}>
                                    Accept the friend request of {user.displayName}
                                </Button>
                            :
                            <Button onClick={this.props.requestFriend.bind(null, user._id)}>
                            Request as a friend
                            </Button>
                    }

                </div>
            )
        })
        const currentFriends = this.props.currentUser.friends.map((friend)=>{
            return(
                <li key={friend._id}>{friend.displayName}</li>
            )
        })
        const friendRequests = this.props.currentUser.friendRequests
        .filter((friendRequest)=>{return friendRequest.requester._id !== this.props.currentUser._id})
        .map((friendRequest)=>{
            return(
            <div key={friendRequest._id}>
                <Button onClick={this.props.addFriend.bind(null, friendRequest.requester._id)}>
                    Be friends with {friendRequest.requester.displayName}
                </Button>
            </div>)
        })
        return(
            <div>
                { friendRequests.length > 0 ?
                <div>
                    <h3>The following users have requested your friendship</h3>
                    {friendRequests}
                </div>
                 :
                null }
                { currentFriends.length > 0 ?
                <div>
                    <h6>You are friends with:</h6>
                    {currentFriends}
                </div>
                :
                null            
                }
                <h3>Find some new friends</h3>
                <form onSubmit={this.searchForFriends}>
                    <label htmlFor="query">Search:</label>
                    <input type="text" name="query" onChange={this.handleChange}/>
                    <input type="submit"/>
                </form>
                {searchResults}
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
      csrfToken: state.auth.csrfToken,
      currentUser: state.auth.currentUser,
    }
};
const mapDispatchToProps = (dispatch) => {
    return{
        getFriendRequests: () => { getFriendRequests(dispatch)},
        addFriend: (id) => { addFriend(dispatch, id)},
        requestFriend: (id) => { requestFriend(dispatch, id)}
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FriendsContainer));