import IdeasAPI from '../services/ideasAPI';
import IdeaList from './ideaList';

class IdeaForm {
  constructor() {
    this._form = document.getElementById('idea-form');

    this._render();
    this._addEventListeners();
  }

  _render() {
    this._form.innerHTML = `
        <div class="form-control">
          <label for="username">Enter a Username</label>
          <input type="text" name="username" id="username" autocomplete=false />
        </div>
        <div class="form-control">
          <label for="text">What's Your Idea?</label>
          <textarea name="text" id="text"  autocomplete="false"></textarea>
        </div>
        <div class="form-control">
          <label for="tag">Tag</label>
          <input type="text" name="tag" id="tag" autocomplete=false />
        </div>
        <button class="btn" type="submit" id="submit">Submit</button>
    `;
    this._formBtn = this._form.querySelector('#submit');
    this._prefillUserName();
  }

  _prefillUserName() {
    if (localStorage.getItem('username')) {
      this._form.querySelector('input[name="username"]').value =
        localStorage.getItem('username');
    }
  }

  async _handleSubmit(e) {
    e.preventDefault();

    // adding Form Validation
    if (
      !this._form.elements.text.value ||
      !this._form.elements.tag.value ||
      !this._form.elements.username.value
    ) {
      alert('Please Enter all Fields');
      return;
    }

    // Construct an idea object from the form submission
    const idea = {
      text: this._form.elements.text.value,
      tag: this._form.elements.tag.value,
      username: this._form.elements.username.value,
    };

    // Add the idea to the database
    await this.addIdea(idea);

    // Clear the form
    this._form.elements.text.value = '';
    this._form.elements.tag.value = '';
    this._form.elements.username.value = '';
    // close the modal
    document.dispatchEvent(new Event('closemodal'));
  }

  // Add a new Idea through the form and displaying it
  addIdea = async (idea) => {
    try {
      const res = await IdeasAPI.addIdea(idea);
      const newIdea = res.data.data;
      // Add idea to DOM
      new IdeaList();
      // Add username to localStorage
      localStorage.setItem('username', newIdea.username);
    } catch (error) {
      console.log(error);
    }
  };

  _addEventListeners() {
    this._form.addEventListener('submit', this._handleSubmit.bind(this));
  }
}

export default new IdeaForm();
