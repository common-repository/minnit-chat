/*
This file is only used when you are Editing posts, using what Wordpress calls the "Gutenberg" editor.

It allows you to embed your Minnit Chat directly from the editor, without having to fuss with iframe codes.
*/

const iconMinnitChat = wp.element.createElement('svg',
  {
    width: '20',
    height: '20'
  },
  wp.element.createElement('path',
    {
      d: "M 4.535156 4.550781 C 4.066406 5.035156 4.066406 5.816406 4.5 6.382812 C 4.816406 6.785156 4.832031 7.050781 4.832031 11.566406 L 4.832031 16.332031 L 6 16.332031 L 6.015625 12.035156 C 6.035156 8.398438 6.066406 7.832031 6.234375 8.25 C 6.351562 8.515625 6.816406 9.667969 7.25 10.785156 C 8.066406 12.898438 8.25 13.101562 8.882812 12.617188 C 9.132812 12.433594 9.050781 12.132812 7.933594 9.265625 C 6.984375 6.851562 6.714844 5.984375 6.785156 5.566406 C 6.964844 4.398438 5.351562 3.683594 4.535156 4.550781 Z M 13.582031 4.582031 C 13.300781 4.851562 13.167969 5.167969 13.167969 5.582031 C 13.167969 5.964844 12.667969 7.300781 11.765625 9.351562 L 10.367188 12.515625 L 10.785156 12.683594 C 11.015625 12.765625 11.265625 12.867188 11.332031 12.917969 C 11.382812 12.949219 12 11.734375 12.683594 10.199219 L 13.917969 7.417969 L 13.964844 11.867188 L 14 16.332031 L 15.167969 16.332031 L 15.167969 11.566406 C 15.167969 7.050781 15.183594 6.785156 15.5 6.382812 C 16.566406 5.015625 14.800781 3.351562 13.582031 4.582031 Z M 6.734375 0.464844 C 3.566406 1.566406 1.082031 4.214844 0.25 7.332031 C -0.0664062 8.535156 -0.0664062 11.484375 0.25 12.667969 C 0.699219 14.332031 1.484375 15.667969 2.917969 17.082031 C 5.082031 19.25 6.917969 20 10 20 C 13.082031 20 14.917969 19.25 17.082031 17.082031 C 19.199219 14.964844 20 13 20 9.917969 C 20 7.167969 19.25 5.199219 17.515625 3.300781 C 16.199219 1.882812 15.015625 1.082031 13.316406 0.5 C 12.082031 0.0664062 11.683594 0 10 0 C 8.332031 0 7.917969 0.0664062 6.734375 0.464844 Z M 11.699219 1.015625 C 15.550781 1.785156 18.367188 4.765625 19 8.75 C 19.464844 11.699219 18.132812 15.101562 15.785156 16.964844 C 15.398438 17.265625 14.964844 17.617188 14.816406 17.734375 C 14.332031 18.132812 12.398438 18.816406 11.183594 19.035156 C 8.234375 19.535156 4.785156 18.101562 2.800781 15.535156 C 1 13.214844 0.398438 10.066406 1.234375 7.484375 C 1.851562 5.601562 2.183594 5 3.398438 3.683594 C 5.449219 1.464844 8.714844 0.417969 11.699219 1.015625 Z M 11.699219 1.015625"
    }
  )
);

//Register the block into the Gutenberg editor.
wp.blocks.registerBlockType('minnit-chat/chat-embed', {
  title: 'Minnit Chat',
  icon: iconMinnitChat,
  category: 'embed',
  attributes: {
    chatname: { type: 'string' },
    height: { type: 'string' },
    width: { type: 'string' }
  },

  //Handle the hooks for when the element itself is edited.
  edit: function (props) {
    function setChatName(event) {
      props.setAttributes({ chatname: event.target.value })
    }
    function setHeight(event) {
      props.setAttributes({ height: event.target.value })
    }
    function setWidth(event) {
      props.setAttributes({ width: event.target.value })
    }
    return React.createElement(
      "div",
      { style: { "border": "2px solid", "border-color": "rgba(126, 126, 126, 0.1)", "padding": "10px" } },
      React.createElement("p", { style: { "margin-bottom": "0px", "font-size": "1.4em" } }, "Chat URL:"),
      React.createElement("input", { type: "text", placeholder: "https://", style: { "width": "100%" }, value: props.attributes.chatname, onChange: setChatName }),
      React.createElement("p", { style: { "font-size": "0.8em" } }, (
        React.createElement("a", { href: "https://minnit.chat/wpsync", target: "_blank" }, "Click here to get your chat URL if you do not know it")
      )
      ),
      React.createElement("p", { style: { "margin-bottom": "0px", "font-size": "1.1em" } }, "Width:"),
      React.createElement("select", { onChange: setWidth, value: props.attributes.width },
        React.createElement("option", { value: "100%" }, "Standard"),
        React.createElement("option", { value: "65%" }, "Narrower"),
        React.createElement("option", { value: "30%" }, "Narrowest")
      ),
      React.createElement("p", { style: { "margin-bottom": "0px", "font-size": "1.1em" } }, "Height:"),
      React.createElement("select", { onChange: setHeight, value: props.attributes.height },
        React.createElement("option", { value: "70vh" }, "Standard"),
        React.createElement("option", { value: "80vh" }, "Taller"),
        React.createElement("option", { value: "90vh" }, "Tallest")
      ),
    );
  },
  save: function (props) {
    var width = '100%';
    if (props.attributes.hasOwnProperty('width') && props.attributes.width) {
      width = props.attributes.width;
    }
    var height = '70vh';
    if (props.attributes.hasOwnProperty('height') && props.attributes.height) {
      height = props.attributes.height;
    }
    if ((props.attributes.hasOwnProperty('width') && props.attributes.width) || (props.attributes.hasOwnProperty('height') && props.attributes.height)) {
      try {
        return wp.element.createElement(
          "minnit-chat",
          { 'data-chatname': props.attributes.chatname, 'data-width': width, 'data-height': height },
          ""
        );
      } catch (e) {
        return wp.element.createElement(
          "minnit-chat",
          { 'data-chatname': props.attributes.chatname },
          ""
        );
      }
    } else {
      return wp.element.createElement(
        "minnit-chat",
        { 'data-chatname': props.attributes.chatname },
        ""
      );
    }
  }
})
