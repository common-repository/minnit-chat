=== Group chat for WordPress - Minnit Chat ===
Contributors: minnitchat
Tags: chat, chatroom, chat group, group chat, chatbox, chat box, live chat, free chat, sso chat, wordpress chat
Requires at least: 3.4
Tested up to: 6.7
Stable tag: 4.0.6
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Cloud-based chat using your WordPress accounts. Minnit uses SSO to allow you and your WordPress users to communicate with one another. Chats take place on our servers, so you don't have to worry about messy installations or unnecessary server usage.

== Description ==
Minnit Chat is an easy-to-use group chat service. You can appoint moderators to watch over your chat, customize the look and feel of your chat, and increase engagement by having your users be able to talk to one another in real time!

Configure the chatroom to use Single Sign-On, and users who load the chat will automatically be logged in using their WordPress accounts. No need for additional sign-ups, onboarding, or any other steps — your users can get chatting right away!

Many other features can be enabled or disabled, including support for sending GIFs, uploading files, direct messaging between users, and more.

Get started in minutes and get chatting with Minnit!

== Installation ==
Once this plugin is installed, you will be able to add a Minnit Chat to any post or page using the editor. Simply create a new block, scroll down to "Embeds", and then select "Minnit Chat". Enter your chat name, and you're all set!

Want a site-wide icon? No problem. Simply go to the Settings section of your WordPress admin panel, and then select Minnit Chat. Once you enter a chat name and customize the color/position, the icon will appear on every page on your site, so your users can instantly start chatting.

== Frequently Asked Questions ==
= How many users can join my chat? =
 
Up to 20 users can connect at once on the Free tier. If you expect more users, you can consider subscribing to a monthly or annual subscription.
 
= Can I change the background or colors? =
 
Yes. These options and more are available via "Chat Settings" from within your chatroom itself. Upload a background image, change the color scheme, set up light or dark mode, and more.

= Can I ban users from the chat, or remove messages? =

Yes. Clicking a user will allow you to ban them. You can also tap and hold a message, or click the three dots next to it, to delete an individual message. 

= Can I appoint moderators? =

Yes. Moderators can ban users and remove messages, but you retain full control and are able to add or remove moderators as desired.

= Does this increase my server costs or bandwidth? =

No. The chat and content within are hosted on our servers; messages are not stored on your server, and connections are not established with your server.

= Can users use their existing accounts to chat? =

Yes. Set up Single Sign-On within the plugin settings to get started. Once configured, users will be able to chat right away using their same name and photo (if present) from your WordPress site.

== Screenshots ==
1. Talk directly with visitors of your site in real time using Minnit.
2. Minnit seamlessly and securely connects with WordPress accounts using SSO. Names and pictures automatically populate in the chat, reducing friction for users and ensuring a smooth experience.
3. Customize your chatroom with a variety of options, to make everything work exactly how you see fit.
4. A variety of settings allows you to pick who is allowed to use the chatroom, and how the chatroom should behave.
5. Adding a chatroom to a single post is a breeze. Simply add the "Minnit Chat" block, enter your chat URL, and you're all set.

== Changelog ==
= 4.0.6 =
Version 4.0.6 of the plugin is here, with a behind-the-scenes change: When generating SSO tokens, we now make a request where the "minnitpage" URL parameter is used, rather than the more generic "p". This will ensure the chatroom will correctly operate, without conflicting with other potential plugins.

= 4.0.5 =
Removes `min-width` from the chatroom frame, so if the chat is embedded on a very small div, it will remain confined to the parent dimensions. 

= 4.0.4 =
When the chatroom is floating, its height will now scale properly on very small displays

= 4.0.3 =
Prevents the button from taking up more space than necessary after the chatroom is dismissed

= 4.0.2 =
Adds SSO to any Minnit Chat embedded via HTML, even if the chat was added outside of the plugin setup process

= 4.0.1 =
Better wording for the plugin's "Who Can View the Site-Wide Chat Icon?" setting

= 4.0.0 =
Version 4.0 of our plugin has arrived! Learn all about it on our blog: https://blog.minnit.chat/version-4-0-of-our-wordpress-plugin-has-arrived/

= 3.5.8 =
Ensures Custom Domains work properly during the setup process.

