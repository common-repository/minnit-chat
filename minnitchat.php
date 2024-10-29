<?php
/*
	 Plugin Name: Minnit Chat
	 Plugin URI: https://minnit.chat
	 Description: Minnit Chat offers you the ability to have a live group chat on your site. Assign moderators, customize the chat to match your site, integrate with your existing userbase with Single Sign-On support, and much, much more.
	 Version: 4.0.6
	 Author: Minnit LTD
	 Author URI: https://minnit.chat
	 License: GNU General Public License v2
	 */
defined('ABSPATH') or die('https://minnit.chat');
add_action('wp_enqueue_scripts', 'minnit_chat_add_script');
add_action('admin_enqueue_scripts', 'minnit_chat_admin_script');

function minnit_chat_admin_script($hook)
{
	if ($hook == "settings_page_minnit-chat") {
		wp_enqueue_script('minnitchatscript', plugins_url('minnitwpadmin.js?minnitversion=4.0.6', __FILE__));
	}
}


function minnit_is_user_logged_in()
{
	$user = wp_get_current_user();
	return $user->exists();
}
function minnit_chat_add_script()
{
	$minnitChatOptions = get_option('minnit_options');
	$whoCanChat = 1;
	if (isset($minnitChatOptions)) {
		if (isset($minnitChatOptions['minnitwhocanchat'])) {
			$whoCanChat = $minnitChatOptions['minnitwhocanchat'];
		}
	}
	if ($whoCanChat == 1 || ($whoCanChat == 2 && minnit_is_user_logged_in()) || ($whoCanChat == 3 && (current_user_can('subscriber') || current_user_can('contributor') || current_user_can('editor') || current_user_can('author') || current_user_can('administrator'))) || ($whoCanChat == 4 && (current_user_can('contributor') || current_user_can('editor') || current_user_can('author') || current_user_can('administrator'))) || ($whoCanChat == 5 && (current_user_can('editor') || current_user_can('author') || current_user_can('administrator'))) || ($whoCanChat == 6 && (current_user_can('editor') || current_user_can('administrator'))) || ($whoCanChat == 7 && (current_user_can('administrator')))) {
		if (minnit_is_user_logged_in()) {
			$current_user = wp_get_current_user();
			$minnitChatOptions['minnitwpusername'] = $current_user->display_name;
			if (@gettype($current_user) == "object" && @gettype($current_user->ID) == "integer") {
				if (@get_avatar($current_user->ID, 64) !== "") {
					@$minnitChatOptions['minnitwpphoto'] = get_avatar($current_user->ID, 64);
				}
			}
			$minnitChatOptions['wpurl'] = get_bloginfo('wpurl');
		}
		$minnitChatOptions['minnitchatencryptionkey'] = '';
		$minnitChatOptions['minnitchatssooauth2_client_secret'] = '';
		wp_register_script('minnitchatscript', plugins_url('minnit.js?minnitversion=4.0.6', __FILE__));
		wp_enqueue_script('minnitchatscript');
		wp_localize_script('minnitchatscript', 'minnitChatOptions', $minnitChatOptions);
	}
}
add_action('wp_enqueue_scripts', 'minnit_chat_add_css');
function minnit_chat_add_css()
{
	wp_register_style('minnitchatstyle', plugins_url('minnit.css?minnitversion=4.0.6', __FILE__));
	wp_enqueue_style('minnitchatstyle');
}
global $minnitChatOptions;



function minnit_add_settings_link($links)
{
	$settings_link = '<a href="options-general.php?page=minnit-chat">' . __('Settings') . '</a>';
	array_unshift($links, $settings_link);
	return $links;
}
add_action('admin_enqueue_scripts', 'minnit_mw_enqueue_color_picker');
function minnit_mw_enqueue_color_picker($hook_suffix)
{
	wp_enqueue_style('wp-color-picker');
	wp_enqueue_script('colorwheel-handle', plugins_url('minnitcolorpick.js?minnitversion=4.0.6', __FILE__), array('wp-color-picker'), false, true);
}
$plugin = plugin_basename(__FILE__);
add_filter("plugin_action_links_$plugin", 'minnit_add_settings_link');
class minnit_settings_page
{
	/**
	 * Holds the values to be used in the fields callbacks
	 */
	var $options;

