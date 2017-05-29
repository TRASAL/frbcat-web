"use strict";

let db = require('./pghelper');

let escape = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

let findAll = (req, res, next) => {

    let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 12,
        page = req.query.page ? parseInt(req.query.page) : 1,
        search = req.query.search,
        min = req.query.min,
        max = req.query.max,
        whereParts = [],
        values = [];

    let where = whereParts.length > 0 ? ("WHERE " + whereParts.join(" AND ")) : "";

    let countSql = "SELECT COUNT(*) from spot_view WHERE rmp_rank=1" + where;
    //let sql = "SELECT * from spot_view WHERE rmp_rank=1";
    let sql = ["SELECT f.name as frb_name, ",
               "o.telescope,to_char(o.utc, 'YYYY/MM/DD HH24:MI:SS') as utc, ",
               "rop.raj as rop_raj, rop.decj as rop_decj, ",
               "rop.gl as rop_gl, rop.gb as rop_gb, ",
               "rop.receiver as rop_receiver, rop.backend as rop_backend, ",
               "rop.beam as rop_beam, rop.pointing_error as rop_pointing_error, ",
               "rop.fwhm as rop_fwhm, rop.sampling_time as rop_sampling_time, ",
               "rop.bandwidth as rop_bandwidth, rop.centre_frequency as rop_centre_frequency, ",
               "rop.npol as rop_npol, rop.channel_bandwidth as rop_channel_bandwidth, ",
               "rop.bits_per_sample as rop_bits_per_sample, ",
               "rop.gain as rop_gain, rop.tsys as rop_tsys, ",
               "rop.ne2001_dm_limit as rop_ne2001_dm_limit, ",
               "COALESCE(rmp.dm::text || '&plusmn' || rmp.dm_error::text, rmp.dm::text) AS rmp_dm, ",
               "rmp.snr as rmp_snr, ",
               "COALESCE(rmp.width::text || '<span class=''subsup''><sup>+' || rmp.width_error_upper::text || '</sup><sub>-'|| rmp.width_error_lower::text || '</sub></span>', rmp.width::text) as rmp_width, ",
               "COALESCE(rmp.flux::text || '<span class=''subsup''><sup>+' || rmp.flux_error_upper::text || '</sup><sub>-'|| rmp.flux_error_lower::text || '</sub></span>', rmp.flux::text) as rmp_flux, ",
               "COALESCE(rmp.dm_index::text || '&plusmn' || rmp.dm_index_error::text, rmp.dm_index::text) AS rmp_dm_index, ",
               "COALESCE(rmp.scattering_index::text || '&plusmn' || rmp.scattering_index_error::text, rmp.scattering_index::text) AS rmp_scattering_index, ",
               "COALESCE(rmp.scattering_time::text || '&plusmn' || rmp.scattering_time_error::text, rmp.scattering_time::text) AS rmp_scattering_time, ",
               "COALESCE(rmp.linear_poln_frac::text || '&plusmn' || rmp.linear_poln_frac_error::text, rmp.linear_poln_frac::text) AS rmp_linear_poln_frac, ",
               "COALESCE(rmp.circular_poln_frac::text || '&plusmn' || rmp.circular_poln_frac_error::text, rmp.circular_poln_frac::text) AS rmp_circular_poln_frac, ",
               "COALESCE(rmp.spectral_index::text || '&plusmn' || rmp.spectral_index_error::text, rmp.spectral_index::text) AS rmp_spectral_index, ",
               "COALESCE(rmp.z_phot::text || '&plusmn' || rmp.z_phot_error::text, rmp.z_phot::text) AS rmp_z_phot, ",
               "COALESCE(rmp.z_spec::text || '&plusmn' || rmp.z_spec_error::text, rmp.z_spec::text) AS rmp_z_spec ",
               "FROM frbs f JOIN observations o ON (f.id = o.frb_id) ",
               "JOIN radio_observations_params rop ON (o.id = rop.obs_id) ",
               "JOIN radio_measured_params rmp ON (rop.id = rmp.rop_id) ",
               "JOIN authors armp ON (rmp.author_id = armp.id) ",
               "WHERE (rmp.rank = 1) ORDER BY f.name,o.utc"].join('\n');
    db.query(countSql, values)
        .then(result => {
            let total = parseInt(result[0].count);
            db.query(sql, values.concat([]))
                .then(products => {
                    return res.json({"pageSize": pageSize, "page": page, "total": total, "products": products});
                })
                .catch(next);
        })
        .catch(next);
};

let findById = (req, res, next) => {
  let id = req.params.id;

  let sql = "SELECT * from spot_view WHERE frb_name = $1";

  db.query(sql, ['FRB010125'])
  .then(product => res.json(product[0]))
  .catch(next);
};

