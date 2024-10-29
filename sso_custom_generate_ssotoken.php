<?php
class minnit_custom_sso
{
    var $user;

    public function __construct()
    {
        $this->user = wp_get_current_user();
    }

    public function loggedIn()
    {
        return $this->user->exists();
    }

    public function encrypt($key, $textToEncrypt)
    {
        $tag_length = 16;
        $iv_len = 12;
        $iv = openssl_random_pseudo_bytes($iv_len);
        $tag = ""; // will be filled by openssl_encrypt
        $ciphertext = openssl_encrypt($textToEncrypt, "aes-256-gcm", $key, OPENSSL_RAW_DATA, $iv, $tag, "", $tag_length);
        return base64_encode($iv . $ciphertext . $tag);
    }

    public function getUserDataJSON() {
        $userdata = get_userdata($this->user->ID);
        $ssoTokenArr = array("userid" => $userdata->ID, "username" => $userdata->user_login, "nickname" => $userdata->display_name, "profile_picture_url" => $_GET["photourl"], "max_valid_ts" => time() + 1209600);
        return json_encode($ssoTokenArr);
    }
}

header("Cache-Control: must-revalidate, no-cache, no-store, private");
header("Expires: 0");
header("Content-Type: application/json");

$page = new minnit_custom_sso();

$options = get_option('minnit_options');
$respArray = array();
if (!isset($options["minnitchatssooauth2"]) || $options["minnitchatssooauth2"] != 1) {
    $respArray["success"] = false;
    $respArray["error"] = "sso_not_enabled";
} elseif (isset($options["minnitchatssoadvanced"]) && $options["minnitchatssoadvanced"] == 1) {
    $respArray["success"] = false;
    $respArray["error"] = "advanced_sso_enabled";
} elseif (empty($options["minnitchatencryptionkey"])) {
    $respArray["success"] = false;
    $respArray["error"] = "encryption_key_empty";
} elseif (!$page->loggedIn()) {
    $respArray["success"] = false;
    $respArray["error"] = "user_not_logged_in";
} else {
    $respArray["success"] = true;
    $respArray["ssotoken"] = $page->encrypt($options["minnitchatencryptionkey"], $page->getUserDataJSON());
}

status_header($respCode);

echo json_encode($respArray);