import React from "react";
import ReactDOM from "react-dom";
import User from "./lib/User";

class Dashboard extends React.Component {
	constructor(...args) {
		super(...args);

		const user = new User(localStorage.address);
		this.state = {
			user,
			editedName: "",
			editedBio: ""
		};

		[
			"editedNameChange",
			"editedNameKeyPress",
			"editedBioChange",
			"editedBioKeyPress"
		].forEach(func => {
			this[func] = this[func].bind(this);
		});

		this.updateProfile();
	}

	editedNameChange(event) {
		this.setState({
			editedName: event.target.value
		});
	}

	async editedNameKeyPress(event) {
		if(event.key == "Enter") {
			console.log("Up");
			console.log(this.state.user.setName);
			await this.state.user.setName(this.state.editedName);
			await this.updateProfile();
		}
	}

	editedBioChange(event) {
		this.setState({
			editedBio: event.target.value
		});
	}

	async editedBioKeyPress(event) {
		if(event.key == "Enter") {
			await this.state.user.setBio(this.state.editedBio);
			await this.updateProfile();
		}
	}

	async updateProfile() {
		await this.state.user.load();

		const newState = {
			user: this.state.user,
			editedName: this.state.user.name,
			editedBio: this.state.user.bio
		};

		this.setState(() => newState);
	}

	render() {
		return <div className="dashboard">
			<input
				onKeyPress={this.editedNameKeyPress}
				onChange={this.editedNameChange}
				value={this.state.editedName}
			/>

			<input
				onKeyPress={this.editedBioKeyPress}
				onChange={this.editedBioChange}
				value={this.state.editedBio}
			/>
		</div>;
	}
}

class EthSocial extends React.Component {
	constructor(...args) {
		super(...args);
	}

	render() {
		return <Dashboard />
	}
}

ReactDOM.render(<EthSocial />, document.querySelector("#app"));