	/**
	 * Start up
	 */
	public function __construct()
	{
		add_action('admin_menu', array($this, 'add_plugin_page'));
		add_action('admin_init', array($this, 'page_init'));
	}

	/**
	 * Add options page
	 */
	public function add_plugin_page()
	{
		// This page will be under "Settings"
		add_options_page(
			'Settings Admin',
			'Minnit Chat',
			'manage_options',
			'minnit-chat',
			array($this, 'create_admin_page')
		);
	}

	/**
	 * Options page callback
	 */
	public function create_admin_page()
	{
		// Set class property
		$this->options = get_option('minnit_options');
?>
		<div class="wrap">
			<form method="post" action="options.php">
				<h1>Add Minnit Chat to a post or page.</h1>
				<p><strong>To proceed, you must create a chat on Minnit Chat. <a href="https://minnit.chat/register?threesteps" target=_blank>Click here to register an account and get your chat name!</a></strong></p>
				<p>If you wish to use Minnit Chat on a single page, add a new block using the Plus icon in the Gutenberg editor, and then scroll down to "Embeds". Select Minnit Chat, and enter your chat name.</p>
				<p>Once you preview or publish your post, you will see your chat!</p>
				<p>The chat will automatically scale to fit 100% of the allotted paragraph width, depending on your site's theme.</p>
				<p><a href="https://minnit.chat/images/hotlink-ok/MinnitChatWordPress.gif" target="_blank">View tutorial</a> or <a href="https://minnit.chat/support" target="_blank">contact support</a>.</p>
				<p><input type="button" class="button button-primary" id="no-gutenberg" value="I don't use the Gutenberg Editor"></p>
				<div id='no-gutenberg-step-2' class='hidden'>
					<p>No Gutenberg? No problem.</p>
					<p>Get the link to your chatroom, and paste it into the following text box:</p>
					<p><input id='no-gutenberg-input' type='text'></p>
					<p><input type="button" class="button button-primary" id="no-gutenberg-button" value="Proceed"></p>
					<div id='no-gutenberg-step-3' class='hidden'>
						<p>Now, add the following HTML code to any page or post on your site. Be sure to add it using a direct HTML editor, so the plugin will be able to convert it automatically!</p>
						<p><code id='no-gutenberg-code'></code></p>
					</div>
				</div>
				<hr>
				<div id='no-site-wide-icon-2'>
					<h2>Site-wide Icon</h2>
					<p>You can set up a site-wide icon that appears in the corner of all of your pages. This is a great way to ensure that your users can instantly chat with ease, whether they're on desktop or mobile.</p>
				</div>
				<p><button class="button button-primary" id="want-side-wide-icon">I want a site-wide icon</button></p>
				<div id="site-wide-icon" style="display:none;">
					<?php
					// This prints out all relevant setting fields
					settings_fields('minnit_option_group');
					do_settings_sections('minnit-settings-menu');
					submit_button();
					?>
			</form>
		</div>
<?php
	}

