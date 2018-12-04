import {combineReducers} from 'redux';
import authReducer from './authReducer';
import planReducer from './planReducer';

const rootReducer = combineReducers({
    auth: authReducer,
    plan: planReducer
});

export default rootReducer;