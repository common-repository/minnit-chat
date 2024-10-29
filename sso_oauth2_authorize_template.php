<?php
class minnit_sso_authorize {
    var $user;

    public function __construct() {
        $this->user = wp_get_current_user();
    }

    public function redirectIfNotLoggedIn() {
        if (!$this->user->exists()) {
            global $wp;
            $current_url = home_url( add_query_arg( $_GET, $wp->request ) );
            wp_redirect(wp_login_url($current_url));
            return true;
        }
        return false;
    }
    public function displayStart() {
        $title = "Login to chat";
        if ($this->user->exists()) {
            $title = "Login to chat as " . $this->user->display_name;
        }
        echo '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.0/css/bootstrap.min.css" integrity="sha512-P5MgMn1jBN01asBgU0z60Qk4QxiXo86+wlFahKrsQf37c9cro517WzVSPPV1tDKzhku2iJ2FVgL67wG03SGnNA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.0/js/bootstrap.bundle.min.js" integrity="sha512-wV7Yj1alIZDqZFCUQJy85VN+qvEIly93fIQAN7iqDFCPEucLCeNFz4r35FCo9s6WrpdDQPi80xbljXB8Bjtvcg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <title>' . $title . '</title>
        <div class="container">
        <br>
        <h1>' . $title . '</h1>
        ';
    }
    public function showErrorMessage($messageText) {
        echo '<div class="alert alert-danger" role="alert">' . $messageText . '</div>';
    }
    
    public function showLoginConsentButton() {
        echo '<div class="alert alert-info" role="alert">Note: Your account username, display name, and profile photo will be accessible to everyone in the chat. Your email will be shared with the owners of the chatroom.</div>
        <button id="loginbtn" class="btn btn-primary btn-lg">Continue</button><br><br>
        ';
    }
}

header("Cache-Control: must-revalidate, no-cache, no-store, private");
header("Expires: 0");

$options = get_option('minnit_options');
if (!minnit_chat_sso_oauth2_active($options)) {
    status_header(404);
    return;
}
$page = new minnit_sso_authorize();
$redirected = $page->redirectIfNotLoggedIn();
if ($redirected) {
    exit;
}
$respArray = array();
$respCode = 200;
$clientID = "";
if (isset($_GET["client_id"])) {
    $clientID = $_GET["client_id"];
}
if (!minnit_chat_sso_oauth2_check_client_id($options, $clientID)) {
    $respArray["error"] = "invalid_client";
    $respArray["error_description"] = "Invalid client ID/secret. If you are the site admin, please resync your WordPress plugin settings. See <a href=\"https://docs.minnit.chat/organizations/sso/#wordpress-plugin-errors\">here</a> for more details.";
    $respCode = 400;
} elseif (!isset($_GET["scope"]) || $_GET["scope"] != "openid") {
    $respArray["error"] = "invalid_scope";
    $respArray["error_description"] = "Invalid scope, expecting openid";
    $respCode = 400;
} elseif (!isset($_GET["response_type"]) || $_GET["response_type"] != "code") {
    $respArray["error"] = "invalid_response_type";
    $respArray["error_description"] = "Invalid response type, expecting code";
    $respCode = 400;
} elseif (empty($_GET["redirect_uri"]) || empty($options['minnitchatssooauth2_authorized_redirect_uri']) || $_GET["redirect_uri"] != $options['minnitchatssooauth2_authorized_redirect_uri']) {
    $respArray["error"] = "invalid_redirect_uri";
    $respArray["error_description"] = "Invalid redirect uri. If you are the site admin, please resync your WordPress plugin settings. See <a href=\"https://docs.minnit.chat/organizations/sso/#wordpress-plugin-errors\">here</a> for more details.";
    $respCode = 400;
} elseif (empty($respArray) && ($options["minnitchatssooauth2_user_consent_required"] == 1 || isset($_COOKIE["minnit_chat_sso_login_consent"]))) {
    $generatedCode = wp_generate_password(15, false);
    set_transient($generatedCode, wp_get_current_user()->ID, 300);
    wp_redirect($_GET["redirect_uri"] . "?code=" . $generatedCode, 307);
    exit;
}

status_header($respCode);
$page->displayStart();
if ($respCode !== 200) {
    $page->showErrorMessage($respArray["error_description"] . " (" . $respArray["error"] . ")");
} else {
    $page->showLoginConsentButton();
}
?>
</div>
<script>
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

document.addEventListener("DOMContentLoaded", function(event) {
    $("#loginbtn").on("click", function() {
        setCookie("minnit_chat_sso_login_consent", "1", 1);
        location.reload();
    });
});
</script>