	/**
	 * Register and add settings
	 */
	public function page_init()
	{
		register_setting(
			'minnit_option_group', // Option group
			'minnit_options', // Option name
			array($this, 'sanitize') // Sanitize
		);

		add_settings_section(
			'minnit_chat_config', // ID
			'Configure your site-wide chat icon.', // Title
			array($this, 'print_section_info'), // Callback
			'minnit-settings-menu' // Page
		);

		add_settings_field(
			'minnitchatname', // ID
			'Link To Your Chatroom', // Title 
			array($this, 'id_number_callback'), // Callback
			'minnit-settings-menu', // Page
			'minnit_chat_config' // Section 
		);

		add_settings_field(
			'minnitplacement', // ID
			'Chat Placement', // Title 
			array($this, 'placement_callback'), // Callback
			'minnit-settings-menu', // Page
			'minnit_chat_config' // Section					 
		);

		add_settings_field(
			'minnitchatsize', // ID
			'Chat Size', // Title 
			array($this, 'size_callback'), // Callback
			'minnit-settings-menu', // Page
			'minnit_chat_config' // Section					 
		);

		add_settings_field(
			'minnitwhocanchat', // ID
			'Who Can View the Site-Wide Chat Icon?', // Title 
			array($this, 'who_can_chat_callback'), // Callback
			'minnit-settings-menu', // Page
			'minnit_chat_config' // Section					 
		);

		add_settings_field(
			'minnitchatcolor', // ID
			'Chat Icon Color', // Title 
			array($this, 'color_callback'), // Callback
			'minnit-settings-menu', // Page
			'minnit_chat_config' // Section					 
		);

		add_settings_section(
			'minnit_chat_sso_oauth2_info', // ID
			'<hr>Single Sign On (SSO)', // Title
			array($this, 'print_sso_info'), // Callback
			'minnit-settings-menu' // Page
		);

		add_settings_field(
			'minnitchatssooauth2active', // ID
			'Active', // Title
			array($this, 'minnit_chat_sso_oauth2_active_callback'), // Callback
			'minnit-settings-menu', // Page
			'minnit_chat_sso_oauth2_info' // Section
		);


		add_settings_section(
			'minnit_chat_sso_oauth2_settings', // ID
			'', // Title
			array($this, 'print_sso_settings'), // Callback
			'minnit-settings-menu', // Page
			'minnit_chat_sso_oauth2_info' // Section
		);
	}

	/**
	 * Sanitize each setting field as needed
	 *
	 * @param array $input Contains all settings fields as array keys
	 */
	public function sanitize($input)
	{
		$new_input = array();
		if (isset($input['minnitchatname'])) {
			$new_input['minnitchatname'] =	preg_replace("/[^A-Za-z0-9\-\/\:\.\?=& ]/", '', $input['minnitchatname']);
		}

		if (isset($input['minnitplacement'])) {
			$new_input['minnitplacement'] =	preg_replace("/[^a-zA-Z\? ]/", '', $input['minnitplacement']);
		}

		if (isset($input['minnitchatsize'])) {
			$new_input['minnitchatsize'] =	preg_replace("/[^0-9\? ]/", '', $input['minnitchatsize']);
		}

		if (isset($input['minnitwhocanchat'])) {
			$new_input['minnitwhocanchat'] =	preg_replace("/[^0-9\? ]/", '', $input['minnitwhocanchat']);
		}

		if (isset($input['minnitchatcolor'])) {
			$new_input['minnitchatcolor'] =	preg_replace("/[^a-fA-F0-9\#\? ]/", '', $input['minnitchatcolor']);
		}
		if (isset($input['minnitchatencryptionkey'])) {
			$new_input['minnitchatencryptionkey'] =	preg_replace("/[^a-zA-Z0-9\#-\? ]/", '', $input['minnitchatencryptionkey']);
		}

		if (isset($input['minnitchatssooauth2'])) {
			$currentSettings = get_option('minnit_options', array());
			$new_input['minnitchatssooauth2'] =	preg_replace("/[^a-fA-F0-9\#\? ]/", '', $input['minnitchatssooauth2']);
			$new_input['minnitchatssoadvanced'] =	preg_replace("/[^a-fA-F0-9\#\? ]/", '', $input['minnitchatssoadvanced']);
			if (isset($input['minnitchatssooauth2_authorized_redirect_uri'])) {
				$new_input['minnitchatssooauth2_authorized_redirect_uri'] =	esc_url($input['minnitchatssooauth2_authorized_redirect_uri']);
			}
			if (isset($input['minnitchatssooauth2_user_consent_required'])) {
				$new_input['minnitchatssooauth2_user_consent_required'] =	preg_replace("/[^a-fA-F0-9\#\? ]/", '', $input['minnitchatssooauth2_user_consent_required']);
			}
			if (($currentSettings["minnitchatssoadvanced"] != 1 && $new_input['minnitchatssoadvanced'] == 1) || ($new_input['minnitchatssooauth2'] == 1 && $input["minnitchatssooauth2_refreshclientidandsecret"] == 1)) {
				//enabling SSO when it was disabled before, or refreshing client ID & secret...generate a random client ID + secret and store it
				$new_input['minnitchatssooauth2_client_id'] = wp_generate_password(15, false);
				$new_input['minnitchatssooauth2_client_secret'] = wp_generate_password(25, false);
			} elseif (isset($currentSettings["minnitchatssooauth2"]) && $currentSettings["minnitchatssooauth2"] == 1 && $new_input['minnitchatssooauth2'] == 0) {
				unset($new_input['minnitchatssooauth2_client_id']);
				unset($new_input['minnitchatssooauth2_client_secret']);
				unset($new_input['minnitchatssooauth2_authorized_redirect_uri']);
				unset($new_input['minnitchatssooauth2_user_consent_required']);
			} else {
				//keep existing client ID and secret since the option is still enabled
				$new_input['minnitchatssooauth2_client_id'] = $currentSettings['minnitchatssooauth2_client_id'];
				$new_input['minnitchatssooauth2_client_secret'] = $currentSettings['minnitchatssooauth2_client_secret'];
			}
		}

		return $new_input;
	}

