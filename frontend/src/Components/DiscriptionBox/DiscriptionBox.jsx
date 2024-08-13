import React from 'react'
import './DiscriptionBox.css'

const DiscriptionBox = () => {
  return (
    <div className='discriptionbox'>
      <div className="discriptionbox-navigator">
        <div className="discriptionbox-nav-box">Description</div>
        <div className="discriptionbox-nav-box fade">Reviews (122)</div>
      </div>
      <div className="discriptionbox-discription">
        <p>An e-commerce website is an online platform that facilitates the
        buying and selling of products or services over the internet. It serves
        as a virtual marketplace where businesses and individuals can
        showcase theri products, interact with customers and conduct
        transactions without the need for a physical presence. E-commerce
        websites have gained immense popularity due to their convenience,
        accessibility, and the global reach they offer.</p>
        <p>E-commerce websites typically disply products or services along with
         detailed descriptions, images, prices, and any available variations 
         (e.g. sizes, colors). Each product usually has its own dedicated page with relevent information.</p>
      </div>
    </div>
  )
}

export default DiscriptionBox
