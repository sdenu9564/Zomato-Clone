import React from 'react';
import '../Styles/filter.css';
import queryString from 'query-string';
import axios from 'axios';

class Filter extends React.Component {
    constructor(){
        super();
        this.state ={
            restaurant:[],
            mealtype:undefined,
            location:undefined,
            Cuisine:[],
            lcost:undefined,
            hcost:undefined,
            sort:undefined,
            page:undefined,
            pageCount:[],
            locations:[]
        }
    }
    handleClick = (rsId) => {
        this.props.history.push(`/details/?restaurant=${rsId}`);
    }
    /*only filter page*/
    componentDidMount(){
        const qs=queryString.parse(this.props.location.search);
        const {mealtype,area}=qs;
        const{page,sort,pageCount}=this.state;
        axios({
            method:'POST',
            url:'http://localhost:9564/filter',
            headers:{'content-type':'application/json'},
            data:{
                mealtype: mealtype,
                location: area,
                sort:sort,
                page:page,
                pageCount:pageCount
            }

        }).then(res=>{
            this.setState({
                restaurant:res.data.restaurants,
                mealtype:mealtype,
                pageCount:res.data.pageCount,
                location: area
                

            })

        }).catch(err=>{console.log(err)})


        axios({
            method: 'GET',
            url: 'http://localhost:9564/locations',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => this.setState({ locations: res.data.locations }))
            .catch(err => console.log(err))
    }


    handleLocationChange = (event) => {
        const location=event.target.value;
        const { Cuisine, mealtype, hcost, lcost, page, sort,pageCount } = this.state;

        axios({
            method: 'POST',
            url: 'http://localhost:9564/filter',
            headers: { 'Content-Type': 'application/json' },
            data:{
                sort:sort,
                mealtype: mealtype,
                lcost:lcost,
                hcost:hcost,
                page:page,
                Cuisine:Cuisine==0?undefined:Cuisine,
                location:location,
                pageCount:pageCount
                
               
            }
             
        })
            .then(res => this.setState({ restaurant:res.data.restaurants,location: location }))
            .catch(err => console.log(err))
    }

   

    /* sort function need to pass mealtype,area and also location */

    handleSortChange=(sort)=>{
        const{mealtype,location,Cuisine,lcost,hcost,page,pageCount}=this.state;
        axios({
            method:'POST',
            url:'http://localhost:9564/filter',
            headers:{'content-type':'application/json'},
            data:{
                sort:sort,
                mealtype: mealtype,
                location: location,
                lcost:lcost,
                hcost:hcost,
                page:page,
                Cuisine:Cuisine==0?undefined:Cuisine,
                pageCount:pageCount
                
                
               
            }

        }).then(res=>{
            this.setState({restaurant:res.data.restaurants,sort:sort})

        }).catch(err=>{console.log(err)})
    }
    /* lcost and hcost  */

    handlecostchange=(lcost,hcost)=>{
        const{mealtype,location,sort,page,Cuisine,pageCount}=this.state;
        axios({
            method:'POST',
            url:'http://localhost:9564/filter',
            headers:{'content-type':'application/json'},
            data:{
                sort:sort,
                mealtype: mealtype,
                location: location,
                lcost:lcost,
                hcost:hcost,
                page:page,
                Cuisine:Cuisine==0?undefined:Cuisine,
                pageCount:pageCount
               
            }

        }).then(res=>{
            this.setState({restaurant:res.data.restaurants,lcost:lcost,hcost:hcost})

        }).catch(err=>{console.log(err)})

    }
    /*cuisine change */

    handleCuisineChange = (cuisineId) => {

        const{mealtype,location,sort,page,Cuisine,pageCount,lcost,hcost}=this.state;


        
        if (Cuisine.indexOf(cuisineId) == -1) {
            Cuisine.push(cuisineId);
        }
        else {
            var index = Cuisine.indexOf(cuisineId);
            Cuisine.splice(index, 1);
        }
        

        

        axios({
            method: 'POST',
            url: 'http://localhost:9564/filter',
            headers: { 'Content-Type': 'application/json' },
            data:{
                sort:sort,
                mealtype: mealtype,
                location: location,
                lcost:lcost,
                hcost:hcost,
                page:page,
                Cuisine:Cuisine,
                pageCount:pageCount
               
            }
        })
            .then(res => this.setState({ restaurant: res.data.restaurants, pageCount: res.data.pageCount, Cuisine: Cuisine }))
            .catch(err => console.log(err))
    }





    /*  page change */
    pagechange=(page)=>{
        const{mealtype,location,Cuisine,lcost,hcost,sort}=this.state;
        axios({
            method:'POST',
            url:'http://localhost:9564/filter',
            headers:{'content-type':'application/json'},
            data:{
                sort:sort,
                mealtype: mealtype,
                location: location,
                lcost:lcost,
                hcost:hcost,
                page:page,
                Cuisine:Cuisine==0?undefined:Cuisine,
                
               
            }

        }).then(res=>{
            this.setState({restaurant:res.data.restaurants,page:page})

        }).catch(err=>{console.log(err)})
    }
    
   



    render() {
        const{restaurant,locations,pageCount,page}=this.state;
        return (
            <div>

                <div id="myId" className="theheading">MY RESTAURANTS</div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-4 col-md-4 col-lg-4 filter-options">
                            <div className="filter-heading">Filters / Sort</div>
                            <span className="glyphicon glyphicon-chevron-down toggle-span" data-toggle="collapse"
                                data-target="#filter"></span>
                            <div id="filter" className="collapse show" >
                                <div className="Select-Location">Select Location</div>
                                <select className="Rectangle-2236" onChange={this.handleLocationChange}>
                                    <option>Select</option>
                                    {
                                     locations.length!=0?locations.map((item)=>{
                                        return <option value={item.location_id}>{`${item.name} : ${item.city}`}</option>
                                        }):null
                                    }
                                    <option ></option>
                                </select>
                                <div className="Cuisine">Cuisine</div>
                                <div>
                                    <input type="checkbox" onChange={() => this.handleCuisineChange(1)}/>
                                    <span className="checkbox-items">North Indian</span>
                                </div>
                                <div>
                                    <input type="checkbox" onChange={() => this.handleCuisineChange(2)}/>
                                    <span className="checkbox-items">South Indian</span>
                                </div>
                                <div>
                                    <input type="checkbox" onChange={() => this.handleCuisineChange(3)}/>
                                    <span className="checkbox-items">Chineese</span>
                                </div>
                                <div>
                                    <input type="checkbox" onChange={() => this.handleCuisineChange(4)}/>
                                    <span className="checkbox-items">Fast Food</span>
                                </div>
                                <div>
                                    <input type="checkbox" onChange={() => this.handleCuisineChange(5)}/>
                                    <span className="checkbox-items">Street Food</span>
                                </div>
                                <div className="Cuisine">Cost For Two</div>
                                <div>
                                    <input type="radio" name="cost" onChange={()=>{this.handlecostchange(1,500)}}/>
                                    <span className="checkbox-items">Less than &#8377; 500</span>
                                </div>
                                <div>
                                    <input type="radio" name="cost" onChange={()=>{this.handlecostchange(500,1000)}}/>
                                    <span className="checkbox-items">&#8377; 500 to &#8377; 1000</span>
                                </div>
                                <div>
                                    <input type="radio" name="cost" onChange={()=>{this.handlecostchange(1000,1500)}}/>
                                    <span className="checkbox-items">&#8377; 1000 to &#8377; 1500</span>
                                </div>
                                <div>
                                    <input type="radio" name="cost"  onChange={()=>{this.handlecostchange(1500,2000)}}/>
                                    <span className="checkbox-items">&#8377; 1500 to &#8377; 2000</span>
                                </div>
                                <div>
                                    <input type="radio" name="cost"  onChange={()=>{this.handlecostchange(1,110000)}}/>
                                    <span className="checkbox-items">&#8377; All</span>
                                </div>
                                <div className="Cuisine">Sort</div>
                                <div>
                                    <input type="radio" name="sort" onChange={() => { this.handleSortChange(1) }}  />
                                    <span className="checkbox-items">Price low to high</span>
                                </div>
                                <div>
                                    <input type="radio" name="sort" onChange={() => { this.handleSortChange(-1) }} />
                                    <span className="checkbox-items">Price high to low</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-8 col-md-8 col-lg-8">
                            {restaurant.length !=0?restaurant.map((item)=>{
                                return  <div className="Item" onClick={()=>{this.handleClick(item._id)}}>
                                <div>
                                    <div className="small-item vertical">
                                        <img className="img" src={`../${item.image}`} />
                                    </div>
                                    <div className="big-item">
                                        <div className="rest-name">{item.name}</div>
                                        <div className="rest-location">{item.locality}</div>
                                        <div className="rest-address">{item.address}</div>
                                    </div>
                                </div>
                                <hr />
                                <div>
                                    <div className="margin-left">
                                        <div className="Bakery">CUISINES : {item && item.Cuisine?item.Cuisine.map(i=>{return `${i.name} || `}):null}</div>
                                        <div className="Bakery">TOTAL COST : &#8377; {item.cost}</div>
                                    </div>
                                </div>
                            </div>
                            }):<div><h1 className="coming">Restaurants coming soon</h1></div>}

                             <div className="pagination">
                                <a href="#" onClick={()=>{this.pagechange(page--)}}>&laquo;</a>
                                {/* {restaurant.length!=0?restaurant.map((i)=>{
                                    return<a href="#"style={{height:"40px"}}>{restaurant.page}</a>
                                }):null} */}
                                
                                {/* <a href="#"style={{height:"40px"}}>{restaurant.page}</a> */}
                                <a href="#"onClick={()=>{this.pagechange(page++)}}>&raquo;</a>
    
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Filter;

/* 3 phases in lifecycle -

1. Mounting Phase - rendered for 1st time
2. Update Phase - only starts when the end user interacts with the application
3. UnMounting Phase - removed from the DOM

Mounting -

1. Constructor - to Initialize the state valriables
2. getDerivedStateFromProps - to derive the state from props
2. render - render anything to browser
3. componentDidMount  - API Calls on load of component

setState

Update -

1. getDerivedStateFromProps - to derive the state from props
2. shouldComponentUpdate
1. render
4. componentDidUpdate - logic after the update

UnMounting -

1. componentWillUnmount

className Component - State, LifeCycle
Functional - State, LifeCycle doesn't work


Components
Props
State
LifeCycle

*/
