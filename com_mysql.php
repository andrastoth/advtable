<?php
$order = $_REQUEST['order'];

if($order != 'load_excel'){
    $pass = $_REQUEST['pass'];
    require_once('mysql_db.php');
    $db = Database::getInstance();
    $db->connect();
}
$id = $_REQUEST['id'];
$pass = $_REQUEST['pass'];
$param = $_REQUEST['param'];
$table = assoc_table($_REQUEST['name']);
$table = $table['table'];
$req_pass = assoc_table($_REQUEST['name']);
$req_pass = $req_pass['pass'];
if($order == 'load') {
    $sql = "SELECT * FROM $table ORDER BY id";
    $query = $db->query($sql);
    $json = $db->jsonEncode($query);
    echo $json;
} else if($order == 'reload') {
    $sql = "SELECT * FROM $table ORDER BY id";
    $query = $db->query($sql);
    $json = $db->jsonEncode($query);
    echo $json;
}else if($order == 'load_excel'){
    $file = $param;
    $lines = file($file);
    $first = true;
    $row ='<thead>';
    foreach($lines as $line_num => $line){
            $line = trim($line);
            //$line = trim(utf8_encode ($line));
            if($first == true){
                $row .='<tr><th>'.str_replace($pass, '</th><th>', $line).'</th></tr></thead><tbody>';
                $first = false;
            }else{
                $row .='<tr><td>'.str_replace($pass, '</td><td>', $line).'</td></tr>';
            }
    }
        $json =  $row.'</tbody>';
        echo json_encode($json);
} else if($order == 'insert') {
    if($req_pass == $pass) {
        $sql = "SELECT  * FROM $table LIMIT 1";
        $query = $db->query($sql);
        $row = $query[0];
        $nameArray = array();
        $index = 0;
        foreach($row as $key => $value) {
            if($index != $id) {
                $nameArray[] = $key;
                $valArray[] = "'".$param[$index]."'";
            }
            $index++;
        }
        $valArray  = str_replace('?', '',$valArray);
        $arrayName = implode(',', $nameArray);
        $valArray = implode(',', $valArray);
        $sql = "INSERT INTO $table ($arrayName) VALUES ($valArray);";
        $query = $db->query($sql, array(), true);
        $json = array('state' => 'OK');
        $json = json_encode($json);
    } else {
        $json = array('state' => 'NOK');
        $json = json_encode($json);
    }

    echo $json;
} else if($order == 'update') {
    if($req_pass == $pass) {
        $sql = "SELECT  * FROM $table LIMIT 1";
        $query = $db->query($sql);
        $row = $query[0];
        $sql = "UPDATE $table SET ";
        $index = 0;
        $sqle = '';
        foreach($row as $key => $value) {
            if($index != $id) {
                $sql.= $key.'='."'".$param[$index]."', ";
            } else {
                $sqle = "WHERE ".$key." = "."'".$param[$index]."';";
            }
            $index++;
        }
        $sql = rtrim($sql, ', ');
        $sql.= ' '.$sqle;
        $query = $db->query($sql, array(), true);
        $json = array('state' => 'OK');
        $json = json_encode($json);
    } else {
        $json = array('state' => 'NOK');
        $json = json_encode($json);
    }

    echo $json;
} else if($order == 'delete') {
    if($req_pass == $pass) {
        $sql = "SELECT  * FROM $table LIMIT 1";
        $query = $db->query($sql);
        $row = $query[0];
        $sql = "DELETE FROM $table ";
        $index = 0;
        $sqle = '';
        foreach($row as $key => $value) {
            if($index == $id) {
                $sqle = "WHERE ".$key." = "."'".$param."';";
            }
            $index++;
        }
        $sql.= $sqle;
        $query = $db->query($sql, array(), true);
        $json = array('state' => 'OK');
        $json = json_encode($json);
    } else {
        $json = array('state' => 'NOK');
        $json = json_encode($json);
    }

    echo $json;
} else if($order == 'getpass') {
    if($req_pass == $pass) {
        $json = array('state' => 'OK');
        $json = json_encode($json);
    } else {
        $json = array('state' => 'NOK');
        $json = json_encode($json);
    }

    echo $json;
} else if($order == 'download') {
    $myFile = 'upload/'.$_REQUEST['name'].'.csv';
    $fh = fopen($myFile, 'w') or die("can't open file");
    fwrite($fh, $param);
    fclose($fh);
}

function assoc_table($value = '') {
    $val = array();
    if($value == 'advTable') {
        $val['table'] =  'yourTable';
        $val['pass'] ='admin';
    }
    return $val;
}
if($order != 'load_excel'){
    $db->disconnect(); 
}
?>