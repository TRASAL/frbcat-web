import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn, ButtonGroup, ExportCSVButton} from 'react-bootstrap-table';
import * as productService from '../../services/product-service';
import ReactDOMServer from 'react-dom/server'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import Lightbox from 'react-images';
import String from 'natural-compare-lite';
import he from 'he';

let libraries = {};
let order= 'desc';

function enumFormatter(cell, row, enumObject) {
  return enumObject[cell];
}

function NaturalSortFunc(a, b, order, sortField) {
  /*
   * Based on the
   * Natural Sort algorithm for Javascript - Version 0.8.1 - Released under MIT license
   * Author: Jim Palmer (based on chunking idea from Dave Koelle)
   */
  var re = /(^([+\-]?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?(?=\D|\s|$))|^0x[\da-fA-F]+$|\d+)/g,
  sre = /^\s+|\s+$/g,   // trim pre-post whitespace
  snre = /\s+/g,        // normalize all whitespace to single ' ' character
  dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
  hre = /^0x[0-9a-f]+$/i,
  ore = /^0/,
  i = function(s) {
    return (NaturalSortFunc.insensitive && ('' + s).toLowerCase() || '' + s).replace(sre, '');
  }
  if (order === 'asc') {
    // convert all to strings strip whitespace
    var x = i(a[sortField]),
    y = i(b[sortField])
  } else {
    var x = i(b[sortField]),
    y = i(a[sortField])
  }
    // chunk/tokenize
  var xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
  yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
  // numeric, hex or date detection
  xD = parseInt(x.match(hre), 16) || (xN.length !== 1 && Date.parse(x)),
  yD = parseInt(y.match(hre), 16) || xD && y.match(dre) && Date.parse(y) || null,
  normChunk = function(s, l) {
    // normalize spaces; find floats not starting with '0', string or 0 if not defined (Clint Priest)
    return (!s.match(ore) || l == 1) && parseFloat(s) || s.replace(snre, ' ').replace(sre, '') || 0;
  },
  oFxNcL, oFyNcL;
  // first try and sort Hex codes or Dates
  if (yD) {
    if (xD < yD) { return -1; }
    else if (xD > yD) { return 1; }
  }
  // natural sorting through split numeric strings and default strings
  for(var cLoc = 0, xNl = xN.length, yNl = yN.length, numS = Math.max(xNl, yNl); cLoc < numS; cLoc++) {
    oFxNcL = normChunk(xN[cLoc] || '', xNl);
    oFyNcL = normChunk(yN[cLoc] || '', yNl);
    // handle numeric vs string comparison - number < string - (Kyle Adams)
    if (isNaN(oFxNcL) !== isNaN(oFyNcL)) {
      return isNaN(oFxNcL) ? 1 : -1;
    }
    // if unicode use locale comparison
    if (/[^\x00-\x80]/.test(oFxNcL + oFyNcL) && oFxNcL.localeCompare) {
      var comp = oFxNcL.localeCompare(oFyNcL);
      return comp / Math.abs(comp);
    }
    if (oFxNcL < oFyNcL) { return -1; }
    else if (oFxNcL > oFyNcL) { return 1; }
  }
}

class BSTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false, hiddenColumns: this.props.hiddencols, meas: {}, product: [] };
    this.openColumnDialog = this.openColumnDialog.bind(this);
    this.closeColumnDialog = this.closeColumnDialog.bind(this);
  }
  cellButton(cell, row, enumObject, rowIndex) {
    return (
      <button type="button" className="btn btn-info btn-circle"><i className="glyphicon glyphicon-ok"></i></button>
    );
  }
  customInfoButton(cell, row, enumObject, rowIndex) {
    return (
      <InsertButton
      btnText=''
      btnContextual='btn-info'
      className='btn btn-info btn-circle'
      btnGlyphicon='glyphicon-info-sign'
      onContextMenu={this.openColumnDialog.bind(this, row)}
      onClick={this.openColumnDialog.bind(this, row)}/>
    );
  }
  colFormatter(cell, row) {
    return (
      <Router>
        <Link to='/some/route'>
        </Link>
      </Router>
    );
  }
