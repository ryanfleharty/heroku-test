const initialState = {
    currentPlan: {
        creator: {},
        stops: [],
        joiners: [],
        invitedUsers: [],
        invitations: []
    },
    newStop: {
        location: {},
    },
    searchResults: [],
    locationHasBeenSearched: false,
    locationHasBeenChosen: false,
}

const planReducer = (state = initialState, action) => {
    switch(action.type){
        case "GET_PLAN":
            return{
                ...state,
                currentPlan: action.payload
            }
        case "INVITE_USER_TO_PLAN":
            return{
                ...state,
                currentPlan: {
                    ...state.currentPlan,
                    invitedUsers: [...state.currentPlan.invitedUsers, action.payload.invitee]
                }
            }
        case "SET_LOCATION_SEARCH_RESULTS":
            return{
                ...state,
                searchResults: action.payload,
                locationHasBeenSearched: true,
                locationHasBeenChosen: false
            }
        case "ADD_LOCATION_TO_STOP":
            return {
                ...state,
                locationHasBeenChosen: true,
                newStop: {
                    ...state.newStop,
                    "location": action.payload
                }
            }
        case "ADD_STOP_TO_PLAN":
            return {
                ...state,
                currentPlan: {
                    ...state.currentPlan,
                    stops: [...state.currentPlan.stops, action.payload]
                },
                newStop: {
                    location: {},
                },
                searchResults: [],
                locationHasBeenSearched: false,
                locationHasBeenChosen: false,
            }
        default:
            return state;
    }
}

export default planReducer;