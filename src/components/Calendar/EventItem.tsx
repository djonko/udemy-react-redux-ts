import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteUserEvent, updateUserEvent, UserEvent } from "../../redux/user-events";

interface Props {
    event: UserEvent
}

const EventItem: React.FC<Props> = ({ event }) => {

    const refInput = useRef<HTMLInputElement>(null);
    const [editable, setEditable] = useState<boolean>(false);

    const handleTitleClick = () => {
        setEditable(true);
    }

    useEffect
        (
            () => {
                if (editable) {
                    refInput.current?.focus();
                }
                return () => {
                    // clean section
                }
            }, [editable]
        );

    const dispatch = useDispatch();
    const handleDeleteClick = () => {
        dispatch(deleteUserEvent(event.id))
    }

    const [title, setTitle] = useState<string>(event.title);
    const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }

    const handleBlur = () => {
        if (title !== event.title) {
            const updatedEvent: UserEvent = { ...event, title: title }
            dispatch(updateUserEvent(updatedEvent))
        }
        setEditable(false)


    }
    return (
        <div key={event.id} className="calendar-event">
            <div className="calendar-event-info">
                <div className="calendar-event-time">10:00 - 12:00</div>
                <div className="calendar-event-title">
                    {editable ?
                        (<input type="text" ref={refInput} onChange={handleChangeTitle} value={title} onBlur={handleBlur} />) :
                        (<span onClick={handleTitleClick}>{event.title}</span>)
                    }
                </div>
            </div>
            <button className="calendar-event-delete-button" onClick={handleDeleteClick}>&times;</button>
        </div>
    )
}
export default EventItem