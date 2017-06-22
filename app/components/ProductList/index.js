import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn, ButtonGroup, ExportCSVButton} from 'react-bootstrap-table';
import * as productService from '../../services/product-service';
import Lightbox from 'react-images';
import String from 'natural-compare-lite';
import he from 'he';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

let libraries = {};
let order= 'desc';

// begin values from cosmocalc.js
var i=0;  // index
var n=1000; // number of points in integrals
var nda = 1;  // number of digits in angular size distance
var H0 = 69.6;  // Hubble constant
var WM = 0.286; // Omega(matter)
var WV = 0.714; // Omega(vacuum) or lambda
var WR = 0; // Omega(radiation)
var WK = 0; // Omega curvaturve = 1-Omega(total)
var z = 3.0;  // redshift of the object
var h = 0.696 // H0/100
var c = 299792.458; // velocity of light in km/sec
var Tyr = 977.8; // coefficent for converting 1/H into Gyr
var DTT = 0.5;  // time from z to now in units of 1/H0
var DTT_Gyr = 0.0;  // value of DTT in Gyr
var age = 0.5;  // age of Universe in units of 1/H0
var age_Gyr = 0.0;  // value of age in Gyr
var zage = 0.1; // age of Universe at redshift z in units of 1/H0
var zage_Gyr = 0.0; // value of zage in Gyr
var DCMR = 0.0; // comoving radial distance in units of c/H0
var DCMR_Mpc = 0.0;
var DCMR_Gyr = 0.0;
var DA = 0.0; // angular size distance
var DA_Mpc = 0.0;
var DA_Gyr = 0.0;
var kpc_DA = 0.0;
var DL = 0.0; // luminosity distance
var DL_Mpc = 0.0;
var DL_Gyr = 0.0; // DL in units of billions of light years
var V_Gpc = 0.0;
var a = 1.0;  // 1/(1+z), the scale factor of the Universe
var az = 0.5; // 1/(1+z(object))

