<?php

/**
 * Created by PhpStorm.
 * User: Zesa
 * Date: 12/15/2016
 * Time: 4:04 PM
 */
class Piccolo
{

    public $fileextension;
    public $mime;
    public $base64_image;
    private $postvariablename;

    private function __construct($postvariablename){

        $this->postvariablename = $postvariablename;

        //Get http payload
        $payload = file_get_contents('php://input');
        $data = json_decode($payload);

        //Get file content
        $raw_base64_image = $data->$postvariablename;

        $index_colon = strpos($raw_base64_image, ':') + 1;
        $index_semicolon = strpos($raw_base64_image, ';') + 1;
        $index_comma = strpos($raw_base64_image, ',') + 1;

        //Get MIME
        $this->mime = substr($raw_base64_image, $index_colon, $index_semicolon - $index_colon);

        //Get base64 image text
        $this->base64_image = substr($raw_base64_image, $index_comma);

    }

    public function save($filename_no_extension){

        $im = imagecreatefromstring($this->base64_image);

        if($im !== false){

            $status = imagepng($im, $filename_no_extension);
            imagedestroy($im);
            return $status;

        }else{

            return false;

        }

    }

    public static function init($postvariablename = 'file'){

        $postvariablename = ($postvariablename) ? $postvariablename : 'file';
        return new Piccolo($postvariablename);

    }

}