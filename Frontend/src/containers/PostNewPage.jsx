import React, { PropTypes } from 'react';
import PostNewForm from '../components/LoginForm.jsx';
import Auth from '../services/AuthService';
// import SimpleMDE from 'react-simplemde-editor';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';
import PostMDE from '../components/PostMDE';

class PostNewPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);

    const storedMessage = localStorage.getItem('successMessage');
    let successMessage = '';

    if (storedMessage) {
      successMessage = storedMessage;
      localStorage.removeItem('successMessage');
    }

    // set the initial component state
    this.state = {
      errors: {},
      successMessage,
      textValue: "",
      user: {
        email: '',
        password: ''
      }
    };
    this.onTextChange = this.onTextChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.processForm = this.processForm.bind(this);
  }

  onTextChange(value) {
      this.setState({
        textValue: value
      });
    };

  onSubmit() {
    const body = this.state.textValue;
  }
  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();
    const _this = this;
    // create a string for an HTTP body message
    const email = this.state.user.email;
    const password = encodeURIComponent(this.state.user.password);
    Auth.login(email, password)
            .catch(function(err) {
                alert("Error logging in", err)
            })
            .done(function(greeting) {
              if (greeting !== undefined) {
                console.log('greeting', greeting);
                _this.context.router.replace('/');
              }
            });
  }

  /**
   * Render the component.
   */
  render() {
    // const { fields: {title, body, tags}, handleSubmit } = this.props;
    return (
        <PostMDE />
    );
  }

}

PostNewPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default PostNewPage;