import React, {createContext, useEffect, useState} from "react";

export const ShopContext = createContext(null);

const getDefaultCart=()=>{
    let cart={};
    for (let index = 0; index < 300+1; index++) {
        cart[index]=0;
    }
    return cart;
}

const ShopContextProvider = (props) =>{
    const [all_product,setAll_Product] = useState([]);

    const [cartItems,setCartItems]=useState(getDefaultCart());

    useEffect(()=>{
        fetch('https://e-commerce-backend-c6zo.onrender.com/allproducts')
        .then((response)=>response.json())
        .then((data)=>setAll_Product(data))

        if(localStorage.getItem('auth-token')){
            fetch('https://e-commerce-backend-c6zo.onrender.com/getcart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'content-Type':'application/json',
                },
                body:"",
            })
            .then((response)=>response.json())
            .then((data)=>setCartItems(data));
        }
    },[])
    
    const addToCart=(itemId)=>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        if(localStorage.getItem('auth-token')){
            fetch('https://e-commerce-backend-c6zo.onrender.com/addtocart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId}),
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
        }
    }

    const removeFromCart=(itemId)=>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
        if(localStorage.getItem('auth-token')){
            fetch('https://e-commerce-backend-c6zo.onrender.com/removefromcart',{
                method:'POST',
                headers:{
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem('auth-token')}`,
                    'content-Type':'application/json',
                },
                body:JSON.stringify({"itemId":itemId}),
            })
            .then((response)=>response.json())
            .then((data)=>console.log(data));
        }
    }

    const clearcart=(itemId)=>{
        // setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
        // if(localStorage.getItem('auth-token')){
        //     fetch('https://e-commerce-backend-c6zo.onrender.com/clearcart',{
        //         method:'POST',
        //         headers:{
        //             Accept:'application/form-data',
        //             'auth-token':`${localStorage.getItem('auth-token')}`,
        //             'content-Type':'application/json',
        //         },
        //         body:JSON.stringify({"itemId":itemId}),
        //     })
        //     .then((response)=>response.json())
        //     .then((data)=>console.log(data));
        // }

        // fetch('https://e-commerce-backend-c6zo.onrender.com/clearcart', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'auth-token': localStorage.getItem('auth-token')
        //     }
        // })
        // .then((response) => response.json())
        // .then((data) => {
        //     console.log(data);
        //     // Set cart to empty in frontend state
        //     setCartItems({});
            
        //     // Redirect to home page or payment success page
        //     window.location.href = '/home'; 
        // })
        // .catch((error) => console.error('Error clearing cart:', error));


        if (localStorage.getItem('auth-token')) {
            alert("heelo")
            fetch('https://e-commerce-backend-c6zo.onrender.com/clearcart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('auth-token'),
                }
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
    
                // Update cart state to empty without refreshing the page
                setCartItems({});  // Assuming you're using setCartItems to manage the cart state
    
                // Optionally, show a success message or redirect the user to another page
                // window.location.href = '/home'; // Optional: Redirect after clearing cart
            })
            .catch((error) => console.error('Error clearing cart:', error));
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                let itemInfo=all_product.find((product)=>product.id===Number(item))
                totalAmount += cartItems[item] * itemInfo.new_price;
            }
        }
        return totalAmount;
    }

    const getTotalCartItems = () =>{
        let totalItem=0;
        for(const item in cartItems){
            if(cartItems[item]>0){
                totalItem+=cartItems[item];
            }
        }
        return totalItem;
    }

    const contextValue = {all_product,cartItems,getTotalCartItems,getTotalCartAmount,addToCart,removeFromCart,clearcart};

    return(
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;