import React from 'react';
import '../Styles/Home.css';

class Wallpaper extends React.Component{
    handleChange = (event) => {
        const locationId = event.target.value;
        sessionStorage.setItem('locationId', locationId);
    }

    render(){
        const{locations}=this.props;
        return(
            <div>
                <img src="./assets/homepageimg.png" height="450" width="100%" margin="auto" />
             <div className="logo">
                 <b>$</b>
             </div>
             <div className="heading">find the best resturant cafes and bars</div>
                <div className="locationselectors">
                    <select className="locationdropdown" onChange={this.handleChange}>
                        <option value="0">plaese select a city</option>
                            {
                                locations.map((item)=>{
                                    return <option value={item.location_id}>{`${item.name} : ${item.city}`}</option>
                                })
                            }
                    </select>
                    <input className="resturantsinput" type="text" placeholder="search a resturant"/>
                </div>
        </div>

        )
    }
}


export default Wallpaper;