// calculate the actual results
function compute()
{
  h = H0/100;
  WR = 4.165E-5/(h*h);  // includes 3 massless neutrino species, T0 = 2.72528
  WK = 1-WM-WR-WV;
  az = 1.0/(1+1.0*z);
  age = 0;
  for (i = 0; i != n; i++) {
    a = az*(i+0.5)/n;
    var adot = Math.sqrt(WK+(WM/a)+(WR/(a*a))+(WV*a*a));
    age = age + 1/adot;
  };
  zage = az*age/n;
// correction for annihilations of particles not present now like e+/e-
// added 13-Aug-03 based on T_vs_t.f
  var lpz = Math.log((1+1.0*z))/Math.log(10.0);
  var dzage = 0;
  if (lpz >  7.500) dzage = 0.002 * (lpz -  7.500);
  if (lpz >  8.000) dzage = 0.014 * (lpz -  8.000) +  0.001;
  if (lpz >  8.500) dzage = 0.040 * (lpz -  8.500) +  0.008;
  if (lpz >  9.000) dzage = 0.020 * (lpz -  9.000) +  0.028;
  if (lpz >  9.500) dzage = 0.019 * (lpz -  9.500) +  0.039;
  if (lpz > 10.000) dzage = 0.048;
  if (lpz > 10.775) dzage = 0.035 * (lpz - 10.775) +  0.048;
  if (lpz > 11.851) dzage = 0.069 * (lpz - 11.851) +  0.086;
  if (lpz > 12.258) dzage = 0.461 * (lpz - 12.258) +  0.114;
  if (lpz > 12.382) dzage = 0.024 * (lpz - 12.382) +  0.171;
  if (lpz > 13.055) dzage = 0.013 * (lpz - 13.055) +  0.188;
  if (lpz > 14.081) dzage = 0.013 * (lpz - 14.081) +  0.201;
  if (lpz > 15.107) dzage = 0.214;
  zage = zage*Math.pow(10.0,dzage);
//
  zage_Gyr = (Tyr/H0)*zage;
  DTT = 0.0;
  DCMR = 0.0;
// do integral over a=1/(1+z) from az to 1 in n steps, midpoint rule
  for (i = 0; i != n; i++) {
    a = az+(1-az)*(i+0.5)/n;
    adot = Math.sqrt(WK+(WM/a)+(WR/(a*a))+(WV*a*a));
    DTT = DTT + 1/adot;
    DCMR = DCMR + 1/(a*adot);
  };
  DTT = (1-az)*DTT/n;
  DCMR = (1-az)*DCMR/n;
  age = DTT+zage;
  age_Gyr = age*(Tyr/H0);
  DTT_Gyr = (Tyr/H0)*DTT;
  DCMR_Gyr = (Tyr/H0)*DCMR;
  DCMR_Mpc = (c/H0)*DCMR;
  DA = az*DCMT();
  DA_Mpc = (c/H0)*DA;
  kpc_DA = DA_Mpc/206.264806;
  DA_Gyr = (Tyr/H0)*DA;
  DL = DA/(az*az);
  DL_Mpc = (c/H0)*DL;
  DL_Gyr = (Tyr/H0)*DL;
  V_Gpc = 4*Math.PI*Math.pow(0.001*c/H0,3)*VCM();

  return;
}
// tangential comoving distance
function DCMT() {
  var ratio = 1.00;
  var x;
  var y;
  x = Math.sqrt(Math.abs(WK))*DCMR;
  // document.writeln("DCMR = " + DCMR + "<BR>");
  // document.writeln("x = " + x + "<BR>");
  if (x > 0.1) {
    ratio =  (WK > 0) ? 0.5*(Math.exp(x)-Math.exp(-x))/x : Math.sin(x)/x;
    // document.writeln("ratio = " + ratio + "<BR>");
    y = ratio*DCMR;
    return y;
  };
  y = x*x;
// statement below fixed 13-Aug-03 to correct sign error in expansion
  if (WK < 0) y = -y;
  ratio = 1 + y/6 + y*y/120;
  // document.writeln("ratio = " + ratio + "<BR>");
  y= ratio*DCMR;
  return y;
}
// comoving volume computation
function VCM() {
  var ratio = 1.00;
  var x;
  var y;
  x = Math.sqrt(Math.abs(WK))*DCMR;
  if (x > 0.1) {
    ratio =  (WK > 0) ? (0.125*(Math.exp(2*x)-Math.exp(-2*x))-x/2)/(x*x*x/3) :
    (x/2 - Math.sin(2*x)/4)/(x*x*x/3) ;
    y = ratio*DCMR*DCMR*DCMR/3;
    return y;
  };
  y = x*x;
// statement below fixed 13-Aug-03 to correct sign error in expansion
  if (WK < 0) y = -y;
  ratio = 1 + y/5 + (2/105)*y*y;
  y= ratio*DCMR*DCMR*DCMR/3;
  return y;
}
// computing energy
function computeEnergy (fluence, dl, bandwidth, z)
{
  var e1 = fluence * Math.pow(10,-26) * 0.001;
  var e2 = Math.pow((dl * 3.08567758 * Math.pow(10,25)),2);
  var e3 = bandwidth * (1 + z);
  var e4 = Math.pow(10,32);
  var energy = (e1 * e2 * e3) / e4;
  return energy;
}
// end values from cosmocalc.js

function enumFormatter(cell, row, enumObject) {
  return enumObject[cell];
}

function supsub_formatter(variable, upper_error, lower_error) {
  // return variable with upper/lower error if available, else return variable
  if (!isNaN(parseFloat(upper_error)) && !isNaN(parseFloat(lower_error))) {
    //return variable with upper and lower error
    return <div>{variable}<span className='supsub'><sup>{upper_error}</sup><sub>{lower_error}</sub></span></div>;
  } 
  else {
    // return variable without error
    return variable;
  }
}

function isRNaN(a) { return a !== a; };

