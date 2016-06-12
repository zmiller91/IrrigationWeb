<?php
require_once 'Server.php';
define('ROOT_PATH', $_SERVER['DOCUMENT_ROOT'].'/'.APP_NAME.'/');
$GLOBALS['AUTOLOAD_CACHE_PATH']  = ROOT_PATH . "cache/classpaths.cache";
if(!file_exists($AUTOLOAD_CACHE_PATH))
{
    touch($AUTOLOAD_CACHE_PATH);
}
$GLOBALS['AUTOLOAD_CACHE'] = unserialize(file_get_contents($AUTOLOAD_CACHE_PATH));

function application_autoloader($class) {
    $class = strtolower($class);
    $class_filename = strtolower($class).'.php';
    $temp = $GLOBALS['AUTOLOAD_CACHE_PATH'];
    if (array_key_exists($class, $GLOBALS['AUTOLOAD_CACHE'])) {
        /* Load class using path from cache file (if the file still exists) */
        if (file_exists($GLOBALS['AUTOLOAD_CACHE'][$class])) { 
            require_once $GLOBALS['AUTOLOAD_CACHE'][$class]; 
        }
 
    } else {
        /* Determine the location of the file within the $class_root and, if found, load and cache it */
        $directories = new RecursiveDirectoryIterator(ROOT_PATH);
        foreach(new RecursiveIteratorIterator($directories) as $file) {
            if (strtolower($file->getFilename()) == $class_filename) {
                $full_path = $file->getRealPath();
                $GLOBALS['AUTOLOAD_CACHE'][$class] = $full_path;
                file_put_contents($GLOBALS['AUTOLOAD_CACHE_PATH'], serialize($GLOBALS['AUTOLOAD_CACHE']));
                require_once $full_path;
                break;
            }
        }   
 
    }
}
 
spl_autoload_register('application_autoloader');