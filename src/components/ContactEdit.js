import React from 'react';
import { Link } from 'react-router-dom';
import { sendEvent } from './State';
import PropTypes from 'prop-types';

class ContactEdit extends React.Component {

  constructor() {
    super()
    // State for updating the contact (with controlled form). 
    this.state = {
      id: 0,
      name: '',
      email: '',
      phone_number: '',
      image_url: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
  }

  // Listen for changes to input values and update state accordingly. 
  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  // Same function as in ContactNew (see comments there). 
  // (Not very 'DRY', but eval coding time is finite.) 
  handleValidation() {
    const errors = [];
    if (this.state.name === '') {
      errors.push('You must enter a name.');
    }
    if (this.state.email !== '') {
      let lastAtPos = this.state.email.lastIndexOf('@');
      let lastDotPos = this.state.email.lastIndexOf('.');
      if (!(lastAtPos < lastDotPos
        && lastAtPos > 0
        && this.state.email.indexOf('@@') === -1
        && lastDotPos > 2
        && (this.state.email.length - lastDotPos) > 2)) {
        errors.push('If you include an email address, it must be valid.');
      }
    }
    if (this.state.phone_number !== '') {
      if (!this.state.phone_number.match(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)) {
        errors.push('If you include a phone number, it must be valid.')
      }
    }
    return errors.join(' ');
  }

  // Handle edits to contact (save changes). Redirect to main page on submit. 
  // (Alert with error message if any errors are found.)
  handleEdit(event) {
    event.preventDefault();
    const error = this.handleValidation();
    if (!error) {
      const updatedContact = this.state;
      sendEvent('editContact', updatedContact);
      this.props.history.push('/');
    } else {
      alert(error);
    }
  }

  // Component receives only the contact that matches the params id. 
  // Set state with contact so form is pre-filled. 
  componentDidMount() {
    const contact = this.props.contact;
    this.setState({ ...contact });
  }

  render() {
    return (
      <div>
        <div className='page-title'>
          Edit Contact
        </div>
        <div>
          <button className="btn btn-light"><Link to='/'>&laquo; Back to Contacts</Link></button>
        </div>
        <form onSubmit={this.handleEdit} className="input-form">
          <input className="form-control" type="text" id="name" value={this.state.name} onChange={this.handleChange} placeholder="Name" />
          <input className="form-control" type="text" id="email" value={this.state.email} onChange={this.handleChange} placeholder="Email" />
          <input className="form-control" type="text" id="phone_number" value={this.state.phone_number} onChange={this.handleChange} placeholder="Phone Number" />
          <input className="form-control" type="text" id="image_url" value={this.state.image_url} onChange={this.handleChange} placeholder="Image URL" />
          <button className="btn btn-primary" type="submit">Save Changes</button>
        </form>
      </div>
    )
  }
}

ContactEdit.propTypes = {
  contact: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone_number: PropTypes.string.isRequired,
    image_url: PropTypes.string.isRequired
  }).isRequired
};

export default ContactEdit; 