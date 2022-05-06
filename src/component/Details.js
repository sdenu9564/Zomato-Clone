import React from 'react';
import '../Styles/Details.css';
import queryString from 'query-string';
import axios from 'axios';
import Modal from 'react-modal';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '15px',
        backgroundColor: 'white',
        border: 'solid 2px brown',
        zIndex: '50',
        height:'500px'
    }
  };

class Details extends React.Component {
    constructor(){
        super();
        this.state={
            restaurant:{},
            gallerymodalIsOpen:false,
            orderdmodalIsOpen:false,
            reataurantid:undefined,
            detailModelsOpen: false,
            loginModalIsOpen: false,
            menuitems:[],
            Name:undefined,
            Mobile:undefined,
            Address:undefined,
            Email:undefined,
            subtotal:0,
        }
    }
    componentDidMount(){
        const qs=queryString.parse(this.props.location.search);
        const resId=qs.restaurant;

        axios({
            url:`http://localhost:9564/getrestaurantbyid/${resId}`,
            method:'GET',
            headers:{'content-type':'application/json'}
        })
        .then(res=>{
            this.setState({restaurant:res.data.restaurants,reataurantid:resId})
        }).catch(err=>console.log(err))
    }
    handleClick=(state)=>{
        const{reataurantid}=this.state;
        this.setState({[state]:true})
        if(state=='orderdmodalIsOpen'){
            axios({
                url:`http://localhost:9564/getMenuItemsByRestaurant/${reataurantid}`,
                method:'GET',
                headers:{'content-type':'application/json'}
            })
            .then(res=>{
                this.setState({menuitems:res.data.item})
            }).catch(err=>console.log(err))
        }
        

    }
    handlefooditemclose = () => {
        this.setState({ orderdmodalIsOpen: false })
    }
    handledetailsmodeclose=()=>{
        this.setState({detailModelsOpen:false})
    }
    handleClose=(state)=>{
        this.setState({[state]:false})
    }
    addItems = (index, operationType) => {
        let total = 0;
        let items = [...this.state.menuitems];
        let item = { ...items[index] };
        if (operationType == 'add') {
            item.qty = item.qty + 1;
        } else {
            item.qty = item.qty - 1;
        }
        items[index] = item;
        items.map((item) => {
            total += item.qty * item.price;
        })
        this.setState({ menuitems:items, subtotal: total });

    }

    openDetailsWindow = () => {
        this.setState({ detailModelsOpen: true, orderModalIsOpen: false })
    }

    handleinputChange=(event,state)=>{
        this.setState({[state]:event.target.value})
    }

    makePayment = () => {
        const { subtotal,Email } = this.state;
        this.getData({ amount: subtotal, email: Email }).then(response => {
            var information = {
                action: "https://securegw-stage.paytm.in/order/process",
                params: response
            }
            this.post(information)
        })
    }
    post = (details) => {
        const form = this.buildForm(details)
        document.body.appendChild(form)
        form.submit()
        form.remove()
    }
    
    buildForm = ({ action, params }) => {
        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action', action)

        Object.keys(params).forEach(key => {
            const input = document.createElement('input')
            input.setAttribute('type', 'hidden')
            input.setAttribute('name', key)
            input.setAttribute('value', this.stringifyValue(params[key]))
            form.appendChild(input)
        })

        return form
    }


    getData = (data) => {

        return fetch(`http://localhost:9564/payment`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => response.json()).catch(err => console.log(err))
    }
    isDate(val) {
        // Cross realm comptatible
        return Object.prototype.toString.call(val) === '[object Date]'
    }

    isObj = (val) => {
        return typeof val === 'object'
    }

