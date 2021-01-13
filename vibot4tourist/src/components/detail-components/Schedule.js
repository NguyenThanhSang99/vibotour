import React, { Component } from 'react';
import '../../styles/detail-css/Schedule.css';
import '../../styles/Detail.css'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


class Schedule extends Component {
    
    constructor(props) {
        super(props);
        this.state = ({
            id: this.props.tourId,
            tours: []
        })
    }

    // GET DATE SCHEDULE
    async getDataSchedule(tour_id) {
        return (
            fetch(process.env.SERVER+"/tourDetail", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ tour_id }),
            })
                .then((res) => res.json())
                .then((result) => {
                    if (!result) {
                        //todo
                    } else {
                        return result
                    }
                })
                .catch((error) => console.log(error))
        )
    }

    componentDidMount() {
        console.log("did mount")
        this.getDataSchedule(this.state.id)
        .then((result) => {
            this.setState({tours: result})},
        )
        
    }

    onDragEnd = (result) => {

        const { destination, source, reason } = result;
        // Not a thing to do...
        if (!destination || reason === 'CANCEL') {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const tours = Object.assign([], this.state.tours);
        const droppedUser = this.state.tours[source.index];
        tours.splice(source.index, 1);
        tours.splice(destination.index, 0, droppedUser);
        this.setState({ tours });
    }

    renderTour = (item, index) => {

        return <Draggable
            key={index}
            draggableId={index + ' '}
            index={index}>

            {(provided) => (

                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div className='item input100'>
                        <div>{index + 1}</div>

                        <div className='name'>
                            <div>Place: {item.tourist_attraction_name}</div>
                            <div>Time: {`${item.number_day} days - ${item.number_night} nights`}</div>
                            <div>Detail: {item.description}</div>
                        </div>

                    </div>
                </div>
            )}
        </Draggable>
    }

    render() {

        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <div className='container '>
                    <div className='users wrap-input100 validate-input bg1"'>
                        <span className=".label-input100">Schedule</span>

                        <Droppable droppableId="dp1">
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                    {
                                        this.state.tours.map(this.renderTour)
                                    }
                                    {provided.placeholder}
                                </div>
                            )}

                        </Droppable>


                    </div>

                </div>
            </DragDropContext>);
    }
}

export default Schedule;