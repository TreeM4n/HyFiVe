<?php

include_once "TEOS10_gsw_saar_data.inc.php";
include_once "TEOS10_gsw_oceanographic_toolbox.php";
$toolbox = new TEOS10_gsw_oceanographic_toolbox();
/**
* Gibbs SeaWater (GSW) Oceanographic Toolbox of TEOS-10 version 3.02 (C)
* This is as translation of the C-translation into PHP for web-based applications.
* The original notices follow.
* Translation by Susanne Feistel, IOW 2013,
* Contact: susanne.feistel@io-warnemuende.de
**/

/**
**  $Id: gsw_saar.c,v 0fa6ed68e79e 2011/09/25 18:18:19 fdelahoyde $
**
**  TEOS-10 V3.0
*/
class TEOS10_gsw_saar {
		public $gsw_nx;
		public $gsw_ny;
		public $gsw_nz;
		public $longs_ref;
		public $lats_ref;
		public $p_ref;
		public $ndepth_ref;
		public $saar_ref;
		public $delta_sa_ref;

	function __construct() {
		global $gsw_nx;
		global $gsw_ny;
		global $gsw_nz;
		global $longs_ref;
		global $lats_ref;
		global $p_ref;
		global $ndepth_ref;
		global $saar_ref;
		global $delta_sa_ref;

		$this->gsw_nx = $gsw_nx;
		$this->gsw_ny = $gsw_ny;
		$this->gsw_nz = $gsw_nz;
		$this->longs_ref = $longs_ref;
		$this->lats_ref = $lats_ref;
		$this->p_ref = $p_ref;
		$this->ndepth_ref = $ndepth_ref;
		$this->saar_ref = $saar_ref;
		$this->delta_sa_ref = $delta_sa_ref;
	}
	/**
	* equivalent to PHP's array_sum()!
	* this is an unneeded c-relic
	*
	* @param mixed $x
	* @param mixed $n
	*/
	function gsw_sum($x, $n) {
		$i = '';
		$val = '';

		for ($val=0.0, $i=0; $i<$n; $val += $x[$i], $i++);
		return ($val);
	}

	#define max(a,b)	(((a)>(b))?(a):(b))
	#define sum(x)		gsw_sum(x, sizeof (x)/sizeof (double))
	/**
	* equivalent to PHP's max()!
	* this is an unneeded c-relic
	*
	* @param mixed $a
	* @param mixed $b
	*/
	function maxvalue($a,$b) {
		($a>$b) ? $result = $a : $result = $b;
		return $result;
	}
	function sum($x) {
		$this->gsw_sum($x,sizeof($x));
	}


	/**
	* ==========================================================================
	* function gsw_saar(p,long,lat)
	* ==========================================================================
	*
	*  Calculates the Absolute Salinity Anomaly Ratio, SAAR.
	*
	*  p      : sea pressure                                    [dbar]
	*  long   : longitude                                       [deg E]
	*  lat    : latitude                                        [deg N]
	*
	*  gsw_saar : Absolute Salinity Anomaly Ratio               [unitless]
	*/

