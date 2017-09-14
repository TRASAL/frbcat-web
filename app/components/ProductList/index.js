import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn, ButtonGroup, ExportCSVButton} from 'react-bootstrap-table';
import * as productService from '../../services/product-service';
import Gallery from 'react-grid-gallery';

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

var char;
var index = 0;

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

function isBlank(str) {
  return (!str || /^\s*$/.test(str));
}

function linkFormatter(link) {
  // return a <a href=> link if link is not null, else return <p></p>
  if (!isBlank(link)) {
    return <a href={link}>Data link</a>;
  }
  else {
    return <p></p>;
  }
}

function subsupstr_formatter(variable, substrng, description, superscript) {
  if ((!isBlank(substrng)) && (!isBlank(description))) {
    return <div>{variable}<span className='supsub'><sub><b>{substrng}</b></sub></span><span className='supsub'><sup><b>{superscript}</b></sup></span></div>;
  }
  else if (!isBlank(description)) {
    return <div>{variable}<span className='supsub'><sup><b>{superscript}</b></sup></span></div>;
  }
  else if (!isBlank(substrng)) {
    return <div>{variable}<span className='supsub'><sub><b>{substrng}</b></sub></span></div>;
  }
  else {
    return variable;
  }
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

function nextChar(index) {
  // convert int to lower case character 0->a, 1->b, etc
  return String.fromCharCode(97 + index);
}

function superscript_list(itemlist) {
  // return superscript list for the items in itemlist
  // first item gets letter a ,second b, etc
  return <div>
    <p></p>
    {
      itemlist.map(function(item, i){
       char = nextChar(i);
       if (!isBlank(item)) {
         return <p key={i}>[{char}] {item}</p>
       }
       else {
         return
       }
    })
  }
  </div>;
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

function uint8ToBase64(buffer) {
     var binary = '';
     var len = buffer.byteLength;
     for (var i = 0; i < len; i++) {
         binary += String.fromCharCode(buffer[i]);
     }
     return window.btoa( binary );
}


class RopNotesComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { rop_notes: [],
    };
  }
  componentDidMount() {
    this.findROPnotes();
  }
  findROPnotes() {
    productService.findropnotes({search: "", rop_id: this.props.rop_id, min: 0, max: 30, page: 1})
    .then(data => {
      this.setState({
        rop_notes: data.products,
      });
    });
  }
  render () {
          if ( this.state.rop_notes[0] == null ) {
            return (
            <div></div>
            );
          } else {
          return (
     <div>
        Notes:
        <ul>
          {
            this.state.rop_notes.map(function(item, i){
            return <li key={i}>{item.note} [{item.author} {item.last_modified}]</li>
            })
         }
        </ul>
      </div>
      );
    }
  }
}

class RmpNotesComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { rmp_notes: [],
    };
  }
  componentDidMount() {
    this.findRMPnotes();
  }
  findRMPnotes() {
    productService.findrmpnotes({search: "", rmp_id: this.props.rmp_id, min: 0, max: 30, page: 1})
    .then(data => {
      this.setState({
        rmp_notes: data.products,
      });
    });
  }
  render () {
          if ( this.state.rmp_notes[0] == null ) {
            return (
            <div></div>
            );
          } else {
          return (
     <div>
        Notes:
        <ul>
          {
            this.state.rmp_notes.map(function(item, i){
            return <li key={i}>{item.note} [{item.author} {item.last_modified}]</li>
            })
         }
        </ul>
      </div>
      );
    }
  }
}

class FrbNotesComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { frb_notes: [],
    };
  }
  componentDidMount() {
    this.findFRBnotes();
  }
  findFRBnotes() {
    productService.findfrbnotes({search: "", frb_id: this.props.frb_id, min: 0, max: 30, page: 1})
    .then(data => {
      this.setState({
        frb_notes: data.products,
      });
    });
  }
  render () {
          if ( this.state.frb_notes[0] == null ) {
            return (
            <div></div>
            );
          } else {
          return (
     <div>
        Notes:
        <ul>
          {
            this.state.frb_notes.map(function(item, i){
            return <li key={i}>{item.note} [{item.author} {item.last_modified}]</li>
            })
         }
        </ul>
      </div>
      );
    }
  }
}

class RmpPubsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { rmp_pubs: [],
    };
  }
  componentDidMount() {
    this.findRMPpublications();
  }
  findRMPpublications() {
    productService.findrmppubs({search: "", rmp_id: this.props.rmp_id, min: 0, max: 30, page: 1})
    .then(data => {
      this.setState({
        rmp_pubs: data.products,
      });
    });
  }
  render () {
          if ( this.state.rmp_pubs[0] == null ) {
            return (
            <div></div>
            );
          } else {
          return (
     <div>
          {
            this.state.rmp_pubs.map(function(item, i){
            return <a href={item.link} key={i}>{item.reference}</a>
            })
         }
      </div>
      );
    }
  }
}

class RmpImagesComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { rmp_images: [],
                   dimensions: [],
                   objrow: [],
    };
    this.finddim = this.finddim.bind(this);
    this.finddims = this.finddims.bind(this);
  }
  componentDidMount() {
    this.findRMPimages();
  }
  findRMPimages() {
    productService.findrmpimages({search: "", rmp_id: this.props.rmp_id, min: 0, max: 30, page: 1})
    .then(data => {
        var imagesize = this.finddims(data.products);
      this.setState({
        rmp_images: data.products,
       });
    });
  }
  finddims(simage) {
      var dims = []; 
      var singledim = {};
      for (var i = 0; i < Object.keys(simage).length; i++) {
        var imgsrc = `data:image/jpeg;base64,${simage[i].image}`
        this.finddim(simage[i]);

        }
  }
  finddim(simage) {
    var imgsrc = `data:image/jpeg;base64,${simage.image}`
    var newImg = new Image();
    newImg.onload = function() {
      var height = newImg.height;
      var width = newImg.width;
      var dimensions = this.state.dimensions;
      var objrow = this.state.objrow;
      var thumbnailheight = 200;
      // extend dimensions array for new image
      dimensions.push({width: newImg.width, height: newImg.height});
      var obj = {
        src: `data:image/jpeg;base64,${simage.image}`,
        thumbnail: `data:image/jpeg;base64,${simage.image}`,
        thumbnailHeight: thumbnailheight,
        thumbnailWidth: this.calcwidth({width: newImg.width, height: newImg.height}, thumbnailheight),
        tags: [{value: `${simage.title}`, title: `${simage.title}`}], 
        caption: `${simage.caption}`}
      objrow.push(obj);
      // update state dimensions
      this.setState({
        dimensions: dimensions,
        objrow: objrow,
      });
    }.bind(this)
    // this must be done AFTER setting onload
    newImg.src = imgsrc
  }
  calcwidth(dimensions, thumbnailheight) {
    //return 320
    var ratio = thumbnailheight/dimensions.height;
    return dimensions.width * ratio
  }
  render () {
    // make sure we have all images loaded before rendering the gallery
    if ( this.state.objrow[Object.keys(this.state.rmp_images).length - 1] == null ) {
      return (
        <div></div>
      );
    } else {
      return (
        <div className='dataproducts'>
        <table className='standard' cellPadding='5px' width='100%'>
        <tbody>
        <tr><th colSpan='3'>Data Products</th></tr>
        <tr><th colSpan='3'>
        <Gallery images={this.state.objrow}
                 enableImageSelection={false}
                 rowHeight={200}
                 margin={5}/>
                 </th></tr></tbody>
                 </table>
        </div>
      );
    }
  }
}
class BSTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false,
                   hiddenColumns: this.props.hiddencols, 
                   meas: {},
                   product: [],
                   rop_notes: [],
                   image: [],
                   // initialize input fields
                   input_fields_tWM: 0.286,
                   input_fields_tH0: 69.6,
                   input_fields_tWV: 0.714,
                   // superscript letter
                   superscript_letter: 'a',
                   next_superscript_letter: 'a',
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
    <button type="button"
            style = {{ 'borderRadius': '50%', 'fontSize': '16px'}}
            className="btn btn-viscol"
            onContextMenu={this.openColumnDialog.bind(this, row)}
            onClick={this.openColumnDialog.bind(this, row)}>
  <span className="glyphicon glyphicon-info-sign"></span>
