import React from 'react';

class FRBCatTXT extends React.Component {
    render() {
        return (
          <div>
          <p>
          </p>
          <p>
          This catalogue contains up to date information for the publicly available population of Fast Radio Bursts (FRBs). This site is maintained by the FRBCAT team and is updated as new sources are published or refined numbers become available. Entries in the catalogue can be sorted or queried based on their parameters. Click on an FRB to select it and view more information. Some bursts in the catalogue have multiple entries either due to the detection of multiple pulses or due to a standardized re-analysis of the published data described in the FRBCAT paper (<a href="http://adsabs.harvard.edu/abs/2016PASA...33...45P">Petroff et al., 2016</a>).
          Intrinsic parameters should be taken as lower limits for FRBs with an uncertain position within a large telescope beam. Models used in this analysis are the NE2001 Galactic electron distribution (Cordes & Lazio, 2002), and the Cosmology Calculator (Wright, 2006).
          </p>
          <p>
          If the data in this catalogue are used in a publication we ask that you cite the paper (Petroff et al., 2016) and provide the url for the FRBCAT.
          </p>
          </div>
        );
    }
};

export default FRBCatTXT;
