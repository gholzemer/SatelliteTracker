<?php
        $output= shell_exec('powershell -command excelToMatlab.ps1');
        echo( '<pre>' );
        echo( $output );
        echo( '</pre>' );          
 ?>
