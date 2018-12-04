import {FETCH_CSRF_TOKEN, ACCEPT_INVITATION_TO_PLAN, DECLINE_INVITATION_TO_PLAN} from './actionTypes';
import {SET_USER_DATA} from './actionTypes';
import {LOGOUT} from './actionTypes';
import {ADD_FRIEND, REQUEST_FRIEND} from './actionTypes';
import {DATA_LOADED} from './actionTypes';
import {GET_FRIEND_REQUESTS} from './actionTypes';

export const fetchCsrfTokenAction = async (dispatch) => {
    const token = await fetch(`${process.env.REACT_APP_API_HOST}/api/v1/auth/get-csrf-token/`, {
        credentials: 'include'
    })
    const parsedToken = await token.json()
    dispatch({
        type: FETCH_CSRF_TOKEN,
        payload: parsedToken.data.token
    });
};

export const checkForUserAction = async (dispatch) => {
    const user = await fetch(`${process.env.REACT_APP_API_HOST}/api/v1/auth/user`, {
        credentials: 'include'
    })
    const userData = await user.json();
    if(userData.status === 400){
        dispatch({
            type: DATA_LOADED,
            payload: {}
        })
    } else {
        dispatch({
            type: SET_USER_DATA,
            payload: userData.data
        })
    }
}

export const loginAction = async (dispatch, formData) => {
    console.log(process.env.REACT_APP_API_HOST);
    console.log("HERES THE API LINK")
    const validLogin = await fetch(`${process.env.REACT_APP_API_HOST}/api/v1/auth/login`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({...formData}),
        headers:{
          'Content-Type': 'application/json'
        }
    })
    const parsedResponse = await validLogin.json()
    if(parsedResponse.status === 200){
        await checkForUserAction(dispatch);
        return true;
    } else {
        return false;
    }
}
export const googleLoginAction = async(dispatch, data) => {
    checkForUserAction(dispatch);
}

export const logOutAction = async (dispatch) => {
    await fetch(`${process.env.REACT_APP_API_HOST}/api/v1/auth/logout`, {
      method: "POST",
      credentials: "include"
    })
    dispatch({
        type: LOGOUT
    })
}
export const getFriendRequests = async (dispatch) => {
    const friendRequests = await fetch(`${process.env.REACT_APP_API_HOST}/api/v1/users/friend-requests`, {
        method: "GET",
        credentials: 'include'
    });
    const parsedRequests = await friendRequests.json();
    dispatch({
        type: GET_FRIEND_REQUESTS,
        payload: parsedRequests.data
    })
}
export const addFriend = async (dispatch, id) => {
    const friendship = await fetch(`${process.env.REACT_APP_API_HOST}/api/v1/users/${id}/add-friend`, {
        method: "POST",
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const parsed = await friendship.json();
    dispatch({
        type: ADD_FRIEND,
        payload: parsed.data.user
    })
}
export const requestFriend = async (dispatch, id) => {
    const friendship = await fetch(`${process.env.REACT_APP_API_HOST}/api/v1/users/${id}/request-friend`, {
        method: "POST",
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const parsed = await friendship.json();
    if(parsed.status === 200){
        dispatch({
            type: REQUEST_FRIEND,
            payload: parsed.data
        })
    }
}

export const acceptInvitationToPlan = async (dispatch, invitationId) => {
    const accepted = await fetch(`${process.env.REACT_APP_API_HOST}/api/v1/invitations/${invitationId}/accept`, {
      method: "POST",
      credentials: "include"
    })
    const parsedResponse = await accepted.json();
    if(parsedResponse.status === 200){
      dispatch({
          type: ACCEPT_INVITATION_TO_PLAN,
          payload: parsedResponse.data.plan
      })
    }
}

export const declineInvitationToPlan = async (dispatch, invitationId) => {
    const accepted = await fetch(`${process.env.REACT_APP_API_HOST}/api/v1/invitations/${invitationId}/decline`, {
      method: "POST",
      credentials: "include"
    })
    const parsedResponse = await accepted.json();
    if(parsedResponse.status === 200){
      dispatch({
          type: DECLINE_INVITATION_TO_PLAN,
          payload: parsedResponse.data.plan
      })
    }
}

export const getPlan = async (dispatch, planId) => {
    const plan = await fetch(`${process.env.REACT_APP_API_HOST}/api/v1/plans/${planId}`, {
        credentials: 'include',
        method: "GET"
    })
    const parsedPlan = await plan.json();
    return dispatch({
        type: "GET_PLAN",
        payload: parsedPlan.data
    })
}

export const inviteUserToPlan = async (dispatch, userId, planId) => {
    const invitation = await fetch(`${process.env.REACT_APP_API_HOST}/api/v1/invitations`, {
        credentials: 'include',
        method: "POST",
        body: JSON.stringify({
            planId: planId,
            userId: userId
        }),
        headers: {
            "Content-Type": 'application/json'
        }
    })
    const parsedInvitation = await invitation.json();
    dispatch({
        type: "INVITE_USER_TO_PLAN",
        payload: parsedInvitation.data.invitation
    })
}

export const addStopToPlan = async(dispatch, stop, planId) => {
    let url = `${process.env.REACT_APP_API_HOST}/api/v1/plans/${planId}/stops`;
    const response = await fetch(url, {
        method: "POST",
        credentials: 'include',
        body: JSON.stringify(stop),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const parsedResponse = await response.json();
    dispatch({
        type: "ADD_STOP_TO_PLAN",
        payload: parsedResponse.data
    })
}

export const addLocationToStop = async(dispatch, location) => {
    dispatch({
        type: "ADD_LOCATION_TO_STOP",
        payload: location
    })
}

export const searchForLocationsForPlan = async(dispatch, searchForm, planId) => {
    console.log("SEARCHING FOR LOCATIONS");
    let requestUrl = `${process.env.REACT_APP_API_HOST}/api/v1/plans/${planId}/stops/search?query=${searchForm.query}&location=${searchForm.location}`
    const locations = await fetch(requestUrl, {
        method: "GET",
        credentials: 'include'
    })
    let parsedLocations = await locations.json();
    console.log(parsedLocations)
    if(parsedLocations.status === 200){
        dispatch({
            type: "SET_LOCATION_SEARCH_RESULTS",
            payload: parsedLocations.data.locations
        })
    } else {
        console.log("BAD STUFF");
    }
}