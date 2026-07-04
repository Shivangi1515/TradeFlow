import React from 'react';

function RaiseTicket() {
    return (
        <div className='container'>
            <div className='row p-5 mt-5 mb-5'>
                <h1 className='fs-2 text-center'>
                    To create a ticket,select a relevant topic
                </h1>
                <div className='col-4 p-5 mt-5 mb-5'>
                    <h4 className=''><i class="fa fa-plus-circle" aria-hidden="true"></i>
                        Account Opening
                    </h4>
                    <a href="" style={{textDecoration:"none",lineHeight:"2"}}>Resident individual</a><br/>
                    <a href="" style={{textDecoration:"none",lineHeight:"2"}}>Minor</a><br/>
                    <a href="" style={{textDecoration:"none",lineHeight:"2"}}>Non Resident Indian (NRI)</a><br/>
                    <a href="" style={{textDecoration:"none",lineHeight:"2"}}>Company, Partnership, HUF and LLP</a><br/>
                    <a href="" style={{textDecoration:"none",lineHeight:"2"}}>Non Resident Indian (NRI)</a>
                    <a href="" style={{textDecoration:"none",lineHeight:"2"}}>Company, Partnership, HUF and LLP</a>
                    <a href="" style={{textDecoration:"none",lineHeight:"2"}}>Glossary</a>
                </div>
                <div className='col-4 p-5 mt-5 mb-5'>
                    <h4 className=''><i class="fa fa-plus-circle" aria-hidden="true"></i>
                        Your TradeFlow Account
                    </h4>
                    <a href="" style={{textDecoration:"none",lineHeight:"2"}}>Your Profile</a><br/>
                    <a href="" style={{textDecoration:"none",lineHeight:"2"}}>Account Modification</a><br/>
                    <a href="" style={{textDecoration:"none",lineHeight:"2"}}>Client Master Report(CMR) and Depository Participant</a><br/>
                    <a href="" style={{textDecoration:"none",lineHeight:"2"}}>Nomination</a><br/>
                    <a href="" style={{textDecoration:"none",lineHeight:"2"}}>Transfer and conversion of securities</a>
                    
                </div>
                <div className='col-4 p-5 mt-5 mb-5'>
                    <h4 className=''><i class="fa fa-plus-circle" aria-hidden="true"></i>
                        Kite
                    </h4>
                    <a href="" style={{textDecoration:"none",lineHeight:"2"}}>IPO</a><br/>
                    <a href="" style={{textDecoration:"none",lineHeight:"2"}}>Trading FAQs</a><br/>
                    <a href="" style={{textDecoration:"none",lineHeight:"2"}}>Margin Trading Facility(MTF) and Margins</a><br/>
                    <a href="" style={{textDecoration:"none",lineHeight:"2"}}>Charts and orcders</a><br/>
                    <a href="" style={{textDecoration:"none",lineHeight:"2"}}>Alerts and nudges</a>
                    <a href="" style={{textDecoration:"none",lineHeight:"2"}}>General</a>
                    
                </div>
            </div>
        </div>
    );
}

export default RaiseTicket;