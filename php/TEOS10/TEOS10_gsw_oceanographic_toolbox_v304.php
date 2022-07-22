<?php
/**
* Gibbs SeaWater (GSW) Oceanographic Toolbox of TEOS-10 version 3.04 (incomplete!)
* The original notices in TEOS10_gsw_oceanographic_toolbox.php
* Translation by Susanne Feistel, IOW 2013,
*   Contact: susanne.feistel@io-warnemuende.de
* Translation by Bernard Saulmé 17/09/2013
*   Contact: b92@wanadoo.fr
*
* ==========================================================================
* This is a subset of functions contained in the Gibbs SeaWater (GSW)
* Oceanographic Toolbox of TEOS-10 (version 3.04). (incomplete!)
* ==========================================================================
*
* density and enthalpy, based on the 48-term expression for density
* gsw_rho_first_derivatives_CT_exact  - first derivatives of density - Converted from Matlab by Bernard Saulmé
* gsw_sa_from_rho_t_input_48term - Absolute Salinity from density, measurements with t input - Converted from Mathlab by Bernard Saulmé
*
* basic thermodynamic properties in terms of in-situ t, based on the exact Gibbs function
* gsw_sa_from_rho_t_exact - Absolute Salinity of a seawater sample (from rho, t, p) - Converted from Matlab by Bernard Saulmé
* gsw_CT_first_derivatives_wrt_t_exact - first derivatives of Conservative Temperature with respect to t - Converted from Matlab by Bernard Saulmé
*
* This software is available from http://www.teos-10.org
*
* ==========================================================================
*/

define('GSW_INVALID_VALUE',9e15);
include_once "TEOS10_gsw_oceanographic_toolbox.php";
include_once "TEOS10_gsw_saar.php";

class TEOS10_gsw_oceanographic_toolbox_v304 extends TEOS10_gsw_oceanographic_toolbox {

	/**
	* USAGE:
	*  sa = gsw_sa_from_rho_t_exact(rho,t,p)
	*
	* DESCRIPTION:
	*  Calculates the Absolute Salinity of a seawater sample, for given values
	*  of its density, in-situ temperature and sea pressure (in dbar).
	*
	* INPUT:
	*  rho  = density of a seawater sample (e.g. 1026 kg/m^3)        [kg/m^3]
	*   Note. This input has not had 1000 kg/m^3 subtracted from it.
	*     That is, it is 'density', not 'density anomaly'.
	*  t   =  in-situ temperature (ITS-90)                           [deg C]
	*  p   =  sea pressure                                           [dbar]
	*         ( i.e. absolute pressure - 10.1325 dbar )
	*
	*  rho & t need to have the same dimensions.
	*  p may have dimensions 1x1 or Mx1 or 1xN or MxN, where rho & t are MxN.
	*
	* OUTPUT:
	*  SA  =  Absolute Salinity                                       [g/kg]
	*   Note. This is expressed on the Reference-Composition Salinity
	*     Scale of Millero et al. (2008).
	*
	* Coded from the Mathlab version by Bernard Saulmé
	*
	*/
	function gsw_sa_from_rho_t_exact($rho,$t,$p) {
		$n0 = 0;
		$n1 = 1;
		$v_lab = 1e0/$rho;

		$v_0 = self::gsw_gibbs($n0,$n0,$n1,0,$t,$p);
		$v_120 = self::gsw_gibbs($n0,$n0,$n1,120,$t,$p);

		$sa = 120e0*($v_lab - $v_0)/($v_120 - $v_0); // initial estimate of sa.
		if ($sa < 0e0 || $sa > 120e0)
			$sa = GSW_INVALID_VALUE;

		$v_sa = ($v_120 - $v_0)/120e0; // initial estimate of v_sa, the sa derivative of v

		for ($no_iter=1; $no_iter <= 2; $no_iter++) {
			$sa_old = $sa;
			$delta_v = self::gsw_gibbs($n0,$n0,$n1,$sa_old,$t,$p) - $v_lab;
			$sa = $sa_old - $delta_v/$v_sa ; // this is half way through the modified N-R method (McDougall and Wotherspoon, 2012)
			if ($sa < 0e0 || $sa > 120e0)
				$sa = GSW_INVALID_VALUE;
			$sa_mean = 0.5e0*($sa + $sa_old);
			$v_sa = self::gsw_gibbs($n1,$n0,$n1,$sa_mean,$t,$p);
			$sa = $sa_old - $delta_v/$v_sa;
			if ($sa < 0e0 || $sa > 120e0)
				$sa = GSW_INVALID_VALUE;
		}

		// After two iterations of this modified Newton-Raphson iteration,
		// the error in sa is no larger than 2x10^-13 g/kg.
		return ($sa);
	}

