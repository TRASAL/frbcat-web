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
               "o.telescope,to_char(o.utc, 'YYYY/MM/DD HH24:MI:SS.MS') as utc, ",
               "o.verified as verified, ",
               "rop.raj as rop_raj, rop.decj as rop_decj, ",
               "rop.gl as rop_gl, rop.gb as rop_gb, ",
               "rop.receiver as rop_receiver, rop.backend as rop_backend, ",
               "rop.beam_semi_major_axis as rop_beam_semi_major_axis, ",
               "rop.beam_semi_minor_axis as rop_beam_semi_minor_axis, ",
               "rop.beam_rotation_angle as rop_beam_rotation_angle, ",
               "rop.beam as rop_beam, ",
               "rop.sampling_time as rop_sampling_time, ",
               "rop.bandwidth as rop_bandwidth, rop.centre_frequency as rop_centre_frequency, ",
               "rop.npol as rop_npol, ",
               "rop.bits_per_sample as rop_bits_per_sample, ",
               "rop.gain as rop_gain, rop.tsys as rop_tsys, ",
               "rop.mw_dm_limit as rop_mw_dm_limit, ",
               "rop.galactic_electron_model as rop_galactic_electron_model, ",
               "COALESCE(rmp.dm::text || '&plusmn' || rmp.dm_error::text, rmp.dm::text) AS rmp_dm, ",
               "rmp.snr as rmp_snr, ",
               "rmp.width as rmp_width, ",
               "rmp.flux as rmp_flux, ",
               "rmp.rm_error as rmp_rm_error, ",
               "rmp.redshift_host as rmp_redshift_host, ",
               "rmp.dispersion_smearing as rmp_dispersion_smearing, ",
               "rmp.scattering_model as rmp_scattering_model, ",
               "rmp.scattering_timescale as rmp_scattering_timescale, ",
               "COALESCE(rmp.rm::text || '&plusmn' || rmp.rm_error::text, rmp.rm::text) AS rmp_rm, ",
               "COALESCE(rmp.dm_index::text || '&plusmn' || rmp.dm_index_error::text, rmp.dm_index::text) AS rmp_dm_index, ",
               "COALESCE(rmp.scattering_index::text || '&plusmn' || rmp.scattering_index_error::text, rmp.scattering_index::text) AS rmp_scattering_index, ",
               "COALESCE(rmp.scattering::text || '&plusmn' || rmp.scattering_error::text, rmp.scattering::text) AS rmp_scattering, ",
               "COALESCE(rmp.linear_poln_frac::text || '&plusmn' || rmp.linear_poln_frac_error::text, rmp.linear_poln_frac::text) AS rmp_linear_poln_frac, ",
               "COALESCE(rmp.circular_poln_frac::text || '&plusmn' || rmp.circular_poln_frac_error::text, rmp.circular_poln_frac::text) AS rmp_circular_poln_frac, ",
               "COALESCE(rmp.spectral_index::text || '&plusmn' || rmp.spectral_index_error::text, rmp.spectral_index::text) AS rmp_spectral_index ",
               "FROM frbs f JOIN observations o ON (f.id = o.frb_id) ",
               "JOIN radio_observations_params rop ON (o.id = rop.obs_id) ",
               "JOIN radio_measured_params rmp ON (rop.id = rmp.rop_id) ",
               "JOIN authors armp ON (rmp.author_id = armp.id) ",
               "WHERE (rmp.rank = 1 AND f.private = FALSE) ORDER BY f.name,o.utc"].join('\n');
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
  "f.id as frb_id, ",
  "o.telescope,to_char(o.utc, 'YYYY/MM/DD HH24:MI:SS.MS') as utc, ",
  "o.data_link as o_data_link, ",
  "rop.raj as rop_raj, rop.decj as rop_decj, ",
  "rop.gl as rop_gl, rop.gb as rop_gb, ",
  "rop.receiver as rop_receiver, rop.backend as rop_backend, ",
  "rop.beam_semi_major_axis as rop_beam_semi_major_axis, ",
  "rop.beam_semi_minor_axis as rop_beam_semi_minor_axis, ",
  "rop.beam_rotation_angle as rop_beam_rotation_angle, ",
  "rop.beam as rop_beam, ",
  "rop.sampling_time as rop_sampling_time, ",
  "rop.bandwidth as rop_bandwidth, rop.centre_frequency as rop_centre_frequency, ",
  "rop.npol as rop_npol, ",
  "(rop.bandwidth/rop.nchan) as rop_channel_bandwidth, ",
  "rop.bits_per_sample as rop_bits_per_sample, ",
  "rop.gain as rop_gain, rop.tsys as rop_tsys, ",
  "rop.mw_dm_limit as rop_mw_dm_limit, ",
  "rop.galactic_electron_model as rop_galactic_electron_model, ",
  "rop.id as rop_id, ",
  "rmp.dm as rmp_dm, rmp.dm_error as rmp_dm_error, ",
  "rmp.rm as rmp_rm, rmp.rm_error as rmp_rm_error, ",
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
  "rmp.scattering as rmp_scattering, ",
  "rmp.scattering_error as rmp_scattering_error, ",
  "rmp.linear_poln_frac as rmp_linear_poln_frac, ",
  "rmp.linear_poln_frac_error as rmp_linear_poln_frac_error, ",
  "rmp.circular_poln_frac as rmp_circular_poln_frac, ",
  "rmp.circular_poln_frac_error as rmp_circular_poln_frac_error, ",
  "rmp.spectral_index as rmp_spectral_index, ",
  "rmp.spectral_index_error as rmp_spectral_index_error, ",
  "rmp.redshift_inferred as rmp_redshift_inferred, ",
  "rmp.redshift_host as rmp_redshift_host, ",
  "rmp.dispersion_smearing as rmp_dispersion_smearing, ",
  "rmp.scattering_model as rmp_scattering_model, ",
  "rmp.scattering_timescale as rmp_scattering_timescale, ",
  "rmp.fluence as rmp_fluence, ",
  "rmp.fluence_error_upper as rmp_fluence_error_upper, ",
  "rmp.fluence_error_lower as rmp_fluence_error_lower, ",
  "rmp.id as rmp_id, ",
  "rop_notes.note as rop_notes_note, rop_notes.author as rop_notes_author, ",
  "to_char(rop_notes.last_modified, 'YYYY/MM/DD') as rop_notes_last_modified, ",
  "COALESCE(rmp.dm::text || '&plusmn' || rmp.dm_error::text, rmp.dm::text) AS rmp_dm_frmt, ",
  "rmp.snr as rmp_snr_frmt, ",
  "COALESCE(rmp.width::text || '<span className=''supsub''><sup>+' || rmp.width_error_upper::text || '</sup><sub>-'|| rmp.width_error_lower::text || '</sub></span>', rmp.width::text) as rmp_width_frmt, ",
  "COALESCE(rmp.flux::text || '<span className=''supsub''><sup>+' || rmp.flux_error_upper::text || '</sup><sub>-'|| rmp.flux_error_lower::text || '</sub></span>', rmp.flux::text) as rmp_flux_frmt, ",
  "COALESCE(rmp.dm_index::text || '&plusmn' || rmp.dm_index_error::text, rmp.dm_index::text) AS rmp_dm_index_frmt, ",
  "COALESCE(rmp.scattering_index::text || '&plusmn' || rmp.scattering_index_error::text, rmp.scattering_index::text) AS rmp_scattering_index_frmt, ",
  "COALESCE(rmp.scattering::text || '&plusmn' || rmp.scattering_error::text, rmp.scattering::text) AS rmp_scattering_frmt, ",
  "COALESCE(rmp.linear_poln_frac::text || '&plusmn' || rmp.linear_poln_frac_error::text, rmp.linear_poln_frac::text) AS rmp_linear_poln_frac_frmt, ",
  "COALESCE(rmp.circular_poln_frac::text || '&plusmn' || rmp.circular_poln_frac_error::text, rmp.circular_poln_frac::text) AS rmp_circular_poln_frac_frmt, ",
  "COALESCE(rmp.fluence::text || '<span className=''supsub''><sup>+' || rmp.fluence_error_upper::text || '</sup><sub>-'|| rmp.fluence_error_lower::text || '</sub></span>', rmp.fluence::text) as rmp_fluence_frmt, ",
  "COALESCE(rmp.spectral_index::text || '&plusmn' || rmp.spectral_index_error::text, rmp.spectral_index::text) AS rmp_spectral_index_frmt ",
  "FROM frbs f JOIN observations o ON (f.id = o.frb_id) ",
  "JOIN radio_observations_params rop ON (o.id = rop.obs_id) ",
  "JOIN radio_measured_params rmp ON (rop.id = rmp.rop_id) ",
  "JOIN authors armp ON (rmp.author_id = armp.id) ",
  "LEFT OUTER JOIN radio_observations_params_notes rop_notes ON (rop.id = rop_notes.rop_id) ",
  "WHERE (f.name = '" + frb_name + "') ORDER BY f.name,o.utc"].join('\n');
    db.query(sql, values.concat([]))
    .then(products => {
      return res.json({"products": products});
    })
    .catch(next);
};

