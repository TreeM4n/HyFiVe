//# constants
const GSW_T0 = 273.15;    				// Celsius zero point, K
const GSW_P0 = 101325; 					// one standard atmosphere, Pa
const GSW_SSO = 35.16504; 				// Standard Ocean Reference Salinity, g/kg
const GSW_uPS = 1.00471542857142857143; // GSW_uPS = GSW_SSO / 35
const GSW_cp0 = 3991.86795711963;		// the “specific heat” for use with CT; 3991.867 957 119 63 (J/kg)/K
const GSW_C3515 = 42.9140;			 	// conductivity of SSW at SP=35, t_68=15, p=0; 42.9140 mS/cm
const GSW_SonCl = 1.80655;				// ratio of SP to Chlorinity; 1.80655 (g/kg)-1
const GSW_valence_factor = 1.2452898;	// valence factor of sea salt; 1.2452898
const GSW_atomic_weight = 31.4038218; 	// mole-weighted atomic weight of sea salt; 31.4038218... g/mol

const db2pa = 1e4;		/* factor to convert from dbar to Pa */
const pa2db = 1e-4;     /* and reverse */

const p0 = 101325e0;

const GSW_INVALID_VALUE = 9e15;

//#--------------------------------------------------------------------------
//# Practical Salinity (SP), PSS-78
//#--------------------------------------------------------------------------

/**
* ==========================================================================
* function gsw_sp_from_c(c,t,p)
* ==========================================================================
*
* Calculates Practical Salinity, SP, from conductivity, C, primarily using
* the PSS-78 algorithm.  Note that the PSS-78 algorithm for Practical
* Salinity is only valid in the range 2 < SP < 42.  If the PSS-78
* algorithm produces a Practical Salinity that is less than 2 then the
* Practical Salinity is recalculated with a modified form of the Hill et
* al. (1986) formula.  The modification of the Hill et al. (1986)
* expression is to ensure that it is exactly consistent with PSS-78
* at SP = 2.  Note that the input values of conductivity need to be in
* units of mS/cm (not S/m).
*
* c      : conductivity                                     [ mS/cm ]
* t      : in-situ temperature [ITS-90]                     [deg C]
* p      : sea pressure                                     [dbar]
*
* sp     : Practical Salinity                               [unitless]
*
* Coded from C version by Bernard Saulmé
*/
export function gsw_sp_from_c(c, t, p) {

    var a0 = 0.0080e0; var a1 = -0.1692e0; var a2 = 25.3851e0;
    var a3 = 14.0941e0; var a4 = -7.0261e0; var a5 = 2.7081e0;
    var b0 = 0.0005e0; var b1 = -0.0056e0; var b2 = -0.0066e0;
    var b3 = -0.0375e0; var b4 = 0.0636e0; var b5 = -0.0144e0;
    var c0 = 0.6766097e0; var c1 = 2.00564e-2;
    var c2 = 1.104259e-4; var c3 = -6.9698e-7; var c4 = 1.0031e-9;
    var d1 = 3.426e-2; var d2 = 4.464e-4; var d3 = 4.215e-1;
    var d4 = -3.107e-3; var e1 = 2.070e-5; var e2 = -6.370e-10;
    var e3 = 3.989e-15; var k = 0.0162;

    var sp = ''; var t68 = ''; var ft68 = ''; var r = ''; var rt_lc = ''; var rp = ''; var rt = ''; var rtx = '';
    var hill_ratio = ''; var x = ''; var sqrty = ''; var part1 = ''; var part2 = ''; var sp_hill_raw = '';

    var t68 = t * 1.00024e0;
    var ft68 = (t68 - 15e0) / (1e0 + k * (t68 - 15e0));

    // The dimensionless conductivity ratio, R, is the conductivity input, C,
    // divided by the present estimate of C(SP=35, t_68=15, p=0) which is
    // 42.9140 mS/cm (=4.29140 S/m), (Culkin and Smith, 1980).

    r = 0.023302418791070513e0 * c; // 0.023302418791070513 = 1./42.9140

    // rt_lc corresponds to rt as defined in the UNESCO 44 (1983) routines.
    rt_lc = c0 + (c1 + (c2 + (c3 + c4 * t68) * t68) * t68) * t68;
    rp = 1e0 + (p * (e1 + e2 * p + e3 * p * p)) / (1e0 + d1 * t68 + d2 * t68 * t68 + (d3 + d4 * t68) * r);
    rt = r / (rp * rt_lc);

    if (rt < 0) {
        rt = GSW_INVALID_VALUE;
    }

    rtx = Math.sqrt(rt);

    sp = a0 + (a1 + (a2 + (a3 + (a4 + a5 * rtx) * rtx) * rtx) * rtx) * rtx + ft68 * (b0 + (b1 + (b2 + (b3 + (b4 + b5 * rtx) * rtx) * rtx) * rtx) * rtx);

    // The following section of the code is designed for SP < 2 based on the
    // Hill et al. (1986) algorithm.  This algorithm is adjusted so that it is
    // exactly equal to the PSS-78 algorithm at SP = 2.

    if (sp < 2) {
        hill_ratio = gsw_hill_ratio_at_sp2(t);
        x = 400e0 * rt;
        sqrty = 10e0 * rtx;
        part1 = 1e0 + x * (1.5e0 + x);
        part2 = 1e0 + sqrty * (1e0 + sqrty * (1e0 + sqrty));
        sp_hill_raw = sp - a0 / part1 - b0 * ft68 / part2;
        sp = hill_ratio * sp_hill_raw;
    }

    // This line ensures that SP is non-negative.
    if (sp < 0) {
        sp = GSW_INVALID_VALUE;
    }

    return (sp);


}
/**
 * ==========================================================================
 * function  gsw_hill_ratio_at_sp2(t)
 * ==========================================================================
 *
 *   Calculates the Hill ratio, which is the adjustment needed to apply for
 *   Practical Salinities smaller than 2.  This ratio is defined at a
 *   Practical Salinity = 2 and in-situ temperature, t using PSS-78. The Hill
 *   ratio is the ratio of 2 to the output of the Hill et al. (1986) formula
 *   for Practical Salinity at the conductivity ratio, Rt, at which Practical
 *   Salinity on the PSS-78 scale is exactly 2.
 */