	/**
	* gsw_SA_from_rho_t_input_48term         Absolute Salinity from density
	*                                        measurements with t input and
	*                                        using the 48-term EOS
	* USAGE:
	* SA = gsw_SA_from_rho_t_input_48term(rho,t,p)
	*
	* DESCRIPTION:
	* Calculates the Absolute Salinity of a seawater sample, for given values
	* of its density, in-situ temperature and sea pressure (in dbar). This
	* code used the 48-term expression for the density of seawater.
	*
	* INPUT:
	*  rho  = density of a seawater sample (e.g. 1026 kg/m^3)        [ kg/m^3 ]
	*   Note. This input has not had 1000 kg/m^3 subtracted from it.
	*     That is, it is 'density', not 'density anomaly'.
	*  t   =  in-situ temperature (ITS-90)                            [ deg C ]
	*  p   =  sea pressure                                             [ dbar ]
	*         ( i.e. absolute pressure - 10.1325 dbar )
	*
	* OUTPUT:
	*  SA  =  Absolute Salinity                                        [ g/kg ]
	*   Note. This is expressed on the Reference-Composition Salinity
	*     Scale of Millero et al. (2008)
	*
	* Coded for the Matlab 3.0.3 (11/09/2013) version by Bernard Saulmé
	*/
	function gsw_sa_from_rho_t_input_48term($rho,$t,$p) {

		$sa = self::gsw_sa_from_rho_t_exact($rho,$t,$p); // First guess of SA

		list($ct_sa_wrt_t, $dummy, $dummy) = self::gsw_ct_first_derivatives_wrt_t_exact($sa,$t,$p);
		list($drho_dsa, $drho_dct, $dummy) = self::gsw_rho_first_derivatives($sa,self::gsw_ct_from_t($sa,$t,$p),$p);
		$df_dsa = $drho_dsa + $drho_dct*$ct_sa_wrt_t; // First guess of the derivative of f

		for ($no_iter=1; $no_iter <= 3; $no_iter++) {
			$sa_old = $sa;
			$f = self::gsw_rho($sa,self::gsw_ct_from_t($sa,$t,$p),$p) - $rho;
			$sa = $sa_old - $f/$df_dsa; // This is half way through the modified N-R method (McDougall and Wotherspoon, 2013)
			if ($sa < 0e0 || $sa > 120e0)
				$sa = GSW_INVALID_VALUE;
			$sa_mean = 0.5e0*($sa + $sa_old);
			list($ct_sa_wrt_t, $dummy, $dummy) = self::gsw_ct_first_derivatives_wrt_t_exact($sa_mean,$t,$p);
			list($drho_dsa, $drho_dct, $dummy) = self::gsw_rho_first_derivatives($sa_mean,self::gsw_ct_from_t($sa_mean,$t,$p),$p);
			$df_dsa = $drho_dsa + $drho_dct*$ct_sa_wrt_t;
			$sa = $sa_old - $f/$df_dsa;
			if ($sa < 0e0 || $sa > 120e0)
				$sa = GSW_INVALID_VALUE;
		}

		return ($sa);
	}