	/** 
	 * Print the Section text
	 */
	public function print_section_info()
	{
		print '<p>This is only if you want to create a site-wide icon on your site. This icon will appear on all pages in the corner, and clicking it will display the chat.</p>';
	}

	/** 
	 * Get the settings option array and print one of its values
	 */
	public function id_number_callback()
	{
		printf(
			'<input type="text" id="minnitchatname" name="minnit_options[minnitchatname]" value="%s" /><p><small>Don\'t know your URL? <a href="https://minnit.chat/wpsync" id="wp-sync-url">Click here</a></small></p>',
			isset($this->options['minnitchatname']) ? esc_attr($this->options['minnitchatname']) : ''
		);
	}

	public function placement_callback()
	{
		$minnitPlacementValues = array(
			"minnitPlacementL" => "Left",
			"minnitPlacementR" => "Right"
		);
		foreach ($minnitPlacementValues as $minnitPlacementKey => $minnitPlacementText) {
			if ($this->options["minnitplacement"] == $minnitPlacementKey) {
				printf('<label><input type="radio" name="minnit_options[minnitplacement]" value="' . $minnitPlacementKey . '" checked="true"> ' . $minnitPlacementText . '</label><br>');
			} else {
				printf('<label><input type="radio" name="minnit_options[minnitplacement]" value="' . $minnitPlacementKey . '"> ' . $minnitPlacementText . '</label><br>');
			}
		}
	}
	public function size_callback()
	{

		$minnitSizeValues = array(
			"1" => "Small",
			"2" => "Medium",
			"3" => "Large"
		);
		foreach ($minnitSizeValues as $minnitSizeKey => $minnitSizeText) {
			if ($this->options["minnitchatsize"] == $minnitSizeKey) {
				printf('<label><input type="radio" name="minnit_options[minnitchatsize]" value="' . $minnitSizeKey . '" checked="true"> ' . $minnitSizeText . '</label><br>');
			} else {
				printf('<label><input type="radio" name="minnit_options[minnitchatsize]" value="' . $minnitSizeKey . '"> ' . $minnitSizeText . '</label><br>');
			}
		}
	}
	public function who_can_chat_callback()
	{
		$minnitWhoCanChatValues = array(
			"1" => "Everyone",
			"2" => "Users who are logged in to your WordPress website",
			"3" => "Users who are Subscribers to your WordPress website",
			"4" => "Users who are Contributors or higher on your WordPress website",
			"5" => "Users who are Authors or higher on your WordPress website",
			"6" => "Users who are Editors or higher on your WordPress website",
			"7" => "Users who are Admins on your WordPress website"
		);
		foreach ($minnitWhoCanChatValues as $minnitWhoCanChatKey => $minnitWhoCanChatText) {
			if ($this->options["minnitwhocanchat"] == $minnitWhoCanChatKey) {
				printf('<label><input type="radio" name="minnit_options[minnitwhocanchat]" value="' . $minnitWhoCanChatKey . '" checked="true"> ' . $minnitWhoCanChatText . '</label><br>');
			} else {
				printf('<label><input type="radio" name="minnit_options[minnitwhocanchat]" value="' . $minnitWhoCanChatKey . '"> ' . $minnitWhoCanChatText . '</label><br>');
			}
		}
	}
	public function color_callback()
	{
		$selectedCol = '#aaaaaa';
		if (strlen($this->options["minnitchatcolor"]) == '7') {
			$selectedCol = $this->options["minnitchatcolor"];
		}
		printf(
			'<input type="text" id="minnitchatcolor" class="minnitchatcolor" name="minnit_options[minnitchatcolor]" data-default-color="#aaaaaa" value="' . $selectedCol . '">'
		);
	}