function gsw_hill_ratio_at_sp2(t) {
    var a0 = 0.0080e0; var a1 = -0.1692e0; var a2 = 25.3851e0;
    var a3 = 14.0941e0; var a4 = -7.0261e0; var a5 = 2.7081e0;
    var b0 = 0.0005e0; var b1 = -0.0056e0; var b2 = -0.0066e0;
    var b3 = -0.0375e0; var b4 = 0.0636e0; var b5 = -0.0144e0;
    var g0 = 2.641463563366498e-1; var g1 = 2.007883247811176e-4;
    var g2 = -4.107694432853053e-6; var g3 = 8.401670882091225e-8;
    var g4 = -1.711392021989210e-9; var g5 = 3.374193893377380e-11;
    var g6 = -5.923731174730784e-13; var g7 = 8.057771569962299e-15;
    var g8 = -7.054313817447962e-17; var g9 = 2.859992717347235e-19;
    var rk = 0.0162e0; var sp2 = 2e0;

    var t68 = ''; var ft68 = ''; var rtx0 = '';
    var dsp_drtx = ''; var sp_est = '';
    var rtx = ''; var rtxm = ''; var x = '';
    var part1 = ''; var part2 = '';
    var sqrty = ''; var sp_hill_raw_at_sp2 = '';

    t68 = t * 1.00024;
    ft68 = (t68 - 15.0) / (1.0 + rk * (t68 - 15.0));

    /*!------------------------------------------------------------------------
    **! Find the initial estimates of Rtx (Rtx0) and of the derivative dSP_dRtx
    **! at SP = 2.
    **!------------------------------------------------------------------------
    */
    rtx0 = g0 + t68 * (g1 + t68 * (g2 + t68 * (g3 + t68 * (g4 + t68 * (g5
        + t68 * (g6 + t68 * (g7 + t68 * (g8 + t68 * g9))))))));

    dsp_drtx = a1 + (2 * a2 + (3 * a3 + (4 * a4 + 5 * a5 * rtx0) * rtx0) * rtx0) * rtx0
        + ft68 * (b1 + (2 * b2 + (3 * b3 + (4 * b4 + 5 * b5 * rtx0) * rtx0) * rtx0) * rtx0);

    /*!-------------------------------------------------------------------------
    **! Begin a single modified Newton-Raphson iteration to find Rt at SP = 2.
    **!-------------------------------------------------------------------------
    */
    sp_est = a0 + (a1 + (a2 + (a3 + (a4 + a5 * rtx0) * rtx0) * rtx0) * rtx0) * rtx0
        + ft68 * (b0 + (b1 + (b2 + (b3 + (b4 + b5 * rtx0) * rtx0) * rtx0) * rtx0) * rtx0);
    rtx = rtx0 - (sp_est - sp2) / dsp_drtx;
    rtxm = 0.5 * (rtx + rtx0);
    dsp_drtx = a1 + (2 * a2 + (3 * a3 + (4 * a4 + 5 * a5 * rtxm) * rtxm) * rtxm) * rtxm
        + ft68 * (b1 + (2 * b2 + (3 * b3 + (4 * b4 + 5 * b5 * rtxm) * rtxm) * rtxm) * rtxm);
    rtx = rtx0 - (sp_est - sp2) / dsp_drtx;
    /*
    **! This is the end of one full iteration of the modified Newton-Raphson
    **! iterative equation solver. The error in Rtx at this point is equivalent
    **! to an error in SP of 9e-16 psu.
    */

    x = 400.0 * rtx * rtx;
    sqrty = 10.0 * rtx;
    part1 = 1.0 + x * (1.5 + x);
    part2 = 1.0 + sqrty * (1.0 + sqrty * (1.0 + sqrty));
    sp_hill_raw_at_sp2 = sp2 - a0 / part1 - b0 * ft68 / part2;

    return (2.0 / sp_hill_raw_at_sp2);
}