	/**
	* gsw_rho_first_derivatives_CT_exact       SA, CT and p partial derivatives
	*                                                                of density
	* USAGE:
	* [drho_dSA, drho_dCT, drho_dP] = gsw_rho_first_derivatives_CT_exact(SA,CT,p)
	*
	* DESCRIPTION:
	*  Calculates the three (3) partial derivatives of in situ density with
	*  respect to Absolute Salinity, Conservative Temperature and pressure.
	*  Note that the pressure derivative is done with respect to pressure in
	*  Pa, not dbar.
	*
	*  Note that this function uses the full Gibbs function.  There is an
	*  alternative to calling this function, namely
	*  gsw_rho_first_derivatives(SA,CT,p), which uses the computationally
	*  efficient 48-term expression for density in terms of SA, CT and p
	*  (IOC et al., 2010).
	*
	* INPUT:
	*  SA  =  Absolute Salinity                                        [ g/kg ]
	*  CT  =  Conservative Temperature (ITS-90)                       [ deg C ]
	*  p   =  sea pressure                                             [ dbar ]
	*         ( i.e. absolute pressure - 10.1325 dbar )
	*
	*  SA & CT need to have the same dimensions.
	*  p may have dimensions 1x1 or Mx1 or 1xN or MxN, where SA & CT are MxN.
	*
	* OUTPUT:
	*  drho_dSA  =  partial derivatives of density             [ kg^2/(g m^3) ]
	*                 with respect to Absolute Salinity
	*  drho_dCT  =  partial derivatives of density               [ kg/(K m^3) ]
	*                 with respect to Conservative Temperature
	*  drho_dP   =  partial derivatives of density              [ kg/(Pa m^3) ]
	*                 with respect to pressure in Pa
	*
	* Coded for the Matlab 3.0.3 (10/05/2013) version by Bernard Saulmé
	*/
	function gsw_rho_first_derivatives_ct_exact($sa,$ct,$p) {
		if ($sa < 0)
			$sa = 0;

		$t = self::gsw_t_from_ct($sa,$ct,$p);

		$n0 = 0;
		$n1 = 1;
		$n2 = 2;
		$db2pa = 1e-4;
		$sfac = 0.0248826675584615; // $sfac = 1/(40*(35.16504/35)).

		$pt0 = self::gsw_pt0_from_t($sa,$t,$p);

		$x2 = $sfac*$sa;
		$x = sqrt($x2);
		$y = 0.025*$t;
		$y_pt = 0.025*$pt0;
		$z = $db2pa*$p; // The input pressure (p) is sea pressure in units of dbar.

		$g_sa_t_mod = 1187.3715515697959 + $z*(1458.233059470092 +
				$z*(-687.913805923122 + $z*(249.375342232496 + $z*(-63.313928772146 + 14.09317606630898*$z)))) +
				$x*(-1480.222530425046 + $x*(2175.341332000392 + $x*(-980.14153344888 + 220.542973797483*$x) +
				$y*(-548.4580073635929 + $y*(592.4012338275047 + $y*(-274.2361238716608 + 49.9394019139016*$y))) -
				90.6734234051316*$z) + $z*(-525.876123559641 + (249.57717834054571 - 88.449193048287*$z)*$z) +
				$y*(-258.3988055868252 + $z*(2298.348396014856 + $z*(-325.1503575102672 + 153.8390924339484*$z)) +
				$y*(-90.2046337756875 - 4142.8793862113125*$z + $y*(10.50720794170734 + 2814.78225133626*$z)))) +
				$y*(3520.125411988816 + $y*(-1351.605895580406 +
				$y*(731.4083582010072 + $y*(-216.60324087531103 + 25.56203650166196*$y) +
				$z*(-2381.829935897496 + (597.809129110048 - 291.8983352012704*$z)*$z)) +
				$z*(4165.4688847996085 + $z*(-1229.337851789418 + (681.370187043564 - 66.7696405958478*$z)*$z))) +
				$z*(-3443.057215135908 + $z*(1349.638121077468 +
				$z*(-713.258224830552 + (176.8161433232 - 31.68006188846728*$z)*$z))));
		$g_sa_t_mod = 0.5*$sfac*0.025*$g_sa_t_mod;

		$g_sa_mod = 8645.36753595126 +
				$x*(-7296.43987145382 + $x*(8103.20462414788 +
				$y_pt*(2175.341332000392 + $y_pt*(-274.2290036817964 +
				$y_pt*(197.4670779425016 + $y_pt*(-68.5590309679152 + 9.98788038278032*$y_pt)))) +
				$x*(-5458.34205214835 - 980.14153344888*$y_pt +
				$x*(2247.60742726704 - 340.1237483177863*$x + 220.542973797483*$y_pt))) +
				$y_pt*(-1480.222530425046 +
				$y_pt*(-129.1994027934126 +
				$y_pt*(-30.0682112585625 + $y_pt*(2.626801985426835))))) +
				$y_pt*(1187.3715515697959 +
				$y_pt*(1760.062705994408 + $y_pt*(-450.535298526802 +
				$y_pt*(182.8520895502518 + $y_pt*(-43.3206481750622 + 4.26033941694366*$y_pt)))));
		$g_sa_mod = 0.5*$sfac*$g_sa_mod;

		$g_p = self::gsw_gibbs($n0,$n0,$n1,$sa,$t,$p);
		$g_psq_g_tt = $g_p*$g_p*self::gsw_gibbs($n0,$n2,$n0,$sa,$t,$p);
		$g_tp = self::gsw_gibbs($n0,$n1,$n1,$sa,$t,$p);

		$factora = $g_sa_t_mod - $g_sa_mod/(273.15+$pt0);
		$factor = $factora/$g_psq_g_tt;
		$drho_dsa = $g_tp*$factor - self::gsw_gibbs($n1,$n0,$n1,$sa,$t,$p)/($g_p*$g_p);
		$drho_dct = $g_tp*self::GSW_cp0/((273.15+$pt0)*$g_psq_g_tt);
		$drho_dp = ($g_tp*$g_tp - self::gsw_gibbs($n0,$n2,$n0,$sa,$t,$p)*self::gsw_gibbs($n0,$n0,$n2,$sa,$t,$p))/($g_psq_g_tt);

		return array($drho_dsa,$drho_dct,$drho_dp);
	}

