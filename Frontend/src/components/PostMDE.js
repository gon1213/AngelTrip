var React = require('react');
var ReactDOM = require('react-dom');
var SimpleMDEReact = require('react-simplemde-editor');
var Editor = require('./Editor');

let counter = 1;

module.exports = React.createClass({

  getInitialState() {
    return {
      textValue1: "I am the initial value. Erase me, or try the button above.",
      textValue2: "Focus this text area and then use the Up and Down arrow keys to see the `extraKeys` prop in action"
    }
  },

  extraKeys() {
    return {
      Up: function(cm) {
        cm.replaceSelection(" surprise. ");
      },
      Down: function(cm) {
        cm.replaceSelection(" surprise again! ");
      }
    };
  },

  handleChange1(value) {
    this.setState({
      textValue1: value
    });
  },

  handleChange2(value) {
    this.setState({
      textValue2: value
    });
  },

  handleTextChange() {
    this.setState({
      textValue1: `Changing text by setting new state. ${counter++}`
    });
  },

  render() {
    //因为你两个library噶classname messup 左

    return (
      <div>
        <Editor
          value={this.state.textValue1}
          handleEditorChange={this.handleChange1}
        />
      </div>
    )
  }
});