function plusmn_formatter(variable, error) {
  // return variable with +-error if available, else return variable
  if (!isNaN(parseFloat(error))) {
    return <div>{variable}&plusmn;{error}</div>;
  }
  else {
    // return variable
    return variable;
  }
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
    this.state = { showModal: false,
                   hiddenColumns: this.props.hiddencols, 
                   meas: {},
                   product: [],
                   // initialize input fields
                   input_fields_tWM: 0.286,
                   input_fields_tH0: 69.6,
                   input_fields_tWV: 0.714,
                   // initialize derived variables
                   derived_fluence: '',
                   derived_fluence_error_upper: '',
                   derived_fluence_error_lower: '',
                   derived_dm_excess: '',
                   derived_dm_excess_error_upper: '',
                   derived_dm_excess_error_lower: '',
                   derived_redshift: '',
                   derived_redshift_error_upper: '',
                   derived_redshift_error_lower: '',
                   derived_dist_comoving: '',
                   derived_dist_comoving_error_upper: {},
                   derived_dist_comoving_error_lower: {},
                   derived_dist_luminosity: '',
                   derived_dist_luminosity_error_upper: {},
                   derived_dist_luminosity_error_lower: {},
                   derived_energy: '',
                   derived_energy_error_upper: {},
                   derived_energy_error_lower: {},
                   
                   derived: {
                     fluence: {},
                     fluence_error_upper: {},
                     fluence_error_lower: {},
                     dm_excess: {},
                     dm_excess_error_upper: {},
                     dm_excess_error_lower: {},
                     redshift: {},
                     redshift_error_upper: {},
                     redshift_error_lower: {},
                     dist_comoving: {},
                     dist_comoving_error_upper: {},
                     dist_comoving_error_lower: {},
                     dist_luminosity: {},
                     dist_luminosity_error_upper: {},
                     dist_luminosity_error_lower: {},
                     energy: {},
                     energy_error_upper: {},
                     energy_error_lower: {},
                   },
    };
    this.openColumnDialog = this.openColumnDialog.bind(this);
    this.closeColumnDialog = this.closeColumnDialog.bind(this);
    this.updateDerived = this.updateDerived.bind(this);
    this.updateField = this.updateField.bind(this);
    this.calculateDerived = this.calculateDerived.bind(this);
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
 updateField(e) {
   this.setState({ [e.target.name]: e.target.value});
   }
  
  calculateDerived(meas) {
    // initial calculation of derived parameters
    // fluence
    if (meas.rmp_width != meas.rmp_flux) {
      if (!isNaN(parseFloat(meas.rmp_width)) && !isNaN(parseFloat(meas.rmp_flux))) {
        var fluence = meas.rmp_width * meas.rmp_flux;
        this.setState({ derived_fluence: fluence })
        if (!isNaN(parseFloat(meas.rmp_flux_error_upper)) && !isNaN(parseFloat(meas.rmp_flux_error_lower)) && !isNaN(parseFloat(meas.rmp_width_error_upper)) && !isNaN(parseFloat(meas.rmp_width_error_lower))) {
          var flux_error_upper = parseFloat(meas.flux_error_upper);
          var flux_error_lower = parseFloat(meas.flux_error_lower);
          var width_error_upper = parseFloat(meas.width_error_upper);
          var width_error_lower = parseFloat(meas.width_error_lower);
          var fluence_error_upper = ((meas.rmp_flux + flux_error_upper) * (meas.rmp_width + width_error_upper)) - fluence;
          var fluence_error_lower = ((meas.rmp_flux + flux_error_lower) * (meas.rmp_width + width_error_lower)) - fluence;
          this.setState({ derived_fluence_error_upper: fluence_error_upper,
                          derived_fluence_error_lower: fluence_error_lower
                        });
        }
      }
    }
    // dm_excess, redshift
    if (!isNaN(parseFloat(meas.rmp_dm)) && !isNaN(parseFloat(meas.rop_ne2001_dm_limit))) {
      var dm = parseFloat(meas.rmp_dm);
      var ne2001_dm_limit = parseFloat(meas.rop_ne2001_dm_limit);
      // calculate dm_excess
      var dm_excess = dm - ne2001_dm_limit;
      var dm_excess_error_upper = dm - (0.5 * ne2001_dm_limit);
      var dm_excess_error_lower = dm - (1.5 * ne2001_dm_limit);
      // calculate redshift
      var redshift = dm_excess / 1200.0;
      var redshift_error_upper = dm_excess_error_upper / 1200.0;
      var redshift_error_lower = dm_excess_error_lower / 1200.0;
      // update state
      this.setState({ derived_dm_excess: dm_excess,
                      derived_dm_excess_error_upper: dm_excess_error_upper,
                      derived_dm_excess_error_lower: dm_excess_error_lower,
                      derived_redshift: redshift,
                      derived_redshift_error_upper: redshift_error_upper,
                      derived_redshift_error_lower: redshift_error_lower
                    });
    }
    // input fields
    var tH0 = this.state.input_fields_tH0;
    var tWM = this.state.input_fields_tWM;
    var tWV = this.state.input_fields_tWV;
    // first compute actual error values
    var bandwidth = meas.rop_bandwidth * Math.pow(10,6);
    H0 = tH0;
    h = H0/100;
    WM = tWM;
    WV = tWV;
    z = redshift;
    WR = 4.165E-5/(h*h);  // includes 3 massless neutrino species, T0 = 2.72528
    WK = 1-WM-WR-WV;
    compute();
    var dist_comoving = DCMR_Mpc / 1000.0;
    var dist_luminosity = DL_Mpc / 1000.0;
    var energy = computeEnergy (fluence, dist_luminosity, bandwidth, z);
    // update state
    this.setState( { derived_dist_luminosity: dist_luminosity,
                     derived_dist_comoving: dist_comoving,
                     derived_energy: energy
                   });
  }

  updateDerived() {
    // set 
    var tH0 = this.state.input_fields_tH0;
    var tWM = this.state.input_fields_tWM;
    var tWV = this.state.input_fields_tWV;
    // first compute actual error values
    var bandwidth = this.state.meas.rop_bandwidth * Math.pow(10,6);
    H0 = tH0;
    h = H0/100;
    WM = tWM;
    WV = tWV;
    z = this.state.derived_redshift;
    var fluence = this.state.derived_fluence;
    var dist_luminosity = this.state.derived_dist_luminosity;
    WR = 4.165E-5/(h*h);  // includes 3 massless neutrino species, T0 = 2.72528
    WK = 1-WM-WR-WV;
    compute();
    var dist_comoving = DCMR_Mpc / 1000.0;
    var dist_luminosity = DL_Mpc / 1000.0;
    var energy = computeEnergy (fluence, dist_luminosity, bandwidth, z);
    // update state
    this.setState( { derived_dist_luminosity: dist_luminosity,
                     derived_dist_comoving: dist_comoving,
                     derived_energy: energy
                   });
  }
  
  openColumnDialog(meas, e) {
    if (e.button == 2) {
      alert("Right click");
      window.open("http://www.google.com", '_blank');
    }
    else {
      this.calculateDerived(meas);
      //this.updateDerived();
      this.setState({ showModal: true,
                      meas });
    }
    //window.open('auth/google', '_blank');
  }
  
  componentDidMount() {
    this.findFRB();
  }

  findFRB() {
    productService.findByFRB({search: "", frb_name: this.props.frb_name, min: 0, max: 30, page: 1})
    .then(data => {
      this.setState({
        product: data.products,
      });
    });
  }

  render() {
    const { showModal, meas, input_fields_tWM, input_fields_tH0, input_fields_tWV } = this.state;
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
        <tr><td>Omega<sub>M</sub></td><td><input type='number' name='input_fields_tWM' defaultValue={this.state.input_fields_tWM} onChange={this.updateField.bind(this)} size='4'></input></td></tr>
        <tr><td>H<sub>o</sub></td><td><input type='number' name='input_fields_tH0' defaultValue={this.state.input_fields_tH0}
                                      onChange={this.updateField.bind(this)} size='4'></input></td></tr>
        <tr><td>Omega<sub>vac</sub></td><td><input type='number' name='input_fields_tWV' defaultValue={this.state.input_fields_tWV}
                                      onChange={this.updateField.bind(this)} size='4'></input></td></tr>
        </tbody>
        </table>
        <input type='button' onClick={this.updateDerived.bind(this)} value='Update Derived Params'/>
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
        <td width='30%'>{plusmn_formatter(meas.rmp_dm, meas.rmp_dm_error)}</td>
        <td width='20%'>[cm<sup>-3</sup> pc]</td>
        </tr>
        <tr>
        <td width='50%'><b>S/N</b></td>
        <td colSpan='2'>{meas.rmp_snr}</td>
        </tr>
        <tr>
        <td width='50%'><b>W<sub>obs</sub></b></td>
        <td width='30%'>{supsub_formatter(meas.rmp_width, meas.rmp_width_error_upper, meas.rmp_width_error_lower)}</td>
        <td width='20%'>[ms]</td>
        </tr>
        <tr>
        <td width='50%'><b>S<sub>peak,obs</sub></b></td>
        <td width='30%'>{supsub_formatter(meas.rmp_flux, meas.rmp_flux_error_upper, meas.rmp_flux_error_lower)}</td>
        <td width='20%'>[Jy]</td>
        </tr>
        <tr>
        <td width='50%'><b>F<sub>obs</sub></b></td>
        <td width='30%'>{supsub_formatter(this.state.derived_fluence, this.state.derived_fluence_error_upper, this.state.derived_fluence_error_lower)}</td>
        <td width='20%'>[Jy ms]</td>
        </tr>
        <tr>
        <td width='50%'><b>DM Index</b></td>
        <td colSpan='2'>{plusmn_formatter(meas.rmp_dm_index, meas.rmp_dm_index_error)}</td>
        </tr>
        <tr>
        <td width='50%'><b>Scattering Index</b></td>
        <td colSpan='2'>{plusmn_formatter(meas.rmp_scattering_index, meas.rmp_scattering_index_error)}</td>
        </tr>
        <tr>
        <td width='50%'><b>Scattering Time</b></td>
        <td colSpan='2'>{plusmn_formatter(meas.rmp_scattering_time, meas.rmp_scattering_time_error)}</td>
        </tr>
        <tr>
        <td width='50%'><b>Linear Poln Fraction</b></td>
        <td colSpan='2'>{plusmn_formatter(meas.rmp_linear_poln_frac, meas.rmp_linear_poln_frac_error)}</td>
        </tr>
        <tr>
        <td width='50%'><b>Circular Poln Fraction</b></td>
        <td colSpan='2'>{plusmn_formatter(meas.rmp_circular_poln_frac, meas.rmp_circulat_poln_frac_error)}</td>
        </tr>
        <tr>
        <td width='50%'><b>Host Photometric Redshift</b></td>
        <td colSpan='2'>{plusmn_formatter(meas.rmp_z_phot, meas.rmp_z_phot_error)}</td>
        </tr>
        <tr>
        <td width='50%'><b>Host Spectroscopic Redshift</b></td>
        <td colSpan='2'>{plusmn_formatter(meas.rmp_z_spec, meas.rmp_z_spec_error)}</td>
        </tr>
        </tbody>
        </table>
        <table className='standard' cellPadding='5px' width='100%'>
        <tbody>
        <tr><th colSpan='3'>Derived Parameters</th></tr>
        <tr>
        <td width='50%'><b>DM<sub>galaxy</sub><sup>c</sup></b></td>
        <td width='30%'>{meas.rop_ne2001_dm_limit}</td>
        <td width='20%'>[cm<sup>-3</sup> pc]</td>
        </tr>
        <tr>
        <td width='50%'><b>DM<sub>excess</sub></b></td>
        <td width='30%'>{this.state.derived_dm_excess}</td>
        <td width='20%'>[cm<sup>-3</sup> pc]</td>
        </tr>
        <tr>
        <td width='50%'><b>z<sup>d</sup></b></td>
        <td colSpan='2'>{this.state.derived_redshift}</td>
        </tr>
        <tr>
        <td width='50%'><b>D<sub>comoving</sub><sup>d</sup></b></td>
        <td width='30%'>{this.state.derived_dist_comoving}</td>
        <td width='20%'>[Gpc]</td>
        </tr>
        <tr>
        <td width='50%'><b>D<sub>luminosity</sub><sup>d</sup></b></td>
        <td width='30%'>{this.state.derived_dist_luminosity}</td>
        <td width='20%'>[Gpc]</td>
        </tr>
        <tr>
        <td width='50%'><b>Energy<sup>d</sup></b></td>
        <td width='30%'>{this.state.derived_energy}</td>
        <td width='20%'>[10<sup>32</sup> J]</td>
        </tr>
        </tbody>
        </table>
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
        rmp_flux: true,
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
      expandRowBgColor: 'rgb(207, 216, 220)',
      expandBy: 'row',
      clearSearch: true,
      clearSearchBtn: this.createCustomClearButton,
      btnGroup: this.createCustomButtonGroup,
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
      } else if (cname === 'rmp_flux') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rmp_flux: !this.state.hiddenColumns.rmp_flux }) });
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
    return true;
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
  showall(onClick) {
    console.log('handle show all/verified')
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

  createCustomButtonGroup(props) {
    return (
      <ButtonGroup className='my-custom-class' sizeClass='btn-group-md'>
      <button type='button'
      className={ `btn btn-primary` }
      onClick={this.openColumnDialog}>
      Visible columns
      </button>
      <button type='button'
      className={ `btn btn-info` }
      onClick={this.showall}>
      Show all/verified
      </button>
      { props.exportCSVBtn }
      </ButtonGroup>    );
  }
  render() {
    const selectRow = {
      mode: 'checkbox',
      clickToSelect: true,  // click to select, default is false
      clickToExpand: true,  // click to expand row, default is false
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
        <input type="checkbox" onChange={this.changeColumn('rmp_flux')} checked={!this.state.hiddenColumns.rmp_flux} /> Flux <br />
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
