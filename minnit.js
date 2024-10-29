(function () {
  'use strict'
  function getPhotoFromHTML(thisPhoto) {
    try {
      if (thisPhoto.indexOf('src=') > -1) {
        thisPhoto = thisPhoto.split('src=')[1];
      }
      if (thisPhoto.indexOf('"') > -1) {
        thisPhoto = thisPhoto.split('"')[1];
      }
      if (thisPhoto.indexOf("'") > -1) {
        thisPhoto = thisPhoto.split("'")[1];
      }
      if (thisPhoto.slice(-1) == '\\') {
        thisPhoto = thisPhoto.substring(0, thisPhoto.length - 1);
      }
      return encodeURIComponent(thisPhoto);
    } catch (e) {
      return '';
    }
  }
  function lookForMinnitChatTags() {
    if (typeof (document.getElementsByTagName("iframe")) !== 'undefined' && document.getElementsByTagName("iframe") !== null && typeof (document.getElementsByTagName("iframe")[0]) !== 'undefined' && document.getElementsByTagName("iframe")[0] !== null) {
      //iterate through all iframes and see if any of them are chats; if so, convert them over...
      document.querySelectorAll('iframe').forEach((IframeTag) => {
        if (typeof (IframeTag) !== 'undefined' && IframeTag && typeof (IframeTag.src) !== 'undefined' && IframeTag.src) {
          //valid source, check if this is a Minnit URL
          if ((IframeTag.src.indexOf('minnit.chat') > -1 || IframeTag.src.indexOf('.minnit.org') > -1) && IframeTag.src.indexOf('nec=') == -1) {
            var thisTagChatName = IframeTag.src
            IframeTag.src = 'about:blank'; //blanks out the iframe until we're done grabbing SSO token and similar checks
            var urlparams = ''
            if (thisTagChatName.indexOf('?') > -1) {
              urlparams = thisTagChatName.split('?')[1].split('nickname').join('')
              thisTagChatName = thisTagChatName.split('?')[0]
            }
            if (thisTagChatName.indexOf('?') > -1) {
              thisTagChatName = thisTagChatName.split('?')[0]
            }
            if (thisTagChatName.length === 0) { thisTagChatName = 'Demo' }
            var minnitNickname = '';
            if (typeof (minnitChatOptions.minnitwpusername) !== 'undefined') {
              minnitNickname = minnitChatOptions.minnitwpusername
            }
            var newEmbedKey = Math.floor(Math.random() * 10000000) + 1;
            var minnitPhoto = '';
            if (typeof (minnitChatOptions.minnitwpphoto) !== 'undefined' && minnitChatOptions.minnitwpphoto !== null) {
              minnitPhoto = getPhotoFromHTML(minnitChatOptions.minnitwpphoto);
              if (minnitPhoto.indexOf("'") !== -1) {
                minnitPhoto = minnitPhoto.split("'")[0];
              }
              try {
                minnitPhoto = encodeURIComponent(minnitPhoto);
              } catch (e) {
                minnitPhoto = '';
              }
            }
            try {
              //Attempt to get the user's "actual" photo from navigational bar; this allows us to support buddypress or similar plugins
              if (typeof (minnitChatOptions.minnitwpusername) !== 'undefined' && typeof (document.getElementById('wpadminbar') !== 'undefined' && document.getElementById('wpadminbar'))) {
                var wpAvatars = document.getElementById('wpadminbar').getElementsByClassName('avatar');
                if (typeof (wpAvatars) !== 'undefined' && wpAvatars !== null && wpAvatars.hasOwnProperty('0') && wpAvatars[0] !== null && wpAvatars[0].src !== null) {
                  minnitPhoto = encodeURIComponent(wpAvatars[0].src);
                }
              }
            } catch (e) {
              //Invalid or unknown error as it relates to site's HTML. Safe to ignore, we'll just use what's in the default WordPress account.
            }
            var xhttp = new XMLHttpRequest();
            xhttp.onload = function () {
              if (typeof (this.responseText) !== 'undefined') {
                try {
                  var responseData = JSON.parse(this.responseText);
                  var ssoToken = '';
                  if (typeof (responseData.ssotoken) !== 'undefined' && responseData.ssotoken !== null && responseData.ssotoken.length > 0) {
                    ssoToken = responseData.ssotoken;
                  }
                  IframeTag.src = thisTagChatName + '?embed&nec=' + newEmbedKey + '&nickname=' + minnitNickname + '&photo=' + minnitPhoto + '&ssotoken=' + ssoToken + '&' + urlparams;
                  IframeTag.dataset.nec = newEmbedKey;
                } catch (e) {
                  IframeTag.src = thisTagChatName + '?embed&nec=' + newEmbedKey + '&nickname=' + minnitNickname + '&photo=' + minnitPhoto + '&' + urlparams;
                  IframeTag.dataset.nec = newEmbedKey;
                }
              }
            }
            xhttp.open("GET", minnitChatOptions.wpurl + '/?minnitpage=minnit-chat-sso-custom-get-token-v1&photourl=' + decodeURIComponent(minnitPhoto));
            xhttp.send();
          }
        }
      });
    }
    if (typeof (document.getElementsByTagName("minnit-chat")) !== 'undefined' && document.getElementsByTagName("minnit-chat") !== null && typeof (document.getElementsByTagName("minnit-chat")[0]) !== 'undefined' && document.getElementsByTagName("minnit-chat")[0] !== null) {
      //an existing tag is present, draw chat here!
      document.querySelectorAll('minnit-chat').forEach((MinnitChatTag) => {
        if (!MinnitChatTag.getAttribute('data-minnit-wp-chat-rendered')) {
          MinnitChatTag.setAttribute('data-minnit-wp-chat-rendered', 'true');
          var thisTagChatName = MinnitChatTag.getAttribute('data-chatname');
          var iframeHeight = '70vh';
          if (typeof (MinnitChatTag.getAttribute('data-height')) !== 'undefined' && MinnitChatTag.getAttribute('data-height') !== null && MinnitChatTag.getAttribute('data-height')) {
            iframeHeight = MinnitChatTag.getAttribute('data-height');
          }
          var iframeWidth = '100%';
          if (typeof (MinnitChatTag.getAttribute('data-width')) !== 'undefined' && MinnitChatTag.getAttribute('data-width') !== null && MinnitChatTag.getAttribute('data-width')) {
            iframeWidth = MinnitChatTag.getAttribute('data-width');
          }
          if (thisTagChatName.indexOf('script') > -1) {
            if (thisTagChatName.indexOf('data-chatname="') > -1) {
              thisTagChatName = thisTagChatName.split('data-chatname="')[1];
            }
            if (thisTagChatName.indexOf('"')) {
              thisTagChatName = thisTagChatName.split('"')[0];
            }
          }
          if (thisTagChatName.indexOf('/') == -1) {
            //user is not providing full URL  -- automatically craft the default minnit.chat setup (for legacy users)
            thisTagChatName = 'https://minnit.chat/' + thisTagChatName
          }
          thisTagChatName = thisTagChatName.split(' ').join('').split('<').join('').split('"').join('').split("'").join('')
          var urlparams = ''
          if (thisTagChatName.indexOf('?') > -1) {
            urlparams = thisTagChatName.split('?')[1].split('nickname').join('')
            thisTagChatName = thisTagChatName.split('?')[0]
          }
          if (thisTagChatName.indexOf('?') > -1) {
            thisTagChatName = thisTagChatName.split('?')[0]
          }
          if (thisTagChatName.length === 0) { thisTagChatName = 'Demo' }
          var minnitNickname = '';
          if (typeof (minnitChatOptions.minnitwpusername) !== 'undefined') {
            minnitNickname = minnitChatOptions.minnitwpusername
          }
          var newEmbedKey = Math.floor(Math.random() * 10000000) + 1;
          var minnitPhoto = '';
          if (typeof (minnitChatOptions.minnitwpphoto) !== 'undefined' && minnitChatOptions.minnitwpphoto !== null) {
            minnitPhoto = getPhotoFromHTML(minnitChatOptions.minnitwpphoto);
            if (minnitPhoto.indexOf("'") !== -1) {
              minnitPhoto = minnitPhoto.split("'")[0];
            }
            try {
              minnitPhoto = encodeURIComponent(minnitPhoto);
            } catch (e) {
              minnitPhoto = '';
            }
          }
          try {
            //Attempt to get the user's "actual" photo from navigational bar; this allows us to support buddypress or similar plugins
            if (1 == 2 && typeof (minnitChatOptions.minnitwpusername) !== 'undefined' && typeof (document.getElementById('wpadminbar') !== 'undefined' && document.getElementById('wpadminbar'))) {
              var wpAvatars = document.getElementById('wpadminbar').getElementsByClassName('avatar');
              if (typeof (wpAvatars) !== 'undefined' && wpAvatars !== null && wpAvatars.hasOwnProperty('0') && wpAvatars[0] !== null && wpAvatars[0].src !== null) {
                minnitPhoto = encodeURIComponent(wpAvatars[0].src);
              }
            }
          } catch (e) {
            //Invalid or unknown error as it relates to site's HTML. Safe to ignore, we'll just use what's in the default WordPress account.
          }
          var xhttp = new XMLHttpRequest();
          xhttp.onload = function () {
            if (typeof (this.responseText) !== 'undefined') {
              try {
                var responseData = JSON.parse(this.responseText);
                var ssoToken = '';
                if (typeof (responseData.ssotoken) !== 'undefined' && responseData.ssotoken !== null && responseData.ssotoken.length > 0) {
                  ssoToken = responseData.ssotoken;
                }
                MinnitChatTag.innerHTML = '<iframe src="' + thisTagChatName + '?embed&nec=' + newEmbedKey + '&nickname=' + minnitNickname + '&photo=' + minnitPhoto + '&ssotoken=' + ssoToken + '&' + urlparams + '" data-width="' + iframeWidth + '" data-height="' + iframeHeight + '" data-nec="' + newEmbedKey + '" style="border:none;width:' + iframeWidth + ';height:' + iframeHeight + '" class="minnit-chat-iframe-gutenberg-block" allowTransparency="true"></iframe>';
              } catch (e) {
                MinnitChatTag.innerHTML = '<iframe src="' + thisTagChatName + '?embed&nec=' + newEmbedKey + '&nickname=' + minnitNickname + '&photo=' + minnitPhoto + '&' + urlparams + '" data-nec="' + newEmbedKey + '" data-width="' + iframeWidth + '" data-height="' + iframeHeight + '" style="margin:auto;border:none;width:' + iframeWidth + ';height:' + iframeHeight + '" class="minnit-chat-iframe-gutenberg-block" allowTransparency="true"></iframe>';
              }
            }
          }
          xhttp.open("GET", minnitChatOptions.wpurl + '/?minnitpage=minnit-chat-sso-custom-get-token-v1&photourl=' + decodeURIComponent(minnitPhoto));
          xhttp.send();
        };
      });
    }
    Array.prototype.forEach.call(document.getElementsByClassName("minnit-chat-iframe-gutenberg-block"), function (thisChatFrame) {
      thisChatFrame.setAttribute("style", "margin:auto;border:none;width:" + thisChatFrame.getAttribute('data-width') + ";height:" + thisChatFrame.getAttribute('data-height')); //this is to prevent some themes, such as Twenty-Twenty, from setting the iframe width to 0 when the page is resized
    });
  }
  function toggleChat() {
    if (document.getElementById('minnit-chat-iframe')) {
      document.getElementById('minnit-chat-iframe').remove()
      var minnitContainer = document.getElementById('minnit-container')
      minnitContainer.setAttribute('data-size', 'button')
    } else {
      drawChat()
    }
  }
  function drawChat() {
    var chatname = minnitChatOptions.minnitchatname
    if (chatname.indexOf('script') > -1) {
      if (chatname.indexOf('data-chatname=') > -1) {
        chatname = chatname.split('data-chatname=')[1];
      }
      if (chatname.indexOf(' ')) {
        chatname = chatname.split(' ')[0];
      }
    }
    if (chatname.indexOf('/') == -1) {
      //user is not providing full URL  -- automatically craft the default minnit.chat setup (for legacy users)
      chatname = 'https://minnit.chat/' + chatname
    }
    var urlparams = ''
    chatname = chatname.split(' ').join('').split('<').join('')
    if (chatname.indexOf('?') > -1) {
      urlparams = chatname.split('?')[1].split('nickname').join('')
      chatname = chatname.split('?')[0]
    }
    if (chatname.length === 0) { chatname = 'Demo' }
    var minnitNickname = ''
    if (typeof (minnitChatOptions.minnitwpusername) !== 'undefined') {
      minnitNickname = minnitChatOptions.minnitwpusername
    }
    var minnitPhoto = '';
    if (typeof (minnitChatOptions.minnitwpphoto) !== 'undefined' && minnitChatOptions.minnitwpphoto !== null) {
      minnitPhoto = getPhotoFromHTML(minnitChatOptions.minnitwpphoto);
      if (minnitPhoto.indexOf("'") !== -1) {
        minnitPhoto = minnitPhoto.split("'")[0];
      }
      try {
        minnitPhoto = encodeURIComponent(minnitPhoto);
      } catch (e) {
        minnitPhoto = '';
      }
    }
    try {
      if (typeof (document.getElementById('wpadminbar') !== 'undefined' && document.getElementById('wpadminbar'))) {
        //Attempt to get the user's "actual" photo from navigational bar; this allows us to support buddypress or similar plugins
        var wpAvatars = document.getElementById('wpadminbar').getElementsByClassName('avatar');
        if (typeof (wpAvatars) !== 'undefined' && wpAvatars !== null && wpAvatars.hasOwnProperty('0') && wpAvatars[0] !== null && wpAvatars[0].src !== null) {
          minnitPhoto = encodeURIComponent(wpAvatars[0].src);
        }
      }
    } catch (e) {
      //Invalid or unknown error as it relates to site's HTML. Safe to ignore, we'll just use what's in the default WordPress account.
    }
    var vendorIframe = document.createElement('iframe')
    vendorIframe.width = '100%'
    vendorIframe.className = 'minnit-chat-iframe'
    vendorIframe.id = 'minnit-chat-iframe'
    var minnitContainer = document.getElementById('minnit-container')
    minnitContainer.setAttribute('data-size', minnitChatOptions.minnitchatsize)
    var xhttp = new XMLHttpRequest();
    var newEmbedKey = Math.floor(Math.random() * 10000000) + 1;
    xhttp.onload = function () {
      if (typeof (this.responseText) !== 'undefined') {
        try {
          var responseData = JSON.parse(this.responseText);
          var ssoToken = '';
          if (typeof (responseData.ssotoken) !== 'undefined' && responseData.ssotoken !== null && responseData.ssotoken.length > 0) {
            ssoToken = responseData.ssotoken;
          }
          vendorIframe.src = chatname + '?embed&nec=' + newEmbedKey + '&nickname=' + minnitNickname + '&photo=' + minnitPhoto + '&ssotoken=' + ssoToken + '&' + urlparams
        } catch (e) {
          vendorIframe.src = chatname + '?embed&nec=' + newEmbedKey + '&nickname=' + minnitNickname + '&photo=' + minnitPhoto + '&' + urlparams
        }
        vendorIframe.setAttribute('data-nec', newEmbedKey);
        minnitContainer.prepend(vendorIframe)
      }
    }
    xhttp.open("GET", minnitChatOptions.wpurl + '/?minnitpage=minnit-chat-sso-custom-get-token-v1&photourl=' + decodeURIComponent(minnitPhoto));
    xhttp.send();
  }
  function drawButton() {
    var buttoncol = '#aaaaaa'
    var buttonstrokecol = '#ffffff'
    if (minnitChatOptions.minnitchatcolor) {
      //    figure out if the outline should be white, or black, for the logo
      buttoncol = minnitChatOptions.minnitchatcolor.substr(1)
      var redCol = parseInt(buttoncol.substr(1, 2), 16)
      var greenCol = parseInt(buttoncol.substr(3, 2), 16)
      var blueCol = parseInt(buttoncol.substr(4), 16)
      if (redCol > 200 && greenCol > 200 && blueCol > 200) {
        buttonstrokecol = '#000000'
      }
      buttoncol = '#' + buttoncol
    }
    var minnitSvg = '<?xml version="1.0" encoding="UTF-8" standalone="no"?> <svg class="minnit-emoji" viewBox="-50 40 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><rect width="400%" height="400%" x="-100%" y="-100%" style="fill:' + buttoncol + ';" /><ellipse style="fill:' + buttonstrokecol + ';fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:1.03318;stroke-opacity:0.231111;paint-order:markers stroke fill" cx="100" cy="181" rx="112.38248" ry="98.500359" /><path style="fill:' + buttonstrokecol + ';fill-rule:evenodd;stroke:none;stroke-opacity:0.231111;paint-order:markers stroke fill" d="m 148.06965,260.97505 c 2.33053,5.29714 2.33053,11.65307 6.14405,17.37288 3.81352,5.71981 11.44049,10.80446 15.678,14.40651 4.23752,3.60205 5.08496,5.72066 1.90632,6.77972 -3.17864,1.05906 -10.38189,1.05906 -18.22052,-2.33089 -7.83863,-3.38995 -16.31304,-10.16947 -23.51647,-16.10171 -7.20342,-5.93224 -13.13551,-11.01689 -11.86477,-16.52498 1.27074,-5.5081 9.74515,-11.44019 16.31354,-12.28803 6.56839,-0.84783 11.22932,3.38937 13.55985,8.6865 z" /></svg> '
    var chatButton = document.createElement('minnit-button')
    chatButton.innerHTML = minnitSvg
    chatButton.onclick = toggleChat
    if (typeof (minnitChatOptions.minnitchatname) !== 'undefined' && minnitChatOptions.minnitchatname !== null && minnitChatOptions.minnitchatname.length > 0) {
      var minnitContainer = document.getElementById('minnit-container')
      minnitContainer.setAttribute('data-size', 'button')
      minnitContainer.innerHTML = ''
      minnitContainer.appendChild(chatButton)
    }
  }
  function updateMinnitOptions() {
    if (!document.getElementById('minnit-container')) {
      var minnitContainer = document.createElement('minnit-container')
      minnitContainer.id = 'minnit-container'
      document.body.appendChild(minnitContainer)
    }
    var container = document.getElementById('minnit-container')
    container.setAttribute('data-placement', minnitChatOptions.minnitplacement)
    drawButton()
    lookForMinnitChatTags()
    setInterval(function () {
      lookForMinnitChatTags()
    }, 1000);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateMinnitOptions)
  } else {
    updateMinnitOptions()
  }
  function createMinnitCookie(name, value, hours) {
    var expires;
    if (hours) {
      var date = new Date();
      date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
    } else expires = "";
    document.cookie = name + "=" + value + expires + "; path=/; SameSite=None; Secure";
  }
  function getMinnitCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  function localStorageSupported() {
    try {
      if (typeof (localStorage) == 'object') {
        localStorage.getItem("test");
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }
  function createMinnitLocalStorage(name, value) {
    name = "minnit_" + name;
    if (localStorageSupported()) {
      localStorage.setItem(name, value);
    } else {
      createMinnitCookie(name, value); //fallback for older browsers
    }
  }
  function getMinnitLocalStorage(name) {
    name = "minnit_" + name;
    if (localStorageSupported()) {
      return localStorage.getItem(name);
    } else {
      return getMinnitCookie(name); //fallback for older browsers
    }
  }
  window.addEventListener("message", function (event) {
    if (typeof (event) !== 'undefined' && event !== null && typeof (event.data) === 'string' && event.data !== null && event.data.indexOf('"minnitnec"') > -1) {
      //find the relevant iframe this is from -- owners are allowed to embed more than one chatroom, so we must make sure we send this to the correct frame!
      try {
        var eventObj = JSON.parse(event.data);
        document.querySelectorAll('iframe').forEach((thisEmbed) => {
          if (typeof (thisEmbed.dataset) !== 'undefined' && thisEmbed.dataset.hasOwnProperty('nec') && thisEmbed.dataset.nec == eventObj.minnitnec) {
            //now, check what this request was for...
            switch (eventObj.request) {
              case "getsigninvars":
                var postMessageData = {
                  'minnitnec': eventObj.minnitnec,
                  'signinvars': true
                }
                if (getMinnitLocalStorage("rauthv") != null && getMinnitLocalStorage("rauthv").length > 6) {
                  postMessageData.rauthv = getMinnitLocalStorage('rauthv');
                  postMessageData.sto = getMinnitLocalStorage('sto');
                } else {
                  postMessageData.gauthv = getMinnitLocalStorage('gauthv');
                  postMessageData.gsto = getMinnitLocalStorage('gsto');
                  if (getMinnitLocalStorage('nickname') !== null) {
                    postMessageData.nickname = getMinnitLocalStorage('nickname');
                  }
                }
                thisEmbed.contentWindow.postMessage(JSON.stringify(postMessageData), '*');
                break;
              case "setcookie":
                createMinnitLocalStorage(eventObj.cookiename, eventObj.cookievalue);
                break;
              case "getcookie":
                thisEmbed.contentWindow.postMessage('{"minnitnec": ' + eventObj.minnitnec + ', "cookiename": "' + eventObj.cookiename + '", "cookievalue": "' + getMinnitLocalStorage(eventObj.cookiename) + '"}', '*');
                break;
              case "setguest":
                createMinnitLocalStorage("gsto", eventObj.gsto);
                createMinnitLocalStorage("gauthv", eventObj.gauthv);
                break;
              case "logout":
                createMinnitLocalStorage("gsto", "");
                createMinnitLocalStorage("sto", "");
                createMinnitLocalStorage("gauthv", "");
                createMinnitLocalStorage("rauthv", "");
                createMinnitLocalStorage("nickname", "");
                break;
            }
          }
        });
      } catch (err) {
        //something went amiss
      }
    }
  });
  window.INSTALL_SCOPE = {
    setOptions: function setOptions(nextOptions) {
      minnitChatOptions = nextOptions
      updateMinnitOptions()
    }
  }
}())
