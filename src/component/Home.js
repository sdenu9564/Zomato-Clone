import React from 'react';
import '../Styles/Home.css';
import Wallpaper from './wallpaper';
import Quicksearch from './quicksearch';
import axios from 'axios';
import Filter from './Filter';

class Home extends React.Component{
    constructor(){
        super();
        this.state={
            locations:[],
            mealTypes:[]
        }
    }
    componentDidMount(){
        sessionStorage.clear();
        axios({
            url:'http://localhost:9564/locations',
            method:'GET',
            headers:{'content-type':'application/json'}
        })
        .then(res=>{
            this.setState({locations:res.data.locations})
        }).catch(err=>console.log(err));

        axios({
            url:'http://localhost:9564/mealtypes',
            method:'GET',
            headers:{'content-type':'application/json'}
        })
        .then(res=>{
            this.setState({mealTypes:res.data.mealTypes})
        }).catch(err=>console.log(err))
    }
    render(){
        const {locations,mealTypes}=this.state;
        return(
           <div>
               <Wallpaper locations={locations}/>
               <Quicksearch quicksearches={mealTypes}/>

           </div>
        )
    }
}


export default Home;
