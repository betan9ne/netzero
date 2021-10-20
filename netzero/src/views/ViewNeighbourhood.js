import React from 'react'

const ViewNeighbourhood = props => {
    let data = props.location.state
    return (
        <div>
           {data.neighbourhood}
        </div>
    )
}

export default ViewNeighbourhood