	function gsw_saar($p, $lon, $lat) {
		global $toolbox;

		$gsw_nx = $this->gsw_nx;
		$gsw_ny = $this->gsw_ny;
		$gsw_nz = $this->gsw_nz;
		$longs_ref = $this->longs_ref;
		$lats_ref = $this->lats_ref;
		$p_ref = $this->p_ref;
		$ndepth_ref = $this->ndepth_ref;
		$saar_ref = $this->saar_ref;
		$delta_sa_ref = $this->delta_sa_ref;

		$nx = $gsw_nx; $ny = $gsw_ny; $nz = $gsw_nz;
		$indx0 = ''; $indy0 = ''; $indz0 = '';
		$i = ''; $j = ''; $k = '';
		$nmean = ''; $flag_saar = ''; $ndepth_index = '';

		$deli = array(0,1,1,0);
		$delj = array(0,0,1,1);
		$saar = array();
		$saar_old = array();

		$dlong = ''; $dlat = '';
		$lon0_in = ''; $sa_upper = ''; $sa_lower = '';
		$r1 = ''; $s1 = ''; $t1 = '';
		$saar_mean = ''; $ndepth_max = ''; $return_value = '';


		$return_value	 = GSW_INVALID_VALUE;

		if ($lat  <  -86e0  ||  $lat  >  90e0)
		    return ($return_value);

		if ($lon  <  0.0)
		    $lon	= $lon + 360.0;


		$dlong	= $longs_ref[1]-$longs_ref[0];
		$dlat	= $lats_ref[1]-$lats_ref[0];

		$indx0	= floor(0 + ($nx-1)*($lon-$longs_ref[0])/($longs_ref[$nx-1]-$longs_ref[0]));
		if ($indx0 == $nx-1) $indx0	= $nx-2;

		$indy0 = floor(0 + ($ny-1)*($lat-$lats_ref[0])/($lats_ref[$ny-1]-$lats_ref[0]));
		if($indy0 == $ny-1)  $indy0 = $ny-2;

		$ndepth_max	= -1;
		for ($k=0; $k < 4; $k++) {
		    $ndepth_index	= $indy0 + $delj[$k] + ($indx0 + $deli[$k]) * $ny;
		    if ($ndepth_ref[$ndepth_index] > 0.0)
				$ndepth_max = max($ndepth_max, $ndepth_ref[$ndepth_index]);
		}

		if ($ndepth_max == -1.0e0)
		    return (0.0);

		if ($p > $p_ref[(int)($ndepth_max)-1])
		    $p	= $p_ref[(int)($ndepth_max)-1];

		$indz0	= $toolbox->gsw_indx($p_ref,$nz,$p);


		$r1	= ($lon-$longs_ref[$indx0])/($longs_ref[$indx0+1]-$longs_ref[$indx0]);
		$s1	= ($lat-$lats_ref[$indy0])/($lats_ref[$indy0+1]-$lats_ref[$indy0]);
		$t1	= ($p-$p_ref[$indz0])/($p_ref[$indz0+1]-$p_ref[$indz0]);

		for ($k=0; $k<4; $k++)
		    $saar[$k]	= $saar_ref[$indz0+$nz*($indy0+$delj[$k]+($indx0+$deli[$k])*$ny)];

		if (260.0 <= $lon && $lon <= 291.999 && 3.4 <= $lat && $lat <= 19.55) {
		    # memmove(saar_old,saar,4*sizeof (double));
		    $saar_old = $saar;
		    $toolbox->gsw_add_barrier($saar_old,$lon,$lat,$longs_ref[$indx0],$lats_ref[$indy0],$dlong,$dlat,$saar);
			/* FIXME v FIXME */
		} elseif (abs(array_sum($saar))  >=  1e10) {
		    $saar_old = $saar;
		    $toolbox->gsw_add_mean($saar_old,$lon,$lat,$saar);
		}

		$sa_upper	= (1.0-$s1)*($saar[0] + $r1*($saar[1]-$saar[0])) + $s1*($saar[3] + $r1*($saar[2]-$saar[3]));

		for ($k=0; $k<4; $k++)
		    $saar[$k]	= $saar_ref[$indz0+1+$nz*($indy0+$delj[$k]+ ($indx0+$deli[$k])*$ny)];

		if (260.0 <= $lon && $lon <= 291.999 && 3.4 <= $lat && $lat <= 19.55) {
		    $saar_old = $saar;
		    $toolbox->gsw_add_barrier($saar_old,$lon,$lat,$longs_ref[$indx0],$lats_ref[$indy0],$dlong,$dlat,$saar);
			/* FIXME v FIXME */
		} elseif (abs(array_sum($saar))  >=  1e10) {
		    $saar_old = $saar;
		    $toolbox->gsw_add_mean($saar_old,$lon,$lat,$saar);
		}

		$sa_lower	= (1.0-$s1)*($saar[0] + $r1*($saar[1]-$saar[0])) + $s1*($saar[3] + $r1*($saar[2]-$saar[3]));

		if (abs($sa_lower)  >=  1e10)
		    $sa_lower	= $sa_upper;

		$return_value	= $sa_upper + $t1*($sa_lower-$sa_upper);

		if (abs($return_value) >= 1e10)
		    $return_value	= GSW_INVALID_VALUE;

		return ($return_value);
	}

