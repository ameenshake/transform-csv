import React from "react";
import Papa from "papaparse"

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uriComponent: '',
      filename: 'transformed.csv'
    }
    this.fileInput = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.fileInput.current.files[0]) {
      return;
    }

    Papa.parse(this.fileInput.current.files[0], {
      delimiter: ",",
      header: false,
      complete: (results, file) => {
        this.setState({ filename: file.name })
        const tranformed_csv = Papa.unparse(this.transform(results.data));
        this.setState({ uriComponent: encodeURIComponent(tranformed_csv) });
        let download = document.getElementById("download");
        download.click();
      }
    })
  }

  transform(data) {
    const new_headers = [
      "Order #",
      "Shipped To Name",
      "Email",
      "Telephone",
      "Address 1",
      "Address 2",
      "City",
      "Shipped To Prov",
      "Shipped To Postal Code",
      "Country Code",
      "SKU #",
      "Quantity",
      "Customer Comments",
      "Fulfilled From"
    ]

    const transformed_data = [];
    transformed_data.push(new_headers);
    for (let row = 1; row < data.length; row++) {
      const current_row = data[row];
      const transformed_row = [
        current_row[0],
        current_row[2] + ' ' + current_row[3],
        current_row[6],
        current_row[4] ?? current_row[5],
        current_row[7],
        current_row[8],
        current_row[9],
        current_row[10],
        current_row[11],
        current_row[12],
        current_row[15],
        current_row[16],
        `${current_row[13] ?? ' '}${current_row[14]}`,
        ''];

      transformed_data.push(transformed_row);
    }
    return transformed_data;
  }

  render() {
    console.log(this.state.uriComponent)

    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Upload csv file to transform:
          <div style={{ paddingTop: "1em" }}>
            <input type="file" ref={this.fileInput} />
          </div>
        </label>
        <br />
        <button type="submit">Transform and Download</button>
        {this.state.uriComponent && <a id="download" style={{ display: "none" }} href={"data:text/plain;charset=utf-8," + this.state.uriComponent} download={this.state.filename}></a>}
      </form >
    );
  }
}

export default App;