	public function print_sso_info()
	{
		print '</div><div id="no-site-wide-icon"><hr><h2>Single Sign On (SSO)</h2></div><p>Single Sign On allows users on your chat to sign in using their WordPress account instead of signing up separately. This is recommended for all Organizations.</p>';
	}

	public function minnit_chat_sso_oauth2_active_callback()
	{
		printf('<select name="minnit_options[minnitchatssooauth2]" id="minnit-sso-setting">
			<option value="0">Disabled</option>');
		$this->options["minnitchatssooauth2"] == '1' ? printf(' <option selected="selected" value="1">Enabled</option>') :	printf(' <option value="1">Enabled</option>');
		printf('</select>');
	}


	public function print_sso_settings()
	{
		$userConsentSelectedHTML = '';
		if ($this->options["minnitchatssooauth2_user_consent_required"] == 1) {
			$userConsentSelectedHTML = 'selected="selected"';
		}
		print '<div id="sso-config" style="display:none;"><h3><strong>SSO Configuration:</strong></h3>';
		print '<strong>Sync SSO Settings to your Organization</strong>';
		print '<p>Sync your plugin to your Organization, so users can use their WordPress accounts within the chat.</p>';
		print '<p id="sync-container"><button type="button" id="minnit-sso-sync-now" class="button button-primary">Sync Now</button></p>';
		print '<p id="sync-second-step" style="display:none;">Organization URL:<br><input style="width:80%;min-width:300px" type="textbox" id="minnit-sso-sync-url"><br><small>Don\'t know your URL?  <a href="https://minnit.chat/wpsync" id="wp-sync-url-orgs-only">Click here</a></small><br><button type="button" id="minnit-sso-sync-proceed" class="button button-primary">Proceed</button></p>';
		print '<hr><p><label><strong>Use Advanced Settings? </strong> <input type="checkbox" name="minnit_options[minnitchatssoadvanced]" id="minnit-advanced-sso" value="1"';
		$this->options["minnitchatssoadvanced"] == '1' ? print ' checked=1' : '';
		print '></label></p><p>Use the Advanced Settings to manually configure OAuth2 options directly. We recommend allowing the plugin to manage everything automatically.</p>';
		print '<div id="sso-advanced-config" style="display:none;">';
		print '<p><strong>User Consent Required:</strong> <select name="minnit_options[minnitchatssooauth2_user_consent_required]">
				<option value="0">Enabled</option>
				<option ' . $userConsentSelectedHTML . ' value="1">Disabled</option></select>
				</p>
				<p>If enabled, users will be required to consent to sharing their data to create or log into their chat account.</p>
				<p>This can be helpful for privacy reasons, but since you control both your website and the chat, having this enabled is entirely optional.</p>';
		print '<p><strong>Client ID:</strong> <span id="minnit-client-id">' . $this->options["minnitchatssooauth2_client_id"] . '</span></p>';
		print '<p><strong>Client Secret:</strong> <span id="minnit-client-secret">' . $this->options["minnitchatssooauth2_client_secret"] . '</span></p>';
		print '<p><strong>Authorize URL:</strong> <span id="minnit-authorize-url">' . get_home_url() . '/?p=minnit-chat-sso-oauth2-authorize-v1</span></p>';
		print '<p><strong>Access Token URL:</strong> <span id="minnit-access-token">' . get_home_url() . '/?rest_route=/minnit-chat/v1/sso/oauth2/access_token/</span></p>';
		print '<p><strong>Get User Info URL:</strong> <span id="minnit-getuserinfo">' . get_home_url() . '/?rest_route=/minnit-chat/v1/sso/oauth2/get_userinfo/</span></p>';
		printf('<p><strong>Authorized Redirect URI:</strong> <input type="text" name="minnit_options[minnitchatssooauth2_authorized_redirect_uri]" id="minnit-authorized-redirect" size="50" value="%s" /></p>', isset($this->options['minnitchatssooauth2_authorized_redirect_uri']) ? $this->options['minnitchatssooauth2_authorized_redirect_uri'] : '');
		print '<br><p><strong>Refresh Client ID & Secret</strong>: <input type="checkbox" name="minnit_options[minnitchatssooauth2_refreshclientidandsecret]" value="1"></p></div></div>';
		printf('<input type="hidden" name="minnit_options[minnitchatencryptionkey]" id="minnit-encryptionkey" value="%s" /></p>', isset($this->options['minnitchatencryptionkey']) ? $this->options['minnitchatencryptionkey'] : '');
	}

	/** 
	 * Get the settings option array and print one of its values
	 */
}

if (is_admin())
	$minnit_settings_page = new minnit_settings_page();

function minnit_chat_gutenberg()
{
	wp_enqueue_script(
		'minnit-chat-gutenberg',
		plugin_dir_url(__FILE__) . 'minnit-gutenberg.js?minnitversion=4.0.6',
		array('wp-blocks', 'wp-editor'),
		true
	);
}

add_action('enqueue_block_editor_assets', 'minnit_chat_gutenberg');

function minnit_chat_sso_oauth2_access_token_endpoint($data)
{
	$options = get_option('minnit_options');
	$respArray = array();
	$respCode = 200;
	if (!minnit_chat_sso_oauth2_active($options)) {
		$respCode = 404;
		$response = new WP_REST_Response($respArray, $respCode);
		$response->set_headers(['Cache-Control' => 'must-revalidate, no-cache, no-store, private', 'Expires' => '0']);
		return $response;
	}
	$authorizedRedirectURI = $options['minnitchatssooauth2_authorized_redirect_uri'];
	$clientID = "";
	if (isset($data["client_id"])) {
		$clientID = $data["client_id"];
	}
	$clientSecret = "";
	if (isset($data["client_secret"])) {
		$clientSecret = $data["client_secret"];
	}
	if (!minnit_chat_sso_oauth2_check_client_id($options, $clientID) || !minnit_chat_sso_oauth2_check_client_secret($options, $clientSecret)) {
		$respCode = 401;
		$respArray["error"] = "invalid_client_or_secret";
		$respArray["error_description"] = "Invalid client ID/secret";
	} elseif (empty($data["redirect_uri"]) || empty($authorizedRedirectURI) || $data["redirect_uri"] != $authorizedRedirectURI) {
		$respCode = 400;
		$respArray["error"] = "invalid_redirect_uri";
		$respArray["error_description"] = "Invalid redirect uri";
	}
	$userID = "";
	if (isset($data["code"])) {
		$userID = get_transient($data["code"]);
	}
	if ($respCode === 200) {
		$generatedAccessToken = wp_generate_password(15, false);
		set_transient($generatedAccessToken, $userID, 300);
		$respArray["access_token"] = $generatedAccessToken;
		$respArray["token_type"] = "bearer";
		$respArray["expires_in"] = 300;
	}

	$response = new WP_REST_Response($respArray, $respCode);
	$response->set_headers(['Cache-Control' => 'must-revalidate, no-cache, no-store, private', 'Expires' => '0']);

	return $response;
}

function minnit_chat_sso_oauth2_get_userinfo_endpoint($data)
{
	$options = get_option('minnit_options');
	$respArray = array();
	$respCode = 200;
	if (!minnit_chat_sso_oauth2_active($options)) {
		$respCode = 404;
		$response = new WP_REST_Response($respArray, $respCode);
		$response->set_headers(['Cache-Control' => 'must-revalidate, no-cache, no-store, private', 'Expires' => '0']);
		return $response;
	}
	$headers = getallheaders();
	if (empty($headers["Authorization"])) {
		$headers["Authorization"] = "Bearer ";
	}
	$accessTokenFromHeader = explode("Bearer ", $headers["Authorization"]);
	if (!empty($accessTokenFromHeader[1])) {
		$accessTokenFromHeader = $accessTokenFromHeader[1];
	}
	$userID = get_transient($accessTokenFromHeader);
	if (empty($userID)) {
		$respCode = 401;
		$respArray["error"] = "invalid_access_token_or_empty_userid";
		$respArray["error_description"] = "Invalid access token when getting user info, or user ID returned is empty";
	}
	if ($respCode === 200) {
		$userdata = get_userdata($userID);
		$respArray["uniqueuserkey"] = $userdata->ID;
		$respArray["email"] = $userdata->user_email;
		$respArray["name"] = $userdata->user_login;
		$respArray["nickname"] = $userdata->display_name;
		$respArray["avatar"] = get_avatar_url($userdata->ID, 64);
		$respArray["email_verified"] = false;
		if (!empty($respArray)) {
			$respArray["email_verified"] = true;
		}
	}

	$response = new WP_REST_Response($respArray, $respCode);
	$response->set_headers(['Cache-Control' => 'must-revalidate, no-cache, no-store, private', 'Expires' => '0']);

	return $response;
}

function minnit_chat_sso_oauth2_check_client_id($options, $clientIDInRequest)
{
	$clientID = $options["minnitchatssooauth2_client_id"];
	if ($clientIDInRequest != $clientID) {
		return false;
	}
	return true;
}

function minnit_chat_sso_oauth2_check_client_secret($options, $clientSecretInRequest)
{
	$clientSecret = $options["minnitchatssooauth2_client_secret"];
	if ($clientSecretInRequest != $clientSecret) {
		return false;
	}
	return true;
}

function minnit_chat_sso_oauth2_active($options)
{
	return $options["minnitchatssooauth2"] == 1 && !empty($options["minnitchatssooauth2_client_id"]) && !empty($options["minnitchatssooauth2_client_secret"]);
}

add_action('rest_api_init', function () {
	register_rest_route('minnit-chat/v1', '/sso/oauth2/access_token', [
		'methods'	=> "POST",
		'callback' => 'minnit_chat_sso_oauth2_access_token_endpoint',
	]);

	register_rest_route('minnit-chat/v1', '/sso/oauth2/get_userinfo', [
		'methods'	=> "GET",
		'callback' => 'minnit_chat_sso_oauth2_get_userinfo_endpoint',
	]);
});

function minnit_chat_sso_template_includes($original_template)
{
	global $wp_query;
	$minnitPage = '';
	if (isset($_GET['minnitpage'])) {
		$minnitPage = $_GET['minnitpage'];
	} else if (isset($wp_query->query["p"])) {
		$minnitPage = $wp_query->query["p"];
	}
	if ($minnitPage == "minnit-chat-sso-oauth2-authorize-v1") {
		include plugin_dir_path(__FILE__) . 'sso_oauth2_authorize_template.php';
		exit();
	} else if ($minnitPage == "minnit-chat-sso-custom-get-token-v1") {
		include plugin_dir_path(__FILE__) . 'sso_custom_generate_ssotoken.php';
		exit();
	} else {
		return $original_template;
	}
}

add_action('template_include', 'minnit_chat_sso_template_includes');

?>