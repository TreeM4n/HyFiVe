
<?php
include_once "./TEOS10/TEOS10_gsw_oceanographic_toolbox.php";
include_once "./TEOS10/TEOS10_gsw_saar.php";
$TEOS10 = new TEOS10_gsw_oceanographic_toolbox();
//$GSW_saar = new TEOS10_gsw_saar();
/*
$c = $_POST['c']; 
$t = $_POST['t']; 
$p = $_POST['p']; 
*/
$t	= 15e0;
$p	= 300e0;
$c  = 43.6e0;
$TEOS10->gsw_sp_from_c($c,$t,$p);


echo json_encode( $TEOS10) ;
?>