let findropnotes = (req, res, next) => {
  let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 12,
  page = req.query.page ? parseInt(req.query.page) : 1,
  search = req.query.search,
  min = req.query.min,
  max = req.query.max,
  values = [];
  let ropid = req.params.rop_id;
  //let ropid = 1;
  let sql = "SELECT * from radio_observations_params_notes rop_notes WHERE (rop_notes.rop_id = '" + ropid + "')";
      db.query(sql, values.concat([]))
    .then(products => {
      return res.json({"products": products});
    })
    .catch(next);
};

let findrmpnotes = (req, res, next) => {
  let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 12,
  page = req.query.page ? parseInt(req.query.page) : 1,
  search = req.query.search,
  min = req.query.min,
  max = req.query.max,
  values = [];
  let rmpid = req.params.rmp_id;
  //let ropid = 1;
  let sql = "SELECT * from radio_measured_params_notes rmp_notes WHERE (rmp_notes.rmp_id = '" + rmpid + "')";
      db.query(sql, values.concat([]))
    .then(products => {
      return res.json({"products": products});
    })
    .catch(next);
};

let findfrbnotes = (req, res, next) => {
  let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 12,
  page = req.query.page ? parseInt(req.query.page) : 1,
  search = req.query.search,
  min = req.query.min,
  max = req.query.max,
  values = [];
  let frbid = req.params.frb_id;
  //let ropid = 1;
  let sql = "SELECT * from frbs_notes frbs_notes WHERE (frbs_notes.frb_id = '" + frbid + "')";
      db.query(sql, values.concat([]))
    .then(products => {
      return res.json({"products": products});
    })
    .catch(next);
};

