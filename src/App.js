import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import {AppBar,FormControl,Select,MenuItem,InputLabel} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Search from './components/SearchBox.js';
import WeatherCard from './components/WeatherCard.js';
import WeatherCardPopup from './components/WeatherCardPopup.js';
import axios from 'axios';
import "./styles.css";
import app from './app.config';

const WEATHER_API = app.OPEN_WEATHER_API_KEY;
class App extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            cardCollection:[],
            metric:"metric",
            popupData:{visible:false,data:undefined}
        };
        
        this.onSearchChange = this.onSearchChange.bind(this)
        this.removeCard = this.removeCard.bind(this)
        this.handleMetricChange = this.handleMetricChange.bind(this)
        this.refreshCards = this.refreshCards.bind(this)
        this.setAppState = this.setAppState.bind(this)
        this.openPopup = this.openPopup.bind(this)

        if (localStorage.getItem('cardState')!==undefined && localStorage.getItem('cardState')!==null){
          var state = JSON.parse(localStorage.getItem('cardState'))
          this.state={cardCollection:state.cardCollection,metric:state.metric,
            popupData:{visible:false,data:undefined}};
        }
        else // If page is loaded for first time, show New York and Tokyo by default
        {
            this.onSearchChange({latitude: 35.689499,longitude: 139.691711});            
            this.onSearchChange({latitude: 40.714272,longitude: -74.005966});
        }
    }

    openPopup(event,isOpen){
      var data;
      if (isOpen===undefined)
      {
        isOpen=true;
        var clickedCard = event.currentTarget.id.toString().slice(0,-4);
        data = this.state.cardCollection.filter(card=>card.cardID===clickedCard)[0].data;
      } 
      if (isOpen ===false)
        data= this.state.popupData.data;
      this.setState({popupData:{visible:isOpen,data:data}})
    }

    //If existing components are restored from localstorage, Update their data
    componentDidMount() {
      let cards = []
      this.state.cardCollection.map(x=>cards.push({cardID:x.cardID,cityData:x.data}));
      this.refreshCards(cards,this.state.metric);
    }

    setAppState(cardCollection,actualMetric){
      if (actualMetric===undefined)
        actualMetric = this.state.metric
      this.setState({cardCollection:cardCollection,metric:actualMetric})
      localStorage.setItem('cardState',JSON.stringify({cardCollection:cardCollection,metric:actualMetric}))
      //console.log(JSON.parse(localStorage.getItem('cardState')))
    }

    handleMetricChange(event){
      let cards = []
      this.state.cardCollection.map(x=>cards.push({cardID:x.cardID,cityData:x.data}));
      this.refreshCards(cards,event.target.value);
    };


    refreshCards(cards,metric){      
      var tempCardCollection = this.state.cardCollection;
      var actualMetric = metric===undefined?this.state.metric:metric;
      //console.log(cards)

      Promise.all(
        cards.map(card=>{
          return new Promise(function (resolve, reject) {
            axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${card.cityData.coord.lat}&lon=${card.cityData.coord.lon}&units=${actualMetric}&appid=${WEATHER_API}`)
            .then(response => {
                console.log(`Weather API called for ${response.data.name}`);
                resolve({cardID:card.cardID,data:response.data});
              }
            )}
          )
        })
      ).then(results=>{
        tempCardCollection.forEach(card=>{
          results.forEach(result =>{
            if(card.cardID===result.cardID)
            {
              card.data=result.data              
            }
          })
        })
        this.setAppState(tempCardCollection,actualMetric)
      });

    }

    removeCard(cardID){
        var tempCardCollection = this.state.cardCollection.filter(x=>x.cardID!==cardID);
        if (tempCardCollection.length === this.state.cardCollection.length-1)
          console.log(`Card ID# ${cardID} removal successful.`);
        this.setAppState(tempCardCollection)
    }

    getUniqueID(){
        function chr4(){
          return Math.random().toString(16).slice(-4);
        }
        return Date.now().toString(36) +chr4() + chr4() +
          '-' + chr4() +
          '-' + chr4() +
          '-' + chr4() +
          '-' + chr4() + chr4() + chr4();
      }

    onSearchChange(data){
        if (data?.latitude !== undefined && data?.longitude !== undefined){
            axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${data.latitude}&lon=${data.longitude}&units=${this.state.metric}&appid=${WEATHER_API}`)
            .then(response => {
                console.log(`Weather API called for ${response.data.name}`);
                var cardID = this.getUniqueID();
                var tempCardCollection = [...this.state.cardCollection]
                tempCardCollection.unshift({cardID:cardID,data:response.data})
                this.setAppState(tempCardCollection)
            }
            )
        }
    }

    render(){
        return(
        <div>
        <AppBar position="fixed" className="app-bar" >
            <Toolbar>
            <Typography variant="h6"  noWrap>
                Weather Watch
            </Typography>
            </Toolbar>
      </AppBar>
      <main className="main">
        <Toolbar />
        <br/>
        <div className="search">
          <Search onSearchChange={this.onSearchChange}/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <FormControl variant="outlined">
            <InputLabel id="lblMetric">Metric</InputLabel>
            <Select
              labelId="lblMetric"
              id="selectMetric"
              onChange={this.handleMetricChange}
              value={this.state.metric}
              label="Metric"
            >
              <MenuItem value="metric">Celsius (°C)</MenuItem>
              <MenuItem value="imperial">Fahrenheit (°F)</MenuItem>
            </Select>
          </FormControl>
        </div>
        <br/>
        <WeatherCardPopup open={this.state.popupData.visible} closePopup={this.openPopup} data={this.state.popupData.data}/>
        <div>
            {this.state.cardCollection.map((card) => {
                return (
                  <div key={`${card.cardID}_div`} id={`${card.cardID}_div`} onClick={this.openPopup} className="weather" >
                        <WeatherCard ID={`${card.cardID}`} data={card.data} 
                          refreshCards={this.refreshCards} removeCard={this.removeCard} metric={this.state.metric}/>
                    </div>
                )})}
        </div>
      </main>
    </div>
        )
    }
};

export default App;