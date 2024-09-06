import React, { useContext } from 'react'
import './CartItems.css'
import {ShopContext} from '../../Context/ShopContext'
import remove_icon from '../Assets/cart_cross_icon.png'
import {loadStripe} from '@stripe/stripe-js';

const CartItems = () => {
    const {all_product,cartItems,getTotalCartAmount,removeFromCart} = useContext(ShopContext)

    var stripePromise = loadStripe("pk_test_51PvOql02k1yCOeuvnWACjjRnygXnrXf3r20iPQVA6Ei91ioyoEsRQimUiY0bXbcfXVSMs5SkuCCyVYyxS0hTwepE00xs4pXi16");

    // payment integration
    const makePayment = async()=>{
        console.log("absc")
        const stripe = await stripePromise;

        const body = {
            products:all_product.filter(product => cartItems[product.id]>0),
            // total_price:getTotalCartAmount(),
            cart_items: cartItems,
        };
        console.log("body",body);
        // const headers = {
        //     "Content-Type": "application/json"
        // };
        try{
            console.log("aaaaaa");
            const response = await fetch("http://localhost:7000/create-checkout-session",{
                method:"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body:JSON.stringify(body)
            });
            
            const session = await response.json();
        //     const result = await stripe.redirectToCheckout({
        //         sessionId:session.id
        //     });
        //     if (result.error) {
        //         console.error(result.error.message);
        //     }
        // } 
        // catch (error) {
        //     console.error("Error during payment process:", error);
        // }

            console.log("Session response:", session); // Log the session response
            if (session.id) {
                const result = await stripe.redirectToCheckout({ sessionId: session.id });
                if (result.error) {
                    console.log(result.error.message);
                }
            } else {
                console.log("Session creation failed");
            }
        } catch (error) {
            console.log("Error during payment process:", error);
        }
        
    }

  return (
    <div className='cartitems'>
      <div className="cartitems-format-main">
        <p>Product</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />

        {all_product.map((e)=>{
            if(cartItems[e.id]>0){
                return <div>
                <div className="cartitems-format cartitems-format-main">
                    <img src={e.image} alt="" className='carticon-product-icon'/>
                    <p>{e.name}</p>
                    <p>Rs.{e.new_price}</p>
                    <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                    <p>Rs.{e.new_price*cartItems[e.id]}</p>
                    <img className='cartitems-remove-icon' src={remove_icon} onClick={()=>{removeFromCart(e.id)}} alt="" />
                </div>
                <hr />
                </div>
            }
            return null;
        })}
        
        <div className="cartitems-down">
            <div className="cartitems-total">
                <h1>Cart Total</h1>
                <div>
                    <div className="cartitems-total-item">
                        <p>SubTotal</p>
                        <p>Rs.{getTotalCartAmount()}</p>
                    </div>
                    <hr />
                    <div className="cartitems-total-item">
                        <p>Shipping Free</p>
                        <p>Free</p>
                    </div>
                    <hr />
                    <div className="cartitems-total-item">
                        <h3>Total</h3>
                        <h3>Rs.{getTotalCartAmount()}</h3>
                    </div>
                </div>
                <button onClick={makePayment} >PROCEED TO CHECKOUT</button>
            </div>
            <div className="cartitems-promocode">
                <p>If you have a promo code, Enter it here</p>
                <div className="cartitems-promobox">
                    <input type="text" placeholder='promo-code' />
                    <button>Submit</button>
                </div>
            </div>
        </div>

      {/* <div>
        <div className="cartitems-format">
            <img src="" alt="" className='carticon-product-icon'/>
            <p></p>
            <p></p>
            <button className='cartitems-quantity'></button>
            <p></p>
            <img src={remove_icon} onClick={()=>{removeFromCart}} alt="" />
        </div>
        <hr />
      </div> */}

    </div>
  );
};

export default CartItems;
