import request from '../request';

let baseURL = "";

export let findAll = (values) => {
    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
        qs = "?" + qs;
    }
    return request({url: baseURL + "/products" + qs})
        .then(data => data = JSON.parse(data))
}

export let findById = () => {
    return request({url: baseURL + "/products/" + id})
        .then(data => data = JSON.parse(data))
}

export let findByFRB = (values) => {
    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
        qs = "?" + qs;
    }
    return request({url: baseURL + "/product/" + values.frb_name})
  .then(data => data = JSON.parse(data))
}

export let findropnotes = (values) => {
    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
        qs = "?" + qs;
    }
    return request({url: baseURL + "/ropnotes/" + values.rop_id})
        .then(data => data = JSON.parse(data))
}

export let findrmpnotes = (values) => {
    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
        qs = "?" + qs;
    }
    return request({url: baseURL + "/rmpnotes/" + values.rmp_id})
        .then(data => data = JSON.parse(data))
}

export let findfrbnotes = (values) => {
    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
        qs = "?" + qs;
    }
    return request({url: baseURL + "/frbnotes/" + values.frb_id})
        .then(data => data = JSON.parse(data))
}


/*
export let findImages = (values) => {
  let qs = "";
  if (values) {
    qs = Object.keys(values).map(key => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
    }).join('&');
    qs = "?" + qs;
  }
  return request({url: baseURL + "/images/" + values.rmp_id})
  .then(data => data = JSON.parse(data))
}
*/
