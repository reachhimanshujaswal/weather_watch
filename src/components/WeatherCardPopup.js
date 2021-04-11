import React from 'react';
import {Modal,Backdrop,Grow} from '@material-ui/core';
import './../styles.css';

function WeatherCardPopup(props) {
    const handleClose = () => {
        props.closePopup(null,false);
      };
      
    return(
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className="card-popup-modal"
            open={props.open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
            timeout: 500
            }}
        >
            <Grow in={props.open}
            {...(props.open ? { timeout: 500 } : {})}>
            <div className="popup-main">
                <div className="popup-left">
                <p className="popup-left-primary">
                    {`${props.data?.main?.temp}°`}
                </p><br/>
                <p className="popup-left-secondary">{props.data?.name}</p>
                </div>
                <div className="popup-right">
                <p>{`Location: ${props.data?.coord?.lat}°N ${props.data?.coord?.lon}°E`}
                <br/>
                {`Weather: ${props.data?.weather[0]?.main}`}
                <br/>
                {`Cloudiness: ${props.data?.clouds?.all}%`}
                <br/><br/>
                {`Feels like: ${props.data?.main?.feels_like}°`}
                <br/>
                {`Min/Max Temerature: ${props.data?.main?.temp_min}° / ${props.data?.main?.temp_max}°`}
                <br/><br/>
                {`Humidity: ${props.data?.main?.humidity}%`}
                <br/>
                {`Pressure: ${props.data?.main?.pressure} hPa`}
                <br/>
                {`Wind (Speed/Direction): ${props.data?.wind?.speed} / ${props.data?.wind?.deg}°`}
                </p>
                </div>
            </div>
            </Grow>
        </Modal>
    )
}
export default WeatherCardPopup;