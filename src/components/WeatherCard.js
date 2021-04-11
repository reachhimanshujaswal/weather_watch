import React,{useEffect} from 'react';
import {Card,CardContent,CardMedia,IconButton} from '@material-ui/core';
import SyncIcon from '@material-ui/icons/Sync';
import CancelIcon from '@material-ui/icons/Cancel';
import './../styles.css'
import app from './../app.config'

function WeatherCard(props) {
    console.log(`Card rendered for ${props.data.id} - ${props.data.name} - ${props.ID}`);
    const refreshData = (e)=>{
        props.refreshCards([{cardID:props.ID,cityData:props.data}]);
        if (e!==undefined)
            e.stopPropagation()
    }

    const deleteCard = (e) => {
        props.removeCard(props.ID);
        if (e!==undefined)
            e.stopPropagation()
    }

    useEffect(() => {
        const interval = setInterval(() => {
          refreshData();
        }, app.REFRESH_RATE);
        return () => {
          clearInterval(interval);
        }
      }, []);

    return(
        <Card className="card">
            
            <div className="card-left">
            <CardContent>
            <p className="card-left-main">
                {props.data.name}
                <IconButton aria-label="Update" onClick={refreshData}>
                    <SyncIcon htmlColor="white"/>
                </IconButton>
            </p>
                {new Date((new Date().getTime())+props.data.timezone*1000).toDateString()} &nbsp;&nbsp;
                {new Date((new Date().getTime())+props.data.timezone*1000).toISOString().match(/\d\d:\d\d/)[0]}
            <br/><br/>                
            <p className="card-left-main">
                { props.data.main.temp.length===0?"":`${props.data.main.temp}°`}
            </p>
            
            { props.data.main.feels_like.length===0?"":`Feels like ${props.data.main.feels_like}°`} 
            </CardContent>
            </div>
            <div className="card-right">
            <div className="icon-button-div">
            <IconButton className="icon-button" aria-label="Delete" onClick={deleteCard}>
                <CancelIcon htmlColor="gray"/>
            </IconButton>
            </div> 
            <CardMedia component="img" className="img-weather"
              image={`${app.IMAGE_URL}${props.data.weather[0].icon}.png`}
            />
            </div>
        </Card>
    );
}

export default React.memo(WeatherCard);