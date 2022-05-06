import React from 'react';
import '../Styles/Home.css';
import Quicksearchitem from './quicksearchitem';

class Quicksearch extends React.Component{
    render(){
        const{ quicksearches}=this.props;
        return(
            <div>

                <div className="quicksearch">
                    <p className="quicksearchHeading">
                        Quick Searches
                    </p>
                    <p className="quicksearchSubHeading">
                        Discover restaurants by type of meal
                    </p>
                    {
                         quicksearches.map((item)=>{
                            return  <Quicksearchitem item={item}/>
                        })
                    }
                    
                   
                </div>
        </div>

        )
    }
}


export default Quicksearch;
