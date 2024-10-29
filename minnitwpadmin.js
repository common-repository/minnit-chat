(function () {
    'use strict'
    function checkMinnitSSOSetting() {
        if (document.getElementById('minnit-sso-setting').value == 1) {
            document.getElementById('sso-config').style.display = 'block';
            if (document.getElementById('minnit-advanced-sso').checked) {
                document.getElementById('sso-advanced-config').style.display = 'block';
            } else {
                document.getElementById('sso-advanced-config').style.display = 'none';
            }
        } else {
            document.getElementById('sso-config').style.display = 'none';
        }
    }
    function getOrgURL(url) {
        var resp = '';
        if (url !== null && url.length > 0) {
            var matches = url.toLowerCase().match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
            if (typeof (matches) !== 'undefined' && matches !== null && typeof (matches[1]) !== 'undefined') {
                if (matches[1] == 'organizations.minnit.chat') {
                    //grab org ID from the very next directory, if present
                    var orgID = url.split('organizations.minnit.chat')[1];
                    if (orgID !== null && orgID.length > 1) {
                        //determine if first char is slash and rest aren't
                        if (orgID.substr(0, 1) == '/') {
                            orgID = orgID.split('/')[1];
                            if (orgID.indexOf('#') > -1) {
                                orgID = orgID.split('#')[0];
                            }
                            if (orgID.indexOf('/') > -1) {
                                orgID = orgID.split('/')[0];
                            }
                            if (orgID.indexOf('?') > -1) {
                                orgID = orgID.split('?')[0];
                            }
                            if (!isNaN(orgID)) {
                                resp = 'https://organizations.minnit.chat/' + orgID;
                            }
                        }
                    }
                } else if (matches[1].indexOf('.minnit.org') > -1) {
                    //grab subdomain
                    var subdomain = matches[1].split('.minnit.org')[0];
                    if (subdomain !== null && subdomain.length > 0) {
                        //good to go
                        resp = 'https://' + subdomain + '.minnit.org';
                    }
                } else if (matches[1].indexOf('.minnit.io') > -1) {
                    //grab subdomain
                    var subdomain = matches[1].split('.minnit.io')[0];
                    if (subdomain !== null && subdomain.length > 0) {
                        //good to go
                        resp = 'https://' + subdomain + '.minnit.io';
                    }
                } else {
                    //custom domain?
                    resp = url;
                }
            }
        }
        return resp;
    }
    document.addEventListener("DOMContentLoaded", function (event) {
        var currentURL = window.location.href;
        if (currentURL.indexOf('&') > -1 && currentURL.indexOf('?') > -1) {
            currentURL = currentURL.split('?')[0]  + '?page=minnit-chat';;
        }
        if (currentURL.indexOf('#') > -1) {
            currentURL = currentURL.split('#')[0];
        }
        document.getElementById('wp-sync-url').href = 'https://minnit.chat/wpsync?from=' + encodeURIComponent(currentURL);
        document.getElementById('wp-sync-url-orgs-only').href = 'https://minnit.chat/wpsync?orgsonly=1&from=' + encodeURIComponent(currentURL);
        checkMinnitSSOSetting();
        document.getElementById('minnit-sso-setting').addEventListener("change", function () {
            checkMinnitSSOSetting();
        });
        document.getElementById('minnit-advanced-sso').addEventListener("change", function () {
            checkMinnitSSOSetting();
        });
        if (window.location.href.indexOf('authorizedprovider=') != -1) {
            var authorizedProvider = decodeURIComponent(window.location.href.split('authorizedprovider=')[1]);
            if (authorizedProvider.indexOf('&') > -1) {
                authorizedProvider = authorizedProvider.split('&')[0];
            }
            if (authorizedProvider != document.getElementById('minnit-authorized-redirect').value) {
                document.getElementById('minnit-authorized-redirect').value = authorizedProvider;
                document.getElementById('submit').click();
            }
        }
        if (window.location.href.indexOf('encryptionkey=') != -1) {
            var encryptionKey = decodeURIComponent(window.location.href.split('encryptionkey=')[1]);
            if (encryptionKey.indexOf('&') > -1) {
                encryptionKey = encryptionKey.split('&')[0];
            }
            if (encryptionKey != document.getElementById('minnit-encryptionkey').value) {
                document.getElementById('minnit-encryptionkey').value = encryptionKey;
                document.getElementById('submit').click();
            }
        }
        if (window.location.href.indexOf('chaturl=') != -1) {
            var newChatURL = decodeURIComponent(window.location.href.split('chaturl=')[1]);
            if (newChatURL.indexOf('&') > -1) {
                newChatURL = newChatURL.split('&')[0];
            }
            if (newChatURL != document.getElementById('minnitchatname').value) {
                document.getElementById('minnitchatname').value = newChatURL;
                document.getElementById('submit').click();
            }
        }
        if (window.location.href.indexOf('orgurl=') != -1) {
            var newOrgURL = decodeURIComponent(window.location.href.split('orgurl=')[1]);
            if (newOrgURL.indexOf('&') > -1) {
                newOrgURL = newOrgURL.split('&')[0];
            }
            if (newOrgURL != document.getElementById('minnit-sso-sync-url').value) {
                document.getElementById('minnit-sso-sync-url').value = newOrgURL;
                document.getElementById('sync-container').style = 'display:none;'
                document.getElementById('sync-second-step').style = '';
                document.getElementById('minnit-sso-setting').value = 1;
                document.getElementById('sso-config').style.display = 'block';
                var currentURL = window.location.href;
                if (currentURL.indexOf('#') == -1) {
                    currentURL = currentURL + '#sync-second-step';
                    window.location = currentURL;
                }
                document.getElementById('minnit-sso-sync-url').focus();
            }
        } 
        document.getElementById('want-side-wide-icon').addEventListener("click", function (event) {
            document.getElementById('want-side-wide-icon').style.display = 'none';
            document.getElementById('no-site-wide-icon').style.display = 'none';
            document.getElementById('no-site-wide-icon-2').style.display = 'none';
            document.getElementById('site-wide-icon').style.display = 'block';
            event.preventDefault();
        });
        document.getElementById('no-gutenberg').addEventListener("click", function (event) {
            document.getElementById('no-gutenberg').style.display = 'none';
            document.getElementById('no-gutenberg-step-2').style.display = 'block';
            event.preventDefault();
        });
        document.getElementById('no-gutenberg-button').addEventListener("click", function (event) {
            document.getElementById('no-gutenberg-step-3').style.display = 'block';
            document.getElementById('no-gutenberg-code').innerText = '<minnit-chat data-chatname="' + document.getElementById('no-gutenberg-input').value + '" class="wp-block-minnit-chat-chat-embed"></minnit-chat>';
            event.preventDefault();
        });
        document.getElementById('minnit-sso-sync-now').addEventListener("click", function () {
            //check if we can already deduce the org URL from chat name...
            document.getElementById('minnit-sso-sync-url').value = getOrgURL(document.getElementById('minnitchatname').value);
            document.getElementById('sync-container').style = 'display:none;'
            document.getElementById('sync-second-step').style = '';
        });
        document.getElementById('minnit-sso-sync-proceed').addEventListener("click", function () {
            //check if valid
            if (getOrgURL(document.getElementById('minnit-sso-sync-url').value) !== '') {
                //redirect
                if (document.getElementById('minnit-advanced-sso').checked) {
                    window.location = getOrgURL(document.getElementById('minnit-sso-sync-url').value) + '/page/settings?ssosetup=1&clientid=' + document.getElementById('minnit-client-id').innerHTML + '&clientsecret=' + document.getElementById('minnit-client-secret').innerHTML + '&authorizeurl=' + encodeURIComponent(document.getElementById('minnit-authorize-url').innerHTML) + '&accesstoken=' + encodeURIComponent(document.getElementById('minnit-access-token').innerHTML) + '&getuserinfo=' + encodeURIComponent(document.getElementById('minnit-getuserinfo').innerHTML) + '&authorizedredirect=' + encodeURIComponent(document.getElementById('minnit-authorized-redirect').value) + '&from=' + encodeURIComponent(window.location);
                } else {
                    window.location = getOrgURL(document.getElementById('minnit-sso-sync-url').value) + '/page/settings?simplessosetup=1&from=' + encodeURIComponent(window.location);
                }
            } else {
                alert("Sorry, this is an invalid URL");
            }
        });
        if (document.getElementById('minnitchatname').value) {
            document.getElementById('want-side-wide-icon').style.display = 'none';
            document.getElementById('no-site-wide-icon').style.display = 'none';
            document.getElementById('no-site-wide-icon-2').style.display = 'none';
            document.getElementById('site-wide-icon').style.display = 'block';
        }
    });
}())