//<Button bsStyle="primary" bsSize="large" className={`${s.btnCircle}`}>
//<i className="fa fa-twitter" />
//</Button> 
  onClickProductSelected(cell, row, rowIndex){
  }
  closeColumnDialog() {
    this.setState({ showModal: false });
  }

  openColumnDialog(meas, e) {
    if (e.button == 2) {
      alert("Right click");
      window.open("http://www.google.com", '_blank');
    }
    else {
      this.setState({ showModal: true, meas });
    }
    //window.open('auth/google', '_blank');
  }
  
  componentDidMount() {
    this.findFRB();
  }

  findFRB() {
    console.log('findfrb');
    productService.findByFRB({search: "", frb_name: this.props.frb_name, min: 0, max: 30, page: 1})
    .then(data => {
      this.setState({
        product: data.products,
      });
    });
  }


  render() {
    const { showModal, meas } = this.state;
    if (Object.keys(this.state.product).length != 0) {
      return (
        <div>
        <Modal show={this.state.showModal} onHide={this.closeColumnDialg}>
        <Modal.Header closeButton onClick={this.closeColumnDialog}>
        <Modal.Title>Observation overview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <table width='100%'>
        <tbody className='selectcol'>
        <tr><td width='50%'>
        <table className='standard' cellPadding='5px' width='300px'>
        <tbody>
        <tr><th colSpan='3'>FRB Parameters</th></tr>
        <tr>
        <td width='50%'><b>Name</b></td>
        <td colSpan='2'>{meas.frb_name}</td>
        </tr>
        <tr>
        <td width='50%'><b>UTC</b></td>
        <td colSpan='2'>{meas.utc}</td>
        </tr>
        </tbody>
        </table>
        <p>Notes:</p>
        <ul>
        <li>Incorrectly published as FRB 011025. [E. Petroff 2015-10-19]</li>
        </ul>
        </td>
        <td width='50%'>
        <form name='getval'>
        <table className='standard'>
        <tbody>
        <tr><th colSpan='2'>Cosmological Parameters</th></tr>
        <tr><td>Omega<sub>M</sub></td><td><input type='text' name='tWM' id='tWM' defaultValue='0.286' size='4' autoComplete='false'></input></td></tr>
        <tr><td>H<sub>o</sub></td><td><input type='text' name='tH0' id='tH0' defaultValue='69.6' size='4'></input></td></tr>
        <tr><td>Omega<sub>vac</sub></td><td><input type='text' name='tWV' id='tWV' defaultValue='0.714' size='4'></input></td></tr>
        </tbody>
        </table>
        <input type='button' onClick={this.closeColumnDialog} value='Update Derived Params'/>
        </form>
        <font size='-2'>Calculation Method: <a href='http://adsabs.harvard.edu/abs/2006PASP..118.1711W'>Wright (2006, PASP, 118, 1711)</a></font>
        </td>
        </tr>
        </tbody>
        </table>
        <table width='100%'>
        <tbody>
        <tr><td width='50%'>
        <table className='standard' cellPadding='5px' width='100%'>
        <tbody>
        <tr><th colSpan='3'>Observation Parameters</th></tr>
        <tr>
        <td width='50%'><b>Telescope</b></td>
        <td colSpan='2'>{meas.telescope}</td>
        </tr>
        <tr>
        <td width='50%'><b>Receiver</b></td>
        <td colSpan='2'>{meas.rop_receiver}</td>
        </tr>
        <tr>
        <td width='50%'><b>Backend</b></td>
        <td colSpan='2'>{meas.rop_backend}</td>
        </tr>
        <tr>
        <td width='50%'><b>Beam</b></td>
        <td colSpan='2'>{meas.rop_beam}</td>
        </tr>
        <tr>
        <td width='50%'><b>Sampling Time</b></td>
        <td width='30%'>{meas.rop_sampling_time}</td>
        <td width='20%'>[ms]</td>
        </tr>
        <tr>
        <td width='50%'><b>Bandwidth</b></td>
        <td width='30%'>{meas.rop_bandwidth}</td>
        <td width='20%'>[MHz]</td>
        </tr>
        <tr>
        <td width='50%'><b>Centre Frequency</b></td>
        <td width='30%'>{meas.rop_centre_frequency}</td>
        <td width='20%'>[MHz]</td>
        </tr>
        <tr>
        <td width='50%'><b>Number of Polarisations</b></td>
        <td colSpan='2'>{meas.rop_npol}</td>
        </tr>
        <tr>
        <td width='50%'><b>Channel Bandwidth</b></td>
        <td width='30%'>{meas.rop_channel_bandwidth}</td>
        <td width='20%'>[MHz]</td>
        </tr>
        <tr>
        <td width='50%'><b>Bits per sample</b></td>
        <td colSpan='2'>{meas.rop_bits_per_sample}</td>
        </tr>
        <tr>
        <td width='50%'><b>Gain</b></td>
        <td width='30%'>{meas.rop_gain}</td>
        <td width='20%'>[K/Jy]</td>
        </tr>
        <tr>
        <td width='50%'><b>System Temperature</b></td>
        <td colSpan='2'>{meas.rop_tsys}</td>
        </tr>
        <tr>
        <td width='50%'><b>Reference</b></td>
        <td colSpan='2'><a href='http://adsabs.harvard.edu/abs/2014ApJ...792...19B'>Burke-Spolaor et al</a></td>
        </tr>
        <tr>
        <td width='50%'><b>Raw Data</b></td>
        <td colSpan='2'><a href='http://supercomputing.swin.edu.au/data-sharing-cluster/parkes-frbs-archival-data/'>Link to Data Portal</a></td>
        </tr>
        </tbody>
        </table>
        <p>Notes:</p>
        <ul>
        <li>Corrected number of bits per sample from 2 to 1. [ebarr 2016-01-23]</li>
        </ul>
        <div className='rmp'>
        <table className='standard' cellPadding='5p'x width='100%'>
        <tbody>
        <tr><th colSpan='3'>Measured Parameters</th></tr>
        <tr>
        <td width='50%'><b>RAJ<sup>a</sup></b></td>
        <td width='30%'>{meas.rop_raj}</td>
        <td width='20%'>[J2000]</td>
        </tr>
        <tr>
        <td width='50%'><b>DECJ<sup>a</sup></b></td>
        <td width='30%'>{meas.rop_decj}</td>
        <td width='20%'>[J2000]</td>
        </tr>
        <tr>
        <td width='50%'><b>gl<sup>a</sup></b></td>
        <td width='30%'>{meas.rop_gl}</td>
        <td width='20%'>[deg]</td>
        </tr>
        <tr>
        <td width='50%'><b>gb<sup>a</sup></b></td>
        <td width='30%'>{meas.rop_gb}</td>
        <td width='20%'>[deg]</td>
        </tr>
        <tr>
        <td width='50%'><b>Positional uncertainty<sup>b</sup></b></td>
        <td width='30%'>{meas.rop_pointing_error}</td>
        <td width='20%'>[arcmin]</td>
        </tr>
        <tr>
        <td width='50%'><b>DM</b></td>
        <td width='30%'>{htmlFormatter(meas.rmp_dm)}</td>
        <td width='20%'>[cm<sup>-3</sup> pc]</td>
        </tr>
        <tr>
        <td width='50%'><b>S/N</b></td>
        <td colSpan='2'>{meas.rmp_snr}</td>
        </tr>
        <tr>
        <td width='50%'><b>W<sub>obs</sub></b></td>
        <td width='30%'>{htmlFormatter(meas.rmp_width)}</td>
        <td width='20%'>[ms]</td>
        </tr>
        <tr>
        <td width='50%'><b>S<sub>peak,obs</sub></b></td>
        <td width='30%'>{meas.rpm_flux}</td>
        <td width='20%'>[Jy]</td>
        </tr>
        <tr>
        <td width='50%'><b>F<sub>obs</sub></b></td>
        <td width='30%'>fluence</td>
        <td width='20%'>[Jy ms]</td>
        </tr>
        <tr>
        <td width='50%'><b>DM Index</b></td>
        <td colSpan='2'>{meas.rmp_dm_index}</td>
        </tr>
        <tr>
        <td width='50%'><b>Scattering Index</b></td>
        <td colSpan='2'>{meas.rmp_scattering_index}</td>
        </tr>
        <tr>
        <td width='50%'><b>Scattering Time</b></td>
        <td colSpan='2'>{meas.rmp_scattering_time}</td>
        </tr>
        <tr>
        <td width='50%'><b>Linear Poln Fraction</b></td>
        <td colSpan='2'>{meas.rmp_linear_poln_frac}</td>
        </tr>
        <tr>
        <td width='50%'><b>Circular Poln Fraction</b></td>
        <td colSpan='2'>{meas.rmp_circular_poln_frac}</td>
        </tr>
        <tr>
        <td width='50%'><b>Host Photometric Redshift</b></td>
        <td colSpan='2'>{meas.rmp_z_phot}</td>
        </tr>
        <tr>
        <td width='50%'><b>Host Spectroscopic Redshift</b></td>
        <td colSpan='2'>{meas.rmp_z_spec}</td>
        </tr>
        </tbody>
        </table>
        <input type='hidden' name='fluence_field' id='0_0_fluence' value='2.82'/>
        <input type='hidden' name='bandwidth_field' id='0_0_bandwidth' value='288'/>
        <input type='hidden' name='redshift_field' id='0_0_redshift' value='0.57'/>
        <table className='standard' cellPadding='5px' width='100%'>
        <tbody>
        <tr><th colSpan='3'>Derived Parameters</th></tr>
        <tr>
        <td width='50%'><b>DM<sub>galaxy</sub><sup>c</sup></b></td>
        <td width='30%'>110</td>
        <td width='20%'>[cm<sup>-3</sup> pc]</td>
        </tr>
        <tr>
        <td width='50%'><b>DM<sub>excess</sub></b></td>
        <td width='30%'>680</td>
        <td width='20%'>[cm<sup>-3</sup> pc]</td>
        </tr>
        <tr>
        <td width='50%'><b>z<sup>d</sup></b></td>
        <td colSpan='2'>0.57</td>
        </tr>
        <tr>
        <td width='50%'><b>D<sub>comoving</sub><sup>d</sup></b></td>
        <td width='30%' id='0_0_dist_comoving'>&nbsp;</td>
        <td width='20%'>[Gpc]</td>
        </tr>
        <tr>
        <td width='50%'><b>D<sub>luminosity</sub><sup>d</sup></b></td>
        <td width='30%' id='0_0_dist_luminosity'>&nbsp;</td>
        <td width='20%'>[Gpc]</td>
        </tr>
        <tr>
        <td width='50%'><b>Energy<sup>d</sup></b></td>
        <td width='30%' id='0_0_energy'>&nbsp;</td>
        <td width='20%'>[10<sup>32</sup> J]</td>
        </tr>
        </tbody>
        </table>
        <input type='hidden' name='fluence_field' id='0_1_fluence' value='5.724'/>
        <input type='hidden' name='bandwidth_field' id='0_1_bandwidth' value='288'/>
        <input type='hidden' name='redshift_field' id='0_1_redshift' value='0.57'/>
        </div>
        </td>
        </tr>
        </tbody>
        </table>
        <div><img src='https://placehold.it/350x150' /></div>
        </Modal.Body>
        <Modal.Footer>
        <Button type="button" onClick={this.closeColumnDialog}>Close</Button>
        </Modal.Footer>
        </Modal>
        <BootstrapTable data={ this.state.product } maxHeight='300px' scrollTop={ 'Bottom' }>
      <TableHeaderColumn
      dataField='button'
      dataFormat={this.customInfoButton.bind(this)}
      width='55'
      />
      <TableHeaderColumn dataField='id' dataFormat={ this.colFormatter.bind(this) }>my header</TableHeaderColumn>
      <TableHeaderColumn ref='frb_name'
      dataField='frb_name'
      isKey={ true }
      hidden={this.state.hiddenColumns.frb_name}
      dataSort>
      FRB
      </TableHeaderColumn>
      <TableHeaderColumn ref='utc'
      dataField='utc'
      tdStyle={ { whiteSpace: 'normal' } }
      hidden={this.state.hiddenColumns.utc}
      dataSort>
      UTC
      </TableHeaderColumn>
      <TableHeaderColumn ref='telescope'
      dataField='telescope'
      hidden={this.state.hiddenColumns.telescope}
      dataSort>
      Telescope
      </TableHeaderColumn>
      <TableHeaderColumn ref='rop_receiver'
      dataField='rop_receiver'
      hidden={this.state.hiddenColumns.rop_receiver}
      dataSort>
      Receiver
      </TableHeaderColumn>
      <TableHeaderColumn ref='rop_backend'
      dataField='rop_backend'
      hidden={this.state.hiddenColumns.rop_backend}
      dataSort>
      Backend
      </TableHeaderColumn>
      <TableHeaderColumn ref='rop_beam'
      dataField='rop_beam'
      hidden={this.state.hiddenColumns.rop_beam}
      dataSort>
      Beam
      </TableHeaderColumn>
      <TableHeaderColumn ref='rop_raj'
      dataField='rop_raj'
      hidden={this.state.hiddenColumns.rop_raj}
      dataSort
      sortFunc={ NaturalSortFunc }>
      RAJ
      </TableHeaderColumn>
      <TableHeaderColumn ref='rop_decj'
      dataField='rop_decj'
      hidden={this.state.hiddenColumns.rop_decj}
      dataSort
      sortFunc={ NaturalSortFunc }>
      DECJ
      </TableHeaderColumn>
      <TableHeaderColumn ref='rop_gl'
      dataField='rop_gl'
      hidden={this.state.hiddenColumns.rop_gl}
      dataSort>
      GL
      </TableHeaderColumn>
      <TableHeaderColumn ref='rop_gb'
      dataField='rop_gb'
      hidden={this.state.hiddenColumns.rop_gb}
      dataSort>
      GB
      </TableHeaderColumn>
      <TableHeaderColumn ref='rop_pointing_error'
      dataField='rop_pointing_error'
      hidden={this.state.hiddenColumns.rop_pointing_error}
      dataSort>
      Pointing error
      </TableHeaderColumn>
      <TableHeaderColumn ref='rop_fwhm'
      dataField='rop_fwhm'
      hidden={this.state.hiddenColumns.rop_fwhm}
      dataSort>
      FWHM
      </TableHeaderColumn>
      <TableHeaderColumn ref='rop_sampling_time'
      dataField='rop_sampling_time'
      hidden={this.state.hiddenColumns.rop_sampling_time}
      dataSort>
      Sampling time
      </TableHeaderColumn>
      <TableHeaderColumn ref='rop_bandwidth'
      dataField='rop_bandwidth'
      hidden={this.state.hiddenColumns.rop_bandwidth}
      dataSort>
      Bandwidth
      </TableHeaderColumn>
      <TableHeaderColumn ref='rop_centre_frequency'
      dataField='rop_centre_frequency'
      hidden={this.state.hiddenColumns.rop_centre_frequency}
      dataSort>
      Centre frequency
      </TableHeaderColumn>
      <TableHeaderColumn ref='rop_npol'
      dataField='rop_npol'
      hidden={this.state.hiddenColumns.rop_npol}
      dataSort>
      Npol
      </TableHeaderColumn>
      <TableHeaderColumn ref='rop_channel_bandwidth'
      dataField='rop_channel_bandwidth'
      hidden={this.state.hiddenColumns.rop_channel_bandwidth}
      dataSort>
      Channel bandwidth
      </TableHeaderColumn>
      <TableHeaderColumn ref='rop_bits_per_sample'
      dataField='rop_bits_per_sample'
      hidden={this.state.hiddenColumns.rop_bits_per_sample}
      dataSort>
      Bits per sample
      </TableHeaderColumn>
      <TableHeaderColumn ref='rop_gain'
      dataField='rop_gain'
      hidden={this.state.hiddenColumns.rop_gain}
      dataSort>
      Gain
      </TableHeaderColumn>
      <TableHeaderColumn ref='rop_tsys'
      dataField='rop_tsys'
      hidden={this.state.hiddenColumns.rop_tsys}
      dataSort>
      Tsys
      </TableHeaderColumn>
      <TableHeaderColumn ref='rop_ne2001_dm_limit'
      dataField='rop_ne2001_dm_limit'
      hidden={this.state.hiddenColumns.rop_ne2001_dm_limit}
      dataSort>
      Ne2001_dm_limit
      </TableHeaderColumn>
      <TableHeaderColumn ref='rmp_dm'
      dataField='rmp_dm'
      dataFormat={ priceFormatter }
      hidden={this.state.hiddenColumns.rmp_dm}
      dataSort
      sortFunc={ NaturalSortFunc }>
      DM
      </TableHeaderColumn>
      <TableHeaderColumn ref='rmp_width'
      dataField='rmp_width'
      dataFormat={ priceFormatter }
      hidden={this.state.hiddenColumns.rmp_width}
      dataSort
      sortFunc={ NaturalSortFunc }>
      Width
      </TableHeaderColumn>
      <TableHeaderColumn ref='rmp_snr'
      dataField='rmp_snr'
      dataFormat={ nanFormatter }
      hidden={this.state.hiddenColumns.rmp_snr}
      dataSort>
      SNR
      </TableHeaderColumn>
      <TableHeaderColumn ref='rmp_flux'
      dataField='rmp_flux'
      dataFormat={ priceFormatter }
      hidden={this.state.hiddenColumns.rmp_flux}
      dataSort>
      Flux
      </TableHeaderColumn>
      <TableHeaderColumn ref='rmp_dm_index'
      dataField='rmp_dm_index'
      dataFormat={ nanFormatter }
      hidden={this.state.hiddenColumns.rmp_dm_index}
      dataSort>
      DM index
      </TableHeaderColumn>
      <TableHeaderColumn ref='rmp_scattering_index'
      dataField='rmp_scattering_index'
      dataFormat={ nanFormatter }
      hidden={this.state.hiddenColumns.rmp_scattering_index}
      dataSort>
      Scattering index
      </TableHeaderColumn>
      <TableHeaderColumn ref='rmp_scattering_time'
      dataField='rmp_scattering_time'
      dataFormat={ nanFormatter }
      hidden={this.state.hiddenColumns.rmp_scattering_time}
      dataSort>
      Scattering time
      </TableHeaderColumn>
      <TableHeaderColumn ref='rmp_linear_poln_frac'
      dataField='rmp_linear_poln_frac'
      dataFormat={ nanFormatter }
      hidden={this.state.hiddenColumns.rmp_linear_poln_frac}
      dataSort>
      Linear poln frac
      </TableHeaderColumn>
      <TableHeaderColumn ref='rmp_circular_poln_frac'
      dataField='rmp_circular_poln_frac'
      dataFormat={ nanFormatter }
      hidden={this.state.hiddenColumns.rmp_circular_poln_frac}
      dataSort>
      Circular poln frac
      </TableHeaderColumn>
      <TableHeaderColumn ref='rmp_spectral_index'
      dataField='rmp_spectral_index'
      dataFormat={ nanFormatter }
      hidden={this.state.hiddenColumns.rmp_spectral_index}
      dataSort>
      Spectral index
      </TableHeaderColumn>
      <TableHeaderColumn ref='rmp_z_phot'
      dataField='rmp_z_phot'
      dataFormat={ nanFormatter }
      hidden={this.state.hiddenColumns.rmp_z_phot}
      dataSort>
      Z phot
      </TableHeaderColumn>
      <TableHeaderColumn ref='rmp_z_spec'
      dataField='rmp_z_spec'
      dataFormat={ nanFormatter }
      hidden={this.state.hiddenColumns.rmp_z_spec}
      dataSort>
      Z spec
      </TableHeaderColumn>
      </BootstrapTable>
      </div>);
    } else {
      return (<p>?</p>);
    }
  }
}