let findrmpimages = (req, res, next) => {
  let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 12,
  page = req.query.page ? parseInt(req.query.page) : 1,
  search = req.query.search,
  min = req.query.min,
  max = req.query.max,
  values = [];
  let rmpid = req.params.rmp_id;
  //let ropid = 1;
  let sql = ["SELECT encode(ri.image::bytea, 'base64') as image, ri.caption as caption, ri.title as title from radio_images ri ",
"JOIN radio_images_have_radio_measured_params ri_rmp ON (ri.id=ri_rmp.radio_image_id) ",
"WHERE (ri_rmp.rmp_id = '" + rmpid + "')"].join('\n');
      db.query(sql, values.concat([]))
    .then(products => {
      return res.json({"products": products});
    })
    .catch(next);
};

let findrmppubs = (req, res, next) => {
  let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 12,
  page = req.query.page ? parseInt(req.query.page) : 1,
  search = req.query.search,
  min = req.query.min,
  max = req.query.max,
  values = [];
  let rmpid = req.params.rmp_id;
  let sql = "SELECT * from publications JOIN radio_measured_params_have_publications rmp_pubs ON (publications.id=rmp_pubs.pub_id) WHERE (rmp_pubs.rmp_id = '" + rmpid + "')";
      db.query(sql, values.concat([]))
    .then(products => {
      return res.json({"products": products});
    })
    .catch(next);
};

exports.findAll = findAll;
exports.findByFRB = findByFRB;
exports.findropnotes = findropnotes;
exports.findrmpnotes = findrmpnotes;
exports.findfrbnotes = findfrbnotes;
exports.findrmpimages = findrmpimages;
exports.findrmppubs = findrmppubs;

