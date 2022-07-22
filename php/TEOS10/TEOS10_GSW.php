<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="author" content="Susanne Feistel, Bernard Saulme">
<meta name="description" content="Gibbs SeaWater (GSW) Oceanographic Toolbox of TEOS-10 version 3.03 (PHP)">
<meta name="keywords" content="Gibbs SeaWater (GSW) Oceanographic Toolbox TEOS-10">
<!--
Creation-date: Susanne Feistel 08/07/2013,
Update: Bernard Saulmé 29/09/2013,
Update: Susanne Feistel 30/05/2014,
-->
<title>Gibbs SeaWater (GSW) Oceanographic Toolbox of TEOS-10 version 3.03</title>
<style type="text/css">
body {background-color: #ffffff; color: #000000;}
body, td, th, h1 {font-family: sans-serif;}
pre {margin: 0px; font-family: monospace;}
a:link {color: #000099; text-decoration: none; background-color: #ffffff;}
table {border-collapse: collapse;}
tr { padding: 0;margin: 0;}
td, th { border: 1px solid #000000; font-size: 75%; vertical-align: baseline;}
h1 {font-size: 150%;}
.fct_grp {background: #555; color: #fff;}
.error {background: #d22; color: #fff;}
</style>
</head>
<body>
<?php
/**
* Gibbs SeaWater (GSW) Oceanographic Toolbox of TEOS-10 version 3.03
* This is as translation of the C-translation into PHP for web-based applications.
* The original notices follow.
* Translation by Susanne Feistel, IOW 2013,
* Contact: susanne.feistel@io-warnemuende.de
**/

ini_set('memory_limit', '-1'); // To avoid memory limit

/**
* Call GSW library object here
*/
include_once "TEOS10_gsw_oceanographic_toolbox.php";
include_once "TEOS10_gsw_saar.php";
$TEOS10 = new TEOS10_gsw_oceanographic_toolbox();
$GSW_saar = new TEOS10_gsw_saar();

/**
* To use the already translated methods from v3.04
* uncomment the following lines:
*/
# include_once "TEOS10_gsw_oceanographic_toolbox_v304.php";
# $TEOS10 = new TEOS10_gsw_oceanographic_toolbox_v304();


echo "<h1>TEOS-10 GSW-Library check values</h1>";
$header = sprintf("==============================================================================<br />\n"
." Gibbs SeaWater (GSW) Oceanographic Toolbox of TEOS-10 version 3.03 (PHP)<br />\n"
."==============================================================================<br />\n"
."\n\r"
." These are the check values for the subset of functions that have been transcripted"
." from Matlab, C or Fortran version to be implemented into PHP<br />\n\r from the"
." Gibbs SeaWater (GSW) Oceanographic Toolbox of TEOS-10 (version 3.03).<br />\n\r"
	);
$columns = sprintf('<tr>
					<td><strong>Function</strong></td>
					<td><strong>Calculated Value</strong></td>
					<td><strong>Check Value</strong></td>
					<td><strong>Difference</strong></td>
					<td><strong>Acceptable Difference</strong></td>
				</tr>');

    $nz=3;
    $sp = ''; $sa = ''; $sstar = ''; $sr = ''; $t = ''; $ct = ''; $pt = ''; $p = ''; $p_bs = ''; $p_ref = ''; $c = ''; $rho = '';
    $lon = ''; $long_bs = ''; $lat = ''; $lat_bs = ''; $saturation_fraction = '';
    $cabbeling = ''; $thermobaric = ''; $alpha_on_beta = '';
    $sigma0 = ''; $sigma1 = ''; $sigma2 = ''; $sigma3 = ''; $sigma4 = '';
    $rho_dsa = ''; $drho_dct = ''; $drho_dp = ''; $drho_dsa_error = ''; $drho_dct_error = '';
    $drho_dp_error = '';

    $n2 = array('',''); $p_mid_n2 = array('',''); $n2_error = array(); $p_mid_n2_error = array();
    $ipvfn2 = array('',''); $p_mid_ipvfn2 = array('','');
    $ipvfn2_error = array('',''); $p_mid_ipvfn2_error = array('','');
    $tu = array('',''); $rsubrho = array('',''); $p_mid_tursr = array('','');
    $tu_error = array('',''); $rsubrho_error = array('',''); $p_mid_tursr_error = array('','');

    $sa_profile[0] = 35.5e0;
    $sa_profile[1] = 35.7e0;
    $sa_profile[2] = 35.6e0;
    $ct_profile[0] = 12.5e0;
    $ct_profile[1] = 15e0;
    $ct_profile[2] = 10e0;
    $p_profile[0] = 00e0;
    $p_profile[1] = 50e0;
    $p_profile[2] = 100e0;
    $lat_profile[0] = 10e0;
    $lat_profile[1] = 10e0;
    $lat_profile[2] = 10e0;

	$sp	=  35.5e0;
	$sa	= 35.7e0;
	$sstar	= 35.5e0;
	$sr	= 35.5e0;
	$t	= 15e0;
	$ct	= 20e0;
	$pt	= 15e0;
	$p	= 300e0;
	$p_bs	= 50e0;
	$p_ref	= 100e0;
    $c    = 43.6e0;
	$lon	= 260e0;
	$long_bs	= 20e0;
	$lat	= 16e0;
	$lat_bs	= 60e0;
	$saturation_fraction	= 0.5e0;

    $rho = $TEOS10->gsw_rho($sa,$ct,$p);

    $variables = sprintf('  $sp = %.3e<br />
                            $sa    = %.3e<br />
                            $sstar = %.3e<br />
                            $sr    = %.3e<br />

                            $t = %.3e<br />
                            $ct    = %.3e<br />
                            $pt    = %.3e<br />

                            $p = %.3e<br />
                            $p_bs = %.3e<br />
                            $p_ref = %.3e<br />

                            $lon = %.3e<br />
                            $long_bs = %.3e<br />
                            $lat = %.3e<br />
                            $lat_bs = %.3e<br />

                            $saturation_fraction = %.3e<br />
                            $c = %.3e
                            </td><td colspan="4" style="padding:1em;">

                            $sa_profile[0] = %.3e<br />
                            $sa_profile[1] = %.3e<br />
                            $sa_profile[2] = %.3e<br />

                            $ct_profile[0] = %.3e<br />
                            $ct_profile[1] = %.3e<br />
                            $ct_profile[2] = %.3e<br />

                            $p_profile[0] = %.3e<br />
                            $p_profile[1] = %.3e<br />
                            $p_profile[2] = %.3e<br />

                            $lat_profile[0] = %.3e<br />
                            $lat_profile[1] = %.3e<br />
                            $lat_profile[2] = %.3e<br />',
                            $sp,$sa,$sstar,$sr,
                            $t,$ct,$pt,
                            $p,$p_bs,$p_ref,
                            $lon,$long_bs,$lat,$lat_bs,
                            $saturation_fraction,$c,
                            $sa_profile[0],$sa_profile[1],$sa_profile[2],
                            $ct_profile[0],$ct_profile[1],$ct_profile[2],
                            $p_profile[0],$p_profile[1],$p_profile[2],
                            $lat_profile[0],$lat_profile[1],$lat_profile[2]);

	printf('<table><tr><td colspan="5" style="padding:1em;">%s</td></tr><tr><td style="padding:1em;">%s</td></tr>',$header,$variables);

    ############################################################################
    # Practical Salinity, PSS-78:
    printf('<tr><td colspan="5" class="fct_grp"><strong>
            Practical Salinity, PSS-78:
            </strong></td></tr>');
    echo $columns;
    $functions = array(
                        0 => array( "func" => '$TEOS10->gsw_sp_from_c($c,$t,$p)',    // name of the function
                                    "value" => $TEOS10->gsw_sp_from_c($c,$t,$p),     // result of function
                                    "check" => 35.500961780774482e0,                 // expected result ("check value")
                                    "diff" => 1.297193463756230e-010),               // Acceptable difference from check value
                        1 => array( "func" => '$TEOS10->gsw_c_from_sp($sp,$t,$p)',
                                    "value" => $TEOS10->gsw_c_from_sp($sp,$t,$p),
                                    "check" => 43.598945605280484e0,
                                    "diff" => 6.163816124171717e-010)
                    );
    foreach($functions as $function) {
        $diff = abs($function["check"]-$function["value"]);
        printf('<tr>');
            echo "<td>".$function["func"]."</td>";
            echo "<td>".$function["value"]."</td>";
            echo "<td>".$function["check"]."</td>";
            echo "<td>$diff</td>";
            if($diff > $function["diff"]) {
                echo '<td class="error">'.$function["diff"]."</td>";
            }
            else echo "<td>".$function["diff"]."</td>";

        printf('</tr>');
    }
    unset($functions);
	############################################################################
	# Absolute Salinity, Preformed Salinity and Conservative Temperature:
    printf('<tr><td colspan="5" class="fct_grp"><strong>
			Absolute Salinity, Preformed Salinity and Conservative Temperature:
			</strong></td></tr>');
	echo $columns;
	$functions = array(
						0 => array(	"func" => '$TEOS10->gsw_sa_from_sp($sp,$p,$lon,$lat)', 	// name of the function
									"value" => $TEOS10->gsw_sa_from_sp($sp,$p,$lon,$lat), 	// result of function
									"check" => 35.671358392019094e0,						// expected result ("check value")
									"diff" => 1.300080043620255e-010),						// Acceptable difference from check value
						1 => array(	"func" => '$TEOS10->gsw_sstar_from_sp($sp,$p,$lon,$lat)',
									"value" => $TEOS10->gsw_sstar_from_sp($sp,$p,$lon,$lat),
									"check" => 35.666011477079032e0,
									"diff" => 1.300008989346679e-010),
						2 => array(	"func" => '$TEOS10->gsw_ct_from_t($sa,$t,$p)',
									"value" => $TEOS10->gsw_ct_from_t($sa,$t,$p),
									"check" => 14.930280459895560e0,
									"diff" => 6.261107188265669e-010)
					);
	foreach($functions as $function) {
		$diff = abs($function["check"]-$function["value"]);
		printf('<tr>');
			echo "<td>".$function["func"]."</td>";
			echo "<td>".$function["value"]."</td>";
			echo "<td>".$function["check"]."</td>";
			echo "<td>$diff</td>";
			if($diff > $function["diff"]) {
				echo '<td class="error">'.$function["diff"]."</td>";
			}
			else echo "<td>".$function["diff"]."</td>";

		printf('</tr>');
	}
	unset($functions);
	############################################################################
	# Other conversions between temperatures, salinities, entropy, pressure and height:
    printf('<tr><td colspan="5" class="fct_grp"><strong>
			Other conversions between temperatures, salinities, entropy, pressure and height:
			</strong></td></tr>');
	echo $columns;
	$functions = array(
						0 => array(	"func" => '$TEOS10->gsw_deltasa_from_sp($sp,$p,$lon,$lat)', 	// name of the function
									"value" => $TEOS10->gsw_deltasa_from_sp($sp,$p,$lon,$lat), 	// result of function
									"check" => 3.96067773336028495e-3,						// expected result ("check value")
									"diff" => 6.963318810448982e-013),						// Acceptable difference from check value
						1 => array(	"func" => '$TEOS10->gsw_sr_from_sp($sp)',
									"value" => $TEOS10->gsw_sr_from_sp($sp),
									"check" => 35.667397714285734e0,
									"diff" => 1.303233077010191e-010),
						2 => array(	"func" => '$TEOS10->gsw_sp_from_sr($sr)',
									"value" => $TEOS10->gsw_sp_from_sr($sr),
									"check" => 35.333387933015295e0,
									"diff" => 1.297122409482654e-010),
						3 => array(	"func" => '$TEOS10->gsw_sp_from_sa($sa,$p,$lon,$lat)',
									"value" => $TEOS10->gsw_sp_from_sa($sa,$p,$lon,$lat),
									"check" => 35.528504019167094e0,
									"diff" => 1.297113527698457e-010),
						4 => array(	"func" => '$TEOS10->gsw_sstar_from_sa($sa,$p,$lon,$lat)',
									"value" => $TEOS10->gsw_sstar_from_sa($sa,$p,$lon,$lat),
									"check" => 35.694648791860907e0,
									"diff" => 1.300008989346679e-010),
						5 => array(	"func" => '$TEOS10->gsw_sp_from_sstar($sstar,$p,$lon,$lat)',
									"value" => $TEOS10->gsw_sp_from_sstar($sstar,$p,$lon,$lat),
									"check" => 35.334761242083573e0,
									"diff" => 1.297122409482654e-010),
						6 => array(	"func" => '$TEOS10->gsw_sa_from_sstar($sstar,$p,$lon,$lat)',
									"value" => $TEOS10->gsw_sa_from_sstar($sstar,$p,$lon,$lat),
									"check" => 35.505322027120805e0,
									"diff" => 1.300222152167407e-010),
						7 => array(	"func" => '$TEOS10->gsw_pt_from_ct($sa,$ct)',
									"value" => $TEOS10->gsw_pt_from_ct($sa,$ct),
									"check" => 20.023899375975017e0,
									"diff" => 6.054037271496782e-010),
						8 => array(	"func" => '$TEOS10->gsw_t_from_ct($sa,$ct,$p)',
									"value" => $TEOS10->gsw_t_from_ct($sa,$ct,$p),
									"check" => 20.079820359223014e0,
									"diff" => 6.000142604989378e-010),
						9 => array(	"func" => '$TEOS10->gsw_ct_from_pt($sa,$pt)',
									"value" => $TEOS10->gsw_ct_from_pt($sa,$pt),
									"check" => 14.976021403957613e0,
									"diff" => 6.261107188265669e-010),
						10 => array("func" => '$TEOS10->gsw_pt0_from_t($sa,$t,$p)',
									"value" => $TEOS10->gsw_pt0_from_t($sa,$t,$p),
									"check" => 14.954241363902305e0,
									"diff" => 6.054037271496782e-010),
						11 => array("func" => '$TEOS10->gsw_pt_from_t($sa,$t,$p,$p_ref)',
									"value" => $TEOS10->gsw_pt_from_t($sa,$t,$p,$p_ref),
									"check" => 14.969381237883740e0,
									"diff" => 6.054037271496782e-010),
                        12 => array( "func" => '$TEOS10->gsw_z_from_p($p,$lat)',
                                    "value" => $TEOS10->gsw_z_from_p($p,$lat),
                                    "check" => -2.980161553316402e2,
                                    "diff" => 2.287223921371151e-008),
                        13 => array("func" => '$TEOS10->gsw_entropy_from_t($sa,$t,$p)',
                                    "value" => $TEOS10->gsw_entropy_from_t($sa,$t,$p),
                                    "check" => 212.30166821093002e0,
                                    "diff" => 9.028163105995191e-009),
                        14 => array("func" => '$TEOS10->gsw_adiabatic_lapse_rate_from_ct($sa,$ct,$p)',
                                    "value" => $TEOS10->gsw_adiabatic_lapse_rate_from_ct($sa,$ct,$p),
                                    "check" => 1.877941744191155e-8,
                                    "diff" => 5.699743845487985e-019)
					);
	foreach($functions as $function) {
		$diff = abs($function["check"]-$function["value"]);
		printf('<tr>');
			echo "<td>".$function["func"]."</td>";
			echo "<td>".$function["value"]."</td>";
			echo "<td>".$function["check"]."</td>";
			echo "<td>$diff</td>";
			if($diff > $function["diff"]) {
				echo '<td class="error">'.$function["diff"]."</td>";
			}
			else echo "<td>".$function["diff"]."</td>";

		printf('</tr>');
	}
	############################################################################
	# Density and enthalpy, based on the 48-term expression for density:
    printf('<tr><td colspan="5" class="fct_grp"><strong>
			Density and enthalpy, based on the 48-term expression for density:
			</strong></td></tr>');
	echo $columns;

    $functions = array(
						0 => array(	"func" => '$TEOS10->gsw_rho($sa,$ct,$p)', 	// name of the function
									"value" => $TEOS10->gsw_rho($sa,$ct,$p), 	// result of function
									"check" => 1026.4562376198473e0,						// expected result ("check value")
									"diff" => 2.945625965367071e-010),						// Acceptable difference from check value
						1 => array(	"func" => '$TEOS10->gsw_alpha($sa,$ct,$p)',
									"value" => $TEOS10->gsw_alpha($sa,$ct,$p),
									"check" => 2.62460550806784356e-4,
									"diff" => 8.264713918662917e-015),
						2 => array(	"func" => '$TEOS10->gsw_beta($sa,$ct,$p)',
									"value" => $TEOS10->gsw_beta($sa,$ct,$p),
									"check" => 7.29314455934463365e-4,
									"diff" => 1.846179459308317e-015),
                        3 => array( "func" => '$TEOS10->gsw_alpha_on_beta($sa,$ct,$p)',
                                    "value" => $TEOS10->gsw_alpha_on_beta($sa,$ct,$p),
                                    "check" => 0.359872958325632e0,
                                    "diff" => 1.052907760978883e-11),
						4 => array(	"func" => '$TEOS10->gsw_specvol($sa,$ct,$p)',
									"value" => $TEOS10->gsw_specvol($sa,$ct,$p),
									"check" => 9.74225654586897711e-4,
									"diff" => 2.821094052807283e-016),
						5 => array(	"func" => '$TEOS10->gsw_specvol_anom($sa,$ct,$p)',
									"value" => $TEOS10->gsw_specvol_anom($sa,$ct,$p),
									"check" => 2.90948181201264571e-6,
									"diff" => 2.810252031082428e-016),
                        6 => array( "func" => '$TEOS10->gsw_sigma0($sa,$ct)',
                                    "value" => $TEOS10->gsw_sigma0($sa,$ct),
                                    "check" => 25.165674636323047e0,
                                    "diff" => 2.933120413217694e-010),
                        7 => array( "func" => '$TEOS10->gsw_sigma1($sa,$ct)',
                                    "value" => $TEOS10->gsw_sigma1($sa,$ct),
                                    "check" => 29.434338510752923e0,
                                    "diff" => 2.999058779096231e-010),
                        8 => array( "func" => '$TEOS10->gsw_sigma2($sa,$ct)',
                                    "value" => $TEOS10->gsw_sigma2($sa,$ct),
                                    "check" => 33.609842926904093e0,
                                    "diff" => 3.060449671465904e-010),
                        9 => array( "func" => '$TEOS10->gsw_sigma3($sa,$ct)',
                                    "value" => $TEOS10->gsw_sigma3($sa,$ct),
                                    "check" => 37.695147569371784e0,
                                    "diff" => 3.119566827081144e-010),
                        10=> array( "func" => '$TEOS10->gsw_sigma4($sa,$ct)',
                                    "value" => $TEOS10->gsw_sigma4($sa,$ct),
                                    "check" => 41.693064726656303e0,
                                    "diff" => 3.180957719450817e-010),
						11=> array(	"func" => '$TEOS10->gsw_sound_speed($sa,$ct,$p)',
									"value" => $TEOS10->gsw_sound_speed($sa,$ct,$p),
									"check" => 1527.2011773569989e0,
									"diff" => 2.596152626210824e-009),
                        12=> array( "func" => '$TEOS10->gsw_kappa($sa,$ct,$p)',
                                    "value" => $TEOS10->gsw_kappa($sa,$ct,$p),
                                    "check" => 4.177024873349404e-010,
                                    "diff" => 1.717743939542931e-21),
                        13=> array( "func" => '$TEOS10->gsw_cabbeling($sa,$ct,$p)',
                                    "value" => $TEOS10->gsw_cabbeling($sa,$ct,$p),
                                    "check" => 9.463053321129075e-6,
                                    "diff" => 1.634722766223964e-16),
                        14=> array( "func" => '$TEOS10->gsw_thermobaric($sa,$ct,$p)',
                                    "value" => $TEOS10->gsw_thermobaric($sa,$ct,$p),
                                    "check" => 1.739078662082863e-12,
                                    "diff" => 4.890907320111513e-23),
						15=> array(	"func" => '$TEOS10->gsw_internal_energy($sa,$ct,$p)',
									"value" => $TEOS10->gsw_internal_energy($sa,$ct,$p),
									"check" => 79740.482561720783e0,
									"diff" => 2.499342372175306e-006),
						16=> array(	"func" => '$TEOS10->gsw_enthalpy($sa,$ct,$p)',
									"value" => $TEOS10->gsw_enthalpy($sa,$ct,$p),
									"check" => 82761.872939932495e0,
									"diff" => 2.499356924090534e-006),
						17=> array(	"func" => '$TEOS10->gsw_dynamic_enthalpy($sa,$ct,$p)',
									"value" => $TEOS10->gsw_dynamic_enthalpy($sa,$ct,$p),
									"check" => 2924.5137975399025e0,
									"diff" => 2.288754734930485e-007),
                        18=> array( "func" => '$TEOS10->gsw_sa_from_rho($rho,$ct,$p)',
                                    "value" => $TEOS10->gsw_sa_from_rho($rho,$ct,$p),
                                    "check" => $sa,
                                    "diff" => 2.945625965367071e-010)
					);
	foreach($functions as $function) {
		$diff = abs($function["check"]-$function["value"]);
		printf('<tr>');
			echo "<td>".$function["func"]."</td>";
			echo "<td>".$function["value"]."</td>";
			echo "<td>".$function["check"]."</td>";
			echo "<td>$diff</td>";
			if($diff > $function["diff"]) {
				echo '<td class="error">'.$function["diff"]."</td>";
			}
			else echo "<td>".$function["diff"]."</td>";

		printf('</tr>');
	}
    printf('<tr><td colspan="4">$TEOS10->gsw_rho_first_derivatives($sa,$ct,$p,$drho_dsa,$drho_dct,$drho_dp)</td>');
        $TEOS10->gsw_rho_first_derivatives($sa,$ct,$p,$drho_dsa,$drho_dct,$drho_dp);
        $drho_dct_ca = 8.315403920988729e-12;
        $drho_dp_ca = 1.782157321023048e-18;
        $drho_dsa_ca = 1.943112337698949e-12;
        $drho_dsa_error = abs($drho_dsa - 0.748609372480258e0);
        $drho_dct_error = abs($drho_dct + 0.269404269504765e0);
        $drho_dp_error = abs($drho_dp - 4.287533235942749e-7);
        if ($drho_dsa_error < $drho_dsa_ca && $drho_dct_error < $drho_dct_ca && $drho_dp_error < $drho_dp_ca)
            printf("<td>passed\n</td>");
        else {
            printf("<td class=\"error\">failed\n</td>");
        }
    printf('</tr>');
	unset($functions);
    ############################################################################
    # Water column properties, based on the 48-term expression for density:
    printf('<tr><td colspan="5" class="fct_grp"><strong>
            Water column properties, based on the 48-term expression for density:
            </strong></td></tr>');
    echo $columns;

    printf('<tr><td colspan="4">$TEOS10->gsw_nsquared($sa_profile,$ct_profile,$p_profile,$lat_profile,$nz,$n2,$p_mid_n2)</td>');
        $TEOS10->gsw_nsquared($sa_profile,$ct_profile,$p_profile,$lat_profile,$nz,$n2,$p_mid_n2);
        $n2_ca = 1.578186366313350e-014;
        $p_mid_n2_ca = 2.300021151313558e-008;
        $n2_error[0] = abs($n2[0] + 0.070960392693051e-3);
        $n2_error[1] = abs($n2[1] - 0.175435821615983e-3);
        $p_mid_n2_error[0] = abs($p_mid_n2[0] - 25e0);
        $p_mid_n2_error[1] = abs($p_mid_n2[1] - 75e0);
        if ($n2_error[0] < $n2_ca && $n2_error[1] < $n2_ca && $p_mid_n2_error[0] < $p_mid_n2_ca && $p_mid_n2_error[1] < $p_mid_n2_ca)
            printf("<td>passed\n</td>");
        else {
            printf("<td class=\"error\">failed\n</td>");
        }
    printf('</tr>');

    printf('<tr><td colspan="4">$TEOS10->gsw_turner_rsubrho($sa_profile,$ct_profile,$p_profile,$nz,$tu,$rsubrho,$p_mid_tursr)</td>');
        $TEOS10->gsw_turner_rsubrho($sa_profile,$ct_profile,$p_profile,$nz,$tu,$rsubrho,$p_mid_tursr);
        $tu_ca = 2.190718007000214e-008;
        $rsubrho_ca = 1.709803143512545e-008;
        $p_mid_tursr_ca = 2.300021151313558e-008;
        $tu_error[0] = abs($tu[0] + 1.187243981606485e2);
        $tu_error[1] = abs($tu[1] - 0.494158257088517e2);
        $rsubrho_error[0] = abs($rsubrho[0] - 3.425146897090065e0);
        $rsubrho_error[1] = abs($rsubrho[1] - 12.949399443139164e0);
        $p_mid_tursr_error[0] = abs($p_mid_tursr[0] - 25e0);
        $p_mid_tursr_error[1] = abs($p_mid_tursr[1] - 75e0);
        if ($tu_error[0] < $tu_ca && $tu_error[1] < $tu_ca &&
            $rsubrho_error[0] < $rsubrho_ca && $rsubrho_error[1] < $rsubrho_ca &&
            $p_mid_tursr_error[0] < $p_mid_tursr_ca &&
            $p_mid_tursr_error[1] < $p_mid_tursr_ca)
            printf("<td>passed\n</td>");
        else {
            printf("<td class=\"error\">failed\n</td>");
        }
    printf('</tr>');

    printf('<tr><td colspan="4">$TEOS10->gsw_ipv_vs_fnsquared_ratio($sa_profile,$ct_profile,$p_profile,$nz,$ipvfn2,$p_mid_ipvfn2)</td>');
        $TEOS10->gsw_ipv_vs_fnsquared_ratio($sa_profile,$ct_profile,$p_profile,$nz,$ipvfn2,$p_mid_ipvfn2);
        $ipvfn2_ca = 3.474816878679121e-009;
        $p_mid_ipvfn2_ca = 2.300021151313558e-008;
        $ipvfn2_error[0] = abs($ipvfn2[0] - 0.996783975249010e0);
        $ipvfn2_error[1] = abs($ipvfn2[1] - 0.992112251478320e0);
        $p_mid_ipvfn2_error[0] = abs($p_mid_ipvfn2[0] - 25e0);
        $p_mid_ipvfn2_error[1] = abs($p_mid_ipvfn2[1] - 75e0);
        if ($ipvfn2_error[0] < $ipvfn2_ca &&
            $ipvfn2_error[1] < $ipvfn2_ca &&
            $p_mid_ipvfn2_error[0] < $p_mid_ipvfn2_ca &&
            $p_mid_ipvfn2_error[1] < $p_mid_ipvfn2_ca)
            printf("<td>passed\n</td>");
        else {
            printf("<td class=\"error\">failed\n</td>");
        }
    printf('</tr>');

	############################################################################
	# Freezing temperatures:
    printf('<tr><td colspan="5" class="fct_grp"><strong>
			Freezing temperatures:
			</strong></td></tr>');
	echo $columns;
	$functions = array(
						0 => array(	"func" => '$TEOS10->gsw_ct_freezing($sa,$p,$saturation_fraction)', 	// name of the function
									"value" => $TEOS10->gsw_ct_freezing($sa,$p,$saturation_fraction), 	// result of function
									"check" => -2.1801450326174852e0,						// expected result ("check value")
									"diff" => 2.257127817983928e-011),						// Acceptable difference from check value
						1 => array(	"func" => '$TEOS10->gsw_t_freezing($sa,$p,$saturation_fraction)',
									"value" => $TEOS10->gsw_t_freezing($sa,$p,$saturation_fraction),
									"check" => -2.1765521998023516e0,
									"diff" => 2.157829470661454e-011)
					);
	foreach($functions as $function) {
		$diff = abs($function["check"]-$function["value"]);
		printf('<tr>');
			echo "<td>".$function["func"]."</td>";
			echo "<td>".$function["value"]."</td>";
			echo "<td>".$function["check"]."</td>";
			echo "<td>$diff</td>";
			if($diff > $function["diff"]) {
				echo '<td class="error">'.$function["diff"]."</td>";
			}
			else echo "<td>".$function["diff"]."</td>";

		printf('</tr>');
	}
	unset($functions);
	############################################################################
	# Isobaric melting enthalpy and isobaric evaporation enthalpy:
    printf('<tr><td colspan="5" class="fct_grp"><strong>
			Isobaric melting enthalpy and isobaric evaporation enthalpy:
			</strong></td></tr>');
	echo $columns;
	$functions = array(
						0 => array(	"func" => '$TEOS10->gsw_latentheat_melting($sa,$p)', 	// name of the function
									"value" => $TEOS10->gsw_latentheat_melting($sa,$p), 	// result of function
									"check" => 329330.54839618353e0,						// expected result ("check value")
									"diff" => 6.286427378654480e-008),						// Acceptable difference from check value
						1 => array(	"func" => '$TEOS10->gsw_latentheat_evap_ct($sa,$ct)',
									"value" => $TEOS10->gsw_latentheat_evap_ct($sa,$ct),
									"check" => 2450871.0228523901e0,
									"diff" => 1.455657184123993e-006),
						2 => array(	"func" => '$TEOS10->gsw_latentheat_evap_t($sa,$t)',
									"value" => $TEOS10->gsw_latentheat_evap_t($sa,$t),
									"check" => 2462848.2895522709e0,
									"diff" => 1.443084329366684e-006)
					);
	foreach($functions as $function) {
		$diff = abs($function["check"]-$function["value"]);
		printf('<tr>');
			echo "<td>".$function["func"]."</td>";
			echo "<td>".$function["value"]."</td>";
			echo "<td>".$function["check"]."</td>";
			echo "<td>$diff</td>";
			if($diff > $function["diff"]) {
				echo '<td class="error">'.$function["diff"]."</td>";
			}
			else echo "<td>".$function["diff"]."</td>";

		printf('</tr>');
	}
	unset($functions);
	############################################################################
	# Basic thermodynamic properties in terms of in-situ t, based on the exact Gibbs function:
    printf('<tr><td colspan="5" class="fct_grp"><strong>
			Basic thermodynamic properties in terms of in-situ t, based on the exact Gibbs function:
			</strong></td></tr>');
	echo $columns;
    $rho = $TEOS10->gsw_rho_t_exact($sa,$t,$p);
	$functions = array(
						0 => array(	"func" => '$TEOS10->gsw_rho_t_exact($sa,$t,$p)', 	// name of the function
									"value" => $TEOS10->gsw_rho_t_exact($sa,$t,$p), 	// result of function
									"check" => 1027.7128170207150e0,						// expected result ("check value")
									"diff" => 2.944489096989855e-010),						// Acceptable difference from check value
						1 => array(	"func" => '$TEOS10->gsw_pot_rho_t_exact($sa,$t,$p,$p_ref)',
									"value" => $TEOS10->gsw_pot_rho_t_exact($sa,$t,$p,$p_ref),
									"check" => 1026.8362655887486e0,
									"diff" => 2.929709808086045e-010),
						2 => array(	"func" => '$TEOS10->gsw_alpha_wrt_t_exact($sa,$t,$p)',
									"value" => $TEOS10->gsw_alpha_wrt_t_exact($sa,$t,$p),
									"check" => 2.19066952410728916e-4,
									"diff" => 8.594856868316542e-015),
						3 => array(	"func" => '$TEOS10->gsw_beta_const_t_exact($sa,$t,$p)',
									"value" => $TEOS10->gsw_beta_const_t_exact($sa,$t,$p),
									"check" => 7.44744841648729426e-4,
									"diff" => 1.804871356536619e-015),
						4 => array(	"func" => '$TEOS10->gsw_specvol_t_exact($sa,$t,$p)',
									"value" => $TEOS10->gsw_specvol_t_exact($sa,$t,$p),
									"check" => 9.73034473676164815e-4,
									"diff" => 2.818925648462312e-016),
						5 => array(	"func" => '$TEOS10->gsw_sound_speed_t_exact($sa,$t,$p)',
									"value" => $TEOS10->gsw_sound_speed_t_exact($sa,$t,$p),
									"check" => 1512.2053940303056e0,
									"diff" => 2.590240910649300e-009),
						6 => array(	"func" => '$TEOS10->gsw_kappa_t_exact($sa,$t,$p)',
									"value" => $TEOS10->gsw_kappa_t_exact($sa,$t,$p),
									"check" => 4.25506953386609075e-010,
									"diff" => 1.712677458291044e-021),
						7 => array(	"func" => '$TEOS10->gsw_enthalpy_t_exact($sa,$t,$p)',
									"value" => $TEOS10->gsw_enthalpy_t_exact($sa,$t,$p),
									"check" => 62520.680485510929e0,
									"diff" => 2.499349648132920e-006),
						8 => array(	"func" => '$TEOS10->gsw_cp_t_exact($sa,$t,$p)',
									"value" => $TEOS10->gsw_cp_t_exact($sa,$t,$p),
									"check" => 3982.7832563441461e0,
									"diff" => 2.813976607285440e-009)
					);
	foreach($functions as $function) {
		$diff = abs($function["check"]-$function["value"]);
		printf('<tr>');
			echo "<td>".$function["func"]."</td>";
			echo "<td>".$function["value"]."</td>";
			echo "<td>".$function["check"]."</td>";
			echo "<td>$diff</td>";
			if($diff > $function["diff"]) {
				echo '<td class="error">'.$function["diff"]."</td>";
			}
			else echo "<td>".$function["diff"]."</td>";

		printf('</tr>');
	}
	unset($functions);
	############################################################################
	# Library functions of the GSW toolbox:
	printf('<tr><td colspan="5" class="fct_grp"><strong>
			Library functions of the GSW toolbox:
			</strong></td></tr>');
	echo $columns;
	$functions = array(
						0 => array(	"func" => '$GSW_saar->gsw_deltasa_atlas($p,$lon,$lat)', 	// name of the function
									"value" => $GSW_saar->gsw_deltasa_atlas($p,$lon,$lat), 	// result of function
									"check" => 3.87660373016291727e-3,						// expected result ("check value")
									"diff" => 6.945514042372425e-013),						// Acceptable difference from check value
						1 => array(	"func" => '$TEOS10->gsw_fdelta($p,$lon,$lat)',
									"value" => $TEOS10->gsw_fdelta($p,$lon,$lat),
									"check" => 1.49916256924158942e-004,
									"diff" => 2.702939055302528e-014),
						2 => array(	"func" => '$TEOS10->gsw_sa_from_sp_baltic($sp,$long_bs,$lat_bs)',
									"value" => $TEOS10->gsw_sa_from_sp_baltic($sp,$long_bs,$lat_bs),
									"check" => 35.666154857142850e0,
									"diff" => 1.300080043620255e-010),
						3 => array(	"func" => '$TEOS10->gsw_sp_from_sa_baltic($sa,$long_bs,$lat_bs)',
									"value" => $TEOS10->gsw_sp_from_sa_baltic($sa,$long_bs,$lat_bs),
									"check" => 35.533769845749660e0,
									"diff" => 1.297113527698457e-010)
					);
	foreach($functions as $function) {
		$diff = abs($function["check"]-$function["value"]);
		printf('<tr>');
			echo "<td>".$function["func"]."</td>";
			echo "<td>".$function["value"]."</td>";
			echo "<td>".$function["check"]."</td>";
			echo "<td>$diff</td>";
			if($diff > $function["diff"]) {
				echo '<td class="error">'.$function["diff"]."</td>";
			}
			else echo "<td>".$function["diff"]."</td>";

		printf('</tr>');
	}
	unset($functions);

	printf('</table>');

	printf("<br/><strong>Unaccceptable Differences are marked red.</strong><br/>");
	printf("<br/><strong>Gibbs SeaWater (GSW) Oceanographic Toolbox is installed.</strong><br/>");


?>

</body>
</html>
