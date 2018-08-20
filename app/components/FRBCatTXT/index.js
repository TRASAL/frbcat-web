import React from 'react';

class FRBCatTXT extends React.Component {
    render() {
        return (
          <div>
          <p>
          </p>
          <p>
This catalogue contains up to date information for the published population of Fast Radio Bursts (FRBs). This site is maintained by the FRBCAT team and is updated as new sources are published or refined numbers become available. Sources can now be added to the FRBCAT automatically via the VOEvent Network, details of this process are given in <a href="http://adsabs.harvard.edu/abs/2017arXiv171008155P">Petroff et al., 2017</a>. FRBs confirmed via publication, received with a high importance score (>0.95) over the VOEvent Network, or with a high confidence value defined explicitly in an Astronomer's Telegram are given 'Verified' status and are shown on the default homepage; to see all events (including unverified candidates received via the VOEvent Network or ATel system) toggle the "Verified events/All events" button below. As refined and peer-reviewed confirmation of FRB detections are received they will be moved to the Verified category.</p>
          <p>
Information for each burst is divided into two categories: observed parameters from the available data, and derived parameters produced using a model. Cosmological values are obtained using the Cosmology Calculator (<a href="http://adsabs.harvard.edu/abs/2006PASP..118.1711W">Wright, 2006</a>). The observed parameters are sometimes either lower or upper limits, due to the limitations of the data acquisition systems. Where multiple fits or measurements of a burst have been made each one is provided as a separate sub-entry for the FRB.
          </p>
          <p>
You may use the data presented in this catalogue for publications; however, we ask that you cite the paper (<a href="http://adsabs.harvard.edu/abs/2016PASA...33...45P">Petroff et al., 2016</a>) and provide the url (<a href="http://www.frbcat.org">http://www.frbcat.org</a>). Any issues relating to the use of the catalogue should be addressed to FRBCAT team (primary contact: Emily Petroff). 
          </p>
          <p>
          The most recent version of the catalogue database and previous versions are available in CSV format on Zenodo at the DOI: <a href={this.props.csv}>{this.props.csv}</a>
          </p>
          </div>
        );
    }
};

export default FRBCatTXT;

