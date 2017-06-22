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
               "rmp.width as rmp_width, ",
               "rmp.flux as rmp_flux, ",
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
            db.query(sql, values.concat([]))
                .then(products => {
                    return res.json({"products": products});
                })
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
  "rmp.dm as rmp_dm, rmp.dm_error as rmp_dm_error, ",
  "rmp.snr as rmp_snr, ",
  "rmp.width as rmp_width, ",
  "rmp.width_error_upper as rmp_width_error_upper, ",
  "rmp.width_error_lower as rmp_width_error_lower, ",
  "rmp.flux as rmp_flux, ",
  "rmp.flux_error_upper as rmp_flux_error_upper, ",
  "rmp.flux_error_lower as rmp_flux_error_lower, ",
  "rmp.dm_index as rmp_dm_index, rmp.dm_index_error as rmp_dm_index_error, ",
  "rmp.scattering_index as rmp_scattering_index, ",
  "rmp.scattering_index_error as rmp_scattering_index_error, ",
  "rmp.scattering_time as rmp_scattering_time, ",
  "rmp.scattering_time_error as rmp_scattering_time_error, ",
  "rmp.linear_poln_frac as rmp_linear_poln_frac, ",
  "rmp.linear_poln_frac_error as rmp_linear_poln_frac_error, ",
  "rmp.circular_poln_frac as rmp_circular_poln_frac, ",
  "rmp.circular_poln_frac_error as rmp_circular_poln_frac_error, ",
  "rmp.spectral_index as rmp_spectral_index, ",
  "rmp.spectral_index_error as rmp_spectral_index_error, ",
  "rmp.z_phot as rmp_z_phot, rmp.z_phot_error as rmp_z_phot_error, ",
  "rmp.z_phot as rmp_z_spec, rmp.z_phot_error as rmp_z_spec_error, ",
  "rmp.id as rmp_id, ",
  // begin add extra formatting
  "COALESCE(rmp.dm::text || '&plusmn' || rmp.dm_error::text, rmp.dm::text) AS rmp_dm_frmt, ",
  "rmp.snr as rmp_snr_frmt, ",
  "COALESCE(rmp.width::text || '<span className=''supsub''><sup>+' || rmp.width_error_upper::text || '</sup><sub>-'|| rmp.width_error_lower::text || '</sub></span>', rmp.width::text) as rmp_width_frmt, ",
  "COALESCE(rmp.flux::text || '<span className=''supsub''><sup>+' || rmp.flux_error_upper::text || '</sup><sub>-'|| rmp.flux_error_lower::text || '</sub></span>', rmp.flux::text) as rmp_flux_frmt, ",
  "COALESCE(rmp.dm_index::text || '&plusmn' || rmp.dm_index_error::text, rmp.dm_index::text) AS rmp_dm_index_frmt, ",
  "COALESCE(rmp.scattering_index::text || '&plusmn' || rmp.scattering_index_error::text, rmp.scattering_index::text) AS rmp_scattering_index_frmt, ",
  "COALESCE(rmp.scattering_time::text || '&plusmn' || rmp.scattering_time_error::text, rmp.scattering_time::text) AS rmp_scattering_time_frmt, ",
  "COALESCE(rmp.linear_poln_frac::text || '&plusmn' || rmp.linear_poln_frac_error::text, rmp.linear_poln_frac::text) AS rmp_linear_poln_frac_frmt, ",
  "COALESCE(rmp.circular_poln_frac::text || '&plusmn' || rmp.circular_poln_frac_error::text, rmp.circular_poln_frac::text) AS rmp_circular_poln_frac_frmt, ",
  "COALESCE(rmp.spectral_index::text || '&plusmn' || rmp.spectral_index_error::text, rmp.spectral_index::text) AS rmp_spectral_index_frmt, ",
  "COALESCE(rmp.z_phot::text || '&plusmn' || rmp.z_phot_error::text, rmp.z_phot::text) AS rmp_z_phot_frmt, ",
  "COALESCE(rmp.z_spec::text || '&plusmn' || rmp.z_spec_error::text, rmp.z_spec::text) AS rmp_z_spec_frmt ",
  // end add extra formatting
  "FROM frbs f JOIN observations o ON (f.id = o.frb_id) ",
  "JOIN radio_observations_params rop ON (o.id = rop.obs_id) ",
  "JOIN radio_measured_params rmp ON (rop.id = rmp.rop_id) ",
  "JOIN authors armp ON (rmp.author_id = armp.id) ",
  "WHERE (f.name = '" + frb_name + "') ORDER BY f.name,o.utc"].join('\n');
  console.log(sql);
    db.query(sql, values.concat([]))
    .then(products => {
      return res.json({"products": products});
    })
    .catch(next);
};

/*
let findImages = (req, res, next) => {
  let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 12,
  page = req.query.page ? parseInt(req.query.page) : 1,
  search = req.query.search,
  min = req.query.min,
  max = req.query.max,
  whereParts = [],
  values = [];
  let rmp_id = req.params.rmp_id;
  let sql = ["SELECT ri.caption as ri_caption, ",
  "ri.image as ri_image ",
  "FROM radio_measured_params rmp JOIN radio_images_have_radio_measured_params ri_rmp ON (rmp.id = ri_rmp.rmp_id) ",
  "JOIN radio_images ri ON (ri.id = ri_rmp.radio_image_id) ",
  "WHERE (rmp.id = '" + rmp_id + "')"].join('\n');
  console.log(sql);
    db.query(sql, values.concat([]))
    .then(images => {
      return res.json({"images": images});
    })
    .catch(next);
};
*/

exports.findAll = findAll;
exports.findByFRB = findByFRB;
//exports.findImages = findImages;