    stringifyValue = (val) => {
        if (this.isObj(val) && !this.isDate(val)) {
            return JSON.stringify(val)
        } else {
            return val
        }
    }




    
    render() {
        const{restaurant,gallerymodalIsOpen,orderdmodalIsOpen,menuitems,subtotal,detailModelsOpen,Name,Mobile,Address,Email}=this.state;
        return (
            <div>
                <div>
                    <img src={`../${restaurant.image}`} alt="No Image, Sorry for the Inconvinience" width="100%" height="350" />
                    <button className="button" onClick={()=>{this.handleClick('gallerymodalIsOpen')}}>Click to see Image Gallery</button>
                </div>
                <div className="Dheading">{restaurant.name}</div>
                <button className="btn-order"onClick={()=>{this.handleClick('orderdmodalIsOpen')}}>Place Online Order</button>

                <div className="tabs">
                    <div className="tab">
                        <input type="radio" id="tab-1" name="tab-group-1" checked />
                        <label for="tab-1">Overview</label>

                        <div className="content" style={{position:"relative"}}>
                            <div className="about">About this place</div>
                            <div className="head">Cuisine</div>
                            <div className="value">{restaurant && restaurant.Cuisine? restaurant.Cuisine.map((item)=>`${item.name} || `):null}</div>
                            <div className="head">Average Cost</div>
                            <div className="value">&#8377; {restaurant.cost} for two people(approx)</div>
                        </div>
                    </div>

                    <div className="tab">
                        <input type="radio" id="tab-2" name="tab-group-1" />
                        <label for="tab-2">Contact</label>

                        <div className="content">
                            <div className="head">Phone Number</div>
                            <div className="value">{restaurant.contact_number}</div>
                            <div className="head">{restaurant.name}</div>
                            <div className="value">{restaurant.address}
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={gallerymodalIsOpen}
                    style={customStyles}
                >
                <div>
                    <div style={{float:'right'}} onClick={()=>{this.handleClose('gallerymodalIsOpen')}}class="glyphicon glyphicon-remove"></div>
                <Carousel showThumbs={false}
                            showIndicators={false}
                            >
                    {restaurant && restaurant.thumb?restaurant.thumb.map((item)=>{
                       return <div>
                        <img src={`../${item}`} />
                    </div>

                    }):null}
                
             </Carousel>
                </div>
            </Modal>
            <Modal
                    isOpen={orderdmodalIsOpen}
                    style={customStyles}
                >
                    <div className="glyphicon glyphicon-remove lose" style={{ float: 'right' }} onClick={this.handlefooditemclose}></div>
                            <div >
                                
                                <h3 className="restaurant-name">{restaurant.name}</h3>
                                {menuitems.map((item, index) => {
                                    return <div style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', borderBottom: '2px solid #dbd8d8' }}>
                                        <div className="card" style={{ width: '43rem', margin: 'auto' }}>
                                            <div className="row" style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                                <div className="col-xs-9 col-sm-9 col-md-9 col-lg-9 " style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                                    <span className="card-body">
                                                        <h5 className="item-name">{item.name}</h5>
                                                        <h5 className="item-name">&#8377;{item.price}</h5>
                                                        <p className="card-text">{item.description}</p>
                                                    </span>
                                                </div>
                                                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3"> <img className="card-img-center title-img" src={`../${item.image}`} />
                                                    {item.qty == 0 ? <div><button className="add-button" onClick={() => this.addItems(index, 'add')}>Add</button></div> :
                                                        <div className="add-number"><button onClick={() => this.addItems(index, 'subtract')}>-</button><span style={{ backgroundColor: 'white' }}>{item.qty}</span><button onClick={() => this.addItems(index, 'add')}>+</button></div>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                })}
                                <div className="card" style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', margin: 'auto' }}>
                                    <div className="row">
                                        <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 subtotal" style={{ paddingLeft: '26px' }}>Subtotal</div>
                                        <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 subtotal">&#8377;{subtotal}</div>
                                        <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4"><button disabled={this.state.subtotal==0} className="btn btn-danger" style={{ marginLeft: '30px' }} onClick={this.openDetailsWindow}>Pay Now</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
            </Modal>
            <Modal
                    isOpen={detailModelsOpen}
                    style={customStyles}
                >
                    <div className="glyphicon glyphicon-remove lose" style={{ float: 'right' }} onClick={this.handledetailsmodeclose}></div>
                 <div >
                                
                                <h3 className="restaurant-name">{restaurant.name}</h3>
                                <table className="table table-border table-striped table-hover">
                                    <tr>
                                        <td>
                                            <label>Name : </label>
                                        </td>
                                        <td>
                                            <input type="text" className=" mhinput" value={Name} onChange={(event) => this.handleinputChange(event, 'Name')} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label>Email : </label>
                                        </td>
                                        <td>
                                            <input type="text" className=" mhinput" value={Email} onChange={(event) => this.handleinputChange(event, 'Email')} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label>Mobile No : </label>
                                        </td>
                                        <td>
                                            <input type="text" className=" mhinput" value={Mobile} onChange={(event) => this.handleinputChange(event, 'Mobile')} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label>Address : </label>
                                        </td>
                                        <td>
                                            <input type="text" className=" mhinput" value={Address} onChange={(event) => this.handleinputChange(event, 'Address')} />
                                        </td>
                                    </tr>
                                   
                                </table>
                                <button className="btn btn-danger" style={{ float: 'right' }} onClick={this.makePayment}>PROCEED</button>
                            </div>
            </Modal>
        </div>
        )
    }
}

export default Details;