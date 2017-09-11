import React from 'react';

class Footer extends React.Component {
  render() {
    return (
      <div>
      <div className="footer slds-m-horizontal--large slds-m-top--xx-large">
        <div>
          <h2>Version Notes</h2>
          <p>Version 2.0: The updated version of the catalogue is now capable of parsing and automatically ingesting FRBs into the catalogue received as xml VOEvents over the VOEvent Network. See (<a href="http://link.to.be.added">Petroff et al., 2017</a>) for more details.</p>
          <p>Version 1.0: This catalogue contains all currently available FRBs with their publication values and re-analysis described in <a href="http://adsabs.harvard.edu/abs/2016PASA...33...45P">Petroff et al., 2016</a>. New FRBs will be added to the catalogue as they become available but will not precipitate a new version. Minor corrections to the catalogue may be performed without new version notes. New versions will be released as new analysis is performed on the sample, new parameters are added to the catalogue, or new cosmological/progenitor considerations become necessary.</p>
        </div>
        <div className="flex-container">
          <div className="flex-item">
            <a href="https://www.esciencecenter.nl/">
            <img src="pics/ESCIENCE_logo_C_nl_cyanblack.jpg" alt="" className="img-responsive" />
            </a>
          </div>
          <div className="flex-item">
            <a href="http://www.alert.eu">
            <img src="pics/ALERT_logo.png" alt="" className="img-responsive"/>
            </a>
          </div>
          <div className="flex-item">
            <a href="http://cordis.europa.eu/project/rcn/191235_en.html">
            <img src="pics/EU_flag.jpg" alt="" className="img-responsive" />
            </a>
          </div>
          <div className="flex-item">
            <a href="http://cordis.europa.eu/project/rcn/191235_en.html">
            <img src="pics/ERC_logo.png" alt="" className="img-responsive" />
            </a>
          </div>
          <div className="flex-item">
            <a href="https://www.astron.nl/">
            <img src="pics/Astron_logo.png" alt=""className="img-responsive" />
            </a>
          </div>
          <div className="flex-item">
            <a href="http://www.swinburne.edu.au/">
            <img src="pics/Swinburne_logo.png" alt=""className="img-responsive" />
            </a>
          </div>
          <br/>
        </div>
      </div>
      <div className="page-footer" role="banner">
        <div className="slds-grid  slds-grid--vertical-align-center">
          <p>This project received funding from the Netherlands eScience Center under grant AA-ALERT (027.015.G09), and from the European Research Council under the European Union's Seventh Framework Programme (FP/2007-2013) / ERC Grant Agreement n. 617199.</p>
        </div>
      </div>
      </div>
        );
    }
};

export default Footer;
