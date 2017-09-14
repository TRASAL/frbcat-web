import React from 'react';

class FRBCatTXT extends React.Component {
    render() {
        return (
          <div>
          <p>
          </p>
          <p>
This catalogue contains up to date information for the published population of Fast Radio Bursts (FRBs). This site is maintained by the FRBCAT team and is updated as new sources are published or refined numbers become available. Sources can now be added to the FRBCAT automatically via the VOEvent Network, details of this process are given in Petroff et al., 2017. FRBs confirmed via publication, or received with a high importance score over the VOEvent Network, are given 'Verified' status and are shown on the default homepage; to see all events (including unverified candidates received via the VOEvent Network) toggle the "Show all/Show verified" button below.
          </p>
          <p>
          Information for each burst is divided into two categories: intrinsic properties measured using the available data, and derived parameters produced using a mode. Cosmological values are obtained using the Cosmology Calculator (<a href="http://adsabs.harvard.edu/abs/2006PASP..118.1711W">Wright, 2006</a>). The intrinsic parameters should be taken as lower limits, as the position within the telescope beam may be uncertain. Where multiple fits or measurements of a burst have been made each one is provided as a separate sub-entry for the FRB.
          </p>
          <p>
          You may use the data presented in this catalogue for publications; however, we ask that you cite the paper (<a href="http://adsabs.harvard.edu/abs/2016PASA...33...45P">Petroff et al., 2016</a>) and provide the url (http://www.frbcat.org). Any issues relating to the use of the catalogue should be addressed to FRBCAT team (primary contact: Emily Petroff).
          </p>
          </div>
        );
    }
};

export default FRBCatTXT;

