import React, {Component} from 'react';

class Mailer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      file: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const file = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      this.setState({ file: fileReader.result.slice(28) });
    };
  }

  handleSubmit(event) {
    event.preventDefault();

    fetch(`http://localhost:8080/api/mail`, {
      headers: {
        'Content-type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        name: 'Rupa',
        file: this.state.file
      })
    })
      .then(response => response.json())
      .then(state => this.setState(state))
      .catch(console.log)
  }

  render() {
    return (
      <div className="App">
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="name">Select a PDF: </label>
            <input 
              type="file"
              name="pdf" 
              accept="application/pdf"
              onChange={this.handleChange} /><br></br><br></br>
            <button type="submit">Submit</button>
          </form>
          <p>{this.state.greeting}</p>
          </div>
    );
  }
 
}

export default Mailer;