    /**
    * gsw_CT_first_derivatives_wrt_t_exact    first derivatives of Conservative
    *                                         Temperature with respect to (or
    *                                         at constant) in situ temperature
    *
    * USAGE:
    *  [CT_SA_wrt_t, CT_T_wrt_t, CT_P_wrt_t] = gsw_CT_first_derivatives_wrt_t_exact(SA,t,p)
    *
    * DESCRIPTION:
    *  Calculates the following three derivatives of Conservative Temperature.
    *  These derivatives are done with respect to in situ temperature t (in the
    *  case of CT_sub_T) or at constant in situ tempertature (in the cases of
    *  CT_sub_SA and CT_sub_P).
    *   (1) CT_SA_wrt_t, the derivative of CT with respect to Absolute Salinity
    *       at constant t and p, and
    *   (2) CT_T_wrt_t, derivative of CT with respect to in-situ temperature t
    *        at constant SA and p.
    *   (3) CT_P_wrt_t, derivative of CT with respect to pressure P (in Pa) at
    *       constant SA and t.
    *
    *  This function uses the full Gibbs function. Note that this function
    *  avoids the NaN that would exist in CT_SA_wrt_t at SA=0 if it were
    *  evaluated in the straightforward way from the derivatives of the Gibbs
    *  function function.
    *
    * INPUT:
    *  SA  =  Absolute Salinity                                        [ g/kg ]
    *  t   =  in-situ temperature (ITS-90)                            [ deg C ]
    *  p   =  sea pressure                                             [ dbar ]
    *         ( i.e. absolute pressure - 10.1325 dbar)
    *
    *  SA & t need to have the same dimensions.
    *  p may have dimensions 1x1 or Mx1 or 1xN or MxN, where SA & t are MxN.
    *
    * OUTPUT:
    *  CT_SA_wrt_t  =  The first derivative of Conservative Temperature with
    *                  respect to Absolute Salinity at constant t and p.
    *                                              [ K/(g/kg)]  i.e. [ K kg/g ]
    *  CT_T_wrt_t  =  The first derivative of Conservative Temperature with
    *                 respect to in-situ temperature, t, at constant SA and p.
    *                                                              [ unitless ]
    *
    *  CT_P_wrt_t  =  The first derivative of Conservative Temperature with
    *                 respect to pressure P (in Pa) at constant SA and t.
    *                                                                  [ K/Pa ]
    *
    * Coded for the Matlab 3.0.3 (06/09/2013) version by Bernard Saulmé
    */
	function gsw_ct_first_derivatives_wrt_t_exact($sa,$t,$p) {

		$n0 = 0;
		$n1 = 1;
		$n2 = 2;
		$db2pa = 1e-4;
		$sfac = 0.0248826675584615; // sfac = 1/(40*(35.16504/35)).

		$pt0 = self::gsw_pt0_from_t($sa,$t,$p);

		//  Note that the following call is an alternative to the code from lines
		//  130 - 157 (mathalb version), however, at SA = 0 the following will return a NaN, whereas
		//  the code from 130 - 157 will not.
		//  CT_SA_wrt_t = (gsw_gibbs(n1,n0,n0,SA,pt0,zeros(size(SA))) ...
		//                - (273.15+pt0).*gsw_gibbs(n1,n1,n0,SA,t,p))...
		//                   ./gsw_cp0;

		$x2 = $sfac*$sa;
		$x = sqrt($x2);
		$y = 0.025*$t;
		$y_pt = 0.025*$pt0;
		$z = $db2pa*$p; // The input pressure (p) is sea pressure in units of dbar.

		$g_sa_t_mod = 1187.3715515697959 + $z*(1458.233059470092 +
				$z*(-687.913805923122 + $z*(249.375342232496 + $z*(-63.313928772146 + 14.09317606630898*$z)))) +
				$x*(-1480.222530425046 + $x*(2175.341332000392 + $x*(-980.14153344888 + 220.542973797483*$x) +
				$y*(-548.4580073635929 + $y*(592.4012338275047 + $y*(-274.2361238716608 + 49.9394019139016*$y))) -
				90.6734234051316*$z) + $z*(-525.876123559641 + (249.57717834054571 - 88.449193048287*$z)*$z) +
				$y*(-258.3988055868252 + $z*(2298.348396014856 + $z*(-325.1503575102672 + 153.8390924339484*$z)) +
				$y*(-90.2046337756875 - 4142.8793862113125*$z + $y*(10.50720794170734 + 2814.78225133626*$z)))) +
				$y*(3520.125411988816 + $y*(-1351.605895580406 +
				$y*(731.4083582010072 + $y*(-216.60324087531103 + 25.56203650166196*$y) +
				$z*(-2381.829935897496 + (597.809129110048 - 291.8983352012704*$z)*$z)) +
				$z*(4165.4688847996085 + $z*(-1229.337851789418 + (681.370187043564 - 66.7696405958478*$z)*$z))) +
				$z*(-3443.057215135908 + $z*(1349.638121077468 +
				$z*(-713.258224830552 + (176.8161433232 - 31.68006188846728*$z)*$z))));
		$g_sa_t_mod = 0.5*$sfac*0.025*$g_sa_t_mod;

		$g_sa_mod = 8645.36753595126 +
				$x*(-7296.43987145382 + $x*(8103.20462414788 +
				$y_pt*(2175.341332000392 + $y_pt*(-274.2290036817964 +
				$y_pt*(197.4670779425016 + $y_pt*(-68.5590309679152 + 9.98788038278032*$y_pt)))) +
				$x*(-5458.34205214835 - 980.14153344888*$y_pt +
				$x*(2247.60742726704 - 340.1237483177863*$x + 220.542973797483*$y_pt))) +
				$y_pt*(-1480.222530425046 +
				$y_pt*(-129.1994027934126 +
				$y_pt*(-30.0682112585625 + $y_pt*(2.626801985426835))))) +
				$y_pt*(1187.3715515697959 +
				$y_pt*(1760.062705994408 + $y_pt*(-450.535298526802 +
				$y_pt*(182.8520895502518 + $y_pt*(-43.3206481750622 + 4.26033941694366*$y_pt)))));
		$g_sa_mod = 0.5*$sfac*$g_sa_mod;

		$ct_sa_wrt_t = ($g_sa_mod - (273.15+$pt0)*$g_sa_t_mod)/self::GSW_cp0;
		$ct_t_wrt_t = -(273.15+$pt0)*self::gsw_gibbs($n0,$n2,$n0,$sa,$t,$p)/self::GSW_cp0;
		$ct_p_wrt_t = -(273.15+$pt0)*self::gsw_gibbs($n0,$n1,$n1,$sa,$t,$p)/self::GSW_cp0;

		return array($ct_sa_wrt_t, $ct_t_wrt_t, $ct_p_wrt_t);
	}

#
#  The End
# ==========================================================================
#
}
?>
