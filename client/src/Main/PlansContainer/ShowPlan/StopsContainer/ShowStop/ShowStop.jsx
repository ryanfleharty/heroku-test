import React from 'react';
import { withRouter } from 'react-router-dom';

const ShowStop = withRouter((props) => {
    console.log(props)
    return(
        <div>
            <h4>{JSON.stringify(props)}</h4>

        </div>
    )
})

export default ShowStop;