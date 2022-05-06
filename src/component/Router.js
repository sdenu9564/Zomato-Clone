import React from 'react';
import {Route,BrowserRouter} from 'react-router-dom';
import Filter from './Filter';
import Home from './Home';
import Details from './Details';
import Header from './Headers'



const Router = ()=>{
    return (
        <BrowserRouter>
        <Header/>
        <Route exact path="/" component={Home}/>
        <Route path="/filter" component={Filter}/>
        <Route path="/details" component={Details}/>

        </BrowserRouter>
    )
}



export default Router;
