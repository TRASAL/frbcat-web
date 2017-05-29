import React from 'react';

class Header extends React.Component {
    render() {
        return (
            <div className="slds-page-header" role="banner">
                <div className="slds-grid  slds-grid--vertical-align-center">
                    <div className="slds-col">
                        <h1 className="slds-page-header__title slds-truncate">{this.props.text}</h1>
                    </div>
                    <div className="slds-col slds-no-flex">
                        <a href="https://github.com/AA-ALERT">
                        <img src="pics/alert-logo05-wide.png" height="32"/>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
};

export default Header;
