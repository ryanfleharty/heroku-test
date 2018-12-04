import React from 'react';
import {Link} from 'react-router-dom';
import Moment from 'react-moment';

const PlanFeedElement = (props) => {
    const calendarStrings = {
        lastDay : '[Yesterday at] LT',
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        lastWeek : '[last] dddd [at] LT',
        nextWeek : 'dddd [at] LT',
        sameElse : 'MMMM DD YYYY'
    };
    return (
        <div>
            <Link to={"/plans/"+props.plan._id}>
                <h5>{props.plan.title}</h5>
            </Link>
            <p>{props.plan.joiners.length} people going <Moment calendar={calendarStrings}>{props.plan.date}</Moment></p>
        </div>
    )
}

export default PlanFeedElement;