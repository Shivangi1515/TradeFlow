import React from 'react';

function Team() {
    return ( 
        <div className='container'>
            <div className='row p-5 mt-5 mb-5 border-top'>
                <h1 className=' text-center'>People</h1>
            </div>

            <div className='row p-5 text-muted ' style={{lineHeight:"1.8",fontSize:"1.2em"}}>
                <div className='col-6 p-5 text-center'>
                    <img src="media/images/shivangi.jpg" style={{borderRadius:"100%",width:"70%"}}/>
                    <h4 className='mt-5'>Shivangi Chaurasia</h4>
                    <h6>Founder,CEO</h6>
                </div>
                <div className='col-6 p-5'>
                    <p>Shivangi Chaurasia founded TradeFlow with the vision of making stock market investing and trading more accessible, intuitive, and transparent for everyone. As a software developer and aspiring engineer, she is building TradeFlow to simplify the investing experience through modern technology, user-centric design, and powerful financial tools.</p>
                </div>
            </div>

            

        </div>
     );
}

export default Team;