function htmlFormatter(cell) {
  if ((cell === '-1')) {
    return;
  } else {
    return he.decode(`${cell}`);
  }
}

function priceFormatter(cell, row) {
  if ((cell === '-1')) {
    return;
  } else {
    return `${cell}`;
  }
}

function nanFormatter(cell, row) {
  if ((cell === -1)) {
    return;
  } else {
    return cell;
  }
}

export default class FRBTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false,
      hiddenColumns: { 
        obs_type: true,
        rop_receiver: true,
        rop_backend: true,
        rop_beam: true,
        rop_pointing_error: true,
        rop_sampling_time: true,
        rop_npol: true,
        rop_channel_bandwidth: true,
        rop_bits_per_sample: true,
        rop_gain: true,
        rop_tsys: true,
        rop_ne2001_dm_limit: true,
        rop_fwhm: true,
        rop_bandwidth: true,
        rop_centre_frequency: true,
        rmp_dm_index: true,
        rmp_scattering_index: true,
        rmp_scattering_time: true,
        rmp_linear_poln_frac: true,
        rmp_circular_poln_frac: true,
        rmp_spectral_index: true,
        rmp_z_phot: true,
        rmp_z_spec: true,
      },
      product : {}
    };
    this.openColumnDialog = this.openColumnDialog.bind(this);
    this.closeColumnDialog = this.closeColumnDialog.bind(this);
    this.expandComponent = this.expandComponent.bind(this);
    this.createCustomButtonGroup = this.createCustomButtonGroup.bind(this);
    // set sorting options
    this.options = {
      defaultSortName: 'frb_name',  // default sort column name
      defaultSortOrder: 'desc',  // default sort order
      sizePerPage: 25,
      sizePerPageList: [ {
        text: '10', value: 10
      }, {
        text: '25', value: 25
      }, {
        text: '50', value: 50
      } ],
      prePage: 'Prev', // Previous page button text
      nextPage: 'Next', // Next page button text
      firstPage: 'First', // First page button text
      lastPage: 'Last', // Last page button text
      expandRowBgColor: 'rgb(242, 255, 163)',
      expandBy: 'row',
      clearSearch: true,
      clearSearchBtn: this.createCustomClearButton,
      btnGroup: this.createCustomButtonGroup,
      toolbar: this.createCustomToolbar
    };
  }
  closeColumnDialog() {
    this.setState({ showModal: false });
  }
  openColumnDialog() {
    this.setState({ showModal: true });
  }
  changeColumn(cname) {
    return () => {
      if (cname === 'frb_name') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { frb_name: !this.state.hiddenColumns.frb_name }) });
      } else if (cname === 'telescope') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { telescope: !this.state.hiddenColumns.telescope }) });
      } else if (cname === 'utc') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { utc: !this.state.hiddenColumns.utc }) });
      } else if (cname === 'obs_type') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { obs_type: !this.state.hiddenColumns.obs_type }) });
      } else if (cname === 'rop_receiver') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rop_receiver: !this.state.hiddenColumns.rop_receiver }) });
      } else if (cname === 'rop_backend') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rop_backend: !this.state.hiddenColumns.rop_backend }) });
      } else if (cname === 'rop_beam') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rop_beam: !this.state.hiddenColumns.rop_beam }) });
      } else if (cname === 'rop_raj') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rop_raj: !this.state.hiddenColumns.rop_raj }) });
      } else if (cname === 'rop_decj') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rop_decj: !this.state.hiddenColumns.rop_decj }) });
      } else if (cname === 'rop_gl') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rop_gl: !this.state.hiddenColumns.rop_gl }) });
      } else if (cname === 'rop_gb') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rop_gb: !this.state.hiddenColumns.rop_gb }) });
      } else if (cname === 'rmp_dm') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rmp_dm: !this.state.hiddenColumns.rmp_dm }) });
      } else if (cname === 'rmp_width') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rmp_width: !this.state.hiddenColumns.rmp_width }) });
      } else if (cname === 'rmp_snr') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rmp_snr: !this.state.hiddenColumns.rmp_snr }) });
      } else if (cname === 'rmp_flux') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rmp_flux: !this.state.hiddenColumns.rmp_flux }) });
      } else if (cname === 'rop_pointing_error') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rop_pointing_error: !this.state.hiddenColumns.rop_pointing_error }) });
      } else if (cname === 'rop_fwhm') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rop_fwhm: !this.state.hiddenColumns.rop_fwhm }) });
      } else if (cname === 'rop_sampling_time') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rop_sampling_time: !this.state.hiddenColumns.rop_sampling_time }) });
      } else if (cname === 'rop_bandwidth') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rop_bandwidth: !this.state.hiddenColumns.rop_bandwidth }) });
      } else if (cname === 'rop_centre_frequency') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rop_centre_frequency: !this.state.hiddenColumns.rop_centre_frequency }) });
      } else if (cname === 'rop_npol') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rop_npol: !this.state.hiddenColumns.rop_npol }) });
      } else if (cname === 'rop_channel_bandwidth') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rop_channel_bandwidth: !this.state.hiddenColumns.rop_channel_bandwidth }) });
      } else if (cname === 'rop_bits_per_sample') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rop_bits_per_sample: !this.state.hiddenColumns.rop_bits_per_sample }) });
      } else if (cname === 'rop_gain') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rop_gain: !this.state.hiddenColumns.rop_gain }) });
      } else if (cname === 'rop_tsys') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rop_tsys: !this.state.hiddenColumns.rop_tsys }) });
      } else if (cname === 'rop_ne2001_dm_limit') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rop_ne2001_dm_limit: !this.state.hiddenColumns.rop_ne2001_dm_limit }) });
      } else if (cname === 'rmp_dm_index') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rmp_dm_index: !this.state.hiddenColumns.rmp_dm_index }) });
      } else if (cname === 'rmp_scattering_index') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rmp_scattering_index: !this.state.hiddenColumns.rmp_scattering_index }) });
      } else if (cname === 'rmp_scattering_time') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rmp_scattering_time: !this.state.hiddenColumns.rmp_scattering_time }) });
      } else if (cname === 'rmp_linear_poln_frac') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rmp_linear_poln_frac: !this.state.hiddenColumns.rmp_linear_poln_frac }) });
      } else if (cname === 'rmp_circular_poln_frac') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rmp_circular_poln_frac: !this.state.hiddenColumns.rmp_circular_poln_frac }) });
      } else if (cname === 'rmp_spectral_index') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rmp_spectral_index: !this.state.hiddenColumns.rmp_spectral_index }) });
      } else if (cname === 'rmp_z_phot') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rmp_z_phot: !this.state.hiddenColumns.rmp_z_phot }) });
      } else if (cname === 'rmp_z_spec') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rmp_z_spec: !this.state.hiddenColumns.rmp_z_spec }) });
      }
    };
  }

  // pagination settings
  sizePerPageListChange(sizePerPage) {
    alert(`sizePerPage: ${sizePerPage}`);
  }

  onPageChange(page, sizePerPage) {
    alert(`page: ${page}, sizePerPage: ${sizePerPage}`);
  }

  isExpandableRow(row) {
    if (row.id > 3) return true;
    else return true;
  }

  expandComponent(row) {
    return (
      <BSTable frb_name={ row.frb_name } hiddencols={ this.state.hiddenColumns} />
    );
  }
  handlerClickCleanFiltered() {
    // remove all filters
    this.refs.frb_name.cleanFiltered();
    this.refs.telescope.cleanFiltered();
    this.refs.utc.cleanFiltered();
    this.refs.rop_raj.cleanFiltered();
    this.refs.rop_decj.cleanFiltered();
    this.refs.rop_gl.cleanFiltered();
    this.refs.rop_gb.cleanFiltered();
    this.refs.rop_receiver.cleanFiltered();
    this.refs.rop_backend.cleanFiltered();
    this.refs.rop_beam.cleanFiltered();
    this.refs.rop_pointing_error.cleanFiltered();
    this.refs.rop_fwhm.cleanFiltered();
    this.refs.rop_sampling_time.cleanFiltered();
    this.refs.rop_bandwidth.cleanFiltered();
    this.refs.rop_centre_frequency.cleanFiltered();
    this.refs.rop_npol.cleanFiltered();
    this.refs.rop_channel_bandwidth.cleanFiltered();
    this.refs.rop_bits_per_sample.cleanFiltered();
    this.refs.rop_gain.cleanFiltered();
    this.refs.rop_tsys.cleanFiltered();
    this.refs.rop_ne2001_dm_limit.cleanFiltered();
    this.refs.rmp_dm.cleanFiltered();
    this.refs.rmp_width.cleanFiltered();
    this.refs.rmp_snr.cleanFiltered();
    this.refs.rmp_flux.cleanFiltered();
    this.refs.rmp_dm_index.cleanFiltered();
    this.refs.rmp_scattering_index.cleanFiltered();
    this.refs.rmp_scattering_time.cleanFiltered();
    this.refs.rmp_linear_poln_frac.cleanFiltered();
    this.refs.rmp_circular_poln_frac.cleanFiltered();
    this.refs.rmp_spectral_index.cleanFiltered();
    this.refs.rmp_z_phot.cleanFiltered();
    this.refs.rmp_z_spec.cleanFiltered();
  }
  handleClearButtonClick(onClick) {
    this.props.search('');
  }

  createCustomClearButton(onClick) {
    return (
      <ClearSearchButton
      btnText='Clear'
      btnContextual='btn-warning'
      className='my-custom-class'
      onClick={ onClick }/>
    );
  }

  createCustomButtonGroup() {
    return (
      <ButtonGroup className='my-custom-class' sizeClass='btn-group-md'>
      <button type='button'
      className={ `btn btn-primary` }
      onClick={this.openColumnDialog}>
      Visible columns
      </button>
      <ExportCSVButton
      btnText='Export to CSV'
      btnContextual='btn-success'
      className='my-custom-class'
      btnGlyphicon='glyphicon-export'
      />
      </ButtonGroup>    );
  }
  render() {
    const selectRow = {
      mode: 'checkbox',
      clickToSelect: true,  // click to select, default is false
      clickToExpand: true,  // click to expand row, default is false
      bgColor: 'rgb(242,195,53)'
    };
    return (
      <div className="reacttable">
      <Modal show={this.state.showModal} onHide={this.closeColumnDialg}>
        <Modal.Header closeButton onClick={this.closeColumnDialog}>
        <Modal.Title>Select visible columns</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <table width='100%'>
        <tbody className='selectcol'>
        <tr><td width='33%'>
        <table className='standard' cellPadding='5px' width='300px'>
        <tbody>
        <tr><th colSpan='1'>FRB parameters</th></tr>
        <tr>
        <td colSpan='1'>
        <input type="checkbox" onChange={this.changeColumn('frb_name')} checked={!this.state.hiddenColumns.frb_name} /> FRB <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('telescope')} checked={!this.state.hiddenColumns.telescope} /> Telescope <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('utc')} checked={!this.state.hiddenColumns.utc} /> UTC <br />
        </td>
        </tr>
        </tbody>
        </table>
        </td>
        <td width='33%'>
        <table className='standard'>
        <tbody>
        <tr><th colSpan='1'>Observation parameters</th></tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rop_raj')} checked={!this.state.hiddenColumns.rop_raj} /> RAJ <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rop_decj')} checked={!this.state.hiddenColumns.rop_decj} /> DECJ <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rop_gl')} checked={!this.state.hiddenColumns.rop_gl} /> GL <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rop_gb')} checked={!this.state.hiddenColumns.rop_gb} /> GB <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rop_receiver')} checked={!this.state.hiddenColumns.rop_receiver} /> Receiver <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rop_backend')} checked={!this.state.hiddenColumns.rop_backend} /> Backend <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rop_beam')} checked={!this.state.hiddenColumns.rop_beam} /> Beam <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rop_pointing_error')} checked={!this.state.hiddenColumns.rop_pointing_error} /> Pointing error <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rop_fwhm')} checked={!this.state.hiddenColumns.rop_fwhm} /> FWHM <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rop_sampling_time')} checked={!this.state.hiddenColumns.rop_sampling_time} /> Sampling time <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rop_bandwidth')} checked={!this.state.hiddenColumns.rop_bandwidth} /> Bandwidth <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rop_centre_frequency')} checked={!this.state.hiddenColumns.rop_centre_frequency} /> Centre frequency <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rop_npol')} checked={!this.state.hiddenColumns.rop_npol} /> Npol <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rop_channel_bandwidth')} checked={!this.state.hiddenColumns.rop_channel_bandwidth} /> Channel bandwidth <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rop_bits_per_sample')} checked={!this.state.hiddenColumns.rop_bits_per_sample} /> Bits per sample <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rop_gain')} checked={!this.state.hiddenColumns.rop_gain} /> Gain <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rop_tsys')} checked={!this.state.hiddenColumns.rop_tsys} /> Tsys <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rop_ne2001_dm_limit')} checked={!this.state.hiddenColumns.rop_ne2001_dm_limit} /> Ne2001_dm_limit <br />
        </td>
        </tr>
        </tbody>
        </table>
        </td>
        <td width='33%'>
        <table className='standard'>
        <tbody>
        <tr><th colSpan='1'>Measured parameters</th></tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rmp_dm')} checked={!this.state.hiddenColumns.rmp_dm} /> DM <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rmp_width')} checked={!this.state.hiddenColumns.rmp_width} /> Width <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rmp_snr')} checked={!this.state.hiddenColumns.rmp_snr} /> SNR <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rmp_dm_index')} checked={!this.state.hiddenColumns.rmp_dm_index} /> DM index <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rmp_scattering_index')} checked={!this.state.hiddenColumns.rmp_scattering_index} /> Scattering index <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rmp_scattering_time')} checked={!this.state.hiddenColumns.rmp_scattering_time} /> Scattering time <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rmp_linear_poln_frac')} checked={!this.state.hiddenColumns.rmp_linear_poln_frac} /> Linear poln frac <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rmp_circular_poln_frac')} checked={!this.state.hiddenColumns.rmp_circular_poln_frac} /> Circular poln frac <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rmp_spectral_index')} checked={!this.state.hiddenColumns.rmp_spectral_index} /> Spectral index <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rmp_z_phot')} checked={!this.state.hiddenColumns.rmp_z_phot} /> Z phot <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rmp_z_spec')} checked={!this.state.hiddenColumns.rmp_z_spec} /> Z spec <br />
        </td>
        </tr>
        </tbody>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" onClick={this.closeColumnDialog}>Close</Button>
        </Modal.Footer>
        </Modal>
        <BootstrapTable ref='table'
                        data={ this.props.products } 
                        exportCSV={ true }
                        pagination={ true}
                        hover={ true }
                        options={ this.options}
                        exportCSV={ true }
                        expandableRow={ this.isExpandableRow }
                        expandComponent={ this.expandComponent }
                        search={ true }
                        expandColumnOptions={
                          {expandColumnVisible: true,
                          expandColumnBeforeSelectColumn: false } }>
        <TableHeaderColumn ref='frb_name'
                           dataField='frb_name'
                           isKey={ true }
                           hidden={this.state.hiddenColumns.frb_name}
                           dataSort
                           width='100px'>
                           FRB
                           </TableHeaderColumn>
        <TableHeaderColumn ref='utc'
                           dataField='utc'
                           tdStyle={ { whiteSpace: 'normal' } }
                           hidden={this.state.hiddenColumns.utc}
                           dataSort
                           width='100px'>
                           UTC
                           </TableHeaderColumn>
        <TableHeaderColumn ref='telescope'
                           dataField='telescope'
                           hidden={this.state.hiddenColumns.telescope}
                           dataSort
                           width='100px'>
                           Telescope
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rop_receiver'
                           dataField='rop_receiver'
                           hidden={this.state.hiddenColumns.rop_receiver}
                           dataSort
                           width='100px'>
                           Receiver
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rop_backend'
                           dataField='rop_backend'
                           hidden={this.state.hiddenColumns.rop_backend}
                           dataSort
                           width='100px'>
                           Backend
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rop_beam'
                           dataField='rop_beam'
                           hidden={this.state.hiddenColumns.rop_beam}
                           dataSort
                           width='100px'>
                           Beam
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rop_raj'
                           dataField='rop_raj'
                           hidden={this.state.hiddenColumns.rop_raj}
                           dataSort
                           sortFunc={ NaturalSortFunc }
                           width='100px'>
                           RAJ
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rop_decj'
                           dataField='rop_decj'
                           hidden={this.state.hiddenColumns.rop_decj}
                           dataSort
                           sortFunc={ NaturalSortFunc }
                           width='100px'>
                           DECJ
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rop_gl'
                           dataField='rop_gl'
                           hidden={this.state.hiddenColumns.rop_gl}
                           dataSort
                           width='100px'>
                           GL
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rop_gb'
                           dataField='rop_gb'
                           hidden={this.state.hiddenColumns.rop_gb}
                           dataSort
                           width='100px'>
                           GB
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rop_pointing_error'
                           dataField='rop_pointing_error'
                           hidden={this.state.hiddenColumns.rop_pointing_error}
                           dataSort
                           width='100px'>
                           Pointing error
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rop_fwhm'
                           dataField='rop_fwhm'
                           hidden={this.state.hiddenColumns.rop_fwhm}
                           dataSort
                           width='100px'>
                           FWHM
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rop_sampling_time'
                           dataField='rop_sampling_time'
                           hidden={this.state.hiddenColumns.rop_sampling_time}
                           dataSort
                           width='100px'>
                           Sampling time
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rop_bandwidth'
                           dataField='rop_bandwidth'
                           hidden={this.state.hiddenColumns.rop_bandwidth}
                           dataSort
                           width='100px'>
                           Bandwidth
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rop_centre_frequency'
                           dataField='rop_centre_frequency'
                           hidden={this.state.hiddenColumns.rop_centre_frequency}
                           dataSort
                           width='100px'>
                           Centre frequency
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rop_npol'
                           dataField='rop_npol'
                           hidden={this.state.hiddenColumns.rop_npol}
                           dataSort
                           width='100px'>
                           Npol
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rop_channel_bandwidth'
                           dataField='rop_channel_bandwidth'
                           hidden={this.state.hiddenColumns.rop_channel_bandwidth}
                           dataSort
                           width='100px'>
                           Channel bandwidth
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rop_bits_per_sample'
                           dataField='rop_bits_per_sample'
                           hidden={this.state.hiddenColumns.rop_bits_per_sample}
                           dataSort
                           width='100px'>
                           Bits per sample
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rop_gain'
                           dataField='rop_gain'
                           hidden={this.state.hiddenColumns.rop_gain}
                           dataSort
                           width='100px'>
                           Gain
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rop_tsys'
                           dataField='rop_tsys'
                           hidden={this.state.hiddenColumns.rop_tsys}
                           dataSort
                           width='100px'>
                           Tsys
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rop_ne2001_dm_limit'
                           dataField='rop_ne2001_dm_limit'
                           hidden={this.state.hiddenColumns.rop_ne2001_dm_limit}
                           dataSort
                           width='100px'>
                           Ne2001_dm_limit
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rmp_dm'
                           dataField='rmp_dm'
                           dataFormat={ priceFormatter }
                           hidden={this.state.hiddenColumns.rmp_dm}
                           dataSort
                           sortFunc={ NaturalSortFunc }
                           width='100px'>
                           DM
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rmp_width'
                           dataField='rmp_width'
                           dataFormat={ priceFormatter }
                           hidden={this.state.hiddenColumns.rmp_width}
                           dataSort
                           sortFunc={ NaturalSortFunc }
                           width='100px'>
                           Width
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rmp_snr'
                           dataField='rmp_snr'
                           dataFormat={ nanFormatter }
                           hidden={this.state.hiddenColumns.rmp_snr}
                           dataSort
                           width='100px'>
                           SNR
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rmp_flux'
                           dataField='rmp_flux'
                           dataFormat={ priceFormatter }
                           hidden={this.state.hiddenColumns.rmp_flux}
                           dataSort
                           width='100px'>
                           Flux
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rmp_dm_index'
                           dataField='rmp_dm_index'
                           dataFormat={ nanFormatter }
                           hidden={this.state.hiddenColumns.rmp_dm_index}
                           dataSort
                           width='100px'>
                           DM index
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rmp_scattering_index'
                           dataField='rmp_scattering_index'
                           dataFormat={ nanFormatter }
                           hidden={this.state.hiddenColumns.rmp_scattering_index}
                           dataSort
                           width='100px'>
                           Scattering index
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rmp_scattering_time'
                           dataField='rmp_scattering_time'
                           dataFormat={ nanFormatter }
                           hidden={this.state.hiddenColumns.rmp_scattering_time}
                           dataSort
                           width='100px'>
                           Scattering time
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rmp_linear_poln_frac'
                           dataField='rmp_linear_poln_frac'
                           dataFormat={ nanFormatter }
                           hidden={this.state.hiddenColumns.rmp_linear_poln_frac}
                           dataSort
                           width='100px'>
                           Linear poln frac
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rmp_circular_poln_frac'
                           dataField='rmp_circular_poln_frac'
                           dataFormat={ nanFormatter }
                           hidden={this.state.hiddenColumns.rmp_circular_poln_frac}
                           dataSort
                           width='100px'>
                           Circular poln frac
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rmp_spectral_index'
                           dataField='rmp_spectral_index'
                           dataFormat={ nanFormatter }
                           hidden={this.state.hiddenColumns.rmp_spectral_index}
                           dataSort
                           width='100px'>
                           Spectral index
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rmp_z_phot'
                           dataField='rmp_z_phot'
                           dataFormat={ nanFormatter }
                           hidden={this.state.hiddenColumns.rmp_z_phot}
                           dataSort
                           width='100px'>
                           Z phot
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rmp_z_spec'
                           dataField='rmp_z_spec'
                           dataFormat={ nanFormatter }
                           hidden={this.state.hiddenColumns.rmp_z_spec}
                           dataSort
                           width='100px'>
                           Z spec
                           </TableHeaderColumn>
        </BootstrapTable>
        </div>
    );
  }
}
