import React from 'react';
import '../Styles/Home.css';
import {withRouter} from 'react-router-dom';



class Quicksearchitem extends React.Component{
    handleClick = (mealTypeId) => {
        const locationId = sessionStorage.getItem('locationId');
        if (locationId) {
            this.props.history.push(`/filter/?mealtype=${mealTypeId}&area=${locationId}`);
        }
        else {
            this.props.history.push(`/filter/?mealtype=${mealTypeId}`);
        }
    }
    render(){
        const {item}=this.props;
        return(
            <div className="tileContainer" onClick={()=>this.handleClick(item.meal_type)}>
                            <div className="tileComponent1">
                                <img src={item.image} height="150" width="140" />
                            </div>
                            <div className="tileComponent2">
                                <div className="componentHeading">
                                    {item.name}
                                </div>
                                <div className="componentSubHeading">
                                    {item.content}
                                </div>
                            </div>
                        </div>
        )
    }
}
export default withRouter(Quicksearchitem);