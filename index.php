<!doctype html>
<html>
<head>
	<title>demo</title>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <link rel="stylesheet" href="css/style.css"/>
    <link rel="stylesheet" href="css/advtable-1.0.0.min.css"/>
    <script type="text/javascript"  src="js/jquery-1.9.0.1.min.js"></script>
    <script type="text/javascript"  src="js/advtable-1.1.0.min.js"></script>
    <link type ="text/css" rel="stylesheet" href="css/codemirror.css" charset="utf-8" media="all">  
    <link type ="text/css" rel="stylesheet" href="css/monokai.css" charset="utf-8" media="all">   
    <script src="js/codemirror.js" type="text/javascript" charset="utf-8" ></script>
    <script src="js/clike.js" type="text/javascript" charset="utf-8" ></script>
    <script src="js/xml.js" type="text/javascript" charset="utf-8" ></script>
    <script src="js/javascript.js" type="text/javascript" charset="utf-8" ></script>
    <script src="js/htmlmixed.js" type="text/javascript" charset="utf-8" ></script>
    <script src="js/php.js" type="text/javascript" charset="utf-8" ></script>
    <script src="js/script.js" type="text/javascript" charset="utf-8" ></script>
</head>
<body>
    <div class = "wrapper">
        <h1 >Advanced Table</h1>
        <p>Standalone Demo (PHP server required) from csv file <br> (update and reload not working):</p>

<?php

    $file = 'upload/demo.csv';
    $lines = file($file);
    $first = true;
    $row ='<table id = "yourId"><thead>';
    foreach($lines as $line_num => $line){
        $line = trim(($line));
            if($first == true){
                $row .='<tr><th>'.str_replace(';', '</th><th>', $line).'</th></tr></thead><tbody>';
                $first = false;
            }else{
                $row .='<tr><td>'.str_replace(';', '</td><td>', $line).'</td></tr>';
            }
    }
        echo  $row.'</tbody></table>';

?>
    <p> Properties and Usage: </p>
    <br>
    <img src="css/demo.jpg" alt="">
    <br><br><br>
    <pre class = "usage">
Menu bar (bottom left):
                        Left(service) icon:     console.
                        down icon:               scroll down.
                        up icon:                    scroll up.
                        download icon:         download visible data to csv file.

Menu bar (bottom right):
                        resize icon: resize the table.
    </pre><br><br>
    <pre class = "usage">
Console:
                        reload:           reload data (working only with database)
                        update:          update modifyed data (working only with database).When clicked, enter your password. Password is timeout limited. 
                        add row:        add a new row.
                        delete row:     delete selected (highlighted) rows.
                        search box:     full text search, only target rows displayed.
    </pre><br><br>
    <pre class = "usage">
Menu bar (bottom left):
                        Left(service) icon:     console.
                        down icon:               scroll down.
                        up icon:                    scroll up.
                        download icon:         download visible data csv file.
    </pre><br><br>
    <pre class = "usage">
    Double click on td: edit content.
    Click on the row: select row (highlighted).
    Multi row select: hold left control and click on the row.
    </pre><br><br>

    <p>Required HTML - PHP - javascript Code:</p>
<!doctype html>

        <textarea name="htmlCode">
&lt;html&gt;
&lt;head&gt;
    &lt;link rel="stylesheet" href="css/advtable-1.0.0.min.css"/&gt;
    &lt;script type="text/javascript"  src="js/jquery-1.9.0.1.min.js"&gt;&lt;/script&gt;
    &lt;script type="text/javascript"  src="js/advtable-1.0.0.min.js"&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
        //if table have children create from this or table dont have children crate from com.php with JSON or uploaded csv file see below. 
        &lt;table id = "yourId"&gt;&lt;/table&gt; 
        //or load with this example method with my php class
        &lt;?php
        require_once('mysql_db.php');
        $db = Database::getInstance();
        $db-&gt;connect();
            $sql = "SELECT * FROM  yourTable";
            $table = $db-&gt;getHTMLtable($sql, 'yourId');
            echo $table;
        $db-&gt;disconnect();
        ?&gt;
        &lt;script type="text/javascript" charset="utf-8" &gt;
        $(document).ready(function() {
        // initialize with default setting  $('#yourId').advTable()  or add a new settings:
        // This is default
            $('#yourId').advTable({
                src: 'database',    // database is default else your uploaded file. Example 'upload/demo.csv'
                name: "advTable",   // Name required for table association in com.php file  (com_mssql or com_mysql)
                width: 1000,        // table inner width numeric
                height: 300,        // table inner height numeric
                delimiter: ';',     // delimiter for csv file (download)
                datePicker: true,   // enable HTML5 date picker. Check field data. If this date or datetime then enable browser HTML5 datepicker.
                buttons: {          // handlers true:display, false:hide
                    addRow: true,   
                    dellRow: true,
                    update: true,
                    reload: true,
                    search: true
                },
                php: {
                    id: 0,              // unique database column index not editable
                    file: "com.php",    // required for database handling (com_mssql or com_mysql)
                    user: "root",       // add more user option (not working, yet)
                    timeout: 60000      // entered password timeout
                }
            });
        });
        &lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;
&lt;?php
// com php file configuration (bottom of the com php): 
function assoc_table($value = '') {
    $val = array();
    if($value == 'advTable') {
        $val['table'] =  'yourTable';   // configured name in script (name: "advTable") 'yourTable' is a real database table.
        $val['pass'] ='admin';          // password for this table
    }
    return $val;
}
?&gt;
&lt;?php
// if you want change column name then add tags for this array(name_def.php):
      $nevek = array(
          'date' => 'Date',
          'location' => 'Location',
          'country_code' => 'Country code',
          'country_name' => 'Country name',
          'ip' => 'Ip address',
          'id' => 'Identity',
          'region' => 'Region',
          'city' => 'City',
          'postal_code' => 'Postal code',
          'latitude' => 'Latitude',
          'longitude' => 'Longitude'
      );
?&gt;
        </textarea>
        <br><br>
	</div>
<script type="text/javascript" charset="utf-8" async defer>
$(document).ready(function() {
    $('#yourId').advTable({
        src: 'upload/demo.csv',
        name: "advTable",
        width: 1000,
        height: 300,
        delimiter: ';',
        buttons: {
            addRow: true,
            dellRow: true,
            update: true,
            reload: true,
            search: true
        },
        php: {
            id: 0,
            file: "com_mysql.php",
            user: "root",
            timeout: 60000
        }
    });
});
</script>
</body>
</html>


