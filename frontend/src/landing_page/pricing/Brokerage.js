import React from 'react';

function Brokerage() {
    return ( 
        <div className='container '>


            
            <div className='row p-5 mt-5 text-center border-top' >
                <div className='col-8 p-4 text-left'>
                    <a href="" style={{textDecoration:"none"}}><h3 className='fs-5'>Brokerage Calculator</h3></a>
                    <ul style={{textAlign:"left",lineHeight:"2.5"}} className='text-muted'>
                        <li>Call & Trade and RMS auto-squareoff:Additional charges of ₹50 + GST per order.</li>
                        <li>Digital contract notes will be sent via e-mail.</li>
                        <li>Physical contract notes will be sent via courier at ₹25 + GST per contract note.</li>
                        <li>For NRI account(non-PIS),0.5% or ₹50 + GST per order (whichever is lower).</li>
                        <li>If the account is a NRI account (PIS), the charges will be as per the NRI pricing.</li>
                    </ul>
                    

                </div>
                <div className='col-4 p-5'>
                    <a href="" style={{textDecoration:"none"}}><h3 className='fs-5'>List of charges</h3></a>

                </div>
                
            </div>
        </div>
     );
}

export default Brokerage;