= 3.5.6 =
If the default WordPress navigational bar is disabled, the chat previously had issues grabbing the latest photo. This has now been resolved.

= 3.5.4 =
Chats are centered when placed within posts.

= 3.5.3 =
Better method for grabbing profile photos for logged-in users

= 3.5.1 =
SSO Tokens (if enabled) will last longer before expiring

= 3.5.0 =
NEW: You can now configure the size of the chat when using the Gutenberg Editor's Minnit Chat block.

= 3.4.1 =
If an owner directly enters an iframe embed code for Minnit Chat on a page or post, the plugin will now automatically correct this and display the chatroom with proper SSO functionality.

= 3.3.9 =
If an owner accidentally inputs an embed script in the "Chat URL" section, the plugin will now automatically correct this and display the correct chatroom for them.

= 3.3.2 =
Minnit Chat will now support a wider range of profile photos, including ones from third-party plugins like BuddyPress. If you want more compatibility with profile photos, feel free to contact @Minnit on Twitter -- we're always happy to make our plugin even better!

= 3.3.1 =
Single Sign-In tokens will now last up to 12 hours, rather than up to 1 hour. This will help if users leave the page up for an extended period of time before connecting to the chat.

= 3.3.0 =
The plugin will now utilize LocalStorage to store user's credentials. See our latest blog post for details: https://blog.minnit.chat/improved-embed-experience-for-organizations/

= 3.2.8 =
Updates the floating icon's design for a more modern look.

= 3.2.7 =
Allows owners who use "Synchronize SSO Settings" to more easily get their Organization URL.

= 3.2.6 =
Further enhancements to SSO error reporting.

= 3.2.5 =
Better error reporting.

= 3.2.4 =
Makes it easier to synchronize your chat URL with your plugin.

= 3.2.3 =
Changes the JS variable name of "options" to "minnitChatOptions" to prevent conflicts.

= 3.2.2 =
Allows WordPress owners to easily access our site by clicking the Author name on plugins page.

= 3.2.1 =
Improves the backend configuration, and provides built-in tutorials on how to set the chat up without the default Gutenberg editor.

= 3.2.0 =
Supports Minnit's upcoming Custom Domains functionality.

= 3.1.0 =
Prevent some themes, such as Twenty-Twenty, from setting the iframe width to 0 when the page is resized.

= 3.1.0 =
Support for customized, zero-click SSO. See https://docs.minnit.chat/SSO for details

= 3.0.3 =
Further prevents caching of SSO-related endpoints. This update is recommended for everyone running 3.0.0 or newer who has any type of caching solution. Thank you!

= 3.0.2 =
Prevents caching of SSO-related endpoints. This update is recommended for everyone running 3.0.0 or newer who has any type of caching solution. Thank you!

= 3.0.1 =
Allow customization of the "Close Chat" text.

= 3.0.0 =
Support for Minnit Organizations, including Single Sign-On support.

= 2.1.1 =
Enhancements to profile photo

= 2.1 =
Minnit can now integreate your user's profile photos / avatars in the chat. Your chat must be on Basic plan or higher to use this feature. See https://blog.minnit.chat/minnit-2021-update/ for details. Happy chatting!

= 2.0.1=
Implements a URL parameter for JavaScript/CSS files that corresponds to the plugin version, so outdated cached assets won't be served. Enjoy!

= 2.0.0 =

* Overhaul of the PHP code for maximum efficiency.

* New: Add Minnit Chat via a Gutenberg block when editing a post or page! This allows you to put the chatroom only on specific pages/posts.

= 1.4.1 =
* Updated the description and FAQ.

= 1.4.0 =
* Ensured compatibility with WordPress 5.0. Happy chatting!

= 1.3.6 =
* Minor changes to menu text.

= 1.0 =
* Minnit Chat now works closer with your WordPress setup to deliver a better experience. You can configure your chat to only display to users with a WordPress account, users who've subscribed to your blog, or your Contributors/Editors/Admins! The choice is yours.

* Also, new users who are logged in automatically get a nickname that matches their WordPress name. This makes it easier for you to identify your visitors, and prevents them from having to type a nickname when they join your chat.

* Happy chatting!

= 0.2 =
* Bug fixes.

= 0.1 =
* Initial release.
