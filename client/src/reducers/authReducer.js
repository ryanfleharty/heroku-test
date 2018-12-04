const initialState = {
    csrf_token: '',
    dataLoaded: false,
    currentUser: {
        loggedIn: false,
        displayName: '',
        username: '',
        _id: '',
        friends: [],
        plans: [],
        invitations: [],
        friendRequests: []
    }
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_CSRF_TOKEN':
            return {
                ...state,
                csrf_token: action.payload
            };
        case 'SET_USER_DATA':
            return {
                ...state,
                dataLoaded: true,
                currentUser: {
                    loggedIn: true,
                    displayName: action.payload.user.displayName,
                    username: action.payload.user.username,
                    _id: action.payload.user._id,
                    friends: action.payload.user.friends,
                    plans: action.payload.plans,
                    invitations: action.payload.invitations,
                    friendRequests: action.payload.friendRequests
                }
            };
        case 'LOGOUT':
            return {
                ...state,
                currentUser: {
                    loggedIn: false
                }
            };
        case 'DATA_LOADED':
            return {
                ...state,
                dataLoaded: true
            }
        case "ADD_FRIEND":
            return{
                ...state,
                currentUser: {
                    ...state.currentUser,
                    friends: [...state.currentUser.friends, action.payload],
                    friendRequests: state.currentUser.friendRequests.filter((friendRequest)=>{return friendRequest.requester._id !== action.payload._id})
                }
            }
        case "GET_FRIEND_REQUESTS":
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    friendRequests: action.payload
                }
            }
        case "REQUEST_FRIEND":
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    friendRequests: [...state.currentUser.friendRequests, action.payload]
                }
            }
        case "ACCEPT_INVITATION_TO_PLAN":
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    plans: [...state.currentUser.plans, action.payload],
                    invitations: state.currentUser.invitations.filter(invite => invite.plan._id !== action.payload._id)
                }
            }
        case "DECLINE_INVITATION_TO_PLAN":
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    invitations: state.currentUser.invitations.filter(invite => invite.plan._id !== action.payload._id)
                }
        }
        default:
            return state;
    }
};

export default authReducer;