	/**
	* ==========================================================================
	* function gsw_deltasa_atlas(p,lon,lat)
	* ==========================================================================
	*
	*  Calculates the Absolute Salinity Anomaly atlas value, deltaSA_atlas.
	*
	*  p      : sea pressure                                    [dbar]
	*  lon   : longiture                                       [deg E]
	*  lat    : latitude                                        [deg N]
	*
	*  gsw_deltasa_atlas : Absolute Salinity Anomaly atlas value    [g/kg]
	*/
	function gsw_deltasa_atlas($p, $lon, $lat) {

		global $toolbox;

		$gsw_nx = $this->gsw_nx;
		$gsw_ny = $this->gsw_ny;
		$gsw_nz = $this->gsw_nz;
		$longs_ref = $this->longs_ref;
		$lats_ref = $this->lats_ref;
		$p_ref = $this->p_ref;
		$ndepth_ref = $this->ndepth_ref;
		$saar_ref = $this->saar_ref;
		$delta_sa_ref = $this->delta_sa_ref;

		$nx = $gsw_nx;
		$ny = $gsw_ny;
		$nz = $gsw_nz;

		$indx0 = ''; $indy0 = ''; $indz0 = '';
		$i = ''; $j = ''; $k = ''; $ndepth_index = '';
		$nmean = ''; $flag_dsar = '';
		$deli = array(0,1,1,0);
		$delj = array(0,0,1,1);

		$dsar = array();
		$dsar_old = array();
		$dlong = ''; $dlat = '';
		$return_value = ''; $lon0_in = ''; $sa_upper = ''; $sa_lower = '';
		$r1 = ''; $s1 = ''; $t1 = ''; $dsar_mean = ''; $ndepth_max = '';

		$return_value	= GSW_INVALID_VALUE;

		if ($lat < -86.0  ||  $lat  >  90.0)
		    return ($return_value);

		if ($lon < 0.0)
		    $lon	= $lon + 360.0;

		$dlong	= $longs_ref[1]-$longs_ref[0];
		$dlat	= $lats_ref[1]-$lats_ref[0];

		$indx0	= floor(0 + ($nx-1)*($lon-$longs_ref[0])/($longs_ref[$nx-1]-$longs_ref[0]));

		if ($indx0 == $nx-1)
		    $indx0	= $nx-2;

		$indy0	= floor(0 + ($ny-1)*($lat-$lats_ref[0])/($lats_ref[$ny-1]-$lats_ref[0]));

		if ($indy0 == $ny-1)
		    $indy0	= $ny-2;

		$ndepth_max	= -1;
		for ($k=0; $k<4; $k++) {
		    $ndepth_index	= $indy0+$delj[$k]+($indx0+$deli[$k])*$ny;
		    if ($ndepth_ref[$ndepth_index] > 0.0)
				$ndepth_max	= max($ndepth_max, $ndepth_ref[$ndepth_index]);
		}

		if ($ndepth_max == -1.0)
		    return (0.0);

		$ttt = (int)($ndepth_max)-1;
		$xxx = $p_ref[$ttt];
		if ($p > $p_ref[(int)($ndepth_max)-1])
		    $p	= $p_ref[(int)($ndepth_max)-1];

		$indz0	= $toolbox->gsw_indx($p_ref,$nz,$p);

		$r1	= ($lon-$longs_ref[$indx0])/($longs_ref[$indx0+1]-$longs_ref[$indx0]);
		$s1	= ($lat-$lats_ref[$indy0])/	($lats_ref[$indy0+1]-$lats_ref[$indy0]);
		$t1	= ($p-$p_ref[$indz0])  /	($p_ref[$indz0+1]-$p_ref[$indz0]);

		for ($k=0; $k < 4; $k++)
		    $dsar[$k]	= $delta_sa_ref[$indz0+$nz*($indy0+$delj[$k]+($indx0+$deli[$k])*$ny)];

		if (260.0 <= $lon && $lon <= 291.999 && 3.4 <= $lat && $lat <= 19.55) {
		    $dsar_old = $dsar;
		    $toolbox->gsw_add_barrier($dsar_old,$lon,$lat,$longs_ref[$indx0],
					$lats_ref[$indy0],$dlong,$dlat,$dsar);
		} elseif (abs(array_sum($dsar)) >= 1e10) {
		    $dsar_old = $dsar;
		    $toolbox->gsw_add_mean($dsar_old,$lon,$lat,$dsar);
		}

		$sa_upper	= (1.0-$s1)*($dsar[0] + $r1*($dsar[1]-$dsar[0])) +
					$s1*($dsar[3] + $r1*($dsar[2]-$dsar[3]));

		for ($k=0; $k<4; $k++)
		    $dsar[$k]	= $delta_sa_ref[$indz0+1+$nz*($indy0+$delj[$k]+
					($indx0+$deli[$k])*$ny)];

		if (260.0 <= $lon && $lon <= 291.999 && 3.4 <= $lat && $lat <= 19.55) {
		    $dsar_old = $dsar;
		    $toolbox->gsw_add_barrier($dsar_old,$lon,$lat,$longs_ref[$indx0],
					$lats_ref[$indy0],$dlong,$dlat,$dsar);
		} elseif (abs(array_sum($dsar)) >= 1e10) {
		    $dsar_old = $dsar;
		    $toolbox->gsw_add_mean($dsar_old,$lon,$lat,$dsar);
		}

		$sa_lower	= (1.0-$s1)*($dsar[0] + $r1*($dsar[1]-$dsar[0])) +
					$s1*($dsar[3] + $r1*($dsar[2]-$dsar[3]));
		if (abs($sa_lower) >= 1e10)
		    $sa_lower	= $sa_upper;
		$return_value	= $sa_upper + $t1*($sa_lower-$sa_upper);

		if (abs($return_value) >= 1e10)
		    return (GSW_INVALID_VALUE);

		return ($return_value);
	}
	/*
	**  The End
	*/
}
?>