</button>
    );
  }
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
    if (!isNaN(parseFloat(meas.rmp_fluence))) {
      // use fluence value from database
      var fluence = meas.rmp_fluence;
      this.setState({ derived_fluence: fluence })
      if ((isNaN(parseFloat(meas.rmp_fluence_error_upper))) && (isNaN(parseFloat(meas.rmp_fluence_error_lower)))) {
        // set fluence_error_upper and fluence_error_lower to the value in database if available
        this.setState({ derived_fluence_error_upper: meas.fluence_error_upper,
                        derived_fluence_error_lower: meas.fluence_error_lower
                      });
      }
    }
    else {
      // calculate fluence if not in database
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
    }
    // dm_excess, redshift
    if (!isNaN(parseFloat(meas.rmp_dm)) && !isNaN(parseFloat(meas.rop_mw_dm_limit))) {
      var dm = parseFloat(meas.rmp_dm);
      var mw_dm_limit = parseFloat(meas.rop_mw_dm_limit);
      // calculate dm_excess
      var dm_excess = dm - mw_dm_limit;
      var dm_excess_error_upper = dm - (0.5 * mw_dm_limit);
      var dm_excess_error_lower = dm - (1.5 * mw_dm_limit);
      if (isNaN(parseFloat(meas.rmp_redshift_inferred))) {
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
      else {
        var redshift = meas.rmp_redshift_inferred;
        this.setState({ derived_dm_excess: dm_excess,
          derived_dm_excess_error_upper: dm_excess_error_upper,
          derived_dm_excess_error_lower: dm_excess_error_lower,
          derived_redshift: redshift
        });
      }
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
      this.calculateDerived(meas);
      this.setState({ showModal: true,
                      meas });
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
  findROPnotes() {
    productService.findropnotes({search: "", rop_id: this.props.rop_id, min: 0, max: 30, page: 1})
    .then(data => {
      this.setState({
        rop_notes: data.products,
      });
    });
  }

  render() {
    const { showModal, meas, input_fields_tWM, input_fields_tH0, input_fields_tWV } = this.state;
    if (Object.keys(this.state.product).length != 0) {
      return (
        <div>
        <Modal show={this.state.showModal} onHide={this.closeColumnDialg} dialogClassName="my-modal">
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
        <FrbNotesComponent frb_id={meas.frb_id} />
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
        <td width='50%'><b>Beam semi-major axis</b></td>
        <td width='30%'>{meas.rop_beam_semi_major_axis}</td>
        <td width='20%'>[MM]</td>
        </tr>
        <tr>
        <td width='50%'><b>Beam semi-minor axis</b></td>
        <td width='30%'>{meas.rop_beam_semi_minor_axis}</td>
        <td width='20%'>[MM]</td>
        </tr>
        <tr>
        <td width='50%'><b>Beam rotation angle</b></td>
        <td width='30%'>{meas.rop_beam_rotation_angle}</td>
        <td width='20%'>[Deg]</td>
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
        <td width='30%'>{meas.rop_tsys}</td>
        <td width='20%'>[K]</td>
        </tr>
        <tr>
        <td width='50%'><b>Reference</b></td>
        <td colSpan='2'><RmpPubsComponent rmp_id={meas.rmp_id} /></td>
        </tr>
        <tr>
        <td width='50%'><b>Raw Data</b></td>
        <td colSpan='2'>{linkFormatter(meas.o_data_link)}</td>
        </tr>
        </tbody>
        </table>
        <RopNotesComponent rop_id={meas.rop_id} />
        <div className='rmp'>
        <table className='standard' cellPadding='5px' width='100%'>
        <tbody>
        <tr><th colSpan='3'>Measured Parameters</th></tr>
        <tr>
        <td width='50%'><b>RAJ</b></td>
        <td width='30%'>{meas.rop_raj}</td>
        <td width='20%'>[J2000]</td>
        </tr>
        <tr>
        <td width='50%'><b>DECJ</b></td>
        <td width='30%'>{meas.rop_decj}</td>
        <td width='20%'>[J2000]</td>
        </tr>
        <tr>
        <td width='50%'><b>gl</b></td>
        <td width='30%'>{meas.rop_gl}</td>
        <td width='20%'>[deg]</td>
        </tr>
        <tr>
        <td width='50%'><b>gb</b></td>
          <td width='30%'>{meas.rop_gb}</td>
        <td width='20%'>[deg]</td>
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
        <td width='50%'><b>{subsupstr_formatter('W', 'obs', '', '')}</b></td>
        <td width='30%'>{supsub_formatter(meas.rmp_width, meas.rmp_width_error_upper, meas.rmp_width_error_lower)}</td>
        <td width='20%'>[ms]</td>
        </tr>
        <tr>
        <td width='50%'><b>{subsupstr_formatter('S', 'peak,obs', '', '')}</b></td>
        <td width='30%'>{supsub_formatter(meas.rmp_flux, meas.rmp_flux_error_upper, meas.rmp_flux_error_lower)}</td>
        <td width='20%'>[Jy]</td>
        </tr>
        <tr>
        <td width='50%'><b>{subsupstr_formatter('F', 'obs', '', '')}</b></td>
        <td width='30%'>{supsub_formatter(parseFloat(this.state.derived_fluence).toFixed(2), this.state.derived_fluence_error_upper, this.state.derived_fluence_error_lower)}</td>
        <td width='20%'>[Jy ms]</td>
        </tr>
        <tr>
        <td width='50%'><b>DM Index</b></td>
        <td colSpan='2'>{plusmn_formatter(meas.rmp_dm_index, meas.rmp_dm_index_error)}</td>
        </tr>
        <tr>
        <td width='50%'><b>Dispersion smearing</b></td>
        <td width='30%'>{meas.rmp_dispersion_smearing}</td>
        <td width='20%'>[ms]</td>
        </tr>
        <tr>
        <td width='50%'><b>Scattering Index</b></td>
        <td colSpan='2'>{plusmn_formatter(meas.rmp_scattering_index, meas.rmp_scattering_index_error)}</td>
        </tr>
        <tr>
        <td width='50%'><b>{subsupstr_formatter('Scattering', '', meas.rmp_scattering_model, 'a')}</b></td>
        <td width='30%'>{plusmn_formatter(meas.rmp_scattering, meas.rmp_scattering_error)}</td>
        <td width='20%'>[ms]</td>
        </tr>
        <tr>
        <td width='50%'><b>Scattering timescale</b></td>
        <td width='30%'>{meas.rmp_scattering_timescale}</td>
        <td width='20%'>[ms]</td>
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
        <td width='40%'><b>{subsupstr_formatter('Redshift', 'inferred', '', '')}</b></td>
        <td colSpan='2'>{parseFloat(this.state.derived_redshift).toFixed(2)}</td>
        </tr>
        <tr>
        <td width='40%'><b>{subsupstr_formatter('Redshift', 'host', '', '')}</b></td>
        <td colSpan='2'>{parseFloat(meas.rmp_redshift_host).toFixed(2)}</td>
        </tr>
        </tbody>
        </table>
        <RmpNotesComponent rmp_id={meas.rmp_id} />
        <table width='100%'>
        <tbody className='selectcol'>
        <tr><td width='50%'>
        <table className='standard' cellPadding='5px' width='50%'>
        <tbody>
        <tr><th colSpan='3'>Derived Parameters</th></tr>
        <tr>
        <td width='40%'><b>{subsupstr_formatter('DM', 'galaxy', meas.rop_galactic_electron_model, 'b')}</b></td>
        <td width='30%'>{parseFloat(meas.rop_mw_dm_limit).toFixed(2)}</td>
        <td width='30%'>[cm<sup>-3</sup> pc]</td>
        </tr>
        <tr>
        <td width='40%'><b>{subsupstr_formatter('DM', 'excess', '', '')}</b></td>
        <td width='30%'>{parseFloat(this.state.derived_dm_excess).toFixed(2)}</td>
        <td width='30%'>[cm<sup>-3</sup> pc]</td>
        </tr>
        <tr>
        <td width='40%'><b>{subsupstr_formatter('D', 'comoving', '', '')}</b></td>
        <td width='30%'>{parseFloat(this.state.derived_dist_comoving).toFixed(2)}</td>
        <td width='30%'>[Gpc]</td>
        </tr>
        <tr>
        <td width='40%'><b>{subsupstr_formatter('D', 'luminosity', '', '')}</b></td>
        <td width='30%'>{parseFloat(this.state.derived_dist_luminosity).toFixed(2)}</td>
        <td width='30%'>[Gpc]</td>
        </tr>
        <tr>
        <td width='40%'><b>Energy</b></td>
        <td width='30%'>{parseFloat(this.state.derived_energy).toFixed(2)}</td>
        <td width='30%'>[10<sup>32</sup> J]</td>
        </tr>
        </tbody>
        </table>
        </td>
        <td width='50%'>
        <form name='getval'>
        <table className='standard'>
        <tbody>
        <tr><th colSpan='2'>Cosmological Parameters</th></tr>
        <tr><td>{subsupstr_formatter('Omega','M', '', '')}</td><td><input type='number' name='input_fields_tWM' defaultValue={this.state.input_fields_tWM} onChange={this.updateField.bind(this)} size='4'></input></td></tr>
        <tr><td>{subsupstr_formatter('H', 'o', '', '')}</td><td><input type='number' name='input_fields_tH0' defaultValue={this.state.input_fields_tH0}
        onChange={this.updateField.bind(this)} size='4'></input></td></tr>
        <tr><td>{subsupstr_formatter('Omega', 'vac', '', '')}</td><td><input type='number' name='input_fields_tWV' defaultValue={this.state.input_fields_tWV}
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
        </div>
        </td>
        </tr>
        </tbody>
        </table>
        <RmpImagesComponent rmp_id={meas.rmp_id} />
        {superscript_list([meas.rmp_scattering_model, meas.rop_galactic_electron_model])}
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
      <TableHeaderColumn ref='rop_beam_semi_major_axis'
      dataField='rop_beam_semi_major_axis'
      hidden={this.state.hiddenColumns.rop_beam_semi_major_axis}
      dataSort>
      Beam semi-major axis
      </TableHeaderColumn>
      <TableHeaderColumn ref='rop_beam_semi_minor_axis'
      dataField='rop_beam_semi_minor_axis'
      hidden={this.state.hiddenColumns.rop_beam_semi_minor_axis}
      dataSort>
      Beam semi-minor axis
      </TableHeaderColumn>
      <TableHeaderColumn ref='rop_beam_rotation_angle'
      dataField='rop_beam_rotation_angle'
      hidden={this.state.hiddenColumns.rop_beam_rotation_angle}
      dataSort>
      Beam rotation angle
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
      <TableHeaderColumn ref='rop_mw_dm_limit'
      dataField='rop_mw_dm_limit'
      hidden={this.state.hiddenColumns.rop_mw_dm_limit}
      dataSort>
      DM<sub>galaxy</sub>
      </TableHeaderColumn>
      <TableHeaderColumn ref='rop_galactic_electron_model'
      dataField='rop_galactic_electron_model'
      hidden={this.state.hiddenColumns.rop_galactic_electron_model}
      dataSort>
      Galactic electron model
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
      <TableHeaderColumn ref='rmp_scattering'
      dataField='rmp_scattering'
      dataFormat={ nanFormatter }
      hidden={this.state.hiddenColumns.rmp_scattering}
      dataSort>
      Scattering
      </TableHeaderColumn>
      <TableHeaderColumn ref='rmp_scattering_model'
      dataField='rmp_scattering_model'
      dataFormat={ nanFormatter }
      hidden={this.state.hiddenColumns.rmp_scattering_model}
      dataSort>
      Scattering model
      </TableHeaderColumn>
      <TableHeaderColumn ref='rmp_scattering_timescale'
      dataField='rmp_scattering_timescale'
      dataFormat={ nanFormatter }
      hidden={this.state.hiddenColumns.rmp_scattering_timescale}
      dataSort>
      Scattering timescale
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
      <TableHeaderColumn ref='rmp_rm'
      dataField='rmp_rm'
      dataFormat={ nanFormatter }
      hidden={this.state.hiddenColumns.rmp_rm}
      dataSort>
      RM
      </TableHeaderColumn>
      <TableHeaderColumn ref='rmp_redshift_inferred'
      dataField='rmp_redshift_inferred'
      dataFormat={ nanFormatter }
      hidden={this.state.hiddenColumns.rmp_redshift_inferred}
      dataSort>
      Redshift<sub>inferred</sub>
      </TableHeaderColumn>
      <TableHeaderColumn ref='rmp_redshift_host'
      dataField='rmp_redshift_host'
      dataFormat={ nanFormatter }
      hidden={this.state.hiddenColumns.rmp_redshift_host}
      dataSort>
      Redshift<sub>host</sub>
      </TableHeaderColumn>
      <TableHeaderColumn ref='rmp_fluence'
      dataField='rmp_fluence'
      dataFormat={ nanFormatter }
      hidden={this.state.hiddenColumns.rmp_fluence}
      dataSort>
      Fluence
      </TableHeaderColumn>
      <TableHeaderColumn ref='rmp_dispersion_smearing'
      dataField='rmp_dispersion_smearing'
      dataFormat={ nanFormatter }
      hidden={this.state.hiddenColumns.rmp_dispersion_smearing}
      dataSort>
      Dispersion smearing
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
      btnTitle: 'Show verified',
      verified: true,
      hiddenColumns: {
        verified: true,
        obs_type: true,
        rop_receiver: true,
        rop_backend: true,
        rop_beam: true,
        rop_beam_semi_major_axis: true,
        rop_beam_semi_minor_axis: true,
        rop_beam_rotation_angle: true,
        rop_sampling_time: true,
        rop_npol: true,
        rop_channel_bandwidth: true,
        rop_bits_per_sample: true,
        rop_gain: true,
        rop_tsys: true,
        rop_mw_dm_limit: true,
        rop_galactic_electron_model: true,
        rop_bandwidth: true,
        rop_centre_frequency: true,
        rmp_flux: true,
        rmp_dm_index: true,
        rmp_scattering_index: true,
        rmp_scattering: true,
        rmp_scattering_model: true,
        rmp_scattering_timescale: true,
        rmp_linear_poln_frac: true,
        rmp_circular_poln_frac: true,
        rmp_spectral_index: true,
        rmp_rm: true,
        rmp_redshift_inferred: true,
        rmp_redshift_host: true,
        rmp_fluence: true,
        rmp_dispersion_smearing: true,
      },
      product : {}
    };
    this.openColumnDialog = this.openColumnDialog.bind(this);
    this.showall = this.showall.bind(this);
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
      expandRowBgColor: '#B6C1C7',
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
      } else if (cname === 'rop_beam_semi_major_axis') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rop_beam_semi_major_axis: !this.state.hiddenColumns.rop_beam_semi_major_axis }) });
      } else if (cname === 'rop_beam_semi_minor_axis') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rop_beam_semi_minor_axis: !this.state.hiddenColumns.rop_beam_semi_minor_axis }) });
      } else if (cname === 'rop_beam_rotation_angle') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rop_beam_rotation_angle: !this.state.hiddenColumns.rop_beam_rotation_angle }) });
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
      } else if (cname === 'rop_mw_dm_limit') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rop_mw_dm_limit: !this.state.hiddenColumns.rop_mw_dm_limit }) });
      } else if (cname === 'rop_galactic_electron_model') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rop_galactic_electron_model: !this.state.hiddenColumns.rop_galactic_electron_model }) });
      } else if (cname === 'rmp_flux') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rmp_flux: !this.state.hiddenColumns.rmp_flux }) });
      } else if (cname === 'rmp_dm_index') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rmp_dm_index: !this.state.hiddenColumns.rmp_dm_index }) });
      } else if (cname === 'rmp_scattering_index') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rmp_scattering_index: !this.state.hiddenColumns.rmp_scattering_index }) });
      } else if (cname === 'rmp_scattering') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rmp_scattering: !this.state.hiddenColumns.rmp_scattering }) });
      } else if (cname === 'rmp_scattering') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rmp_scattering_model: !this.state.hiddenColumns.rmp_scattering_model }) });
      } else if (cname === 'rmp_scattering_model') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rmp_scattering_timescale: !this.state.hiddenColumns.rmp_scattering_timescale }) });
      } else if (cname === 'rmp_linear_poln_frac') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rmp_linear_poln_frac: !this.state.hiddenColumns.rmp_linear_poln_frac }) });
      } else if (cname === 'rmp_circular_poln_frac') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rmp_circular_poln_frac: !this.state.hiddenColumns.rmp_circular_poln_frac }) });
      } else if (cname === 'rmp_spectral_index') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rmp_spectral_index: !this.state.hiddenColumns.rmp_spectral_index }) });
      } else if (cname === 'rmp_rm') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rmp_rm: !this.state.hiddenColumns.rmp_rm }) });
      } else if (cname === 'rmp_redshift_inferred') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rmp_redshift_inferred: !this.state.hiddenColumns.rmp_redshift_inferred }) });
      } else if (cname === 'rmp_redshift_host') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rmp_redshift_host: !this.state.hiddenColumns.rmp_redshift_host }) });
      } else if (cname === 'rmp_fluence') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rmp_fluence: !this.state.hiddenColumns.rmp_fluence }) });
      } else if (cname === 'rmp_dispersion_smearing') {
        this.setState({ hiddenColumns: Object.assign(this.state.hiddenColumns, { rmp_dispersion_smearing: !this.state.hiddenColumns.rmp_dispersion_smearing }) });
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
    this.refs.rop_beam_semi_major_axis.cleanFiltered();
    this.refs.rop_beam_semi_minor_axis.cleanFiltered();
    this.refs.rop_beam_rotation_angle.cleanFiltered();
    this.refs.rop_sampling_time.cleanFiltered();
    this.refs.rop_bandwidth.cleanFiltered();
    this.refs.rop_centre_frequency.cleanFiltered();
    this.refs.rop_npol.cleanFiltered();
    this.refs.rop_channel_bandwidth.cleanFiltered();
    this.refs.rop_bits_per_sample.cleanFiltered();
    this.refs.rop_gain.cleanFiltered();
    this.refs.rop_tsys.cleanFiltered();
    this.refs.rop_mw_dm_limit.cleanFiltered();
    this.refs.rop_galactic_electron_model.cleanFiltered();
    this.refs.rmp_dm.cleanFiltered();
    this.refs.rmp_width.cleanFiltered();
    this.refs.rmp_snr.cleanFiltered();
    this.refs.rmp_flux.cleanFiltered();
    this.refs.rmp_dm_index.cleanFiltered();
    this.refs.rmp_scattering_index.cleanFiltered();
    this.refs.rmp_scattering.cleanFiltered();
    this.refs.rmp_scattering_model.cleanFiltered();
    this.refs.rmp_scattering_timescale.cleanFiltered();
    this.refs.rmp_linear_poln_frac.cleanFiltered();
    this.refs.rmp_circular_poln_frac.cleanFiltered();
    this.refs.rmp_spectral_index.cleanFiltered();
    this.refs.rmp_rm.cleanFiltered();
    this.refs.rmp_redshift_inferred.cleanFiltered();
    this.refs.rmp_redshift_host.cleanFiltered();
    this.refs.rmp_fluence.cleanFiltered();
    this.refs.rmp_dispersion_smearing.cleanFiltered();
  }
  handleClearButtonClick(onClick) {
    this.props.search('');
  }
  showall(onClick) {
    if ( this.state.verified === true) {
        // set state to verified=false
        this.setState({verified: false});
        // change button title
        this.setState({btnTitle: 'Show all'});
        // remove filter
        //this.refs.verified.cleanFiltered(); // broken
        this.refs.verified.applyFilter('');
    } else {
        // set state to verified=true
        this.setState({verified: true});
        // change button title
        this.setState({btnTitle: 'Show verified'});
        // apply filter
        this.refs.verified.applyFilter('true');
    }
  }

  createCustomClearButton(onClick) {
    return (
      <ClearSearchButton
      btnText='Clear'
      btnContextual='btn-warning'
      className='btn btn-search'
      onClick={ onClick }/>
    );
  }

  createCustomButtonGroup(props) {
    return (
      <ButtonGroup className='my-custom-class' sizeClass='btn-group-md'>
      <button type='button'
      className={ `btn btn-viscol` }
      onClick={this.openColumnDialog}>
      Visible columns
      </button>
      <button type='button'
      className={ `btn btn-info` }
      onClick={this.showall}>
      {this.state.btnTitle}
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
        <input type="checkbox" onChange={this.changeColumn('rop_beam_semi_major_axis')} checked={!this.state.hiddenColumns.rop_beam_semi_major_axis} /> Beam semi-major axis<br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rop_beam_semi_minor_axis')} checked={!this.state.hiddenColumns.rop_beam_semi_minor_axis} /> Beam semi-minor axis<br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rop_beam_rotation_angle')} checked={!this.state.hiddenColumns.rop_beam_rotation_angle} /> Beam rotation angle <br />
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
        <input type="checkbox" onChange={this.changeColumn('rop_mw_dm_limit')} checked={!this.state.hiddenColumns.rop_mw_dm_limit} /> DM<sub>galaxy</sub> <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rop_galactic_electron_model')} checked={!this.state.hiddenColumns.rop_galactic_electron_model} /> Galactic electron model <br />
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
        <input type="checkbox" onChange={this.changeColumn('rmp_scattering')} checked={!this.state.hiddenColumns.rmp_scattering} /> Scattering <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rmp_scattering_model')} checked={!this.state.hiddenColumns.rmp_scattering_model} /> Scattering model<br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rmp_scattering_timescale')} checked={!this.state.hiddenColumns.rmp_scattering_timescale} /> Scattering timescale<br />
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
        <input type="checkbox" onChange={this.changeColumn('rmp_rm')} checked={!this.state.hiddenColumns.rmp_rm} /> RM <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rmp_redshift_inferred')} checked={!this.state.hiddenColumns.rmp_redshift_inferred} /> Redshift<sub>inferred</sub> <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rmp_redshift_host')} checked={!this.state.hiddenColumns.rmp_redshift_host} /> Redshift<sub>host</sub> <br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rmp_fluence')} checked={!this.state.hiddenColumns.rmp_fluence} /> Fluence<br />
        </td>
        </tr>
        <tr>
        <td>
        <input type="checkbox" onChange={this.changeColumn('rmp_dispersion_smearing')} checked={!this.state.hiddenColumns.rmp_dispersion_smearing} /> Dispersion smearing<br />
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
        <TableHeaderColumn ref='verified'
                           dataField='verified'
                           hidden={this.state.hiddenColumns.verified}
                           filter={{type: 'TextFilter', delay: 0, defaultValue: 'true' }}
                           dataSort
                           width='100px'>
                           verified
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
        <TableHeaderColumn ref='rop_beam_semi_major_axis'
                           dataField='rop_beam_semi_major_axis'
                           hidden={this.state.hiddenColumns.rop_beam_semi_major_axis}
                           dataSort
                           width='100px'>
                           Beam semi-major axis
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rop_beam_semi_minor_axis'
                           dataField='rop_beam_semi_minor_axis'
                           hidden={this.state.hiddenColumns.rop_beam_semi_minor_axis}
                           dataSort
                           width='100px'>
                           Beam semi-minor axis
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rop_beam_rotation_angle'
                           dataField='rop_beam_rotation_angle'
                           hidden={this.state.hiddenColumns.rop_beam_rotation_angle}
                           dataSort
                           width='100px'>
                           Beam rotation angle
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
        <TableHeaderColumn ref='rop_mw_dm_limit'
                           dataField='rop_mw_dm_limit'
                           hidden={this.state.hiddenColumns.rop_mw_dm_limit}
                           dataSort
                           width='100px'>
                           DM<sub>galaxy</sub>
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rop_galactic_electron_model'
                           dataField='rop_galactic_electron_model'
                           hidden={this.state.hiddenColumns.rop_galactic_electron_model}
                           dataSort
                           width='100px'>
                           Galactic electron model
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
        <TableHeaderColumn ref='rmp_scattering'
                           dataField='rmp_scattering'
                           dataFormat={ nanFormatter }
                           hidden={this.state.hiddenColumns.rmp_scattering}
                           dataSort
                           width='100px'>
                           Scattering
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rmp_scattering_model'
                           dataField='rmp_scattering_model'
                           dataFormat={ nanFormatter }
                           hidden={this.state.hiddenColumns.rmp_scattering_model}
                           dataSort
                           width='100px'>
                           Scattering model
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rmp_scattering_timescale'
                           dataField='rmp_scattering_timescale'
                           dataFormat={ nanFormatter }
                           hidden={this.state.hiddenColumns.rmp_scattering_timescale}
                           dataSort
                           width='100px'>
                           Scattering timescale
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
        <TableHeaderColumn ref='rmp_rm'
                           dataField='rmp_rm'
                           dataFormat={ nanFormatter }
                           hidden={this.state.hiddenColumns.rmp_rm}
                           dataSort
                           sortFunc={ NaturalSortFunc }
                           width='100px'>
                           RM
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rmp_redshift_inferred'
                           dataField='rmp_redshift_inferred'
                           dataFormat={ nanFormatter }
                           hidden={this.state.hiddenColumns.rmp_redshift_inferred}
                           dataSort
                           width='100px'>
                           Redshift<sub>inferred</sub>
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rmp_redshift_host'
                           dataField='rmp_redshift_host'
                           dataFormat={ nanFormatter }
                           hidden={this.state.hiddenColumns.rmp_redshift_host}
                           dataSort
                           width='100px'>
                           Redshift<sub>host</sub>
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rmp_fluence'
                           dataField='rmp_fluence'
                           dataFormat={ nanFormatter }
                           hidden={this.state.hiddenColumns.rmp_fluence}
                           dataSort
                           width='100px'>
                           Fluence
                           </TableHeaderColumn>
        <TableHeaderColumn ref='rmp_dispersion_smearing'
                           dataField='rmp_dispersion_smearing'
                           dataFormat={ nanFormatter }
                           hidden={this.state.hiddenColumns.rmp_dispersion_smearing}
                           dataSort
                           width='100px'>
                           Dispersion smearing
                           </TableHeaderColumn>
        </BootstrapTable>
        </div>
    );
  }
}