let findByFRB = (req, res, next) => {
  let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 12,
  page = req.query.page ? parseInt(req.query.page) : 1,
  search = req.query.search,
  min = req.query.min,
  max = req.query.max,
  whereParts = [],
  values = [];
  let frb_name = req.params.frb_name;
  let where = whereParts.length > 0 ? ("WHERE " + whereParts.join(" AND ")) : "";
  let countSql = "SELECT COUNT(*) from spot_view WHERE frb_name = '" + frb_name + "'";
  //let sql = "SELECT * from spot_view WHERE frb_name = '" + frb_name + "'";
  let sql = ["SELECT f.name as frb_name, ",
  "o.telescope,to_char(o.utc, 'YYYY/MM/DD HH24:MI:SS') as utc, ",
  "rop.raj as rop_raj, rop.decj as rop_decj, ",
  "rop.gl as rop_gl, rop.gb as rop_gb, ",
  "rop.receiver as rop_receiver, rop.backend as rop_backend, ",
  "rop.beam as rop_beam, rop.pointing_error as rop_pointing_error, ",
  "rop.fwhm as rop_fwhm, rop.sampling_time as rop_sampling_time, ",
  "rop.bandwidth as rop_bandwidth, rop.centre_frequency as rop_centre_frequency, ",
  "rop.npol as rop_npol, rop.channel_bandwidth as rop_channel_bandwidth, ",
  "rop.bits_per_sample as rop_bits_per_sample, ",
  "rop.gain as rop_gain, rop.tsys as rop_tsys, ",
  "rop.ne2001_dm_limit as rop_ne2001_dm_limit, ",
  "COALESCE(rmp.dm::text || '&plusmn' || rmp.dm_error::text, rmp.dm::text) AS rmp_dm, ",
  "rmp.snr as rmp_snr, ",
  "COALESCE(rmp.width::text || '<span class=''subsup''><sup>+' || rmp.width_error_upper::text || '</sup><sub>-'|| rmp.width_error_lower::text || '</sub></span>', rmp.width::text) as rmp_width, ",
  "COALESCE(rmp.flux::text || '<span class=''subsup''><sup>+' || rmp.flux_error_upper::text || '</sup><sub>-'|| rmp.flux_error_lower::text || '</sub></span>', rmp.flux::text) as rmp_flux, ",
  "COALESCE(rmp.dm_index::text || '&plusmn' || rmp.dm_index_error::text, rmp.dm_index::text) AS rmp_dm_index, ",
  "COALESCE(rmp.scattering_index::text || '&plusmn' || rmp.scattering_index_error::text, rmp.scattering_index::text) AS rmp_scattering_index, ",
  "COALESCE(rmp.scattering_time::text || '&plusmn' || rmp.scattering_time_error::text, rmp.scattering_time::text) AS rmp_scattering_time, ",
  "COALESCE(rmp.linear_poln_frac::text || '&plusmn' || rmp.linear_poln_frac_error::text, rmp.linear_poln_frac::text) AS rmp_linear_poln_frac, ",
  "COALESCE(rmp.circular_poln_frac::text || '&plusmn' || rmp.circular_poln_frac_error::text, rmp.circular_poln_frac::text) AS rmp_circular_poln_frac, ",
  "COALESCE(rmp.spectral_index::text || '&plusmn' || rmp.spectral_index_error::text, rmp.spectral_index::text) AS rmp_spectral_index, ",
  "COALESCE(rmp.z_phot::text || '&plusmn' || rmp.z_phot_error::text, rmp.z_phot::text) AS rmp_z_phot, ",
  "COALESCE(rmp.z_spec::text || '&plusmn' || rmp.z_spec_error::text, rmp.z_spec::text) AS rmp_z_spec ",
  "FROM frbs f JOIN observations o ON (f.id = o.frb_id) ",
  "JOIN radio_observations_params rop ON (o.id = rop.obs_id) ",
  "JOIN radio_measured_params rmp ON (rop.id = rmp.rop_id) ",
  "JOIN authors armp ON (rmp.author_id = armp.id) ",
  "WHERE (f.name = '" + frb_name + "') ORDER BY f.name,o.utc"].join('\n');
  db.query(countSql, values)
  .then(result => {
    let total = parseInt(result[0].count);
    db.query(sql, values.concat([]))
    .then(products => {
      return res.json({"pageSize": pageSize, "page": page, "total": total, "products": products});
    })
    .catch(next);
  })
  .catch(next);
};


exports.findAll = findAll;
exports.findById = findById;
exports.findByFRB = findByFRB;
